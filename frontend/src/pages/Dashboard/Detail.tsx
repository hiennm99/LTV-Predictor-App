import React, { useEffect, useState } from 'react';
import CardDataStats from '../../components/CardDataStats.js';
import LTVFilter from '../../components/Filters/LTVFilter.js';
import { resetFilters, resetFiltersKeepGame } from '../../redux/slices/LTVSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/index.js';
import { QueryData, CalCoefficients } from '../../services/DataServices.js';
import { LineChart, LineChartExtend } from '../../components/GoogleCharts/LineChart';
import { generateData1, generateData2, generateData3, generateData4 } from '../../components/Generators/ChartDataGenerator.js'
import { FilteredTable, FilteredTableExtended } from './RenderTable.js';
import { useOktaAuth } from "@okta/okta-react";


const Details: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowFilter, setIsShowFilter] = useState<boolean>(false);
  const today = new Date();
  const initialFromDate = new Date(new Date(today).setDate(today.getDate() - 6))
    .toISOString()
    .split('T')[0];
  const initialToDate = new Date(new Date(today).setDate(today.getDate() - 1))
    .toISOString()
    .split('T')[0];
  const [selectedFromDate, setSelectedFromDate] = useState<string | undefined>(initialFromDate);
  const [selectedToDate, setSelectedToDate] = useState<string | undefined>(initialToDate);
  const [selectedSource, setSelectedSource] = useState<string | undefined>("");
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>("");
  const [selectedGame, setSelectedGame] = useState<string | undefined>("");
  const [selectedCampaign, setSelectedCampaign] = useState<string | undefined>("");

  const [d1, setD1] = useState<number>(0);
  const [d3, setD3] = useState<number>(0);
  const [d7, setD7] = useState<number>(0);
  const [a1, setA1] = useState<number>(0);
  const [b1, setB1] = useState<number>(0);
  const [a2, setA2] = useState<number>(0);
  const [b2, setB2] = useState<number>(0);

  const [obj, setObj] = useState<{}>()
  const [a3, setA3] = useState<number>(0);
  const [b3, setB3] = useState<number>(0);
  const [actualDay, setActualDay] = useState<number>(0);
  const [arpdau, setArpdau] = useState<number>(0);
  const [install, setInstall] = useState<number>(500);
  const [actualRoas7d, setActualRoas7d] = useState<number>(0);

  const [retentionData, setRetentionData] = useState<(string | number)[][]>([["Day", "Retention"]]);
  const [pdnData, setPdnData] = useState<(string | number)[][]>([["Day", "PDn"]]);
  const [ltvData, setLtvData] = useState<(string | number)[][]>([["Day", "LTV"]]);
  const [roasData, setRoasData] = useState<(string | number)[][]>([["Day", "ROAS"]]);
  const [actualRoasData, setActualRoasData] = useState<(string | number)[][]>([["Day", "ROAS"]]);
  const [dauData, setDauData] = useState<(string | number)[][]>([["Day", "DAU"]]);

  const dispatch = useDispatch<AppDispatch>(); 
  const filters = useSelector((state: RootState) => state.CheatDetail.filters);
  const { authState } = useOktaAuth();

  // Đồng bộ từ `filters` vào state `selectedFromDate` và `selectedToDate`
  useEffect(() => {
    if (filters.length > 0) {
      setTimeout(() => {
        const latestFilter = filters[filters.length - 1];
        setSelectedFromDate(latestFilter.fromDate);
        setSelectedToDate(latestFilter.toDate);
        setSelectedSource(latestFilter.partner);
        setSelectedCountry(latestFilter.country);
        setSelectedGame(latestFilter.gamePackageName);
        setSelectedCampaign(latestFilter.campaign);
      }, 100);
    }
  }, [filters]);
  
  
  //Hàm fetch dữ liệu Cheat by Type
  const fetchData = async () => {
    setIsLoading(true);
    try {
      setD1(0);
      setD3(0);
      setD7(0);
      setA1(0);
      setB1(0);
      setA2(0);
      setB2(0);
      setA3(0);
      setB3(0);
      setArpdau(0);
      setActualRoas7d(0)
      setRetentionData([["Day", "Retention"]]);
      setPdnData([["Day", "PDn"]]);
      setLtvData([["Day", "LTV"]]);
      setDauData([["Day", "DAU"]]);
      setRoasData([["Day", "ROAS"]]);
      setObj({});

      if (!authState || !authState.isAuthenticated) {
        console.error("User is not authenticated");
        return;
      }
  
      const accessToken = authState.accessToken?.accessToken;
      if (!accessToken) {
        console.error("Access token not found");
        return;
      }

      const response = await QueryData(selectedFromDate, selectedToDate, selectedGame, selectedCountry, selectedSource, selectedCampaign, accessToken);
  
      if (response && response.data) {
        const res = response.data.data
        setA1(res.a1);
        setB1(res.b1);
        setA2(res.a2);
        setB2(res.b2);
        setArpdau(parseFloat(res.arpdau.toFixed(2)));
        setD1(parseFloat((res.d1 * 100).toFixed(2)));
        setD3(parseFloat((res.d3 * 100).toFixed(2)));
        setD7(parseFloat((res.d7 * 100).toFixed(2)));
        setActualRoas7d(parseFloat((res.actual_roas_7d).toFixed(2)));
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  //Hàm fetch dữ liệu Cheat by Type
  const fetchCoefficients = async () => {
    if (!obj || Object.keys(obj).length === 0) {
      console.warn("fetchCoefficients called with empty obj.");
      return;
    }
  
    try {
      const response = await CalCoefficients(obj);
      if (response && response.data) {
        const res = response.data.data
        setA3(res.a);
        setB3(res.b);
        setActualDay(parseFloat((res.actual_n).toFixed(0)));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const [showedFromDate, setShowedFromDate] = useState<string | undefined>("");
  const [showedToDate, setShowedToDate] = useState<string | undefined>("");
  const [showedSource, setShowedSource] = useState<string | undefined>("");
  const [showCountry, setShowedCountry] = useState<string | undefined>("");
  const [showedGame, setShowedGame] = useState<string | undefined>("");
  const [showedCampaign, setShowedCampaign] = useState<string | undefined>("");

  useEffect(() => {
    if (selectedFromDate && selectedToDate && selectedGame != '') {
      setD1(0);
      setD3(0);
      setD7(0);
      setShowedFromDate(selectedFromDate);
      setShowedToDate(selectedToDate);
      setShowedGame(selectedGame);
      setShowedCountry(selectedCountry);
      setShowedSource(selectedSource);
      setShowedCampaign(selectedCampaign);
      fetchData();
      dispatch(resetFiltersKeepGame());

    }
  }, [selectedFromDate, selectedToDate, selectedGame, selectedCountry, selectedSource, selectedCampaign]);  

  useEffect(() => {
    if (a1 && b1 && a2 && b2) {
      setRetentionData(generateData1(a1, b1, 365, ["Day", "Retention"]));
      setPdnData(generateData2(a2, b2, 365, ["Day", "PDn"]));
      setLtvData(generateData2(arpdau * a2, b2, 365, ["Day", "LTV"]));
      setDauData(generateData2(install * a2, b2, 365, ["Day", "DAU"]));
  
      const x = generateData2(arpdau * a2, b2, 365, ["Day", "LTV"]);
      
      if (Array.isArray(x) && x.length > 1 && Array.isArray(x[1])) {
        const newObj = Object.fromEntries(x.slice(1));
        newObj["actual_roas_7d"] = actualRoas7d;
        if (JSON.stringify(newObj) !== JSON.stringify(obj)) {
          setObj(newObj);
        }
      } else {
        console.warn("Invalid data format for Object.fromEntries:", x);
      }
    }
  }, [a1, b1, a2, b2, install]);
  

  useEffect(() => {
    if (obj && Object.keys(obj).length > 0) {
      fetchCoefficients();
    }
  }, [obj]);
  
  useEffect(()=>{
    if (a3 && b3){
      setRoasData(generateData3(a3, b3, actualDay, ["Day", "ROAS"]));
      setActualRoasData(generateData4(actualRoas7d, actualDay, ["Day", "ROAS"]))
    }
  },[a3, b3])

  const handleClose = () => {
    setIsShowFilter(false);
  };

  const toSuperscript = (num: number) => {
    const superscriptDigits: { [key: string]: string } = {
      "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
      "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "-": "⁻", ".": "·"
    };
    return num.toFixed(3).split("").map(d => superscriptDigits[d] || d).join("");
  };

  return (
    <React.Fragment>
      {/* Nút Filter */}
      <div className="flex justify-between items-center mt-1">
      <div className="flex flex-wrap gap-2">
        {showedFromDate && (
          <span className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-200 text-gray-700">
            {showedFromDate}
            <button onClick={() => setShowedFromDate("")}>
              ❌
            </button>
          </span>
        )}
        {showedToDate && (
          <span className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-200 text-gray-700">
            {showedToDate}
            <button onClick={() => setShowedToDate("")}>
              ❌
            </button>
          </span>
        )}
        {showedGame && (
          <span className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-200 text-gray-700">
            {showedGame}
            <button onClick={() => setShowedGame("")}>
              ❌
            </button>
          </span>
        )}
        {showCountry && (
          <span className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-200 text-gray-700">
            {showCountry}
            <button onClick={() => setShowedCountry("")}>
              ❌
            </button>
          </span>
        )}
        {showedSource && (
          <span className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-200 text-gray-700">
            {showedSource}
            <button onClick={() => setShowedSource("")}>
              ❌
            </button>
          </span>
        )}
        {showedCampaign && (
          <span className="flex items-center gap-1 px-3 py-1 rounded-md bg-gray-200 text-gray-700">
            {showedCampaign}
            <button onClick={() => setShowedCampaign("")}>
              ❌
            </button>
          </span>
        )}
      </div>

        {/* Nút Filter */}
        <button
          className="rounded-md border border-gray-300 bg-white p-2 mb-2"
          onClick={() => setIsShowFilter(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
          </svg>
        </button>
      </div>

      {/* Modal */}
      {isShowFilter && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50">
          <LTVFilter isOpen={isShowFilter} handleClose={handleClose} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-5 2xl:gap-7.5">
        <CardDataStats title="Retention D1" total={`${d1} %`} rate="">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.000000 512.000000" fill="none"  strokeWidth={1.5}  stroke="currentColor" className="size-6">
          <g
            transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
            fill="#000000"
            stroke="none"
          >
            <path d="M1506 4919 c-20 -16 -26 -29 -26 -59 0 -48 10 -56 187 -157 73 -41 135 -79 138 -82 2 -4 -33 -22 -78 -40 -574 -231 -1040 -731 -1241 -1331 -133 -401 -147 -822 -40 -1239 188 -733 758 -1326 1484 -1545 179 -54 469 -98 534 -82 31 8 59 57 50 90 -11 45 -37 58 -136 67 -773 75 -1444 585 -1712 1302 -105 280 -150 595 -126 872 23 267 85 494 200 730 204 420 528 742 945 941 171 81 166 86 70 -83 -47 -81 -85 -158 -85 -170 0 -12 11 -34 23 -49 29 -33 79 -37 107 -8 10 10 80 125 154 254 138 238 152 275 124 312 -11 14 -380 233 -477 282 -40 21 -63 20 -95 -5z" />
            <path d="M2642 4734 c-21 -10 -43 -62 -36 -88 11 -45 37 -58 136 -67 620 -60 1168 -389 1511 -909 242 -366 363 -831 327 -1259 -60 -735 -491 -1366 -1145 -1677 -171 -81 -166 -86 -70 83 47 81 85 158 85 170 0 12 -11 34 -23 49 -29 33 -79 37 -107 8 -10 -10 -80 -125 -154 -254 -138 -238 -152 -275 -123 -313 18 -24 498 -297 523 -297 12 0 33 9 48 21 20 16 26 29 26 58 0 49 -13 60 -183 156 -75 43 -139 81 -142 84 -2 4 33 22 78 40 341 137 682 399 904 696 298 396 447 840 446 1330 -2 1064 -762 1964 -1817 2151 -91 16 -264 27 -284 18z" />
            <path d="M2433 4055 c-35 -8 -93 -28 -130 -46 -93 -45 -217 -169 -261 -261 -109 -224 -70 -474 101 -654 37 -39 67 -73 67 -76 0 -3 -19 -11 -42 -18 -72 -21 -210 -95 -293 -157 -238 -177 -393 -427 -450 -724 -18 -95 -22 -617 -5 -649 5 -10 24 -23 41 -29 23 -8 346 -11 1099 -11 753 0 1076 3 1099 11 17 6 36 19 41 29 6 11 10 134 10 295 0 316 -12 407 -77 570 -84 213 -240 411 -419 532 -72 49 -204 116 -261 133 -24 7 -43 15 -43 18 0 3 30 37 68 76 170 180 209 430 100 654 -44 92 -168 216 -260 260 -120 59 -256 75 -385 47z m232 -160 c312 -81 418 -473 191 -701 -241 -240 -651 -107 -709 230 -50 295 226 546 518 471z m135 -1015 c113 -27 287 -114 380 -189 144 -115 257 -276 316 -448 46 -137 54 -198 54 -440 l0 -213 -990 0 -990 0 0 213 c0 242 8 303 54 440 59 172 169 330 310 443 132 106 288 178 453 209 106 20 300 13 413 -15z" />
          </g>
        </svg>
        </CardDataStats>
        <CardDataStats title="Retention D3" total={`${d3} %`} rate="">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.000000 512.000000" fill="none"  strokeWidth={1.5}  stroke="currentColor" className="size-6">
          <g
            transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
            fill="#000000"
            stroke="none"
          >
            <path d="M1506 4919 c-20 -16 -26 -29 -26 -59 0 -48 10 -56 187 -157 73 -41 135 -79 138 -82 2 -4 -33 -22 -78 -40 -574 -231 -1040 -731 -1241 -1331 -133 -401 -147 -822 -40 -1239 188 -733 758 -1326 1484 -1545 179 -54 469 -98 534 -82 31 8 59 57 50 90 -11 45 -37 58 -136 67 -773 75 -1444 585 -1712 1302 -105 280 -150 595 -126 872 23 267 85 494 200 730 204 420 528 742 945 941 171 81 166 86 70 -83 -47 -81 -85 -158 -85 -170 0 -12 11 -34 23 -49 29 -33 79 -37 107 -8 10 10 80 125 154 254 138 238 152 275 124 312 -11 14 -380 233 -477 282 -40 21 -63 20 -95 -5z" />
            <path d="M2642 4734 c-21 -10 -43 -62 -36 -88 11 -45 37 -58 136 -67 620 -60 1168 -389 1511 -909 242 -366 363 -831 327 -1259 -60 -735 -491 -1366 -1145 -1677 -171 -81 -166 -86 -70 83 47 81 85 158 85 170 0 12 -11 34 -23 49 -29 33 -79 37 -107 8 -10 -10 -80 -125 -154 -254 -138 -238 -152 -275 -123 -313 18 -24 498 -297 523 -297 12 0 33 9 48 21 20 16 26 29 26 58 0 49 -13 60 -183 156 -75 43 -139 81 -142 84 -2 4 33 22 78 40 341 137 682 399 904 696 298 396 447 840 446 1330 -2 1064 -762 1964 -1817 2151 -91 16 -264 27 -284 18z" />
            <path d="M2433 4055 c-35 -8 -93 -28 -130 -46 -93 -45 -217 -169 -261 -261 -109 -224 -70 -474 101 -654 37 -39 67 -73 67 -76 0 -3 -19 -11 -42 -18 -72 -21 -210 -95 -293 -157 -238 -177 -393 -427 -450 -724 -18 -95 -22 -617 -5 -649 5 -10 24 -23 41 -29 23 -8 346 -11 1099 -11 753 0 1076 3 1099 11 17 6 36 19 41 29 6 11 10 134 10 295 0 316 -12 407 -77 570 -84 213 -240 411 -419 532 -72 49 -204 116 -261 133 -24 7 -43 15 -43 18 0 3 30 37 68 76 170 180 209 430 100 654 -44 92 -168 216 -260 260 -120 59 -256 75 -385 47z m232 -160 c312 -81 418 -473 191 -701 -241 -240 -651 -107 -709 230 -50 295 226 546 518 471z m135 -1015 c113 -27 287 -114 380 -189 144 -115 257 -276 316 -448 46 -137 54 -198 54 -440 l0 -213 -990 0 -990 0 0 213 c0 242 8 303 54 440 59 172 169 330 310 443 132 106 288 178 453 209 106 20 300 13 413 -15z" />
          </g>
        </svg>
        </CardDataStats>
        <CardDataStats title="Retention D7" total={`${d7} %`} rate="">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.000000 512.000000" fill="none"  strokeWidth={1.5}  stroke="currentColor" className="size-6">
          <g
            transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
            fill="#000000"
            stroke="none"
          >
            <path d="M1506 4919 c-20 -16 -26 -29 -26 -59 0 -48 10 -56 187 -157 73 -41 135 -79 138 -82 2 -4 -33 -22 -78 -40 -574 -231 -1040 -731 -1241 -1331 -133 -401 -147 -822 -40 -1239 188 -733 758 -1326 1484 -1545 179 -54 469 -98 534 -82 31 8 59 57 50 90 -11 45 -37 58 -136 67 -773 75 -1444 585 -1712 1302 -105 280 -150 595 -126 872 23 267 85 494 200 730 204 420 528 742 945 941 171 81 166 86 70 -83 -47 -81 -85 -158 -85 -170 0 -12 11 -34 23 -49 29 -33 79 -37 107 -8 10 10 80 125 154 254 138 238 152 275 124 312 -11 14 -380 233 -477 282 -40 21 -63 20 -95 -5z" />
            <path d="M2642 4734 c-21 -10 -43 -62 -36 -88 11 -45 37 -58 136 -67 620 -60 1168 -389 1511 -909 242 -366 363 -831 327 -1259 -60 -735 -491 -1366 -1145 -1677 -171 -81 -166 -86 -70 83 47 81 85 158 85 170 0 12 -11 34 -23 49 -29 33 -79 37 -107 8 -10 -10 -80 -125 -154 -254 -138 -238 -152 -275 -123 -313 18 -24 498 -297 523 -297 12 0 33 9 48 21 20 16 26 29 26 58 0 49 -13 60 -183 156 -75 43 -139 81 -142 84 -2 4 33 22 78 40 341 137 682 399 904 696 298 396 447 840 446 1330 -2 1064 -762 1964 -1817 2151 -91 16 -264 27 -284 18z" />
            <path d="M2433 4055 c-35 -8 -93 -28 -130 -46 -93 -45 -217 -169 -261 -261 -109 -224 -70 -474 101 -654 37 -39 67 -73 67 -76 0 -3 -19 -11 -42 -18 -72 -21 -210 -95 -293 -157 -238 -177 -393 -427 -450 -724 -18 -95 -22 -617 -5 -649 5 -10 24 -23 41 -29 23 -8 346 -11 1099 -11 753 0 1076 3 1099 11 17 6 36 19 41 29 6 11 10 134 10 295 0 316 -12 407 -77 570 -84 213 -240 411 -419 532 -72 49 -204 116 -261 133 -24 7 -43 15 -43 18 0 3 30 37 68 76 170 180 209 430 100 654 -44 92 -168 216 -260 260 -120 59 -256 75 -385 47z m232 -160 c312 -81 418 -473 191 -701 -241 -240 -651 -107 -709 230 -50 295 226 546 518 471z m135 -1015 c113 -27 287 -114 380 -189 144 -115 257 -276 316 -448 46 -137 54 -198 54 -440 l0 -213 -990 0 -990 0 0 213 c0 242 8 303 54 440 59 172 169 330 310 443 132 106 288 178 453 209 106 20 300 13 413 -15z" />
          </g>
        </svg>
        </CardDataStats>
        <CardDataStats title="ARPDAU" total={`${arpdau} $`} rate="">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        </CardDataStats>
        <CardDataStats title="Installs/Day" total={`${install}`} rate="" editable={true} value={install} onChange={setInstall}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
          </svg>
        </CardDataStats>
      </div>

      {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
          </div>
        ) : retentionData.length > 1 && pdnData.length > 1 && ltvData.length > 1 && roasData.length > 1 && dauData.length > 1 ? (
          <div className="mt-4 space-y-4 md:mt-6 md:space-y-6 2xl:mt-7.5 2xl:space-y-7.5">
            {/* Retention Predictor */}
            <div className="grid grid-cols-10 gap-4">
              <div className="col-span-7">
                <LineChart 
                  data={retentionData}
                  title={`Retention Curve is r(n) = ${a1.toFixed(3)} * n${toSuperscript(b1)}`}
                  y_title="Retention %"
                  x_title="Day n Since Install"
                />
              </div>
              <div className="col-span-3">
                <FilteredTable data={retentionData} unit={"%"} extraColumns={[]}/>
              </div>
            </div>

            {/* Expected Player Days Predictor */}
            <div className="grid grid-cols-10 gap-4">
              <div className="col-span-7">
                <LineChart 
                  data={pdnData}
                  title={`Expected Player Days is PD(n) = ${a2.toFixed(3)} * n${toSuperscript(b2)}`}
                  y_title="Sum of Retention (Player Days)"
                  x_title="Day n Since Install"
                />
              </div>
              <div className="col-span-3">
                <FilteredTable data={pdnData} unit={""} extraColumns={[]}/>
              </div>
            </div>

            {/* LTV Predictor */}
            <div className="grid grid-cols-10 gap-4">
              <div className="col-span-7">
                <LineChart 
                  data={ltvData}
                  title={`LTV is LTV(n) = ${arpdau.toFixed(2)} * ${a2.toFixed(3)} * n${toSuperscript(b2)}`}
                  y_title="LTV $"
                  x_title="Day n Since Install"
                />
              </div>
              <div className="col-span-3">
                <FilteredTable data={ltvData} unit={"$"} extraColumns={[]}/>
              </div>
            </div>

            {/* ROAS Predictor */}
            <div className="grid grid-cols-10 gap-4">
              <div className="col-span-7">
                <LineChartExtend 
                  data1={roasData}
                  data2={actualRoasData}
                  title="D7ROAS Target to Break-Even by Day n"
                  y_title="Days to Break Even (N)"
                  x_title="D7 ROAS %"
                />
              </div>
              <div className="col-span-3">
                <FilteredTable data={roasData} unit={"%"} extraColumns={[]}/>
              </div>
            </div>

            {/* DAU Predictor */}
            <div className="grid grid-cols-10 gap-4">
              <div className="col-span-7">
                <LineChart 
                  data={dauData}
                  title={`DAU is DAU(n) = ${install.toFixed(0)} * ${a2.toFixed(3)} * n${toSuperscript(b2)}`}
                  y_title="DAU"
                  x_title="Day n Since App Lauch"
                />
              </div>
              <div className="col-span-3">
                <FilteredTableExtended 
                  data={dauData} 
                  unit=""
                  extraColumns={[{ name: "Daily Revenue", multiplier: arpdau, unit: "$" }]}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-10">
            <span className="text-6xl mb-4 opacity-80">📂</span>
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-300 animate-fade-in">
              No data found
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Try searching for something else.
            </p>
          </div>
        )}
    </React.Fragment>
  );
};

export default Details;

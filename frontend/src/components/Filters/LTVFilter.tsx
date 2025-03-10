import React, { useEffect, useState } from "react";
import Select from 'react-select';
import { DateRangePicker } from 'react-date-range';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux';
import { addFilter } from '../../redux/slices/LTVSlice';
import { PartnerList } from "../../assets/filter_assets/PartnerList";
import { CountryList } from "../../assets/filter_assets/CountryList";
import { QueryCampaign } from "../../services/DataServices";
import { useOktaAuth } from "@okta/okta-react";

interface LTVFilterProps {
  isOpen: boolean;
  handleClose: () => void;
};

const LTVFilter: React.FC<LTVFilterProps> = ({ isOpen, handleClose }) => {
    const [selectedGames, setSelectedGames] = useState<{ value: string }[]>([]);
    const [selectedCampaigns, setSelectedCampaigns] = useState<{ value: string }[]>([]);
    const [selectedPartners, setSelectedPartners] = useState<{ value: string }[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<{ value: string }[]>([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");
    const [selectedFromDate, setSelectedFromDate] = useState<Date | null>(null); 
    const [selectedToDate, setSelectedToDate] = useState<Date | null>(null); 
    const [campaignList, setCampaignList] = useState();

    const [filterForm, setFilterForm] = useState<{}>({})
    
    const [isMultiFilterGames, setIsMultiFilterGames] = useState<boolean>(false); 
    const [isMultiFilterPartners, setIsMultiFilterPartners] = useState<boolean>(false); 
    const [isMultiFilterCountries, setIsMultiFilterCountries] = useState<boolean>(false);

    const dispatch = useDispatch<AppDispatch>();
    const { authState } = useOktaAuth();
    
    const [selectionRange, setSelectionRange] = useState<{
        startDate: Date | null;
        endDate: Date | null;
        key: string;
        }>({
        startDate: null,
        endDate: null,
        key: 'selection'
    });
    
    const handleSelectDate = (ranges: any) => {
        setSelectionRange(ranges.selection);
        
        if (ranges.selection) {
            setSelectedFromDate(ranges.selection.startDate);
            setSelectedToDate(ranges.selection.endDate);
        }
    };

    const fetchCampaigns = async (filters: any) => {
        try {
            if (!authState || !authState.isAuthenticated) {
                console.error("User is not authenticated");
                return;
            }
          
            const accessToken = authState.accessToken?.accessToken;
            if (!accessToken) {
                console.error("Access token not found");
                return;
            }
            
            const response = await QueryCampaign(
                filters.fromDate, 
                filters.toDate, 
                filters.gamePackageName, 
                filters.country, 
                filters.partner,
                accessToken
            );
            if (response && response.data && Array.isArray(response.data.data)) {
                setCampaignList(response.data.data.map((item: string) => ({ value: item })));
            }
        } catch (error) {
            console.error("Lỗi khi fetch dữ liệu: ", error);
        }
    };

    const reduxFilters = useSelector((state: RootState) => state.CheatDetail.filters);
    const latestFilter = reduxFilters[reduxFilters.length - 1];

    useEffect(()=>{
        if (selectedFromDate && selectedToDate) {
            const formattedFromDate = selectedFromDate.toLocaleDateString('en-CA');
            const formattedToDate = selectedToDate.toLocaleDateString('en-CA');
    
            const filters = {
                fromDate: formattedFromDate,
                toDate: formattedToDate,
                gamePackageName: latestFilter.gamePackageName,
                partner: Array.isArray(selectedPartners)
                    ? selectedPartners.map(partner => partner.value).join(",")
                    : selectedPartners?.value || "",
                country: Array.isArray(selectedCountries)
                    ? selectedCountries.map(country => country.value).join(",")
                    : selectedCountries?.value || "",
                campaign: Array.isArray(selectedCampaigns)
                ? selectedCampaigns.map(campaign => campaign.value).join(",")
                : selectedCampaigns?.value || "",
                deviceId: selectedDeviceId
            };
            fetchCampaigns(filters);
        }
        else {
            return;
        }
    
    },[selectedFromDate, selectedToDate, selectedGames, selectedCampaigns, selectedCountries, selectedPartners]);
    
    const updateFilter = (newData: Partial<typeof latestFilter>) => {
        dispatch(addFilter({ ...latestFilter, ...newData }));
    };
    
    const handleSubmit = () => {
        if (!selectedFromDate || !selectedToDate) {
            return;
        }

        const formattedFromDate = selectedFromDate.toLocaleDateString('en-CA'); // Convert date to string format
        const formattedToDate = selectedToDate.toLocaleDateString('en-CA'); // Convert date to string format

        let reduxForm = {
            fromDate: formattedFromDate,
            toDate: formattedToDate,
            partner: Array.isArray(selectedPartners)
                ? selectedPartners.map(partner => partner.value).join(",")
                : selectedPartners?.value || "",
            country: Array.isArray(selectedCountries)
                ? selectedCountries.map(country => country.value).join(",")
                : selectedCountries?.value || "",
            campaign: Array.isArray(selectedCampaigns)
            ? selectedCampaigns.map(campaign => campaign.value).join(",")
            : selectedCampaigns?.value || "",
            deviceId: selectedDeviceId
        };
        
        setFilterForm(reduxForm);

        if (reduxForm){
            updateFilter(reduxForm); // Thêm filter vào Redux store
        }
        
        setSelectedCampaigns([]);
        setSelectedGames([]);
        setSelectedPartners([]);
        setSelectedCountries([]);
        setSelectedDeviceId("");
        setSelectedFromDate(null);
        setSelectedToDate(null);
        setSelectionRange({
            startDate: null,
            endDate: null,
            key: 'selection'
        });
        handleClose()
    };
     
    return (
        isOpen && (
        <div
            className="py-10 fixed inset-0 flex justify-center items-center bg-opacity-50 pr-4 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"
            onClick={handleClose}
        >
            <div
            className="bg-white p-6 rounded-lg shadow-lg w-auto max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()} // Prevent closing modal on content click
            >
                <form className=" rounded-md">
                <div className="p-4">
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white  font-bold">
                            Date Range
                        </label>
                        <DateRangePicker
                            ranges={[selectionRange]}
                            onChange={handleSelectDate}
                            className="w-full border-[1.5px] border-stroke bg-transparent text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>

                    {/* <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white font-bold">
                            Game Package Name <span className="text-meta-1">*</span>
                        </label>
                        <Select
                            isMulti={isMultiFilterGames}
                            options={GameList}
                            value={selectedGames}
                            onChange={(selected) => setSelectedGames(selected as any)}
                            getOptionLabel={(e) => e.value}
                            getOptionValue={(e) => e.value}
                            defaultInputValue=""
                            isClearable
                            required
                            className="w-full border-[1.5px] border-stroke bg-transparent text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div> */}
                    <div className="mb-4.5 grid grid-cols-2">
                        <div className="mr-1">
                            <label className="mb-2.5 block text-black dark:text-white  font-bold">
                                Partner
                            </label>
                                <Select
                                isMulti={isMultiFilterPartners}
                                options={PartnerList}
                                value={selectedPartners}
                                onChange={(selected) => setSelectedPartners(selected as any)}
                                getOptionLabel={(e) => e.value}
                                getOptionValue={(e) => e.value}
                                defaultInputValue=""
                                isClearable
                                required
                                className="w-full border-[1.5px] border-stroke bg-transparent text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
                                />
                            </div>
                        <div className="ml-1">
                            <label className="mb-2.5 block text-black dark:text-white  font-bold">
                                Country
                            </label>
                            <Select
                                isMulti={isMultiFilterCountries}
                                options={CountryList}
                                value={selectedCountries}
                                onChange={(selected) => setSelectedCountries(selected as any)}
                                getOptionLabel={(e) => e.value}
                                getOptionValue={(e) => e.value}
                                defaultInputValue=""
                                isClearable
                                required
                                className="w-full border-[1.5px] border-stroke bg-transparent text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="mb-4.5">
                        <label className="mb-2.5 block text-black dark:text-white font-bold">
                            Campaign
                        </label>
                        <Select
                            options={campaignList}
                            value={selectedCampaigns}
                            onChange={(selected) => setSelectedCampaigns(selected as any)}
                            getOptionLabel={(e) => e.value}
                            getOptionValue={(e) => e.value}
                            defaultInputValue=""
                            isClearable
                            required
                            className="w-full border-[1.5px] border-stroke bg-transparent text-black dark:border-form-strokedark dark:bg-form-input dark:text-white"
                        />
                    </div>
                </div>
                </form>
                <div className="flex">
                    <button 
                        className="flex w-full justify-center rounded bg-red-500 p-3 font-medium text-gray hover:bg-opacity-90 mx-6"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    <button 
                        className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90 mx-6"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
        )
    );
};

export default LTVFilter;

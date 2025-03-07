import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GameDataStats from "../../components/GameDataStats.js";
import { addFilter } from '../../redux/slices/LTVSlice';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/index';
import { debounce } from 'lodash';
import { Game } from '../../types/game';
import { QueryPermission, QueryGames } from "../../services/DataServices.js";


const Overview: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const account = useSelector((state: RootState) => state.User.user);

  const [keywords, setKeywords] = useState<string>("");
  const [gameData, setGameData] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const getGameImage = (packageName: string) => `/src/images/game/${packageName}.webp`;
  const getGameImage = (packageName: string) => `/images/game/${packageName}.webp`;
  const getOsImage = (os: string) => `/images/icon/${os}.svg`;

  const handleGameClick = (selectedGame: string) => {
    dispatch(addFilter({
      fromDate: "",
      toDate: "",
      gamePackageName: selectedGame,
      partner: "",
      country: "",
      campaign: ""
    }));
    navigate("/dashboard/game/details");
  };

  useEffect(() => {
    setFilteredGames(gameData);
  }, [gameData]);

  const deboundedSearch = useCallback(
    debounce((term: string) => {
      if (term) {
        term = term.trim().toLowerCase();
        const filtered = gameData.filter(game =>
           game.name.toLocaleLowerCase().includes(term)
        || game.package_name.toLocaleLowerCase().includes(term)
        );
        setFilteredGames(filtered);
      } 
      else {
        setFilteredGames(gameData);
      }
    }, 500),
    [gameData]
  );

  // ✅ Fetch game data
  const fetchGameData = async (view_all: boolean, games_list: string[]) => {
    setIsLoading(true);
    try {
      const response = await QueryGames(view_all, games_list);
      if (response?.data?.data) {
        setGameData(response.data.data);
        setFilteredGames(response.data.data); // ✅ Cập nhật luôn filteredGames
      }
    } catch (error) {
      console.error("Error fetching game data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Fetch permissions
  const fetchPermission = async (email: string) => {
    try {
      const response = await QueryPermission(email);
      
      if (response?.data?.data) {
        const { view_all, games_list } = response.data.data;
        if (typeof view_all === "boolean" && Array.isArray(games_list)) {
          fetchGameData(view_all, games_list);
        } else {
          console.error("Invalid payload structure:", response.data.data);
        }
      }
    } catch (error) {
      console.error("Error fetching permissions:", error);
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    if (account && account.isAuthenticated && account.email != ''){
      fetchPermission(account.email ? account.email: '')
    }
  },[]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setKeywords(term);
    deboundedSearch(term);
  };

  return (
    <React.Fragment>
      {/* Ô tìm kiếm */}
      <input
        className="mb-4 p-2 border rounded-md w-full shadow-3 border-stroke bg-white 
                  dark:border-strokedark dark:bg-boxdark cursor-pointer hover:shadow-blue-300 
                  hover:shadow-lg transition duration-300 dark:text-white"
        placeholder="Search package name or name ........."
        value={keywords}
        onChange={handleSearch}
      />
  
      {/* Hiệu ứng loading */}
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        // Danh sách game hoặc thông báo không tìm thấy
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-6 2xl:gap-7.5">
          {filteredGames && filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <GameDataStats
                key={game.package_name}
                name={game.name}
                os={getOsImage((game.os.toLowerCase()))}
                image={getGameImage(game.package_name)}
                onClick={() => handleGameClick(game.package_name)}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-10">
              <span className="text-6xl mb-4 opacity-80">🎮</span>
              <p className="text-lg font-semibold text-gray-600 dark:text-gray-300 animate-fade-in">
                No games found
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Try searching for something else.
              </p>
            </div>
          )}
        </div>
      )}
    </React.Fragment>
  );

};

export default Overview;

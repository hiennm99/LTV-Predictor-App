import React from "react";

interface GameDataStatsProps {
  name: string;
  os: string;
  image?: string;
  onClick?: () => void;
}

const GameDataStats: React.FC<GameDataStatsProps> = ({ name, os, image, onClick }) => {
  const androidIcon = "/images/icon/android.svg";
  const iosIcon = "/images/icon/ios.svg";
  const osIcon = os === "ANDROID" ? androidIcon : os === "IOS" ? iosIcon : null;

  return (
    <div
      className="relative rounded-2xl border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark cursor-pointer hover:shadow-blue-300 hover:shadow-lg transition duration-300"
      onClick={onClick}
    >
      {osIcon && (
        <img
          src={osIcon}
          alt={`${os} icon`}
          className="absolute top-2 left-2 w-6 h-6"
        />
      )}

      <div className="flex flex-col items-center">
        {image && (
          <img
            src={image}
            alt={`Image for ${name}`}
            className="rounded-lg shadow-lg w-20 h-20 object-cover mb-3"
          />
        )}
        <h4 className="text-lg font-bold text-black dark:text-white text-center">
          {name}
        </h4>
      </div>
    </div>
  );
};

export default GameDataStats;

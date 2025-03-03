import React from "react";
import { Event } from "../../types/event";

interface ShowEventDetailProps {
  isOpen: boolean;
  handleClose: () => void;
  data: Event;
}

const ShowEventDetail: React.FC<ShowEventDetailProps> = ({ isOpen, handleClose, data }) => {
  return (
    isOpen && (
      <div
        className="fixed inset-0 flex justify-end items-center bg-opacity-50"
        onClick={handleClose}
      >
        <div
          className="p-4 rounded-lg shadow-lg w-auto max-h-[80vh] overflow-y-auto mr-10 bg-indigo-50"
          onClick={(e) => e.stopPropagation()} // Ngăn đóng modal khi click vào nội dung
        >
          <h2 className="text-xl font-semibold mb-4">Details</h2>
          <div className="p-4 rounded-lg overflow-x-auto">
            <div className="grid grid-cols-[auto,1fr] gap-3">
              {Object.entries(data).map(([key, value]) => (
                <>
                  <div
                    key={`key-${key}`}
                    className="p-2 border border-gray-300 rounded-md text-sm font-semibold truncate max-w-50 text-left"
                    title={key}
                  >
                    {key}
                  </div>
                  <div
                    key={`value-${key}`}
                    className="p-2 border border-gray-300 rounded-md text-sm break-words w-full whitespace-normal text-left"
                  >
                    {JSON.stringify(value).replace('"','').replace('"','')}
                  </div>
                </>
              ))}
            </div>
          </div>
          <button
            onClick={handleClose} // Đóng modal
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    )
  );
  
  
  
}
  

export default ShowEventDetail;

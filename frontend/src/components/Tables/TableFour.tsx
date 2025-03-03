import React, { useState, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import { Event } from '../../types/event';
import ModalOne from '../Modal/ShowEventDetail';
import ModalTwo from '../Modal/ModalTwo';

const eventData: Event[] = [
  {
    id: 1,
    device_id: '649db152-6ab5-4e7b-86ed-bfc93bc3537a',
    partner: 'FYBER',
    country: 'AR',
    tracking_name: 'EXP_LEVEL_2',
    line_x1: 1000,
    total_exp: 100000,
    total_revenue: 1.5,
  },
  {
    id: 2,
    device_id: '649db152-6ab5-4e7b-86ed-bfc93bc3537a',
    partner: 'FYBER',
    country: 'AR',
    tracking_name: 'EXP_LEVEL_3',
    line_x1: 1000,
    total_exp: 100000,
    total_revenue: 1.5,
  },
  {
    id: 3,
    device_id: '649db152-6ab5-4e7b-86ed-bfc93bc3537a',
    partner: 'FYBER',
    country: 'AR',
    tracking_name: 'CHEAT_AD_EXP_LEVEL_5',
    line_x1: 1000,
    total_exp: 100000,
    total_revenue: 0,
  },
  {
    id: 4,
    device_id: '649db152-6ab5-4e7b-86ed-bfc93bc3537a',
    partner: 'FYBER',
    country: 'AR',
    tracking_name: 'CHEAT_EXP_EXP_LEVEL_8',
    line_x1: 1000,
    total_exp: 0,
    total_revenue: 1.2,
  },
  {
    id: 5,
    device_id: '9d3d0272-a538-461d-8d12-518d0fe46ce9',
    partner: 'TAPJOY',
    country: 'SG',
    tracking_name: 'CHEAT_SOURCE_EXP_LEVEL_2',
    line_x1: 1000,
    total_exp: 100000,
    total_revenue: 1.5,
  },
];

const TableFour = () => {
  const [showModalOne, setShowModalOne] = useState(false);
  const [showModalTwo, setShowModalTwo] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [keywords, setKeywords] = useState<string>('');
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(eventData);

  const handleClose = () => {
    setShowModalOne(false);
    setShowModalTwo(false);
  };

  const handleShowModalOne = (event: Event) => {
    setSelectedEvent(event);
    setShowModalOne(true);
  };

  const handleShowModalTwo = () => {
    setShowModalTwo(true);
  };

  // Search handler with debounce
  const deboundedSearch = useCallback(
    debounce((term: string) => {
      if (term) {
        term = term.trim().toUpperCase();
        const filtered = eventData.filter(event =>
           event.device_id.toUpperCase().includes(term)
        || event.country.includes(term)
        || event.partner.includes(term)
        || event.tracking_name.includes(term)
        );
        setFilteredEvents(filtered);
      } 
      else {
        setFilteredEvents(eventData); // Reset data
      }
    }, 1000),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setKeywords(term);
    deboundedSearch(term);
  };

  return (
    <React.Fragment>
      <ModalOne isOpen={showModalOne} handleClose={handleClose} data={selectedEvent} />
      <ModalTwo isOpen={showModalTwo} handleClose={handleClose}/>
      <div className="flex justify-end">
        <button 
            type="submit" 
            className="btn btn-success border rounded-md font-bold"
            onClick={() => handleShowModalTwo()}
        >
            Filter
        </button>
      </div>
      <div className="rounded-xl border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="">
          <input
            type="text"
            className="w-full px-4 py-2  border-gray-300 rounded-md dark:border-strokedark dark:bg-boxdark"
            placeholder="Search..."
            value={keywords}
            onChange={handleSearch}
          />
        </div>
        <div className="max-w-full overflow-x-auto rounded-xl">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                  Device ID
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Partner
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Country
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Tracking Name
                </th>
                <th className="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event, key) => (
                <tr
                    key={key}
                    className={`${
                        key % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
                    } border-b border-[#eee] dark:border-strokedark`}
                >
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{event.device_id}</p>
                  </td>

                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{event.partner}</p>
                  </td>

                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p className="text-black dark:text-white">{event.country}</p>
                  </td>

                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <p
                      className={`inline-flex rounded-full bg-opacity-10 py-1 px-3 text-sm font-medium ${
                        event.tracking_name.startsWith('CHEAT_AD')
                          ? 'bg-warning text-warning'
                          : event.tracking_name.startsWith('CHEAT_EXP')
                          ? 'bg-primary text-primary'
                          : event.tracking_name.startsWith('CHEAT_SOURCE')
                          ? 'bg-danger text-danger'
                          : 'bg-success text-success'
                      }`}
                    >
                      {event.tracking_name}
                    </p>
                  </td>

                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      {/* Show button */}
                      <button
                        className="hover:text-primary"
                        onClick={() => handleShowModalOne(event)} // Pass event to the modal
                      >
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                          />
                          <path
                            d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                          />
                        </svg>
                      </button>

                      {/* Download button */}
                      <button className="hover:text-primary">
                        <svg
                          className="fill-current"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M16.8754 11.6719H1.12445C0.797095 11.6719 0.477448 12.118 0.477448 12.3187V14.8219C0.477448 15.3834 0.797095 15.8219 1.12445 15.8219H16.8754C17.2027 15.8219 17.5224 15.3834 17.5224 14.8219V12.3187C17.5224 11.9531 17.213 11.6719 16.8754 11.6719Z"
                          />
                          <path
                            d="M13.5 8.41862L10.5 5.41862C10.4027 5.31469 10.2359 5.31469 10.1387 5.41862C10.0414 5.52256 10.0414 5.6937 10.1387 5.79763L12.1367 7.79763H7.86234L9.85995 5.79763C9.95714 5.6937 9.95714 5.52256 9.85995 5.41862C9.76275 5.31469 9.59594 5.31469 9.49875 5.41862L6.49875 8.41862C6.40155 8.52256 6.40155 8.6937 6.49875 8.79763C6.596 8.90157 6.76281 8.90157 6.85995 8.79763L9 6.5755L9 13.25C9 13.6642 9.33579 14 9.75 14C10.1642 14 10.5 13.6642 10.5 13.25L10.5 6.5755L13 8.79763C13.0972 8.90157 13.264 8.90157 13.3623 8.79763C13.4595 8.6937 13.4595 8.52256 13.3623 8.41862Z"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  );
};

export default TableFour;

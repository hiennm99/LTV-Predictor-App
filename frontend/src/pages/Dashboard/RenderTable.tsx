interface FilteredTableProps {
    data: any[][];
    unit: string;
    extraColumns: { name: string; multiplier: number, unit: string}[]; // Danh sách cột mở rộng
  }

const filterDays = new Set([7, 14, 30, 60, 90, 180, 365]);

const FilteredTable = ({ data, unit, extraColumns }: FilteredTableProps) => {
  if (!data || data.length < 2) return <p>No Data Available</p>;

  const headers = data[0]; // Lấy tên cột từ hàng đầu tiên
  const filteredRows = data.slice(1).filter(row => filterDays.has(Number(row[0])));

  return (
    <div className="max-w-full overflow-x-auto rounded-xl shadow-md">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className={`py-4 px-4 font-medium text-black dark:text-white text-left ${
                  index === 0 ? "w-[30%]" : "text-center"
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="even:bg-gray-50 odd:bg-white dark:even:bg-gray-700 dark:odd:bg-gray-800 border-b border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`py-3 px-4 text-black dark:text-white ${
                    cellIndex === 0 ? "text-left w-[30%]" : "text-center"
                  }`}
                >
                  {cellIndex === 1 ? `${Number(cell).toFixed(2)} ${unit}` : cell} {/* Làm tròn số & thêm đơn vị */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const FilteredTableExtended = ({ data, unit, extraColumns }: FilteredTableProps) => {
  if (!data || data.length < 2) return <p>No Data Available</p>;

  const headers = [...data[0], ...extraColumns.map(col => col.name)]; // Thêm cột mới vào header
  const filteredRows = data.slice(1).filter(row => filterDays.has(Number(row[0])));

  return (
    <div className="max-w-full overflow-x-auto rounded-xl shadow-md">
      <table className="w-full table-auto border-collapse">
        <thead className="bg-gray-100 dark:bg-gray-800">
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className={`py-4 px-4 font-medium text-black dark:text-white text-left ${
                  index === 0 ? "w-[30%]" : "text-center"
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="even:bg-gray-50 odd:bg-white dark:even:bg-gray-700 dark:odd:bg-gray-800 border-b border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
            >
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`py-3 px-4 text-black dark:text-white ${
                    cellIndex === 0 ? "text-left w-[30%]" : "text-center"
                  }`}
                >
                  {cellIndex === 1 ? `${Number(cell).toFixed(2)} ${unit}` : cell} {/* Làm tròn số & thêm đơn vị */}
                </td>
              ))}
              {/* Thêm các cột mới với giá trị nhân hệ số */}
              {extraColumns.map((col, extraIndex) => (
                <td key={`extra-${extraIndex}`} className="py-3 px-4 text-center text-black dark:text-white">
                  {(Number(row[1]) * col.multiplier).toFixed(2)} {col.unit}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export {FilteredTable, FilteredTableExtended};

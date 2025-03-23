import React from "react";

interface Column<T> {
  key: keyof T; // Restrict keys to properties of T
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: ReadonlyArray<Column<T>>; 
  data: T[];
}

const Table = <T,>({ columns, data }: TableProps<T>) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border border-gray-300 text-left">
        <thead className="bg-[#F8BA10] text-white py-5">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-4 py-4 border border-gray-300 text-sm md:text-base">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border border-gray-300 hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-4 py-2 border border-gray-300 text-sm md:text-base whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-2 text-center text-sm md:text-base">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

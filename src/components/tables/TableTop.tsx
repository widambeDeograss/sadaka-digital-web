import React from "react";
import { Link } from "react-router-dom";
import {
  FilterIcon,
  X,
  SearchCheckIcon,
  FileText,
  FileSpreadsheet,
  Printer,
} from "lucide-react";

// Define props for the Tabletop component
interface TabletopProps {
  inputfilter: boolean;
  togglefilter: (value: boolean) => void;
  showFilter?: boolean;
}

const Tabletop: React.FC<TabletopProps> = ({
  inputfilter,
  togglefilter,
  showFilter = true,
}) => {
  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md">
      <div className="flex items-center space-x-3">
        {showFilter && (
          <div className="relative">
            <button
              className={`flex items-center justify-center p-2 border rounded-lg ${
                inputfilter ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
              id="filter_search"
              onClick={() => togglefilter(!inputfilter)}
            >
              <FilterIcon className="h-4 w-4" />
              {inputfilter && (
                <span className="ml-2">
                  <X className="h-4 w-4" />
                </span>
              )}
            </button>
          </div>
        )}

        <div className="relative">
          <input
            className="p-2 border rounded-lg focus:outline-none bg-gray-200 text-gray-700 focus:ring-2 focus:ring-indigo-500 w-64"
            type="text"
            placeholder="Search..."
          />
          <Link to="#" className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <SearchCheckIcon className="h-4 w-4 text-gray-600" />
          </Link>
        </div>
      </div>
      <div>
        <ul className="flex space-x-3">
          <li>
            <button className="p-2 hover:bg-gray-100 bg-gray-200 text-gray-700 rounded-full">
              <FileText className="h-4 w-4 text-red-600" />
            </button>
          </li>
          <li>
            <button className="p-2 hover:bg-gray-100 bg-gray-200 text-gray-700 rounded-full">
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
            </button>
          </li>
          <li>
            <button className="p-2 hover:bg-gray-100 bg-gray-200 text-gray-700 rounded-full">
              <Printer className="h-4 w-4 text-black" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Tabletop;

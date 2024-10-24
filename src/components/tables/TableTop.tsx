import React from "react";
import { Link } from "react-router-dom";
import { FilterIcon, X, SearchCheckIcon, FileText, FileSpreadsheet, Printer } from "lucide-react";
import { Input } from "antd"; // Import Ant Design Input

// Define props for the Tabletop component
interface TabletopProps {
  inputfilter: boolean;
  togglefilter: (value: boolean) => void;
  showFilter?: boolean;
  searchTerm: string; // Prop for search term
  onSearch: (value: string) => void; // Prop for search handler
}

const Tabletop: React.FC<TabletopProps> = ({
  inputfilter,
  togglefilter,
  showFilter = true,
  searchTerm,
  onSearch,
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

        {/* Search Input using Ant Design */}
        <div className="relative">
          <Input
            className="w-64" 
            type="text"
            placeholder="Search..."
            value={searchTerm} 
            onChange={(e) => onSearch(e.target.value)} 
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

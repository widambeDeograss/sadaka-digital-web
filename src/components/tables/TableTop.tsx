import React from "react";
import { Link } from "react-router-dom";
import { FilterIcon, X, SearchCheckIcon, FileSpreadsheet } from "lucide-react";
import { Input, Tooltip } from "antd";
import { motion } from "framer-motion";
import * as XLSX from 'xlsx';

interface TabletopProps {
  inputfilter: boolean;
  togglefilter: (value: boolean) => void;
  showFilter?: boolean;
  searchTerm: string;
  onSearch: (value: string) => void;
  data: any[]; // Data to be exported
  docName?: string;
}

const Tabletop: React.FC<TabletopProps> = ({
  inputfilter,
  togglefilter,
  showFilter = true,
  searchTerm,
  onSearch,
  data,
  docName = "ExcelData"
}) => {
  const flattenObject = (obj: any, prefix: string = ''): Record<string, any> => {
    let result: Record<string, any> = {};
  
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;
  
      // If the value is a nested object, flatten it recursively
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        result = { ...result, ...flattenObject(value, newKey) };
      } else {
        result[newKey] = value;
      }
    });
  
    return result;
  };
  
  const handleExport = () => {
    // Flatten the data before exporting
    const flattenedData = data.map(item => flattenObject(item));
  
    // Create the worksheet from the flattened data
    const worksheet = XLSX.utils.json_to_sheet(flattenedData);
  
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
  
    // Append the sheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
    // Write the workbook to a file
  XLSX.writeFile(workbook, `${docName}.xlsx`);
  };
  


  return (
    <div className="flex justify-between items-center p-4 bg-white shadow-md rounded-lg">
      <div className="flex items-center space-x-3">
        {showFilter && (
          <Tooltip title={inputfilter ? "Close Filter" : "Open Filter"}>
            <button
              className={`flex items-center justify-center p-2 border rounded-lg transition-all duration-300 ${
                inputfilter 
                  ? "bg-red-500 text-white hover:bg-red-600" 
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => togglefilter(!inputfilter)}
            >
              {inputfilter ? <X className="h-4 w-4" /> : <FilterIcon className="h-4 w-4" />}
            </button>
          </Tooltip>
        )}

        <div className="relative">
          <Input
            className="w-64 rounded-lg" 
            type="text"
            placeholder="Search..."
            value={searchTerm} 
            onChange={(e) => onSearch(e.target.value)} 
            prefix={<SearchCheckIcon className="h-4 w-4 text-gray-400 mr-2" />}
          />
        </div>
      </div>
      
      <div>
        <Tooltip title="Export to Excel">
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="bg-gradient-to-br  from-[#152033] to-[#3E5C76] text-white 
            px-4 py-2 rounded-lg flex items-center space-x-2 
            transition-all duration-300 ease-in-out"
          >
            <FileSpreadsheet className="h-5 w-5" />
            <span>Export Excel</span>
          </motion.button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Tabletop;
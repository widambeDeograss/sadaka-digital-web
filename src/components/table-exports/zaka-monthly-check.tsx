import React from "react";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { Link } from "react-router-dom";
import { 
  CloseOutlined, 
  FilterOutlined, 
  SearchOutlined, 
  FilePdfOutlined, 
  FileExcelOutlined, 
  PrinterOutlined 
} from '@ant-design/icons';
import { ExportAsExcel, ExportAsPdf, PrintDocument } from "react-export-table";

interface TabletopProps {
  inputfilter?: boolean;
  togglefilter?: (value: boolean) => void;
  searchQuery: string;
  onChangeSearch: (e: string) => void;
  data: any[];
  header: any[];
  docTitle: string;
  topFilter?: boolean;
}

const Tabletop: React.FC<TabletopProps> = ({
  inputfilter = false,
  togglefilter = () => {},
  searchQuery,
  onChangeSearch,
  data,
  header,
  docTitle="",
  topFilter = false
}) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-white rounded-lg shadow-sm mb-4">
      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        {topFilter && (
          <button
            className={`flex items-center justify-center p-2 rounded-md ${
              inputfilter ? "bg-gray-200" : "bg-gray-100 hover:bg-gray-200"
            } transition-colors`}
            onClick={() => togglefilter(!inputfilter)}
            id="filter_search"
            aria-label={inputfilter ? "Close filter" : "Open filter"}
          >
            <FilterOutlined className="text-gray-600" />
            {inputfilter && (
              <CloseOutlined className="text-gray-600 ml-1" />
            )}
          </button>
        )}

        <div className="relative flex-grow">
          <input
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            type="text"
            value={searchQuery}
            onChange={(e) => onChangeSearch(e.target.value)}
            placeholder="Search..."
            aria-label="Search table"
          />
          <Link
            to="#"
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            aria-label="Search"
          >
            <SearchOutlined className="text-gray-400" />
          </Link>
        </div>
      </div>

      {/* Export Buttons Section */}
      <div className="flex gap-2 w-full md:w-auto justify-end">
        <ReactTooltip place="top"  />
        
        {/* PDF Export */}
        <ExportAsPdf
          data={data}
          headers={[...header].slice(0, 20)}
          headerStyles={{ fillColor: "red", font: "times", fontSize: 8 }}
          styles={{ font: "times", fontSize: 8 }}
          margin={{ left: 1, right: 1, bottom: 0 }}
          title={docTitle}
          fileName={docTitle}
          theme="striped"
        >
          {(props) => (
            <button
              data-tip="PDF"
              {...props}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              aria-label="Export as PDF"
            >
              <FilePdfOutlined className="text-red-500" />
            </button>
          )}
        </ExportAsPdf>

        {/* Excel Export */}
    
        <ExportAsExcel
          data={data}
          headers={[...header]}
        //   title=""
          fileName={docTitle}
        >
          {(props) => (
            <button
              data-tip="Excel"
              {...props}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              aria-label="Export as Excel"
            >
              <FileExcelOutlined className="text-green-600" />
            </button>
          )}
        </ExportAsExcel>

        {/* Print */}
        <PrintDocument
          data={data}
          headers={[...header].slice(0, 20)}
          headerStyles={{ fillColor: "red", font: "times", fontSize: 4 }}
          styles={{ font: "times", fontSize: 4 }}
          margin={{ left: 1, right: 1, bottom: 0 }}
          theme="striped"
          title={docTitle}
        >
          {(props) => (
            <button
              data-tip="Print"
              {...props}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              aria-label="Print table"
            >
              <PrinterOutlined className="text-gray-600" />
            </button>
          )}
        </PrintDocument>
      </div>
    </div>
  );
};

export default Tabletop;
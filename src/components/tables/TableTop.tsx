import React from "react";
import { FilterIcon, X, SearchCheckIcon, FileSpreadsheet } from "lucide-react";
import { Input, Tooltip } from "antd";
import { motion } from "framer-motion";
import { useDownloadExcel } from "react-export-table-to-excel";
import {
  fetchAhadi,
  fetchMavuno,
  fetchMichango,
  fetchSadaka,
  fetchWahumini,
  fetchZaka,
} from "../../helpers/ApiConnectors";
import { useAppSelector } from "../../store/store-hooks";

interface TabletopProps {
  inputfilter: boolean;
  togglefilter: (value: boolean) => void;
  showFilter?: boolean;
  searchTerm: string;
  onSearch: (value: string) => void;
  docName?: string;
  data: string;
}

const Tabletop: React.FC<TabletopProps> = ({
  inputfilter,
  togglefilter,
  showFilter = true,
  searchTerm,
  onSearch,
  data,
  docName = "TableData",
}) => {
  // Export functionality using react-export-table-to-excel
  const church = useAppSelector((state: any) => state.sp);
  const { onDownload } = useDownloadExcel({
    currentTableRef: document.getElementById(data),
    filename: docName,
    sheet: "Sheet1",
  });

  const handleExport = async () => {
    const id = `?export=excel&church_id=${church.id}`;
    try {
      let response;
      switch (data) {
        case "wahumini":
          response = await fetchWahumini(id, "blob");
          console.log(response);

          break;
        case "sadaka":
          response = await fetchSadaka(id, "blob");
          break;
        case "zaka":
          response = await fetchZaka(id, "blob");
          break;
        case "michango":
          response = await fetchMichango(id);
          break;
        case "ahadi":
          response = await fetchAhadi(id);
          break;
        case "mavuno":
          response = await fetchMavuno(id);
          break;
        default:
          onDownload();
          return;
      }

      if (response) {
        // Handle the binary response (e.g., download the file)
        //@ts-ignore
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${docName}.xlsx`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error exporting data:", error);
    }
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
              {inputfilter ? (
                <X className="h-4 w-4" />
              ) : (
                <FilterIcon className="h-4 w-4" />
              )}
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

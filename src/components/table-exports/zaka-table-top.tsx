import React, { useState } from "react";
import { Tooltip } from "antd";
import { DatePicker } from "antd";
import { motion } from "framer-motion";
import { 
  Filter, 
  X, 
  Calendar, 
  DownloadCloud 
} from "lucide-react";
import {  
    SearchOutlined, 
    FilePdfOutlined, 
    FileExcelOutlined, 
    // PrinterOutlined 
  } from '@ant-design/icons';
import { fetchZaka } from "../../helpers/ApiConnectors";
import { useAppSelector } from "../../store/store-hooks";

const { RangePicker } = DatePicker;

interface ZakaTableTopProps {
  inputfilter: boolean;
  togglefilter: (value: boolean) => void;
  searchTerm: string;
  onSearch: (value: string) => void;
  docName?: string;
  onDateRangeChange?: (dates: [Date | null, Date | null] | null) => void;
}

const ZakaTableTop: React.FC<ZakaTableTopProps> = ({
  inputfilter,
  togglefilter,
  searchTerm,
  onSearch,
  docName = "Zaka Records",
  onDateRangeChange,
}) => {
  const church = useAppSelector((state: any) => state.sp);
  const [isExporting, setIsExporting] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null] | null>(null);

  // Handle date range change
  const handleDateChange = (dates: any) => {
    if (dates) {
      const formattedDates: [Date | null, Date | null] = [
        dates[0]?.toDate() || null,
        dates[1]?.toDate() || null
      ];
      setDateRange(formattedDates);
      if (onDateRangeChange) {
        onDateRangeChange(formattedDates);
      }
    } else {
      setDateRange(null);
      if (onDateRangeChange) {
        onDateRangeChange(null);
      }
    }
  };

  // Format dates for API query
  const formatDateForQuery = (date: Date | null): string => {
    if (!date) return '';
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  // Base query parameters
  const getBaseQueryParams = (): string => {
    let query = `church_id=${church.id}`;
    
    // Add search term if present
    if (searchTerm) {
      query += `&search=${encodeURIComponent(searchTerm)}`;
    }
    
    // Add date range if present
    if (dateRange && dateRange[0] && dateRange[1]) {
      query += `&from_date=${formatDateForQuery(dateRange[0])}&to_date=${formatDateForQuery(dateRange[1])}`;
    }
    
    return query;
  };

  // Export handlers
  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const query = `?${getBaseQueryParams()}&export=excel`;
      const response = await fetchZaka(query, "blob");
      
      if (response) {
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
      console.error("Error exporting Excel:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPdf = async () => {
    setIsExporting(true);
    try {
      const query = `?${getBaseQueryParams()}&export=pdf`;
      const response = await fetchZaka(query, "blob");
      
      if (response) {
        //@ts-ignore
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${docName}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = async () => {
    setIsExporting(true);
    try {
      const query = `?${getBaseQueryParams()}&export=pdf`;
      const response = await fetchZaka(query, "blob");
      
      if (response) {
        //@ts-ignore
        const url = window.URL.createObjectURL(new Blob([response]));
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = url;
        document.body.appendChild(iframe);
        iframe.onload = () => {
          iframe.contentWindow?.print();
          setTimeout(() => {
            document.body.removeChild(iframe);
            window.URL.revokeObjectURL(url);
          }, 100);
        };
      }
    } catch (error) {
      console.error("Error printing:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Left side: Search and Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
          {/* Filter toggle button */}
          <Tooltip title={inputfilter ? "Close Filter" : "Open Filter"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ${
                inputfilter
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => togglefilter(!inputfilter)}
              aria-label={inputfilter ? "Close filter" : "Open filter"}
            >
              {inputfilter ? (
                <X className="h-4 w-4" 
                    onClick={() => handlePrint()}
                />
              ) : (
                <Filter className="h-4 w-4" />
              )}
            </motion.button>
          </Tooltip>

          {/* Search input */}
          <div className="relative w-full sm:w-64">
            <input
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="text"
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search by name, card, jumuiya..."
              aria-label="Search"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <SearchOutlined className="h-4 w-4 text-gray-400" />
            </div>
          </div>

          {/* Date Range Picker */}
          <div className="w-full sm:w-auto">
            <RangePicker 
              onChange={handleDateChange}
              className="border border-gray-300 rounded-lg"
              format="YYYY-MM-DD"
              placeholder={["Export From date", "To date"]}
              suffixIcon={<Calendar className="h-4 w-4 text-gray-400" />}
            />
          </div>
        </div>

        {/* Right side: Export Buttons */}
        <div className="flex items-center gap-2">
          {/* Excel Export */}
          <Tooltip title="Export to Excel">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportExcel}
              disabled={isExporting}
              className="flex items-center gap-2 py-2 px-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              aria-label="Export to Excel"
            >
              <FileExcelOutlined className="h-4 w-4" />
              <span className="hidden sm:inline">Excel</span>
            </motion.button>
          </Tooltip>

          {/* PDF Export */}
          <Tooltip title="Export to PDF">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExportPdf}
              disabled={isExporting}
              className="flex items-center gap-2 py-2 px-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              aria-label="Export to PDF"
            >
              <FilePdfOutlined className="h-4 w-4" />
              <span className="hidden sm:inline">PDF</span>
            </motion.button>
          </Tooltip>

          {/* Print */}
          {/* <Tooltip title="Print">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrint}
              disabled={isExporting}
              className="flex items-center gap-2 py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              aria-label="Print"
            >
              <PrinterOutlined className="h-4 w-4" />
              <span className="hidden sm:inline">Print</span>
            </motion.button>
          </Tooltip> */}
        </div>
      </div>

      {/* Export loading indicator */}
      {isExporting && (
        <div className="mt-2 flex items-center gap-2 text-blue-600">
          <DownloadCloud className="h-4 w-4 animate-pulse" />
          <span className="text-sm">Preparing export...</span>
        </div>
      )}
    </div>
  );
};

export default ZakaTableTop;
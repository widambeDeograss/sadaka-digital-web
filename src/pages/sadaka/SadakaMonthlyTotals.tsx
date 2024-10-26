import React, { useState, useMemo } from "react";
import { Table, Card, Button } from "antd";
import { useAppSelector } from "../../store/store-hooks";
import { resolveSadakaTotals } from "../../helpers/ApiConnectors";
import { useQuery } from "@tanstack/react-query";
import Tabletop from "../../components/tables/TableTop";

interface WeekData {
  week_start: string;
  week_end: string;
  total_sadaka: number;
}

interface SadakaData {
  card_no: string;
  mhumini_first_name: string;
  mhumini_last_name: string;
  weekly_sadaka: WeekData[];
}

const SadakaReportTable: React.FC = () => {
  const church = useAppSelector((state: any) => state.sp);
  const [data, setData] = useState<SadakaData[]>([]);
  const [yearFilter, setYearFilter] = useState<string | null>(null);
  const [monthFilter, setMonthFilter] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch sadaka report data using react-query with error handling
  const {
    data: sadaka,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sadakaTotals", yearFilter, monthFilter],
    queryFn: async () => {
      if (!church?.id) return [];
      let query = `?church_id=${church.id}`;
      if (yearFilter) query += `&year=${yearFilter}`;
      if (monthFilter) query += `&month=${monthFilter}`;
      const response: any = await resolveSadakaTotals(query);
      setData(response);
      return response;
    },
  });

  // Memoize columns for performance optimization
  const columns = useMemo(() => {
    if (!data || data.length === 0) return [];

    const weeksColumns = data[0].weekly_sadaka.map((week: WeekData) => ({
      title: `${week.week_start} to ${week.week_end}`,
      dataIndex: "weekly_sadaka",
      key: `${week.week_start}-${week.week_end}`,
      render: (weekly_sadaka: WeekData[]) => {
        const weekData = weekly_sadaka.find(
          (w) =>
            w.week_start === week.week_start && w.week_end === week.week_end
        );
        return weekData ? weekData.total_sadaka || 0 : 0;
      },
    }));

    return [
      {
        title: "Card Number",
        dataIndex: "card_no",
        key: "card_no",
      },
      {
        title: "Member Name",
        key: "member_name",
        render: (record: SadakaData) =>
          `${record.mhumini_first_name} ${record.mhumini_last_name}`,
      },
      ...weeksColumns,
    ];
  }, [data]);

  return (
    <Card
      title={
        <h3 className="font-bold text-sm text-left ">Matoleo ya Sadaka</h3>
      }
      className="mt-5"
    >
      <div className="table-responsive">
        <Tabletop
          inputfilter={showFilter}
          onSearch={(term: string) => setSearchTerm(term)}
          togglefilter={(value: boolean) => setShowFilter(value)}
          searchTerm={searchTerm}
        />
        {showFilter && (
          <div className="bg-gray-100 p-4 mt-4 rounded-lg">
            <h4 className="font-bold mb-2">Filter Options</h4>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="yearFilter" className="block text-sm mb-2">
                  Filter by Year:
                </label>
                <input
                  type="text"
                  id="yearFilter"
                  value={yearFilter || ""}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="p-2 border rounded-lg w-full"
                  placeholder="Enter year (e.g., 2023)"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="monthFilter" className="block text-sm mb-2">
                  Filter by Month:
                </label>
                <input
                  type="text"
                  id="monthFilter"
                  value={monthFilter || ""}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="p-2 border rounded-lg w-full"
                  placeholder="Enter month (e.g., 09 for September)"
                />
              </div>
            </div>
            <Button
              type="primary"
              className="mt-4 bg-[#152033] text-white"
              onClick={() => setShowFilter(false)}
            >
              Apply Filter
            </Button>
          </div>
        )}

        <Table
          columns={columns}
          dataSource={sadaka}
          loading={isLoading}
          rowKey="card_no"
          pagination={false}
          bordered
        />
      </div>
    </Card>
  );
};

export default SadakaReportTable;

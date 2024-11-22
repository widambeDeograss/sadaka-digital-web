import React, { useEffect, useState } from "react";
import { Table, Card, Button } from "antd";
import { useAppSelector } from "../../store/store-hooks";
import { resolveZakaTotals } from "../../helpers/ApiConnectors";
import Tabletop from "../../components/tables/TableTop";
import { useQuery } from "@tanstack/react-query";

// Interface based on your sample data
interface MonthData {
  month: string;
  total_amount: number;
}


const ZakaReportTable: React.FC = () => {
  const church = useAppSelector((state: any) => state.sp);
  // const _userPermissions = useAppSelector(
  //   (state: any) => state.user.userInfo.role.permissions
  // );
  const [yearFilter, setYearFilter] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [zakaData, setZakaData] = useState([]);

  const { isLoading: loadingzaka } = useQuery({
    queryKey: ["zakaTotals", yearFilter],
    queryFn: async () => {
      let query = `?church_id=${church.id}`;
      if (yearFilter) query += `&year=${yearFilter}`;
      const response: any = await resolveZakaTotals(query);
      setZakaData(response);
      setFilteredData(response);
      return response;
    },
    // {
    //   enabled: false,
    // }
  });

  useEffect(() => {
    if (searchTerm) {
      const lowercasedTerm = searchTerm?.toLowerCase();
      const filtered = zakaData.filter((item: any) => {
        return (
          item?.jumuiya_name?.toLowerCase().includes(lowercasedTerm) ||
          item?.kanda_name?.toLowerCase().includes(lowercasedTerm) ||
          item?.member_name?.toLowerCase().includes(lowercasedTerm) ||
          item?.card_no?.toLowerCase().includes(lowercasedTerm)
        );
      });
      setFilteredData(filtered);
    } else {
      setFilteredData(zakaData);
    }
  }, [searchTerm, zakaData]);

  // Define months mapping to column names
  const monthColumns = [
    `${yearFilter? yearFilter: new Date().getFullYear()}-01`,
    `${yearFilter? yearFilter: new Date().getFullYear()}-02`,
    `${yearFilter? yearFilter: new Date().getFullYear()}-03`,
    `${yearFilter? yearFilter: new Date().getFullYear()}-04`,
    `${yearFilter? yearFilter: new Date().getFullYear()}-05`,
    `${yearFilter? yearFilter: new Date().getFullYear()}-06`,
    `${yearFilter? yearFilter: new Date().getFullYear()}-07`,
    `${yearFilter? yearFilter: new Date().getFullYear()}-08`,
    `${yearFilter? yearFilter: new Date().getFullYear()}-09`,
    `${yearFilter? yearFilter: new Date().getFullYear()}-10`,
    `${yearFilter? yearFilter: new Date().getFullYear()}-11`,
    `${yearFilter? yearFilter: new Date().getFullYear()}-12`,
  ];

  // Define table columns
  const columns = [
    {
      title: "Card Number",
      dataIndex: "card_no",
      key: "card_no",
    },
    {
      title: "Member Name",
      dataIndex: "member_name",
      key: "member_name",
    },
    {
      title: "Jumuiya",
      dataIndex: "jumuiya_name",
      key: "jumuiya_name",
    },
    {
      title: "Kanda",
      dataIndex: "kanda_name",
      key: "kanda_name",
    },
    ...monthColumns.map((month) => ({
      title: month,
      dataIndex: "months",
      key: month,
      render: (months: MonthData[]) => {
        const monthData = months.find((m) => m.month === month);
        return monthData ? monthData.total_amount || 0 : 0;
      },
    })),
  ];

  return (
    <Card
      title={<h3 className="font-bold text-sm text-left ">Zaka</h3>}
      className="mt-5"
    >
      <div className="table-responsive">
        <Tabletop
          inputfilter={showFilter}
          onSearch={(term: string) => setSearchTerm(term)}
          togglefilter={(value: boolean) => setShowFilter(value)}
          searchTerm={searchTerm}
          data={filteredData}
        />
        {showFilter && (
          <div className="bg-gray-100 p-4 mt-4 rounded-lg">
            <h4 className="font-bold mb-2">Filter Options</h4>
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
            <Button
              type="primary"
              className="mt-3 bg-[#152033] text-white"
              onClick={() => {
                setShowFilter(false);
              }}
            >
              Apply Filter
            </Button>
          </div>
        )}
        <Table
          columns={columns}
          dataSource={filteredData}
          loading={loadingzaka}
          rowKey="card_no"
          pagination={false}
          bordered
        />
      </div>
    </Card>
  );
};

export default ZakaReportTable;

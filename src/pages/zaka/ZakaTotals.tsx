import React from "react";
import { Table, Card } from "antd";
import { useAppSelector } from "../../store/store-hooks";
import { resolveZakaTotals } from "../../helpers/ApiConnectors";
import Tabletop from "../../components/tables/TableTop";
import { useQuery } from "@tanstack/react-query";

// Interface based on your sample data
interface MonthData {
  month: string;
  total_amount: number;
}

interface ZakaData {
  card_no: string;
  member_name: string;
  months: MonthData[];
}

const ZakaReportTable: React.FC = () => {
  const church = useAppSelector((state: any) => state.sp);
  const userPermissions = useAppSelector(
    (state: any) => state.user.userInfo.role.permissions
  );


  const { data: zaka, isLoading: loadingzaka } = useQuery({
    queryKey: ["zakaTotals"],
    queryFn: async () => {
      const response: any = await resolveZakaTotals(`?church_id=${church.id}`);
      console.log(response);
      return response;
    },
    // {
    //   enabled: false,
    // }
  });

  // Define months mapping to column names
  const monthColumns = [
    "2024-01", "2024-02", "2024-03", "2024-04", "2024-05", "2024-06", 
    "2024-07", "2024-08", "2024-09", "2024-10", "2024-11", "2024-12"
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
    <Card title={<h3 className="font-bold text-sm text-left ">Zaka</h3>}
    className="mt-5">
    <div className="table-responsive">
    <Tabletop inputfilter={false} togglefilter={function (value: boolean): void {
          throw new Error("Function not implemented.");
      } }/>
     <Table
        columns={columns}
        dataSource={zaka}
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

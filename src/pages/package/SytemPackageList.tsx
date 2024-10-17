import {Badge, Button, Card, Progress, Select, Table, Typography} from "antd";
import { useState } from "react";
import Tabletop from "../../components/tables/TableTop";
import { useAppSelector } from "../../store/store-hooks";
import { useQuery } from "@tanstack/react-query";
import { fetchSystemPackage } from "../../helpers/ApiConnectors";
import { useNavigate } from "react-router-dom";


const SystemPackagesList = () => {
  const [openMOdal, setopenMOdal] = useState(false);
  const navigate = useNavigate();
  const church = useAppSelector((state: any) => state.sp);
  const userPermissions = useAppSelector(
    (state: any) => state.user.userInfo.role.permissions
  );


  const { data: systemPackages, isLoading: loadingSystemPackages } = useQuery({
    queryKey: ["SystemPackages"],
    queryFn: async () => {
      const response: any = await fetchSystemPackage();
      console.log(response);
      return response;
    },
    // {
    //   enabled: false,
    // }
  });

  const columns = [
    {
      title: "s/No",

      dataIndex: "sNo",
      render: (text: any, record: any, index: number) => <div>{index + 1}</div>,
      sorter: (a: any, b: any) => a.sNo.length - b.sNo.length,
    },
    {
        title: "Name",
        dataIndex: "mchango_name",
        render: (text: any, record: any) => <div>{text}</div>,
        // sorter: (a, b) => a.name.length - b.name.length,
      },
      {
          title: "Amount",
          dataIndex: "mchango_amount",
          render: (text: any, record: any) => (
            <div>
              {text}
            </div>
          ),
          // sorter: (a, b) => a.name.length - b.name.length,
        },
    {
        title: "Collected Amount",
        dataIndex: "collected_amount",
        render: (text: any, record: any) => <div>{text}</div>,
        // sorter: (a, b) => a.name.length - b.name.length,
      },
    {
        title: "Lengo",
        dataIndex: "target_amount",
        render: (text: any, record: any) => <div>{text}</div>,
        // sorter: (a, b) => a.name.length - b.name.length,
      },
    {
        title: "Lengo",
        dataIndex: "status",
        render: (text: any, record: any) => <div>
          {text === true ? <Badge className="" color="green">Active</Badge>: <Badge color="yellow">Inactive</Badge>}
        </div>,
        // sorter: (a, b) => a.name.length - b.name.length,
      },
    {
        title: "Progress",
        dataIndex: "status",
        render: (text: any, record: any) => <div>
             <Progress percent={Math.floor(record.collected_amount/record.target_amount * 100)} status="active" />
        </div>,
        // sorter: (a, b) => a.name.length - b.name.length,
      },
    {
      title: "date",
      dataIndex: "date",
      render: (text: any, record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.capacity.length - b.capacity.length,
    },
  ];

  return(
      <div className="">
          <Card
          className="mt-4"
              title={<h3 className="font-bold text-sm text-left ">System Packages</h3>}
          >
              <div className="text-xs">
                  <h3 className="text-left">Total Packages: <span>{systemPackages?.length}</span></h3>
                  {/* <h3 className="text-left">Bahasha Zilizorudishwa Mwezi huu: <span>0</span></h3> */}
                  <div className="flex justify-between flex-wrap mt-3">
                      <div>
                          <Button.Group className="mt-5">
                              <Button type="primary" className="bg-[#152033] text-white" onClick={() => navigate("/dashboard/SystemPackages/ongeza")} >Add System Packages</Button>
                              {/* </Radio.Button> */}
                          </Button.Group>
                      </div>
                  </div>
              </div>

          </Card>
          <Card title={<h3 className="font-bold text-sm text-left ">SystemPackages</h3>}
                className="mt-5">
              <div className="table-responsive">
                <Tabletop inputfilter={false} togglefilter={function (value: boolean): void {
                      throw new Error("Function not implemented.");
                  } }/>
                <Table columns={columns} dataSource={systemPackages} loading={loadingSystemPackages} />
              </div>
          </Card>
      </div>
  )
}

export default SystemPackagesList;

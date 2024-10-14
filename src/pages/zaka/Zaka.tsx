import {Button, Card, Select, Table, Typography} from "antd";
import Column from "antd/es/table/Column";
import OngezaZaka from "./OngezaZakaModal";
import { useState } from "react";
import Widgets from "./Stats";
import Tabletop from "../../components/tables/TableTop";
import { useAppSelector } from "../../store/store-hooks";
import { useQuery } from "@tanstack/react-query";
import { fetchZaka } from "../../helpers/ApiConnectors";

const michango = [
    {
        id:1,
        name:'Widambe Deograss',
        phone:"0716058802",
        changio:500000,
        tarehe:"1/11/2023",

    }
]
const Zaka = () => {
    const [reverse, setReverse] = useState(false);
  const [openMOdal, setopenMOdal] = useState(false);

  const church = useAppSelector((state: any) => state.sp);
  const userPermissions = useAppSelector(
    (state: any) => state.user.userInfo.role.permissions
  );


  const { data: zaka, isLoading: loadingzaka } = useQuery({
    queryKey: ["zaka"],
    queryFn: async () => {
      const response: any = await fetchZaka(`?church_id=${church.id}`);
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
  
        dataIndex: "name",
        render: (text: any, record: any) => <div>{record?.bahasha_details?.mhumini_details?.first_name} {record?.bahasha_details?.mhumini_details?.last_name}</div>,
        // sorter: (a, b) => a.name.length - b.name.length,
      },
      {
          title: "Bahasha",
    
          dataIndex: "",
          render: (text: any, record: any) => (
            <div>
              {record?.bahasha_details?.card_no}
            </div>
          ),
          // sorter: (a, b) => a.name.length - b.name.length,
        },
    {
        title: "Amount",
        dataIndex: "zaka_amount",
        render: (text: any, record: any) => <div>{text}</div>,
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
        <Widgets/>
          <Card
              title={<h3 className="font-bold text-sm text-left ">Zaka</h3>}
          >
              <div className="text-xs">
                  <h3 className="text-left">Tarehe: <span>{new Date().toDateString()}</span></h3>
                  <h3 className="text-left">Bahasha Zilizorudishwa Mwezi huu: <span>0</span></h3>
                  <div className="flex justify-between flex-wrap mt-3">
                      <div>
                          <Button.Group className="mt-5">
                              <Button type="primary" className="bg-[#152033] text-white" onClick={() => setopenMOdal(true)} >Ongeza zaka</Button>
                              <Button type="primary" className="bg-[#152033] text-white" onClick={() => setopenMOdal(true)} ></Button>
                              {/* </Radio.Button> */}
                          </Button.Group>
                      </div>
                  </div>
              </div>

          </Card>
          <Card title={<h3 className="font-bold text-sm text-left ">Zaka</h3>}
                className="mt-5">
                <div className="table-responsive">
                <Tabletop inputfilter={false} togglefilter={function (value: boolean): void {
                      throw new Error("Function not implemented.");
                  } }/>
                <Table columns={columns} dataSource={zaka} loading={loadingzaka} />
              </div>
          </Card>
          <OngezaZaka openModal={openMOdal} handleCancel={() =>  setopenMOdal(false) }  />
      </div>
  )
}

export default Zaka;

import { Button, Card, Col, Dropdown, Menu, Row, Table } from "antd";
import { useNavigate } from "react-router-dom";
import Tabletop from "../..//../components/tables/TableTop";
import { fetchPayTypes, fetchtExpCat } from "../../../helpers/ApiConnectors";
import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "../../../store/store-hooks";
import { useState } from "react";
import ExpenseCategoryModal from "./AddCategory";

const ExpenseCategoryList = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false)
  const church = useAppSelector((state: any) => state.sp);
  const userPermissions = useAppSelector(
    (state: any) => state.user.userInfo.role.permissions
  );

  const {
    data: expensecats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["expensecats"],
    queryFn: async () => {
      const response: any = await fetchtExpCat(`?church_id=${church.id}`);
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
      dataIndex: "category_name",
      render: (text: any, record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Budget",
      dataIndex: "budget",
      render: (text: any, record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },

    {
        title: "created_at",
        dataIndex: "inserted_at",
        render: (text: any, record: any) => <div>{text}</div>,
        // sorter: (a, b) => a.capacity.length - b.capacity.length,
      },

  ];
  return (
    <div>
      <Card
        title={<h3 className="font-bold text-sm text-left">Aina za matumizi</h3>}
        className=""
      >
        <div>
          <div className="flex justify-between mt-3">
            <div>
              <h3 className="text-left font-bold text-xs">
                Aina za matumizi: <span>{expensecats?.length}</span>
              </h3>
            </div>
            <div>
              <Button.Group>
                <Button
                  type="primary"
                  className="bg-[#152033] text-white text-xs"
                  onClick={() => setIsVisible(true)}
                >
                  Add Expense Category
                </Button>
                {/* </Radio.Button> */}
              </Button.Group>
            </div>
          </div>
        </div>
      </Card>

      <Row gutter={[24, 0]} className="mt-5">
        <Col xs="24" xl={24}>
          <Card
            bordered={false}
            //   className="criclebox tablespace mb-24"
            title="Bahasha"
          >
            <div className="table-responsive">
              <Tabletop
                inputfilter={false}
                togglefilter={function (value: boolean): void {
                  throw new Error("Function not implemented.");
                }}
              />

              <Table
                columns={columns}
                dataSource={expensecats}
                loading={isLoading}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <ExpenseCategoryModal visible={isVisible} onClose={() => setIsVisible(false)} />
    </div>
  );
};

export default ExpenseCategoryList;

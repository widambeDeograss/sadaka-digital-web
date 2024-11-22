import { Button, Card, Col, Dropdown, Menu, message, Row, Table } from "antd";
import { useNavigate } from "react-router-dom";
import Tabletop from "../..//../components/tables/TableTop";
import { deleteExpCat, fetchtExpCat } from "../../../helpers/ApiConnectors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "../../../store/store-hooks";
import { useState } from "react";
import ExpenseCategoryModal from "./AddCategory";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  PlusCircleFilled
} from "@ant-design/icons";
import modal from "antd/es/modal";
import { GlobalMethod } from "../../../helpers/GlobalMethods";
import ViewModal from "./ViewExpenditureCategory";

const ExpenseCategoryList = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false)
  const church = useAppSelector((state: any) => state.sp);
  const userPermissions = useAppSelector(
    (state: any) => state.user.userInfo.role.permissions
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);
  const queryClient = useQueryClient();

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

  const handleDelete = (expenceCategoryId: any) => {
    modal.confirm({
      title: "Confirm Deletion",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this record?",
      okText: "OK",
      okType: "danger",
      cancelText: "cancel",
      onOk: () => {
        deleteAhadiMutation(expenceCategoryId);
      },
    });
  };

  const { mutate: deleteAhadiMutation } = useMutation({
    mutationFn: async (expenceCategoryId: any) => {
      await deleteExpCat(expenceCategoryId);
    },
    onSuccess: () => {
      message.success(" Expence category deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["expensecats"] });
    },
    onError: () => {
      message.error("Failed to delete expence category.");
    },
  });

  const handleView = (record: any) => {
    setSelectedData(record);
    setModalVisible(true);
  };

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
      render: (text: any, record: any) => <div>{GlobalMethod.twoDecimalWithoutRounding(text)}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },

    {
        title: "created at",
        dataIndex: "inserted_at",
        render: (text: any, record: any) => <div>{text}</div>,
        // sorter: (a, b) => a.capacity.length - b.capacity.length,
      },

    
      {
        title: "",
        render: (text: any, record: any) => (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="1"
                  icon={<EyeOutlined />}
                  onClick={() => handleView(record)}
                >
                  View
                </Menu.Item>
                <Menu.Item
                  key="3"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setSelectedData(record);
                    setIsVisible(true);
                  }}
                >
                  Edit
                </Menu.Item>
               {
                record?.name !== "Cash" && (
                  <Menu.Item
                  key="4"
                  icon={<DeleteOutlined />}
                  danger
                  onClick={() => handleDelete(record?.id)}
                >
                  Delete
                </Menu.Item>
                )
               }
              </Menu>
            }
            trigger={["click"]}
          >
            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
              Actions <DownOutlined />
            </a>
          </Dropdown>
        ),
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
            title=""
          >
            <div className="table-responsive">
              {/* <Tabletop
                inputfilter={false}
                togglefilter={function (value: boolean): void {
                  throw new Error("Function not implemented.");
                }}
              /> */}

              <Table
                columns={columns}
                dataSource={expensecats}
                loading={isLoading}
                bordered
              />
            </div>
          </Card>
        </Col>
      </Row>
      <ExpenseCategoryModal visible={isVisible} onClose={() => setIsVisible(false)} expenseCategory={selectedData} isEditing={selectedData === null? false: true}/>
        <ViewModal data={selectedData} onClose={() => setModalVisible(false)} visible={modalVisible}/>
    </div>
  );
};

export default ExpenseCategoryList;

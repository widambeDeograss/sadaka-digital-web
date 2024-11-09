import { Button, Card, Col, Dropdown, Menu, message, Row, Table } from "antd";
import { useNavigate } from "react-router-dom";
import Tabletop from "../..//../components/tables/TableTop";
import { deletePayType, fetchPayTypes } from "../../../helpers/ApiConnectors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "../../../store/store-hooks";
import { useState } from "react";
import PaymentTypeModal from "./AddPaymentCategory";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  PlusCircleFilled
} from "@ant-design/icons";
import modal from "antd/es/modal";

const PaymentTypeList = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false)
  const queryClient = useQueryClient();
  const church = useAppSelector((state: any) => state.sp);
  const userPermissions = useAppSelector(
    (state: any) => state.user.userInfo.role.permissions
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const {
    data: payTypes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["payTypes"],
    queryFn: async () => {
      const response: any = await fetchPayTypes(`?church_id=${church.id}`);
      console.log(response);
      return response;
    },
    // {
    //   enabled: false,
    // }
  });

  const handleDelete = (payTypesId: any) => {
    modal.confirm({
      title: "Confirm Deletion",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this record?",
      okText: "OK",
      okType: "danger",
      cancelText: "cancel",
      onOk: () => {
        deleteAhadiMutation(payTypesId);
      },
    });
  };

  const { mutate: deleteAhadiMutation } = useMutation({
    mutationFn: async (payTypesId: any) => {
      await deletePayType(payTypesId);
    },
    onSuccess: () => {
      message.success("payTypes deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["payTypes"] });
    },
    onError: () => {
      message.error("Failed to delete payTypes.");
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

      dataIndex: "name",
      render: (text: any, record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Description",

      dataIndex: "description",
      render: (text: any, record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },
 
    {
        title: "created_at",
        dataIndex: "created_at",
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
        title={<h3 className="font-bold text-sm text-left">Payment Types</h3>}
        className=""
      >
        <div>
          <div className="flex justify-between mt-3">
            <div>
              <h3 className="text-left font-bold text-xs">
                Aina za malipo: <span>{payTypes?.length}</span>
              </h3>
            </div>
            <div>
              <Button.Group>
                <Button
                  type="primary"
                  className="bg-[#152033] text-white text-xs"
                  onClick={() => {
                    setSelectedData(null);
                    setIsVisible(true);
                  }}
                >
                  Add Payment type
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
            title="Payment Types"
          >
            <div className="table-responsive">

              <Table
                columns={columns}
                dataSource={payTypes}
                loading={isLoading}
              />
            </div>
          </Card>
        </Col>
      </Row>
      <PaymentTypeModal visible={isVisible} onClose={() => setIsVisible(false)} paymentType={selectedData} isEditing={selectedData === null? false: true}/>
    </div>
  );
};

export default PaymentTypeList;

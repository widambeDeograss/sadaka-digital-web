import { Button, Card, Col, Dropdown, Menu, message, Row, Table } from "antd";
import {  deleteSadakaTypeById, fetchSadakaType } from "../../../helpers/ApiConnectors";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "../../../store/store-hooks";
import { useState } from "react";
import {
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import modal from "antd/es/modal";
import SadakaTypeModal from "./AddSadakaType";

const SadakaTypes = () => {
  const [isVisible, setIsVisible] = useState(false)
  const church = useAppSelector((state: any) => state.sp);
  // const userPermissions = useAppSelector(
  //   (state: any) => state.user.userInfo.role.permissions
  // );
  const [selectedData, setSelectedData] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: sadakaTypesData,
    isLoading,
  } = useQuery({
    queryKey: ["sadaka-type"],
    queryFn: async () => {
      const response: any = await fetchSadakaType(`?church_id=${church.id}`);
      console.log(response);
      return response;
    },
    // {
    //   enabled: false,
    // }
  });

  const handleDelete = (id: any) => {
    modal.confirm({
      title: "Confirm Deletion",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to delete this record?",
      okText: "OK",
      okType: "danger",
      cancelText: "cancel",
      onOk: () => {
        deleteMutation(id);
      },
    });
  };

  const { mutate: deleteMutation } = useMutation({
    mutationFn: async (id: any) => {
      await deleteSadakaTypeById(id);
    },
    onSuccess: () => {
      message.success(" Sadaka type deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["expensecats"] });
    },
    onError: () => {
      message.error("Failed to delete Sadaka type.");
    },
  });

  // const handleView = (record: any) => {
  //   setSelectedData(record);
  //   setModalVisible(true);
  // };

  const columns = [
    {
      title: "s/No",
  
      dataIndex: "sNo",
      render: (_text: any, _record: any, index: number) => <div>{index + 1}</div>,
      sorter: (a: any, b: any) => a.sNo.length - b.sNo.length,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (text: any, _record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text: any, _record: any) => <div>{text}</div>,
      // sorter: (a, b) => a.name.length - b.name.length,
    },

    {
        title: "created at",
        dataIndex: "created_at",
        render: (text: any, _record: any) => <div>{text}</div>,
        // sorter: (a, b) => a.capacity.length - b.capacity.length,
      },

    
      {
        title: "",
        render: (_text: any, record: any) => (
          <Dropdown
            overlay={
              <Menu>
                {/* <Menu.Item
                  key="1"
                  icon={<EyeOutlined />}
                  onClick={() => handleView(record)}
                >
                  View
                </Menu.Item> */}
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
        title={<h3 className="font-bold text-sm text-left">Aina za Sadaka </h3>}
        className=""
      >
        <div>
          <div className="flex justify-between mt-3">
            <div>
              <h3 className="text-left font-bold text-xs">
                Aina za Sadaka : <span>{sadakaTypesData?.length}</span>
              </h3>
            </div>
            <div>
              <Button.Group>
                <Button
                  type="primary"
                  className="bg-[#152033] text-white text-xs"
                  onClick={() => setIsVisible(true)}
                >
                  Add Sadaka Type
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
                dataSource={sadakaTypesData}
                loading={isLoading}
                bordered
              />
            </div>
          </Card>
        </Col>
      </Row>
      <SadakaTypeModal visible={isVisible} onClose={() => setIsVisible(false)} sadakaType={selectedData} isEditing={selectedData === null? false: true}/>
    </div>
  );
};

export default SadakaTypes;

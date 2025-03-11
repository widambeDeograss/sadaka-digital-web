import { useState } from "react";
import {
  Row,
  Col,
  Card,
  Button,
  Avatar,
  Form,
  Input,
  Modal,
  Upload,
  message,
  Tag,
  Tabs,
  Typography,
  Divider,
  Space,
  // Progress,
} from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  EditOutlined,
  UploadOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  GlobalOutlined,
  BankOutlined,
  CalendarOutlined,
  // CrownOutlined,
} from "@ant-design/icons";
import { useAppDispatch, useAppSelector } from "../store/store-hooks";
import { updateSp } from "../helpers/ApiConnectors";
import { useMutation } from "@tanstack/react-query";
import { addAlert } from "../store/slices/alert/alertSlice";
const { Paragraph } = Typography;

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const ChurchProfile = () => {
  const userDtl = useAppSelector((state: any) => state?.user?.userInfo);
  const church = useAppSelector((state: any) => state.sp);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const handleEdit = () => {
    form.setFieldsValue({
      church_name: church.church_name,
      church_location: church.church_location,
      church_email: church.church_email,
      church_phone: church.church_phone,
      churh_leader_name: church.churh_leader_name,
      user_email: userDtl.email,
      user_phone: userDtl.phone,
      user_firstname: userDtl.firstname,
      user_lastname: userDtl.lastname,
      church_category: church.church_category,
      inserted_by: church.inserted_by,
      updated_by: userDtl?.username
    });
    setIsEditing(true);
  };

  const { mutate: updateSpMutation, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const res = await updateSp(church?.id, data);
      return res;
    },
    onSuccess: () => {
      dispatch(
        addAlert({
          title: "Success",
          message: "Church  updated successfully!",
          type: "success",
        })
      );
      form.resetFields();
    },
    onError: (_error: any) => {
      dispatch(
        addAlert({
          title: "Error",
          message: "Failed to updated church informarion.",
          type: "error",
        })
      );
    },
  });

  const handleSubmit = async (values: any) => {
    try {
      console.log(values);
    const data = {
       church_category: church.church_category,
       inserted_by: church.inserted_by,
       updated_by: userDtl?.username,
       ...values,
       leader_image: values.leader_image?.fileList?.[0]?.originFileObj,
       church_image: values.church_image?.fileList?.[0]?.originFileObj,
    }
      await updateSpMutation(data);
      setIsEditing(false);
    } catch (error) {
      message.error("Failed to update profile");
    }
  };

  const InfoItem = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
      <Icon className="w-5 h-5 text-gray-500" />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        <span className="text-base font-semibold text-gray-900">{value}</span>
      </div>
    </div>
  );

  // const daysRemaining = Math.ceil(
  //   (new Date(church.active_package?.package_end_date).getTime() -
  //     new Date().getTime()) /
  //     (1000 * 60 * 60 * 24)
  // );
  // const subscriptionProgress = (daysRemaining / 365) * 100;

  const InfoCard = ({ title, icon: Icon, children }: any) => (
    <Card
      className="info-card"
      bordered={false}
      style={{
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        height: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <div
          style={{
            backgroundColor: "#f0f5ff",
            padding: "8px",
            borderRadius: "8px",
            marginRight: "12px",
          }}
        >
          <Icon style={{ fontSize: "20px", color: "#1890ff" }} />
        </div>
        <Title level={5} style={{ margin: 0 }}>
          {title}
        </Title>
      </div>
      {children}
    </Card>
  );

  const SocialButton = ({ icon: Icon, href }: any) => (
    <Button
      shape="circle"
      icon={<Icon />}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ margin: "0 8px" }}
    />
  );

  return (
    <div style={{ background: "#f0f2f5", minHeight: "100vh" }}>
      {/* Hero Section */}
      <div
        style={{
          background: "linear-gradient(135deg, #1a365d 0%, #2d3748 100%)",
          padding: "48px 0",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "url('https://images.pexels.com/photos/1343325/pexels-photo-1343325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.2,
          }}
        />
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
            position: "relative",
          }}
        >
          <Row align="middle" gutter={24}>
            <Col>
              <Avatar
                size={120}
                src={church.churh_image || "/api/placeholder/120/120"}
                style={{
                  border: "4px solid white",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
            </Col>
            <Col flex="1">
              <Title level={2} style={{ color: "white", margin: 0 }}>
                {church.church_name}
              </Title>
              <div style={{ marginTop: 16 }}>
                <Tag color="blue">{church.church_category}</Tag>
                <Tag color="green">
                  Active Package:{" "}
                  {church.active_package?.package_details?.package_name}
                </Tag>
              </div>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEdit}
                size="large"
              >
                Edit Profile
              </Button>
            </Col>
          </Row>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px" }}>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card>
              <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane
                  tab={
                    <span>
                      <BankOutlined />
                      Church Information
                    </span>
                  }
                  key="1"
                >
                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                      <InfoItem
                        icon={EnvironmentOutlined}
                        label="Location"
                        value={church.church_location}
                      />
                      <InfoItem
                        icon={PhoneOutlined}
                        label="Phone"
                        value={church.church_phone}
                      />
                    </Col>
                    <Col xs={24} md={12}>
                      <InfoItem
                        icon={MailOutlined}
                        label="Email"
                        value={church.church_email}
                      />
                      <InfoItem
                        icon={ClockCircleOutlined}
                        label="Package Valid Until"
                        value={new Date(
                          church.active_package?.package_end_date
                        ).toLocaleDateString()}
                      />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane
                  tab={
                    <span>
                      <UserOutlined />
                      User Profile
                    </span>
                  }
                  key="2"
                >
                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={12}>
                      <InfoCard
                        title="Personal Information"
                        icon={UserOutlined}
                      >
                        <Space
                          direction="vertical"
                          size={16}
                          style={{ width: "100%" }}
                        >
                          <div>
                            <Text type="secondary">Full Name</Text>
                            <Paragraph strong>
                              {userDtl.firstname} {userDtl.lastname}
                            </Paragraph>
                          </div>
                          <div>
                            <Text type="secondary">Email</Text>
                            <Paragraph strong>{userDtl.email}</Paragraph>
                          </div>
                          <div>
                            <Text type="secondary">Phone</Text>
                            <Paragraph strong>{userDtl.phone}</Paragraph>
                          </div>
                        </Space>
                      </InfoCard>
                    </Col>
                    <Col xs={24} md={12}>
                      <InfoCard title="Account Details" icon={TeamOutlined}>
                        <Space
                          direction="vertical"
                          size={16}
                          style={{ width: "100%" }}
                        >
                          <div>
                            <Text type="secondary">Username</Text>
                            <Paragraph strong>{userDtl.username}</Paragraph>
                          </div>
                          <div>
                            <Text type="secondary">Role</Text>
                            <Paragraph strong>
                              {userDtl?.role?.name || "Administrator"}
                            </Paragraph>
                          </div>
                          <div>
                            <Text type="secondary">Status</Text>
                            <Tag color="success">Active</Tag>
                          </div>
                        </Space>
                      </InfoCard>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </Card>

            <Col xs={24} md={24} className="mt-3">
              {/* <InfoCard title="Package Details" icon={CrownOutlined}>
                <Space direction="vertical" size={16} style={{ width: "100%" }}>
                  <div>
                    <Text type="secondary">Current Package</Text>
                    <Paragraph strong>
                      {church.active_package?.package_details?.package_name}
                    </Paragraph>
                  </div>
                  <div>
                    <Text type="secondary">Subscription Progress</Text>
                    <Progress
                      percent={Math.round(subscriptionProgress)}
                      status="active"
                      strokeColor={{
                        "0%": "#108ee9",
                        "100%": "#87d068",
                      }}
                    />
                  </div>
                  <div>
                    <Text type="secondary">Days Remaining</Text>
                    <Paragraph strong>{daysRemaining} days</Paragraph>
                  </div>
                </Space>
              </InfoCard> */}
            </Col>
          </Col>

          <Col xs={24} lg={8}>
            <Card>
              <div style={{ textAlign: "center" }}>
                <Avatar
                  size={100}
                  src={church.churh_leader_image || "/api/placeholder/100/100"}
                  style={{ marginBottom: 16 }}
                />
                <Title level={4} style={{ marginBottom: 4 }}>
                  {church.churh_leader_name ||
                    `${userDtl.firstname} ${userDtl.lastname}`}
                </Title>
                <Text type="secondary">{userDtl?.username}</Text>
                <Divider />
                <div style={{ marginTop: 16 }}>
                  <SocialButton icon={FacebookOutlined} href="#" />
                  <SocialButton icon={TwitterOutlined} href="#" />
                  <SocialButton icon={InstagramOutlined} href="#" />
                </div>
              </div>
            </Card>

            <Card style={{ marginTop: 24 }}>
              <Title level={4}>Quick Links</Title>
              <Button
                block
                icon={<GlobalOutlined />}
                style={{ marginBottom: 12 }}
              >
                Visit Church Website
              </Button>
              <Button
                block
                icon={<CalendarOutlined />}
                style={{ marginBottom: 12 }}
              >
                View Events Calendar
              </Button>
              <Button block icon={<TeamOutlined />}>
                Manage Members
              </Button>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Edit Modal */}
      <Modal
        title="Edit Profile"
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={null}
        width={800}
      >

          <Tabs defaultActiveKey="church">
            <TabPane tab="Church Information" key="church">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                
                // initialValues={}
              >
                <Row gutter={16}>
                  <Col span={24}>
                    <Form.Item
                      name="church_name"
                      label="Church Name"
                      rules={[
                        { required: true, message: "Please enter church name" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="church_location"
                      label="Location"
                      rules={[
                        { required: true, message: "Please enter location" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="church_phone"
                      label="Phone"
                      rules={[
                        {
                          required: true,
                          message: "Please enter phone number",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="church_email"
                      label="Email"
                      rules={[
                        {
                          required: true,
                          type: "email",
                          message: "Please enter valid email",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="churh_leader_name"
                      label="Church Leader Name"
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="church_image" label="Church Image">
                      <Upload maxCount={1}>
                        <Button icon={<UploadOutlined />}>
                          Upload Church Image
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="leader_image" label="Leader Image">
                      <Upload maxCount={1}>
                        <Button icon={<UploadOutlined />}>
                          Upload Leader Image
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                <div style={{ textAlign: "right", marginTop: 24 }}>
                  <Button
                    style={{ marginRight: 12 }}
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isPending}
                    className=" rounded-lg bg-gradient-to-br from-[#152033] to-[#3E5C76] hover:from-blue-800 hover:to-purple-900"
                  >
                    Save Changes
                  </Button>
                </div>
              </Form>
            </TabPane>
            <TabPane tab="User Information" key="user" disabled>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                // initialValues={initialValues}
              >
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="firstname"
                      label="First Name"
                      rules={[
                        { required: true, message: "Please enter first name" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="lastname"
                      label="Last Name"
                      rules={[
                        { required: true, message: "Please enter last name" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        {
                          required: true,
                          type: "email",
                          message: "Please enter valid email",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="phone"
                      label="Phone"
                      rules={[
                        {
                          required: true,
                          message: "Please enter phone number",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="username"
                      label="Username"
                      rules={[
                        { required: true, message: "Please enter username" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="user_image" label="Profile Image">
                      <Upload maxCount={1}>
                        <Button icon={<UploadOutlined />}>
                          Upload Profile Image
                        </Button>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
                <div style={{ textAlign: "right", marginTop: 24 }}>
                  <Button style={{ marginRight: 12 }}>Cancel</Button>
                  <Button type="primary" htmlType="submit">
                    Save Changes
                  </Button>
                </div>
              </Form>
            </TabPane>
          </Tabs>
      </Modal>
    </div>
  );
};

export default ChurchProfile;

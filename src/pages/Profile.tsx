
import {
    Row,
    Col,
    Card,
    Button,
    Descriptions,
    Avatar,
    Radio,

} from "antd";

import {
    FacebookOutlined,
    TwitterOutlined,
    InstagramOutlined,
} from "@ant-design/icons";



function Profile() {


    const pencil = [
        <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            key={0}
        >
            <path
                d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
                className="fill-gray-7"
            ></path>
            <path
                d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
                className="fill-gray-7"
            ></path>
        </svg>,
    ];


    return (
        <>
            <div
                className="profile-nav-bg"
                style={{ backgroundImage: "url('https://images.pexels.com/photos/1343325/pexels-photo-1343325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
            ></div>

            <Card
                className="card-profile-head"
                bodyStyle={{ display: "none" }}
                title={
                    <Row justify="space-between" align="middle" gutter={[24, 0]}>
                        <Col span={24} md={12} className="col-info py-10">
                            <Avatar.Group>
                                <Avatar size={74} shape="square" src={""}  className="mt-10"/>

                                <div className="avatar-info " >
                                    <h4 className="font-semibold m-0">Parokia ya Mtalatifu Yosefu Mbezi</h4>
                                    <p className="text-left">Kanda ya Pwani</p>
                                </div>
                            </Avatar.Group>
                        </Col>
                        <Col
                            span={24}
                            md={12}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "flex-end",
                            }}
                        >
                            <Radio.Group defaultValue="">
                                <Radio.Button value="a">BADILI TAARIFA</Radio.Button>
                                <Radio.Button value="b">WAHUMINI</Radio.Button>
                            </Radio.Group>
                        </Col>
                    </Row>
                }
            ></Card>


                    <Card
                        bordered={false}
                        title={<h6 className="font-bold m-0 py-3">Kuhusu Parokia</h6>}
                        className="header-solid  card-profile-information mb-24"
                        extra={<Button type="link">{pencil}</Button>}
                        bodyStyle={{ paddingTop: 0, paddingBottom: 16 }}

                    >
                        <p className="text-dark p-5" >
                            {" "}The second error message, "A case reducer on a non-draftable value must not return undefined,"
                            <br/>
                            suggests that your loginAuth case reducer may not be returning a valid new state objec
                            .{" "}
                        </p>
                        <hr className="my-25" />
                        <Descriptions title="Parokia">
                            <Descriptions.Item label="Mchungaji" span={3}>

                            </Descriptions.Item>
                            <Descriptions.Item label="Namba ya simu" span={3}>
                                +255677766756
                            </Descriptions.Item>
                            <Descriptions.Item label="Email ya Parokia" span={3}>

                            </Descriptions.Item>
                            <Descriptions.Item label="Mahali" span={3}>
                                Dar es Salaam
                            </Descriptions.Item>
                            <Descriptions.Item label="Social" span={3}>
                                <a href="#pablo" className="px-5">
                                    {<TwitterOutlined />}
                                </a>
                                <a href="#pablo" className="px-5">
                                    {<FacebookOutlined style={{ color: "#344e86" }} />}
                                </a>
                                <a href="#pablo" className="px-5">
                                    {<InstagramOutlined style={{ color: "#e1306c" }} />}
                                </a>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>

        </>
    );
}

export default Profile;

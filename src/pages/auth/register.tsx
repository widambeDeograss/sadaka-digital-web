import  { useEffect, useState } from "react";
import { Layout, Form, Input, Checkbox, Button, Divider } from "antd";
import {  Link } from "react-router-dom";
import { Colors } from "../../Constants/Colors";
import logo from "../../assets/church.png";
const { Content, Sider } = Layout;


export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      const leftSide:any = document.querySelector(".left-side");

      if (screenWidth < 768) {
        leftSide.style.display = "none";
      } else {
        leftSide.style.display = "block";
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onFinish = async (_values: any) => {
    localStorage.clear();
    setIsLoading(true);
    try {
      // Your authentication logic here
    } catch (error: any) {
      setErrorMsg(error.message);
    }
    setIsLoading(false);
  };

  return (
    <Layout className="min-h-screen"
    style={{backgroundColor:Colors.bgDarkAddon}}
    >
      <Sider
        width={500}
        style={{
          background: Colors.primary,
          color: "#fff",
          borderRadius:"0px 40% 50% 0px   / 30px"
        }}
        className="left-side relative" // Add relative positioning
      >
        <div className="flex flex-col items-center justify-center h-full p-8">
          <img src={logo} className='h-24 w-24'/>
          <h1 className="text-2xl font-bold">Sadaka Digital</h1>
          <h3></h3>
          <p className="text-xs">A few more clicks to getting started to getting an account.</p>
        </div>
        <div className="w-full h-32 bg-darkgray rounded-r-full absolute bottom-0"></div> {/* Add the semi-circle */}
      </Sider>
      <Content className="flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          <h1 className="text-2xl font-bold text-center mb-4">Sadaka Digital</h1>
          <Divider plain>
            <span className=" text-sm">Create an accont</span>
          </Divider>

          <Form
            onFinish={onFinish}
            layout="vertical"
            className="space-y-4"
          >
            {errorMsg && (
              <div className="text-red-800 text-center">{errorMsg}!!</div>
            )}
            <Form.Item
              label="Jina la Parokia au Usharika"
              name="username"
              rules={[
                {
                  required: true,
                  message: "weka jina!",
                },
              ]}
            >
              <Input placeholder="Parokia" type="text" className="h-9" />
            </Form.Item>
            <Form.Item
              label="Jina la mchungaji au Paroko"
              name="username"
              rules={[
                {
                  required: true,
                  message: "weka jina!",
                },
              ]}
            >
              <Input placeholder="Jina la mchungaji" type="text" className="h-9" />
            </Form.Item>
            <Form.Item
              label="Nambari ya simu"
              name="phone"
              rules={[
                {
                  required: true,
                  message: "weka nambari ya simu!",
                },
              ]}
            >
              <Input placeholder="Namba ya simu" type="text" className="h-9" />
            </Form.Item>
            <Form.Item
              label="Picha za Usharika au Parokia"
              name="image"
              rules={[
                {
                  required: true,
                  message: "weka picha!",
                },
              ]}
            >
              <Input placeholder="Namba ya simu" type="file" className="h-9" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}

            >
              <Input.Password  className="h-9"/>
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked">
              <Checkbox defaultChecked>Remember me</Checkbox>
            </Form.Item>

            <Form.Item>
              {isLoading ? (
                <Button
                  className="w-full h-9"
                  type="primary"
                  htmlType="submit"
                  style={{backgroundColor:Colors.primary}}
                  loading
                >
                  Signing in...
                </Button>
              ) : (
                <Button
                  className="w-full h-9"
                  style={{backgroundColor:Colors.primary}}
                  type="primary"
                  htmlType="submit"
                  color={Colors.primary}
                >
                 Create accont
                </Button>
              )}
            </Form.Item>

            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/login" className="text-blue-500 font-bold">
                Sign In
              </Link>
            </p>
          </Form>

        </div>
      </Content>
    </Layout>
  );
}

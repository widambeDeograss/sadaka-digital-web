import {  Form, Input, Checkbox, Button, Divider } from "antd";
import { UserOutlined, } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { fetchSpByAdmin, postLogin } from "../../helpers/ApiConnectors";
import { addAlert } from "../../store/slices/alert/alertSlice";
import { loginSuccess, setUserInfo } from "../../store/slices/auth/authSlice";
import { setActivePackage, setCurrentSP } from "../../store/slices/sp/spSlice";
import logo from "../../assets/church.png";

// const { Content, Sider } = Layout;

export default function LoginPage() {
  const navigation = useNavigate();
  const dispatch = useDispatch();

  

  const { mutate: signInMutation, isPending } = useMutation({
    mutationFn: async (values: any) => {
      const response =  await postLogin(values);
      console.log(response);
      
      return response
    },
    onSuccess: async (data: any) => {
      console.log(data);
       
      dispatch(
        addAlert({
          title: "Login Sucess",
          message: "You have logged in sucessfly",
          type: "success",
        })
      );
      dispatch(
        loginSuccess({accessToken:data?.access_token, refreshToken:data?.refresh_token})
      );
      dispatch(setUserInfo(data?.user));
      const isAdmin = data?.user?.is_top_admin;
      const isSpManager = data?.user?.is_sp_manager;

      if (isAdmin) {
        const defaultPackage = {
          id: "1221144",
          package_name: "Default Admin Package",
          package_description: "This is the default active package for admin users.",
          package_price: "0", 
          package_duration: "Unlimited",
          is_active: true,
          payed_amount: 0,
          package_start_date: new Date().toISOString(),
          package_end_date: null 
        };
        dispatch(setCurrentSP({church_name:""}));
        dispatch(setActivePackage(defaultPackage));
        navigation("/dashboard"); 
      } else if (isSpManager) {
        
      }  else {
        console.log(data?.user?.id);
        
        const spResponse: any = await fetchSpByAdmin(data?.user?.id);
        dispatch(setCurrentSP(spResponse?.service_provider));
        dispatch(setActivePackage(spResponse?.active_package || null)); 
        console.log(spResponse);
        
        navigation("/");
      }
    
    },
    onError: (_error) => {
      dispatch(
        addAlert({
          title: "Login error",
          message: "Ops.. Error on sign in. Try again!",
          type: "error",
        })
      );
      //  enqueueSnackbar('Ops.. Error on sign in. Try again!', {
      //    variant: 'error'
      //  });
    },
  });

  const onFinish = async (values: any) => {
    await signInMutation(values);
  };
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-100 to-gray-200 flex items-center justify-center"
    >
      <ToastContainer />
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-4xl grid grid-cols-1 md:grid-cols-2">
        {/* Left Side - Branding Section */}
        <div className="bg-gradient-to-br  from-[#152033] to-[#3E5C76] text-white p-12 flex flex-col justify-center items-center">
          <motion.img 
            src={logo} 
            alt="Sadaka Digital Logo"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="w-32 h-32 mb-6 rounded-full shadow-lg"
          />
          <h1 className="text-3xl font-bold mb-4 text-center">Sadaka Digital</h1>
          <p className="text-sm text-center opacity-80">
            Empowering digital church management with seamless solutions
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">
            Welcome Back
          </h2>

          <Form
            onFinish={onFinish}
            layout="vertical"
            className="space-y-4"
          >
            <Form.Item
              name="email"
              rules={[{ 
                required: true, 
                message: "Please enter your email",
                type: "email" 
              }]}
            >
              <Input 
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Email Address" 
                className="h-12 rounded-full" 
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ 
                required: true, 
                message: "Please enter your password" 
              }]}
            >
              <Input.Password 
                placeholder="Password" 
                className="h-12 rounded-full" 
              />
            </Form.Item>

            <div className="flex justify-between items-center">
              <Form.Item name="remember" valuePropName="checked" className="mb-0">
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <Link to="/forgot-password" className="text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isPending}
                className="w-full h-12 rounded-lg bg-gradient-to-br from-[#152033] to-[#3E5C76] hover:from-blue-800 hover:to-purple-900 border-none"
              >
                {isPending ? 'Signing In...' : 'Sign In'}
              </Button>
            </Form.Item>
          </Form>

          <Divider>Or contact us!!</Divider>

          {/* <div className="flex justify-center space-x-4">
            {[
              { icon: <GoogleOutlined />, color: "text-red-500" },
              { icon: <GithubOutlined />, color: "text-gray-800" },
            ].map((provider, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-3 border rounded-full cursor-pointer ${provider.color} hover:bg-gray-100 transition`}
              >
                {provider.icon}
              </motion.div>
            ))}
          </div> */}

          <div className="text-center mt-6">
            {/* <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 font-bold hover:underline">
                Sign Up
              </Link>
            </p> */}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
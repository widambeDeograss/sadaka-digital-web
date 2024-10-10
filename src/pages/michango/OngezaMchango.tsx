import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Card } from "antd";

// Define validation schema using Yup
const schema = yup.object().shape({
  lengo: yup.string().required("Lengo is required"),
  name: yup.string().required("Jina la mchango is required"),
  amount: yup.string().required("Email is required"),
  date: yup.date()
  .typeError("Date is invalid")
  .required("Date is required"),
  description: yup.string().required("Description is required"),
});

const OngezaMchango = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Define the submit handler
  const onSubmit = (data:any) => {
    console.log("Form Submitted", data);
  };

  return (
    <Card
    // title="Ongeza Muhumini"
    className=" mb-10"
>
    <div className=" mb-10">
      <div className="border p-6 rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-4">Ongeza Mchango</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap -mx-4">
            <div className="w-full sm:w-1/2 px-4">
              <div className="mb-4">
                <label htmlFor="lengo" className="block text-sm font-medium text-gray-700">
                  Lengo in Tzs
                </label>
                <input
                  id="lengo"
                  type="text"
                  {...register("lengo")}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md  bg-blue-gray-50   shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.lengo ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.lengo && (
                  <p className="text-sm text-red-600">{errors.lengo.message}</p>
                )}
              </div>
            </div>

            <div className="w-full sm:w-1/2 px-4">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Jina la Mchango
                </label>
                <input
                  id="name"
                  type="text"
                  {...register("name")}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md  bg-blue-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap -mx-4">
            <div className="w-full sm:w-1/2 px-4">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md  bg-blue-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="w-full sm:w-1/2 px-4">
              <div className="mb-4">
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="text"
                  {...register("phoneNumber")}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md  bg-blue-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="text-sm text-red-600">{errors.phoneNumber.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Maelezo Mafupi kuhusu Mchango
            </label>
            <textarea
              id="description"
              rows={4}
              {...register("description")}
              className={`mt-1 block w-full px-3 py-2 border rounded-md  bg-blue-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-[#152033] text-white font-bold rounded-md   shadow-sm hover:bg-[#1b2a45] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Ongeza Mchango
            </button>
          </div>
        </form>
      </div>
    </div>

    </Card>
  );
};

export default OngezaMchango;

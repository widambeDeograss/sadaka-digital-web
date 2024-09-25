import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Define the validation schema using Yup
const schema = yup.object().shape({
  name: yup.string().required("Jina la Muhumini is required"),
  cardNumber: yup.string().required("Namba ya Kadi is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]+$/, "Nambari ya Simu must be numeric")
    .required("Nambari ya Simu is required"),
  address: yup.string().required("Mahali anapoishi is required"),
  description: yup.string().required("Maelezo Mafupi is required"),
});

const OngezaMuhumini = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Form submit handler
  const onSubmit = (data:any) => {
    console.log("Form Data:", data);
  };

  return (
    <div className=" mb-10">
      <div className="border p-6 rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-4">Ongeza Muhumini</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap -mx-4">
            <div className="w-full sm:w-1/2 px-4">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Jina la Muhumini
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

            <div className="w-full sm:w-1/2 px-4">
              <div className="mb-4">
                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                  Namba ya Kadi
                </label>
                <input
                  id="cardNumber"
                  type="text"
                  {...register("cardNumber")}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md  bg-blue-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.cardNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.cardNumber && (
                  <p className="text-sm text-red-600">{errors.cardNumber.message}</p>
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
                  Nambari ya Simu
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

          <div className="flex flex-wrap -mx-4">
            <div className="w-full sm:w-1/2 px-4">
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Mahali anapoishi
                </label>
                <input
                  id="address"
                  type="text"
                  {...register("address")}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md  bg-blue-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.address && (
                  <p className="text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Maelezo Mafupi kuhusu Muhumini
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
              className="px-6 py-2 bg-[#152033] text-white font-bold rounded-md shadow-sm hover:bg-[#1b2a45] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Ongeza Muhumini
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OngezaMuhumini;

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { postWahumini } from "../../helpers/ApiConnectors";
import { useMutation } from "@tanstack/react-query";
import { addAlert } from "../../store/slices/alert/alertSlice";

const schema = yup.object().shape({
  first_name: yup.string().required("Jina la Kwanza ni lazima"),
  last_name: yup.string().required("Jina la Mwisho ni lazima"),
  cardNumber: yup.string().required("Namba ya Kadi ni lazima"),
  email: yup.string().email("Barua pepe sio sahihi").required("Barua pepe ni lazima"),
  phone_number: yup
    .string()
    .matches(/^[0-9]+$/, "Nambari ya Simu inapaswa kuwa nambari")
    .required("Nambari ya Simu ni lazima"),
  gender: yup.string().oneOf(['male', 'female'], "Chagua jinsia sahihi").required("Jinsia ni lazima"),
  birthdate: yup.date().required("Tarehe ya kuzaliwa ni lazima"),
  address: yup.string().required("Mahali anapoishi ni lazima"),
  marital_status: yup.string().required("Hali ya ndoa ni lazima"),
  has_loin_account: yup.boolean(),
});

const OngezaMuhumini = () => {
  const dispatch = useAppDispatch();
  const church = useAppSelector((state:any) =>  state.sp);
  const user = useAppSelector((state:any) =>  state.user.userInfo);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });


  // Form submit handler
  const onSubmit = async (data: any) => {
    if (!church) {
      toast.error("Church ID is missing. Please ensure you are associated with a church.");
      return;
    }
    if (data.birthdate) {
      const formattedDate = new Date(data.birthdate).toISOString().split('T')[0];
      data.birthdate = formattedDate;
    }

    const finalData = {
      ...data,
      church: church?.id, 
      created_by: user?.username,
      updated_by: user?.username,

    };

    console.log(finalData);
    const response = await postWahumini(finalData);
    if (!response) {
      throw new Error("Failed to save muhumini, Try again later")   
   }
   return response;
 };

 
 const { mutate: addMuhuminiMutation, isPending: loading } = useMutation({
   mutationFn: onSubmit,
   onSuccess: (data) => {
     console.log(data);

     dispatch(
       addAlert({
         title: "Success",
         message: "muhumini added successfully",
         type: "success",
       })
     );
   //   navigate("/");
   },
   onError: (error) => {
     
     dispatch(
       addAlert({
         title: "Error adding muhumini",
         message: error.message,
         type: "error",
       })
     );
   //   enqueueSnackbar("Ops.. Error on error adding muhuminit. Try again!", {
   //     variant: "error",
   //   });
   },
 });

  return (
    // <div className="p-10 bg-gray-50 min-h-screen">
      <div className=" mx-auto bg-white p-8 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Ongeza Muhumini</h2>
        <form onSubmit={handleSubmit(addMuhuminiMutation)}>
          {/* First Name and Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                Jina la Kwanza
              </label>
              <input
                id="first_name"
                type="text"
                {...register("first_name")}
                className={`mt-1 block w-full px-3 py-2 border rounded-md bg-blue-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.first_name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.first_name && <p className="text-sm text-red-600">{errors.first_name.message}</p>}
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                Jina la Mwisho
              </label>
              <input
                id="last_name"
                type="text"
                {...register("last_name")}
                className={`mt-1 block w-full px-3 py-2 border rounded-md bg-blue-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.last_name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.last_name && <p className="text-sm text-red-600">{errors.last_name.message}</p>}
            </div>
          </div>

          {/* Card Number and Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                Namba ya Kadi
              </label>
              <input
                id="cardNumber"
                type="text"
                {...register("cardNumber")}
                className={`mt-1 block w-full px-3 py-2 border rounded-md bg-blue-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.cardNumber ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.cardNumber && <p className="text-sm text-red-600">{errors.cardNumber.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email")}
                className={`mt-1 block w-full px-3 py-2 border rounded-md bg-blue-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
            </div>
          </div>

          {/* Phone Number and Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div>
              <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                Nambari ya Simu
              </label>
              <input
                id="phone_number"
                type="text"
                {...register("phone_number")}
                className={`mt-1 block w-full px-3 py-2 border rounded-md bg-blue-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.phone_number ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone_number && (
                <p className="text-sm text-red-600">{errors.phone_number.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Jinsia
              </label>
              <select
                id="gender"
                {...register("gender")}
                className={`mt-1 block w-full px-3 py-2 border rounded-md bg-blue-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.gender ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Chagua Jinsia</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && <p className="text-sm text-red-600">{errors.gender.message}</p>}
            </div>
          </div>

          {/* Birthdate and Marital Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <div>
              <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700">
                Tarehe ya Kuzaliwa
              </label>
              <input
                id="birthdate"
                type="date"
                {...register("birthdate")}
                className={`mt-1 block w-full px-3 py-2 border rounded-md bg-blue-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.birthdate ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.birthdate && (
                <p className="text-sm text-red-600">{errors.birthdate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="marital_status" className="block text-sm font-medium text-gray-700">
                Hali ya Ndoa
              </label>
              <select
                id="marital_status"
                {...register("marital_status")}
                className={`mt-1 block w-full px-3 py-2 border rounded-md bg-blue-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.marital_status ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Chagua Hali ya Ndoa</option>
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
              {errors.marital_status && (
                <p className="text-sm text-red-600">{errors.marital_status.message}</p>
              )}
            </div>
          </div>

          {/* Address and Description */}
          <div className="grid grid-cols-1 gap-6 mt-6">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Mahali anapoishi
              </label>
              <input
                id="address"
                type="text"
                {...register("address")}
                className={`mt-1 block w-full px-3 py-2 border rounded-md bg-blue-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.address ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
            </div>

            {/* <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Maelezo Mafupi kuhusu Muhumini
              </label>
              <textarea
                id="description"
                rows={4}
                {...register("description")}
                className={`mt-1 block w-full px-3 py-2 border rounded-md bg-blue-gray-50 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div> */}
          </div>

          {/* Has Loin Account */}
          {/* <div className="flex items-center mt-6">
            <input
              id="has_loin_account"
              type="checkbox"
              {...register("has_loin_account")}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="has_loin_account" className="ml-2 block text-sm text-gray-700">
              Nina akaunti ya Loin
            </label>
          </div> */}

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 bg-[#152033] text-white font-bold rounded-md shadow-sm hover:bg-[#1b2a45] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Ongeza Muhumini
            </button>
          </div>
        </form>
      </div>
    // </div>
  );
};

export default OngezaMuhumini;

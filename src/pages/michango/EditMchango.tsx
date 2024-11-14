import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Card } from "antd";
import { editMichango, postMichango } from "../../helpers/ApiConnectors";
import { addAlert } from "../../store/slices/alert/alertSlice";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "../../store/store-hooks";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const schema = yup.object().shape({
  lengo: yup.string().required("Lengo is required"),
  name: yup.string().required("Jina la mchango is required"),
  amount: yup.string().required("Email is required"),
  date: yup.date()
  .typeError("Date is invalid")
  .required("Date is required"),
  description: yup.string().required("Description is required"),
});

const EditMchango = () => {
  const dispatch = useAppDispatch();
  const church = useAppSelector((state: any) => state.sp);
  const user = useAppSelector((state: any) => state.user.userInfo);
  const location = useLocation();
  const record = location?.state?.record;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(schema),
  });

  console.log(record);
  

  useEffect(() => {
    if (record) {
     const updateData = {
      lengo: record?.mchango_amount,
      amount: record?.target_amount,
      description:record?.mchango_description,
      name:record?.mchango_name,
      date:record?.date
         }
     reset({...updateData})
    }
  }, [record, reset]);

  const { mutate: postMchangoMutation, isPending: posting } = useMutation({
    mutationFn: async (data: any) => {
      const response = await editMichango(record.id, data);
      return response;
    },
    onSuccess: () => {
      dispatch(
        addAlert({
          title: "Success",
          message: "Contribution updated successfully!",
          type: "success",
        })
      );
     reset();
    },
    onError: (error: any) => {
      dispatch(
        addAlert({
          title: "Error",
          message: "Failed to edit Contribution.",
          type: "error",
        })
      );
    },
  });


  const onSubmit = (data:any) => {
    if (data.date) {
      const formattedDate = new Date(data.date).toISOString().split("T")[0];
      data.date = formattedDate;
    }

    const mchangoData = {
      target_amount: data.lengo,
      mchango_name: data.name,
      mchango_amount: data.amount,
      mchango_description: data.description,
      date: data.date,
      church: church?.id,
      inserted_by: user?.username,
      updated_by: user?.username,
    };

    postMchangoMutation(mchangoData);
  };

  return (
    <Card
    // title="Update Muhumini"
    className=" mb-10"
>
    <div className=" mb-10">
      <div className="border p-6 rounded-lg shadow-md bg-white">
        <h2 className="text-xl font-bold mb-4">Update Mchango</h2>
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
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <input
                  id="amount"
                  type="amount"
                  {...register("amount")}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md  bg-blue-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.amount ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.amount && (
                  <p className="text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>
            </div>

            <div className="w-full sm:w-1/2 px-4">
              <div className="mb-4">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date
                </label>
                <input
                  id="date"
                  type="date"
                  {...register("date")}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md  bg-blue-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.date ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.date && (
                  <p className="text-sm text-red-600">{errors.date.message}</p>
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
              rows={2}
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
              disabled={posting}
              className="px-6 py-2 bg-[#152033] text-white font-bold rounded-md   shadow-sm hover:bg-[#1b2a45] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Mchango
            </button>
          </div>
        </form>
      </div>
    </div>

    </Card>
  );
};

export default EditMchango;

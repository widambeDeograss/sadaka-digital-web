import { Button, Form, Modal, Row, message , Input, Col} from 'antd';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';


type modalType = {
    openMOdal: boolean;
    handleCancel: any;
};

const schema = yup.object().shape({
    expenseName: yup.string().required('Jina la matumizi is required'),
    phoneNumber: yup
        .string()
        .required('Namba ya mawasiliano is required')
        .matches(/^\d+$/, 'Namba ya mawasiliano must be a number'),
    amount: yup.number().required('Amount is required').positive('Amount must be positive'),
    date: yup.date().required('Tarehe is required'),
});

const AddExpenseModal = ({ openMOdal, handleCancel }: modalType) => {


    // const [confirmLoading, setConfirmLoading] = useState(false);
    // const [errorMsg, setErrorMsg] = useState<string>();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: any) => {
        try {
            console.log(data);
            message.success("Matumizi added successfully");
            window.location.reload();
        } catch (error) {
            message.warning("Failed to add expense, try again later");
        }
    };

    return (
        <>

            <Modal title="Ongeza Matumizi" open={openMOdal}  onCancel={handleCancel} footer={null}>
            <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Jina la Matumizi
                        </label>
                        <input
                            {...register('expenseName')}
                            placeholder="Jina la matumizi"
                            className={`mt-1 block w-full px-3 py-2 border ${
                                errors.expenseName ? 'border-red-500' : 'border-gray-300'
                            } rounded-md  bg-blue-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.expenseName && (
                            <p className="text-sm text-red-600">{errors.expenseName?.message}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Namba ya Mawasiliano
                        </label>
                        <input
                            {...register('phoneNumber')}
                            placeholder="Namba ya mawasiliano"
                            className={`mt-1 block w-full px-3 py-2 border ${
                                errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                            } rounded-md  bg-blue-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.phoneNumber && (
                            <p className="text-sm text-red-600">{errors.phoneNumber?.message}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Amount (Tzs)
                        </label>
                        <input
                            {...register('amount')}
                            type="number"
                            placeholder="Amount Tzs"
                            className={`mt-1 block w-full px-3 py-2 border ${
                                errors.amount ? 'border-red-500' : 'border-gray-300'
                            } rounded-md  bg-blue-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.amount && (
                            <p className="text-sm text-red-600">{errors.amount?.message}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            Tarehe
                        </label>
                        <input
                            {...register('date')}
                            type="date"
                            className={`mt-1 block w-full px-3 py-2 border ${
                                errors.date ? 'border-red-500' : 'border-gray-300'
                            } rounded-md  bg-blue-gray-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                        />
                        {errors.date && (
                            <p className="text-sm text-red-600">{errors.date?.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full px-4 py-2 bg-[#152033] text-white font-bold rounded-md shadow-sm hover:bg-[#1b2a45] focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Ongeza Matumizi
                    </button>
                </form>
    </Modal>
    </>
);
};

export default AddExpenseModal;

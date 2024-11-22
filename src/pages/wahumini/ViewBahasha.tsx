import React from 'react';
import { Modal, Row, Col } from 'antd';

interface ViewModalProps {
    visible: boolean;
    onClose: () => void;
    data: any; 
}

const ViewModal: React.FC<ViewModalProps> = ({ visible, onClose, data }) => {
    console.log(data);
    
    return (
        <Modal
            title="View Bahasha Details"
            visible={visible}
            onCancel={onClose}
            footer={null}
            width={900} 
            bodyStyle={{padding: '20px', overflowY: 'auto' }} // Increased height and made scrollable
        >
            {/* Add stripes with Tailwind CSS */}
            <div className="space-y-4">
                {/* Bahasha Details */}
                <div className="p-4 bg-white odd:bg-gray-100 rounded-lg">
                    <Row gutter={16}>
                        <Col span={12}>
                            <h4 className="font-semibold text-sm text-gray-600">Card Number</h4>
                            <p className="text-gray-900">{data?.card_no}</p>
                        </Col>
                        <Col span={12}>
                            <h4 className="font-semibold text-sm text-gray-600">Bahasha Type</h4>
                            <p className="text-gray-900">{data?.bahasha_type}</p>
                        </Col>
                    </Row>
                </div>

                {/* Mhumini Details */}
                <div className="p-4 bg-white odd:bg-gray-100 rounded-lg">
                    <Row gutter={16}>
                        <Col span={12}>
                            <h4 className="font-semibold text-sm text-gray-600">First Name</h4>
                            <p className="text-gray-900">{data?.mhumini_details?.first_name}</p>
                        </Col>
                        <Col span={12}>
                            <h4 className="font-semibold text-sm text-gray-600">Last Name</h4>
                            <p className="text-gray-900">{data?.mhumini_details?.last_name}</p>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <h4 className="font-semibold text-sm text-gray-600">Phone Number</h4>
                            <p className="text-gray-900">{data?.mhumini_details?.phone_number}</p>
                        </Col>
                        <Col span={12}>
                            <h4 className="font-semibold text-sm text-gray-600">Email</h4>
                            <p className="text-gray-900">{data?.mhumini_details?.email}</p>
                        </Col>
                    </Row>
                </div>

                {/* Church Details */}
                <div className="p-4 bg-white odd:bg-gray-100 rounded-lg">
                    <Row gutter={16}>
                        <Col span={12}>
                            <h4 className="font-semibold text-sm text-gray-600">Church Name</h4>
                            <p className="text-gray-900">{data?.mhumini_details?.jumuiya_details?.church_details?.church_name}</p>
                        </Col>
                        <Col span={12}>
                            <h4 className="font-semibold text-sm text-gray-600">Church Location</h4>
                            <p className="text-gray-900">{data?.mhumini_details?.jumuiya_details?.church_details?.church_location}</p>
                        </Col>
                    </Row>
                </div>

                {/* Inserted By and Inserted At */}
                <div className="p-4 bg-white odd:bg-gray-100 rounded-lg">
                    <Row gutter={16}>
                        <Col span={12}>
                            <h4 className="font-semibold text-sm text-gray-600">Inserted By</h4>
                            <p className="text-gray-900">{data?.created_by}</p>
                        </Col>
                        <Col span={12}>
                            <h4 className="font-semibold text-sm text-gray-600">Inserted At</h4>
                            <p className="text-gray-900">{new Date(data?.created_at).toLocaleString()}</p>
                        </Col>
                    </Row>
                </div>

                {/* Updated By and Updated At */}
                <div className="p-4 bg-white odd:bg-gray-100 rounded-lg">
                    <Row gutter={16}>
                        <Col span={12}>
                            <h4 className="font-semibold text-sm text-gray-600">Updated By</h4>
                            <p className="text-gray-900">{data?.updated_by}</p>
                        </Col>
                        <Col span={12}>
                            <h4 className="font-semibold text-sm text-gray-600">Updated At</h4>
                            <p className="text-gray-900">{new Date(data?.updated_at).toLocaleString()}</p>
                        </Col>
                    </Row>
                </div>
            </div>
        </Modal>
    );
};

export default ViewModal;

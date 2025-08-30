import React, { useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { MdToggleOn, MdToggleOff } from "react-icons/md"; 
import { Button, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";

export const PaymentSetting = () => {
    const navigate = useNavigate();
    // Mock data for payment 
    const [paymentMethods, setPaymentMethods] = useState([
        { id: 1, name: "Credit Card", createdAt: "2022-01-01 4:45 PM", status: "Active" },
        { id: 2, name: "PayPal", createdAt: "2021-07-10 8:00 AM", status: "Inactive" },
        { id: 3, name: "Bank Transfer", createdAt: "2020-03-15 3:30 PM", status: "Active" },
        { id: 4, name: "UPI", createdAt: '2024-05-25 10:00 AM', status: "Active"},
    ]);

        const [currentPage, setCurrentPage] = useState(1);
        const itemsPerPage = 3;
    
        // Pagination helper function
        const paginate = (data, page) => {
            const startIndex = (page - 1) * itemsPerPage;
            return data.slice(startIndex, startIndex + itemsPerPage);
        };
    
        const totalPages = Math.ceil(paymentMethods.length / itemsPerPage);

    // Function to handle delete
    const handleDelete = (id) => {
        setPaymentMethods(paymentMethods.filter(payment => payment.id !== id));
        console.log(`Payment method with id ${id} deleted`);
    };

    // Function to handle edit
    const handleEdit = (id) => {
        const paymentToEdit = paymentMethods.find(payment => payment.id === id);
    navigate('/dms/payment/settings/edit', { state: { payment: paymentToEdit } });

    };

    // Function to toggle the status of a payment method
    const toggleStatus = (id) => {
        setPaymentMethods(paymentMethods.map(payment =>
            payment.id === id
                ? { ...payment, status: payment.status === "Active" ? "Inactive" : "Active" }
                : payment
        ));
    };

    return (

        <AdminLayout>
            <div className="dms-pages-header sticky-header">
                <h3>List of Payment methods</h3>
                <Button variant="primary" onClick={() => navigate('/dms/payment/settings/add')}>
                    <FaPlus /> Add
                </Button>
            </div>
            {/* Payment Method List Table */}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Created</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {paginate(paymentMethods, currentPage).map((payment, index) => (
                        <tr key={payment.id}>
                            <td>{index + 1}</td>
                            <td>{payment.name}</td>
                            <td>{payment.createdAt}</td>
                            <td>
                                <span
                                    className={`badge ${payment.status === "Active" ? "bg-success" : "bg-danger"}`}
                                >
                                    {payment.status}
                                </span>
                            </td>
                            <td>
                                <FaEdit
                                    className="icon icon-green edit"
                                    title="Edit"
                                    onClick={() => handleEdit(payment.id)}
                                />
                                <FaTrash
                                    className="icon icon-red delete"
                                    title="Delete"
                                    onClick={() => handleDelete(payment.id)}
                                />
                                {/* On/Off Toggle Icon */}
                                {payment.status === "Active" ? (
                                    <MdToggleOn
                                        className="icon icon-green toggle"
                                        title="Deactivate"
                                        onClick={() => toggleStatus(payment.id)}
                                    />
                                ) : (
                                    <MdToggleOff
                                        className="icon icon-red toggle"
                                        title="Activate"
                                        onClick={() => toggleStatus(payment.id)}
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
             {/* Pagination Controls */}
                        <Pagination className="justify-content-center">
                            <Pagination.Prev
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                            />
                            {[...Array(totalPages)].map((_, idx) => (
                                <Pagination.Item
                                    key={idx + 1}
                                    active={idx + 1 === currentPage}
                                    onClick={() => setCurrentPage(idx + 1)}
                                >
                                    {idx + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                        </AdminLayout>
    );
};

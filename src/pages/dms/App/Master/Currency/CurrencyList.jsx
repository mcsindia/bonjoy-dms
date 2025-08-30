import React, { useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { MdToggleOn, MdToggleOff } from "react-icons/md";
import { Button, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";

export const CurrencyList = () => {
    const navigate = useNavigate();
    // Mock data for currencies 
    const [currencies, setCurrencies] = useState([
        { id: 1, name: "US Dollar", symbol: "$", createdAt: "2022-01-01 12:00 AM", status: "Active" },
        { id: 2, name: "Euro", symbol: "€", createdAt: "2021-07-10 7:45 PM", status: "Inactive" },
        { id: 3, name: "Indian Rupee", symbol: "₹", createdAt: "2020-03-15 4:45 PM", status: "Active" },
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Pagination helper function
    const paginate = (data, page) => {
        const startIndex = (page - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    };

    const totalPages = Math.ceil(currencies.length / itemsPerPage);

    // Function to handle delete
    const handleDelete = (id) => {
        setCurrencies(currencies.filter(currency => currency.id !== id));
        console.log(`Currency with id ${id} deleted`);
    };

    // Function to handle edit
    const handleEdit = (id) => {
        // Implement the logic for editing currency
        const currencyToEdit = currencies.find(currency => currency.id === id);
        navigate('/currency/edit', { state: { currency: currencyToEdit } });
    };


    // Function to toggle the status of a currency
    const toggleStatus = (id) => {
        setCurrencies(currencies.map(currency =>
            currency.id === id
                ? { ...currency, status: currency.status === "Active" ? "Inactive" : "Active" }
                : currency
        ));
    };

    return (
        <AdminLayout>
            <div>
                <div className="dms-pages-header sticky-header">
                    <h3>List of Currency</h3>
                    <Button variant="primary" onClick={() => navigate('/dms/currency/add')}>
                        <FaPlus /> Add
                    </Button>
                </div>
                {/* Currency List Table */}
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Name</th>
                            <th>Symbol</th>
                            <th>Created</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginate(currencies, currentPage).map((currency, index) => (
                            <tr key={currency.id}>
                                <td>{index + 1}</td>
                                <td>{currency.name}</td>
                                <td>{currency.symbol}</td>
                                <td>{currency.createdAt}</td>
                                <td>
                                    <span
                                        className={`badge ${currency.status === "Active" ? "bg-success" : "bg-danger"}`}
                                    >
                                        {currency.status}
                                    </span>
                                </td>
                                <td>
                                    <FaEdit
                                        className="icon icon-green edit"
                                        title="Edit"
                                        onClick={() => handleEdit(currency.id)}
                                    />
                                    <FaTrash
                                        className="icon icon-red delete"
                                        title="Delete"
                                        onClick={() => handleDelete(currency.id)}
                                    />
                                    {/* On/Off Toggle Icon */}
                                    {currency.status === "Active" ? (
                                        <MdToggleOn
                                            className="icon icon-green toggle"
                                            title="Deactivate"
                                            onClick={() => toggleStatus(currency.id)}
                                        />
                                    ) : (
                                        <MdToggleOff
                                            className="icon icon-red toggle"
                                            title="Activate"
                                            onClick={() => toggleStatus(currency.id)}
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
            </div>
        </AdminLayout>
    );
};

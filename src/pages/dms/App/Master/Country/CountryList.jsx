import React, { useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { MdToggleOn, MdToggleOff } from "react-icons/md";
import { Button, Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";

export const CountryList = () => {
    const navigate = useNavigate();
    const [countries, setCountries] = useState([
        { id: 1, name: "United States", code: "US", createdAt: "2022-01-01  4:00 PM", status: "Active" },
        { id: 2, name: "Canada", code: "CA", createdAt: "2021-07-10  2:45 PM", status: "Inactive" },
        { id: 3, name: "India", code: "IN", createdAt: "2020-03-15  8:00 AM", status: "Active" },
        { id: 4, name: "Germany", code: "DE", createdAt: "2021-05-20  4:55 PM", status: "Inactive" },
        { id: 5, name: "France", code: "FR", createdAt: "2021-12-31  10:00 AM", status: "Active" },
        { id: 6, name: "Australia", code: "AU", createdAt: "2020-10-15  12:00 AM", status: "Active" },
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    // Pagination helper function
    const paginate = (data, page) => {
        const startIndex = (page - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    };

    const totalPages = Math.ceil(countries.length / itemsPerPage);

    const handleDelete = (id) => {
        setCountries(countries.filter(country => country.id !== id));
    };

    const handleEdit = (id) => {
        const countryToEdit = countries.find(country => country.id === id);
        navigate('/dms/country/edit', { state: { country: countryToEdit } });
    };

    const toggleStatus = (id) => {
        setCountries(countries.map(country =>
            country.id === id
                ? { ...country, status: country.status === "Active" ? "Inactive" : "Active" }
                : country
        ));
    };

    return (
        <AdminLayout>
        <div>
            <div className="dms-pages-header sticky-header">
                <h3>List of Countries</h3>
                <Button variant="primary" onClick={() => navigate('/dms/country/add')}>
                    <FaPlus /> Add
                </Button>
            </div>

            {/* Country List Table */}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Name</th>
                        <th>Code</th>
                        <th>Created</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginate(countries, currentPage).map((country, index) => (
                        <tr key={country.id}>
                            <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                            <td>{country.name}</td>
                            <td>{country.code}</td>
                            <td>{country.createdAt}</td>
                            <td>
                                <span
                                    className={`badge ${country.status === "Active" ? "bg-success" : "bg-danger"}`}
                                >
                                    {country.status}
                                </span>
                            </td>
                            <td>
                                <FaEdit
                                    className="icon icon-green edit"
                                    title="Edit"
                                    onClick={() => handleEdit(country.id)}
                                />
                                <FaTrash
                                    className="icon icon-red delete"
                                    title="Delete"
                                    onClick={() => handleDelete(country.id)}
                                />
                                {country.status === "Active" ? (
                                    <MdToggleOn
                                        className="icon icon-green toggle"
                                        title="Deactivate"
                                        onClick={() => toggleStatus(country.id)}
                                    />
                                ) : (
                                    <MdToggleOff
                                        className="icon icon-red toggle"
                                        title="Activate"
                                        onClick={() => toggleStatus(country.id)}
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

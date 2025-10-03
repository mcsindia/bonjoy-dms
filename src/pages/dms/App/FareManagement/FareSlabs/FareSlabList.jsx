import React, { useState } from "react";
import { Button, Table, Form, Pagination, Modal } from "react-bootstrap";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { AdminLayout } from "../../../../../layouts/dms/AdminLayout/AdminLayout";
import { useNavigate } from "react-router-dom";

export const FareSlabList = () => {
  const navigate = useNavigate();

  // Dummy data (aligned with DB schema)
  const dummySlabs = [
    {
      slab_id: "1",
      fare_id: "F001",
      start_km: 0,
      end_km: 5,
      rate_type: "per_km",
      rate: 10.5,
    },
    {
      slab_id: "2",
      fare_id: "F002",
      start_km: 6,
      end_km: 10,
      rate_type: "per_km",
      rate: 9.0,
    },
    {
      slab_id: "3",
      fare_id: "F003",
      start_km: 11,
      end_km: null,
      rate_type: "flat",
      rate: 100,
    },
  ];

  const [fareSlabs, setFareSlabs] = useState(dummySlabs);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSlab, setSelectedSlab] = useState(null);

  // 🔹 Mock permissions like RideFareSetting
  let permissions = ["add", "edit", "delete"]; // ✅ Replace with real role logic

  // Pagination logic
  const totalPages = Math.ceil(fareSlabs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSlabs = fareSlabs.slice(indexOfFirstItem, indexOfLastItem);

  const handleDelete = (slab) => {
    setSelectedSlab(slab);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setFareSlabs(fareSlabs.filter((s) => s.slab_id !== selectedSlab.slab_id));
    setShowDeleteModal(false);
    setSelectedSlab(null);
  };

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3>Fare Slab List</h3>
        {permissions.includes("add") && (
          <Button
            variant="primary"
            onClick={() => navigate("/dms/fareslab/add")}
          >
            <FaPlus /> Add Fare Slab
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="dms-table-container">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Start KM</th>
              <th>End KM</th>
              <th>Rate Type</th>
              <th>Rate</th>
              <th>Fare ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentSlabs.length > 0 ? (
              currentSlabs.map((slab, index) => (
                <tr key={slab.slab_id}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{slab.start_km}</td>
                  <td>{slab.end_km === null ? "∞" : slab.end_km}</td>
                  <td>{slab.rate_type}</td>
                  <td>{slab.rate}</td>
                  <td>{slab.fare_id}</td>
                  <td>
                    {(!permissions.includes("edit") &&
                      !permissions.includes("delete")) ? (
                      <span>-</span>
                    ) : (
                      <>
                        {permissions.includes("edit") && (
                          <FaEdit
                            className="icon icon-green me-2"
                            title="Edit"
                            onClick={() =>
                              navigate("/dms/fareslab/edit", { state: { slab } })
                            }
                          />
                        )}
                        {permissions.includes("delete") && (
                          <FaTrash
                            className="icon icon-red"
                            title="Delete"
                            onClick={() => handleDelete(slab)}
                          />
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No fare slabs found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* Pagination */}
        <div className="pagination-container">
          <Pagination className="mb-0">
            <Pagination.Prev
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === currentPage}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Pagination>

          <Form.Select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="pagination-option w-auto"
          >
            <option value="5">Show 5</option>
            <option value="10">Show 10</option>
            <option value="20">Show 20</option>
          </Form.Select>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Fare Slab</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the slab starting at{" "}
          <strong>{selectedSlab?.start_km} km</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

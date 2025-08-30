import React, { useState } from 'react';
import { Table, Button, InputGroup, Form, Pagination, DropdownButton, Dropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { FaEdit, FaTrash, FaPlus, FaFileExport, FaFileExcel, FaFilePdf, FaEye } from 'react-icons/fa';
import blog1_img from '../../../../assets/images/blog1-img.jfif'
import blog2_img from '../../../../assets/images/blog2-img.jpg'
import blog3_img from '../../../../assets/images/blog3-img.avif'

export const BlogList = () => {
  const navigate = useNavigate();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const initialBlogs = [
  {
    id: 1,
    title: 'Top Safety Tips for Riders and Drivers',
    content: 'Explore essential safety practices for both riders and drivers to ensure a secure trip every time.',
    author_id: 1,
    publish_date: '2025-05-10',
    status: 'Published',
    image: blog1_img,
  },
  {
    id: 2,
    title: 'How to Maximize Your Earnings as a Driver',
    content: 'Learn the best strategies to boost your income while driving with our platform.',
    author_id: 2,
    publish_date: '2025-04-20',
    status: 'Draft',
    image: blog2_img,
  },
  {
    id: 3,
    title: 'What’s New in the Ride-Sharing App: May 2025 Update',
    content: 'Check out the latest features and improvements in our app to enhance your ride experience.',
    author_id: 3,
    publish_date: '2025-05-01',
    status: 'Published',
    image: blog3_img,
  },
];

  const [blogs, setBlogs] = useState(initialBlogs);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Search Functionality
  const handleSearch = (e) => setSearch(e.target.value);

  // Filtered Blogs
  const filteredBlogs = blogs.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Edit Action
  const handleEdit = (blog) => {
    navigate('/dms/blog/edit', { state: { blog } });
  };

  // Delete Action
  const handleDelete = (id) => {
    const updatedBlogs = blogs.filter((item) => item.id !== id);
    setBlogs(updatedBlogs);
  };

  return (
    <AdminLayout>
      <div className="blog-list-container p-3">
        {/* Header Options */}
        <div className="dms-pages-header sticky-header ">
          <h3>Blog List</h3>
         <div className="export-import-container">
            <DropdownButton variant="primary" title={<><FaFileExport /> Export</>} className="me-2">
              <Dropdown.Item><FaFileExcel className="icon-green" /> Export to Excel</Dropdown.Item>
              <Dropdown.Item><FaFilePdf className="icon-red" /> Export to PDF</Dropdown.Item>
            </DropdownButton>
            <DropdownButton variant="primary" title={<><FaFileExport /> Import</>} className="me-2">
              <Dropdown.Item><FaFileExcel className="icon-green" /> Import from Excel</Dropdown.Item>
              <Dropdown.Item><FaFilePdf className="icon-red" /> Import from PDF</Dropdown.Item>
            </DropdownButton>
            <Button variant="primary" onClick={() => navigate('/dms/blog/add')}>
              <FaPlus /> Add Blog
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="filter-search-container">
          <DropdownButton
            variant="primary"
            title={`Filter: ${filterStatus || 'All'}`}
            id="filter-dropdown"
            className="dms-custom-width"
          >
            <Dropdown.Item onClick={() => setFilterStatus('')}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilterStatus('Published')}>Published</Dropdown.Item>
            <Dropdown.Item onClick={() => setFilterStatus('Draft')}>Draft</Dropdown.Item>
            <Dropdown.Item className="text-custom-danger" onClick={() => setFilterStatus('')}>
              Cancel
            </Dropdown.Item>
          </DropdownButton>
          <InputGroup className="dms-custom-width ">
            <Form.Control
              id="search-blogs"
              placeholder="Search blogs..."
              value={search}
              onChange={handleSearch}
            />
          </InputGroup>
        </div>

        {/* Table */}
        <div className="dms-table-container">
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Title</th>
                <th>Publish Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBlogs.length > 0 ? (
                currentBlogs.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                      />
                    </td>
                    <td>{item.title}</td>
                    <td>{item.publish_date}</td>
                    <td>{item.status}</td>
                    <td>
                      <FaEye title="View" className="icon-blue me-2" onClick={() => navigate('/dms/blog/view', { state: { blog: item } })} />
                      <FaEdit title="Edit" className="icon-green me-2" onClick={() => handleEdit(item)} />
                      <FaTrash title="Delete" className="icon-red" onClick={() => handleDelete(item.id)} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">No blogs found.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="pagination-container">
                     <Pagination className="mb-0">
                       <Pagination.Prev
                         onClick={() => handlePageChange(currentPage - 1)}
                         disabled={currentPage === 1}
                       />
                       {[...Array(totalPages)].map((_, index) => (
                         <Pagination.Item
                           key={index + 1}
                           active={index + 1 === currentPage}
                           onClick={() => handlePageChange(index + 1)}
                         >
                           {index + 1}
                         </Pagination.Item>
                       ))}
                       <Pagination.Next
                         onClick={() => handlePageChange(currentPage + 1)}
                         disabled={currentPage === totalPages}
                       />
                     </Pagination>
       
                     <Form.Select
                       value={itemsPerPage}
                       onChange={(e) => {
                         setItemsPerPage(Number(e.target.value));
                         setCurrentPage(1);
                       }}
                       className='pagination-option w-auto'
                     >
                       <option value="5">Show 5</option>
                       <option value="10">Show 10</option>
                       <option value="20">Show 20</option>
                       <option value="30">Show 30</option>
                       <option value="50">Show 50</option>
                     </Form.Select>
                   </div>
      </div>
    </AdminLayout>
  );
};

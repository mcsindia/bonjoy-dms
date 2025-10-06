import React, { useState } from 'react';
import {
  Button, Table, InputGroup, Form, Dropdown, DropdownButton, Pagination, Modal
} from 'react-bootstrap';
import {
  FaEdit, FaTrash, FaFileExport, FaPlus,
  FaFileExcel, FaFilePdf, FaEye
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../../../../layouts/dms/AdminLayout/AdminLayout';

const dummyCareers = [
  {
    id: 1,
    title: 'Software Engineer',
    department: 'IT',
    location: 'Mumbai',
    status: 'Open',
    positions: 3,
    createdAt: '2024-06-01',
    jobType: 'Full-Time',
    experience: '2+ years',
    skills: ['JavaScript', 'React', 'Node.js'],
    description: 'Develop and maintain web applications using modern JavaScript frameworks.',
    responsibilities: [
      'Write clean, maintainable code',
      'Participate in code reviews',
      'Collaborate with cross-functional teams'
    ]
  },
  {
    id: 2,
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'Delhi',
    status: 'Closed',
    positions: 1,
    createdAt: '2024-05-15',
    jobType: 'Full-Time',
    experience: '5+ years',
    skills: ['SEO', 'Content Strategy', 'Google Ads'],
    description: 'Plan and execute marketing strategies to increase brand awareness.',
    responsibilities: [
      'Develop marketing campaigns',
      'Manage SEO/SEM efforts',
      'Oversee team performance'
    ]
  },
  {
    id: 3,
    title: 'HR Executive',
    department: 'HR',
    location: 'Pune',
    status: 'Open',
    positions: 2,
    createdAt: '2024-05-10',
    jobType: 'Full-Time',
    experience: '3+ years',
    skills: ['Recruitment', 'Employee Relations', 'HRIS'],
    description: 'Manage recruitment and employee relations within the company.',
    responsibilities: [
      'Screen and interview candidates',
      'Conduct onboarding programs',
      'Resolve employee grievances'
    ]
  },
  {
    id: 4,
    title: 'Sales Associate',
    department: 'Sales',
    location: 'Ahmedabad',
    status: 'Open',
    positions: 5,
    createdAt: '2024-04-20',
    jobType: 'Part-Time',
    experience: '1+ years',
    skills: ['Customer Service', 'CRM', 'Lead Conversion'],
    description: 'Engage with customers and drive product sales.',
    responsibilities: [
      'Generate leads',
      'Handle customer queries',
      'Achieve sales targets'
    ]
  },
  {
    id: 5,
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Remote',
    status: 'Closed',
    positions: 1,
    createdAt: '2024-03-18',
    jobType: 'Contract',
    experience: '4+ years',
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    description: 'Design user-friendly interfaces for web and mobile applications.',
    responsibilities: [
      'Create wireframes and mockups',
      'Work with developers on UI implementation',
      'Conduct usability testing'
    ]
  },
  {
    id: 6,
    title: 'DevOps Engineer',
    department: 'IT',
    location: 'Hyderabad',
    status: 'Open',
    positions: 2,
    createdAt: '2024-02-22',
    jobType: 'Full-Time',
    experience: '3+ years',
    skills: ['AWS', 'Docker', 'CI/CD'],
    description: 'Implement DevOps best practices and infrastructure automation.',
    responsibilities: [
      'Maintain CI/CD pipelines',
      'Monitor production systems',
      'Automate deployments'
    ]
  },
  {
    id: 7,
    title: 'Content Writer',
    department: 'Marketing',
    location: 'Chennai',
    status: 'Open',
    positions: 4,
    createdAt: '2024-01-11',
    jobType: 'Freelance',
    experience: '2+ years',
    skills: ['SEO Writing', 'Blogging', 'Copywriting'],
    description: 'Create engaging content for blogs, social media, and websites.',
    responsibilities: [
      'Write SEO-optimized articles',
      'Develop content calendars',
      'Collaborate with marketing team'
    ]
  },
  {
    id: 8,
    title: 'Finance Analyst',
    department: 'Finance',
    location: 'Bangalore',
    status: 'Open',
    positions: 1,
    createdAt: '2023-12-01',
    jobType: 'Full-Time',
    experience: '4+ years',
    skills: ['Financial Modeling', 'Excel', 'Budgeting'],
    description: 'Analyze financial data to support strategic decisions.',
    responsibilities: [
      'Prepare financial reports',
      'Conduct market analysis',
      'Support budgeting process'
    ]
  },
];

export const JobPostList = () => {
  const navigate = useNavigate();
  const [careers, setCareers] = useState(dummyCareers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [careerToDelete, setCareerToDelete] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ✅ Permission extraction
  const userData = JSON.parse(localStorage.getItem('userData'));
  let permissions = [];

  if (Array.isArray(userData?.employeeRole)) {
    for (const role of userData.employeeRole) {
      for (const child of role.childMenus || []) {
        for (const mod of child.modules || []) {
          if (mod.moduleUrl?.toLowerCase() === 'job-post') {
            permissions =
              mod.permission?.toLowerCase().split(',').map((p) => p.trim()) || [];
          }
        }
      }
    }
  }

  const filteredCareers = careers.filter(career => {
    const matchesSearch =
      career.title.toLowerCase().includes(search.toLowerCase()) ||
      career.department.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === 'All' || career.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCareers.length / itemsPerPage);
  const paginatedCareers = filteredCareers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (career) => {
    setCareerToDelete(career);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setCareers(prev => prev.filter(c => c.id !== careerToDelete.id));
    setShowDeleteModal(false);
    setCareerToDelete(null);
  };

  const handleExport = (format) => {
    alert(`Exporting careers to ${format.toUpperCase()} (simulate only).`);
  };

  const handleImport = (format) => {
    alert(`Importing careers from ${format.toUpperCase()} (simulate only).`);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <AdminLayout>
      <div className="dms-pages-header sticky-header">
        <h3 className="mb-0">Career List</h3>
        <div className="export-import-container">
            <DropdownButton title={<><FaFileExport /> Export</>} className="me-2">
              <Dropdown.Item onClick={() => handleExport('excel')}>
                <FaFileExcel className="icon-green" /> Export to Excel
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleExport('pdf')}>
                <FaFilePdf className="icon-red" /> Export to PDF
              </Dropdown.Item>
            </DropdownButton>
            <DropdownButton title={<><FaFileExcel /> Import</>} className="me-2">
              <Dropdown.Item onClick={() => handleImport('excel')}>
                <FaFileExcel className="icon-green" /> Import from Excel
              </Dropdown.Item>
              <Dropdown.Item>
                <FaFilePdf className="icon-red" /> Import from PDF
              </Dropdown.Item>
            </DropdownButton>

          {permissions.includes('add') && (
            <Button onClick={() => navigate('/dms/job-post/add')}>
              <FaPlus /> Add Career
            </Button>
          )}
        </div>
      </div>

      <div className="filter-search-container">
        <DropdownButton
          title={`Status: ${statusFilter}`}
          onSelect={(val) => { setStatusFilter(val); setCurrentPage(1); }}
        >
          <Dropdown.Item eventKey="All">All</Dropdown.Item>
          <Dropdown.Item eventKey="Open">Open</Dropdown.Item>
          <Dropdown.Item eventKey="Closed">Closed</Dropdown.Item>
        </DropdownButton>

        <InputGroup className="dms-custom-width">
          <Form.Control
            placeholder="Search by Job Title or Department"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </InputGroup>
      </div>

      <div className="dms-table-container">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Job Title</th>
              <th>Department</th>
              <th>Location</th>
              <th>Status</th>
              <th>No. of Positions</th>
              <th>Posted On</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCareers.length > 0 ? paginatedCareers.map((career, index) => (
              <tr key={career.id}>
                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td>{career.title}</td>
                <td>{career.department}</td>
                <td>{career.location}</td>
                <td>{career.status}</td>
                <td>{career.positions}</td>
                <td>{new Date(career.createdAt).toLocaleDateString()}</td>
                {(permissions.includes('view') ||
                  permissions.includes('edit') ||
                  permissions.includes('delete')) && (
                  <td>
                    {permissions.includes('view') && (
                      <FaEye
                        className="icon-blue me-2"
                        onClick={() => navigate("/dms/job-post/view", { state: { career } })}
                      />
                    )}
                    {permissions.includes('edit') && (
                      <FaEdit
                        className="icon-green me-2"
                        onClick={() => navigate("/dms/job-post/edit", { state: { career } })}
                      />
                    )}
                    {permissions.includes('delete') && (
                      <FaTrash
                        className="icon-red"
                        onClick={() => handleDelete(career)}
                      />
                    )}
                  </td>
                )}
              </tr>
            )) : (
              <tr><td colSpan="8" className="text-center">No careers found.</td></tr>
            )}
          </tbody>
        </Table>

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

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{careerToDelete?.title}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </AdminLayout>
  );
};

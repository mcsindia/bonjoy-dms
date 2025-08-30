import React, { useState, useEffect } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { useNavigate, useLocation } from 'react-router-dom';
import { QuillEditor } from '../../../../components/dms/QuillEditor/QuillEditor';

export const BlogEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Initial blog data from location state
  const [blog, setBlog] = useState(location.state?.blog || {
    title: '',
    content: '',
    authorId: '',
    publishDate: '',
    status: 'Active',
    image: null,
  });

  useEffect(() => {
    if (!location.state?.blog) {
      navigate('/dms/blog');
    }
  }, [location.state, navigate]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog({ ...blog, [name]: value });
  };

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBlog({ ...blog, image: URL.createObjectURL(file) });
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Blog updated:', blog);
    // TODO: Update blog API call here
    navigate('/dms/blog'); // Redirect to blog list after update
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h3 className="mb-4">Edit Blog</h3>

        <div className="dms-form-container">
          <Form onSubmit={handleSubmit}>
            {/* Image Upload */}
            <Form.Group className="dms-form-group" controlId="image">
              <Form.Label>Blog Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {blog.image && (
                <div className="mt-2">
                  <img
                    src={blog.image}
                    alt="Preview"
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={blog.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                required
              />
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="content">
              <Form.Label>Content</Form.Label>
              <QuillEditor
                value={blog.content}
                onChange={(value) => setBlog((prev) => ({ ...prev, content: value }))}
              />
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="publishDate">
              <Form.Label>Publish Date</Form.Label>
              <Form.Control
                type="date"
                name="publishDate"
                value={blog.publish_date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="dms-form-group" controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={blog.status}
                onChange={handleChange}
                required
              >
                <option value="Select status">Select status</option>
                <option value="Published">Published</option>
                <option value="Draft">Draft</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit">Update Blog</Button>
            <Button
              type="cancel"
              className="ms-3"
              onClick={() => navigate('/dms/blog')}
            >
              Cancel
            </Button>
          </Form>
        </div>
      </div>
    </AdminLayout>
  );
};

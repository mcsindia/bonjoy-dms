import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { QuillEditor } from '../../../../components/dms/QuillEditor/QuillEditor';

export const BlogAdd = () => {
  const [blog, setBlog] = useState({
    title: '',
    content: '',
    author_id: '',
    publish_date: '',
    status: '',
    image: null,
  });

  const navigate = useNavigate();

  // Handle input change for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlog((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBlog((prev) => ({
        ...prev,
        image: URL.createObjectURL(file),
        imageFile: file, // optionally keep file for upload
      }));
    }
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dms/blog');
  };

  return (
    <AdminLayout>
      <div className="dms-container">
        <h3 className="mb-4">Add Blog</h3>

        <div className="dms-form-container">
          <Form onSubmit={handleSubmit}>
            {/* Image Upload Section */}
            <Form.Group className="dms-form-group" controlId="image">
              <Form.Label>Image</Form.Label>
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

            <Form.Group className="dms-form-group" controlId="publish_date">
              <Form.Label>Publish Date</Form.Label>
              <Form.Control
                type="date"
                name="publish_date"
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
                <option value="">Select Status</option>
                <option value="Published">Publish</option>
                <option value="Draft">Draft</option>
              </Form.Select>
            </Form.Group>

            <Button type="submit">Add Blog</Button>
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

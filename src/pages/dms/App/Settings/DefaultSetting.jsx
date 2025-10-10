import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { AdminLayout } from '../../../../layouts/dms/AdminLayout/AdminLayout';
import { FaEdit, FaSave } from 'react-icons/fa';

export const DefaultSetting = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    adminTitle: '',
    adminFooter: '',
    email: '',
    number: '',
    username: '',
  });

  const [isEditing, setIsEditing] = useState(false);

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false); // Exit edit mode after saving
  };

  const handleLogout = () => {
    // Implement logout functionality
  };

  return (
    <AdminLayout>
      <Container className='dms-container'>
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <h3>Default Settings</h3>
          <Button onClick={toggleEditMode} variant={isEditing ? "success" : "secondary"}>
            {isEditing ? <><FaSave className='me-2' /> Save</> : <><FaEdit className='me-2' /> Edit</>}
          </Button>
        </div>
        
        <div className='dms-form-container'>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='dms-form-group' controlId="theme">
              <Form.Label>Theme</Form.Label>
              <Form.Select name="theme" value={settings.theme} onChange={handleChange} disabled={!isEditing}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className='dms-form-group' controlId="adminTitle">
              <Form.Label>Admin Title</Form.Label>
              <Form.Control type="text" name="adminTitle" value={settings.adminTitle} onChange={handleChange} placeholder="Enter admin title" disabled={!isEditing} />
            </Form.Group>
            
            <Form.Group className='dms-form-group' controlId="adminFooter">
              <Form.Label>Admin Footer</Form.Label>
              <Form.Control type="text" name="adminFooter" value={settings.adminFooter} onChange={handleChange} placeholder="Enter admin footer" disabled={!isEditing} />
            </Form.Group>
            
            <Form.Group className='dms-form-group' controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" name="username" value={settings.username} onChange={handleChange} placeholder="Enter username" disabled={!isEditing} />
            </Form.Group>
            
            <Form.Group className='dms-form-group' controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={settings.email} onChange={handleChange} placeholder="Enter email" disabled={!isEditing} />
            </Form.Group>
            
            <Form.Group className='dms-form-group' controlId="number">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" name="number" value={settings.number} onChange={handleChange} placeholder="Enter phone number" disabled={!isEditing} />
            </Form.Group>
            <Button variant="danger" className="ms-3" onClick={handleLogout}>Logout</Button>
          </Form>
        </div>
      </Container>
    </AdminLayout>
  );
};
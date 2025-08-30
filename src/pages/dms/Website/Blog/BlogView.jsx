import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, Container, Badge } from "react-bootstrap";
import { FaArrowLeft, FaEdit } from "react-icons/fa";
import { AdminLayout } from "../../../../layouts/dms/AdminLayout/AdminLayout";

export const BlogView = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const blog = location.state?.blog;

    if (!blog) {
        return (
            <AdminLayout>
                <Container className="text-center my-5">
                    <h3>Blog not found</h3>
                    <Button onClick={() => navigate(-1)}>Go Back</Button>
                </Container>
            </AdminLayout>
        );
    }

    const { title, author_id, publish_date, image, content, status } = blog;

    const getStatusVariant = (status) => {
        switch (status) {
            case "Published":
                return "success";
            case "Draft":
                return "warning";
            default:
                return "secondary";
        }
    };

    const stripHtmlTags = (html) => {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    return (
        <AdminLayout>
            <Container className="my-4">

                <div className="dms-pages-header">
                    <h3>Blog Details</h3>
                    <Button onClick={() => navigate('/dms/blog/edit', { state: { blog } })} className="edit-button">
                        <FaEdit /> Edit
                    </Button>
                </div>

                <Card>
                    {image && (
                        <Card.Img variant="top" src={image} alt={title} style={{ maxHeight: "400px", objectFit: "cover" }} />
                    )}
                    <Card.Body>
                        <Card.Title>{title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                            {publish_date}
                        </Card.Subtitle>
                        <Card.Text>
                            <strong>Status: </strong>
                            <Badge bg={getStatusVariant(status)}>{status}</Badge>
                        </Card.Text>
                        <Card.Text><strong>Content: </strong>{stripHtmlTags(content)}</Card.Text>
                    </Card.Body>
                </Card>
            </Container>
        </AdminLayout>
    );
};

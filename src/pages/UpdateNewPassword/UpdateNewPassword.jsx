import axios from 'axios';
import React, { useState } from 'react';
import {Button, Container, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import makeRequest from '../../makeRequest';

function UpdateNewPassword() {
    const {token} =  useParams()
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    async function handleUpdateNewPassword(e) {
        e.preventDefault()
        try {
            await makeRequest.userAPI.updateNewPassword({ password, token})
            alert("Tạo mật khẩu mới thành công")
            navigate("/")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                alert(error.response.data.message)
            }
            alert(error.toString())
        }
    }

    return (
        <Container style={{ marginTop: "20px" }}>
            <h1 style={{ textAlign: "center" }}>Tạo mật khẩu mới</h1>
            <Form onSubmit={handleUpdateNewPassword}>
                <Form.Group className="mb-3" Register>
                    <Form.Label>Mật khẩu mới</Form.Label>
                    <Form.Control value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" placeholder="Nhập mật khẩu mới" />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Tạo
                </Button>
            </Form>
        </Container>
    );
}

export default UpdateNewPassword;
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import makeRequest from '../../makeRequest';
import { setValue } from '../../redux/tokenReducer';

function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const dispatch = useDispatch()
    const navigate = useNavigate()

    async function handleLogin(e) {
        e.preventDefault()
        try {
            const res = await makeRequest.userAPI.login({ username, password })
            dispatch(setValue(res.data))
            navigate("/")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response.data.message)
            }
            setError(error.toString())
        }
    }

    return (
        <Container style={{ marginTop: "20px" }}>
            <h1 style={{ textAlign: "center" }}>Đăng nhập</h1>
            {error !== "" && error.split("---").map((err, index) => <Alert variant="danger" key={index + err} severity="error">{err}</Alert>)}
            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Tài khoản</Form.Label>
                    <Form.Control value={username} onChange={(e) => { setUsername(e.target.value) }} type="text" placeholder="Nhập tài khoản" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control value={password} onChange={(e) => { setPassword(e.target.value) }} type="password" placeholder="Nhập mật khẩu" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Link to="/register">Chưa có tài khoản?</Link>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Link to="/forgot">Quên mật khẩu?</Link>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Đăng nhập
                </Button>
            </Form>
        </Container>
    );
}

export default Login;
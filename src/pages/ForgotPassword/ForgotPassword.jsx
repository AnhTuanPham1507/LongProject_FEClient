import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, Container, Form } from 'react-bootstrap';
import makeRequest from '../../makeRequest';

function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")


    async function handleForgotPassword(e) {
        e.preventDefault()
        try {
            const res = await makeRequest.userAPI.forgotPassword({ email })
            console.log(res.data)
            setMessage(res.data.message)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(error.response.data.message)
            }
            setError(error.toString())
        }
    }

    return (
        <Container style={{ marginTop: "20px" }}>
            {message !== "" ?
                <Alert>{message}</Alert> :
                <>
                    <h1 style={{ textAlign: "center" }}>Quên mật khẩu</h1>
                    {error !== "" && error.split("---").map((err, index) => <Alert variant="danger" key={index + err} severity="error">{err}</Alert>)}
                    <Form onSubmit={handleForgotPassword}>
                        <Form.Group className="mb-3" Register>
                            <Form.Label>Email</Form.Label>
                            <Form.Control pattern="/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/" value={email} onChange={(e) => { setEmail(e.target.value) }} type="email" placeholder="Nhập email" />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Lấy lại mật khẩu
                        </Button>
                    </Form>
                </>
            }
        </Container>
    );
}

export default ForgotPassword;
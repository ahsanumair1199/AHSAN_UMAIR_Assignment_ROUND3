import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Form, Button, Container } from "react-bootstrap";
import Message from "../components/Message";

const LoginPage = () => {
  const { loginUser, detail } = useContext(AuthContext);
  const { error, message } = detail;
  return (
    <Container className="my-5">
      <h1 className="text-center">Sign In</h1>
      {error && <Message variant="danger">{message}</Message>}
      <Form onSubmit={loginUser}>
        <Form.Group controlId="email" className="mb-3 mt-3">
          <Form.Label>Email Address</Form.Label>
          <Form.Control type="email" placeholder="Enter Email" name="email" />
        </Form.Group>
        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            name="password"
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Sign In
        </Button>
      </Form>
    </Container>
  );
};

export default LoginPage;

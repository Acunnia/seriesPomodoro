import React, { useState, useContext } from "react";
import api from "../../utils/api";
import { AuthContext, reducer } from "../../utils/auth";
import { Button, Form, Input, Typography, Row, Col, Card } from "antd";
import Modal from "antd/es/modal/Modal";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const Login = (props) => {
  const { dispatch } = useContext(AuthContext);
  const [waiting, setWaiting] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setWaiting(true);
    api
      .post("/users/login", {
        email: values.email,
        password: values.password,
      })
      .then((result) => {
        dispatch({
          type: "LOGIN",
          payload: {
            token: result.data.token,
            user: result.data.user,
          },
        });
        navigate("/");
      })
      .catch((e) => {
        setWaiting(false);
        Modal.error({
          title: "Login failed",
          content: e.response.data.message,
        });
      });
  };

  return (
    <Row justify="center" align="middle" style={{ "margin-top": "100px" }}>
      <Col span={8}>
        <Card
          style={{
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            background: "#333",
            color: "#fff",
          }}
        >
          <Form name="login" onFinish={onFinish} layout="vertical">
            <Title level={2}>Login</Title>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please provide an email" },
                { type: "email", message: "Please provide a valid email" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: "Please provide a password" },
                {
                  min: 6,
                  message: "The password must be at least 6 characters long",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={waiting}>
                Login
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;

import React, {useState, useContext} from "react";
import api from '../../utils/api'
import { AuthContext, reducer } from "../../utils/auth";
import {Button, Form, Input} from "antd";
import Modal from "antd/es/modal/Modal";
import { useNavigate } from "react-router-dom";


const Login = props => {
    const { dispatch } = useContext(AuthContext);
    const [waiting, setWaiting] = useState(false)
    const navigate = useNavigate();

    const onFinish = values => {
        setWaiting(true);
        api.post('/users/login', {
            email: values.email,
            password: values.password,
        })
            .then(result => {
                dispatch({
                    type: 'LOGIN',
                    payload: {
                        token: result.data.token,
                        user: result.data.user,
                    },
                });
                navigate("/");
            })
            .catch(e => {
                setWaiting(false);
                Modal.error({
                    title: 'Login failed',
                    content: e.response.data.msg,
                });
            });
    };

    return (
        <Form name="login" onFinish={onFinish}>

            <Form.Item
                name="email"
                label="Email"
                rules={[
                    { required: true, message: "Pls provide a email" },
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
                    { min: 6, message: "The passworld must have atleast 6 characters long" },
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
    );
};

export default Login;

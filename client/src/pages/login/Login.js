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
                label="Correo Electrónico"
                rules={[
                    { required: true, message: "Por favor ingresa un correo electrónico" },
                    { type: "email", message: "Por favor ingresa un correo electrónico válido" },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                name="password"
                label="Contraseña"
                rules={[
                    { required: true, message: "Por favor ingresa una contraseña" },
                    { min: 6, message: "La contraseña debe tener al menos 6 caracteres" },
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={waiting}>
                    Registrarse
                </Button>
            </Form.Item>
        </Form>
    );
};

export default Login;

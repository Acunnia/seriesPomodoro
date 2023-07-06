import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import api from "../utils/api";

const RegistrationForm = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        setLoading(true);
        api.post("users/register", {
                username: values.username,
                email: values.email,
                password: values.password,
            })
            .then((response) => {
                console.log("Registro exitoso:", response.data);
            })
            .catch((error) => {
                console.error("Error al registrar:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Form name="registration" onFinish={onFinish}>
            <Form.Item
                name="username"
                label="Usuario"
                rules={[
                    { required: true, message: "Por favor ingresa un usuario" },
                    { min: 4, message: "El usuario debe tener al menos 4 caracteres" },
                ]}
            >
                <Input />
            </Form.Item>

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
                <Button type="primary" htmlType="submit" loading={loading}>
                    Registrarse
                </Button>
            </Form.Item>
        </Form>
    );
};

export default RegistrationForm;

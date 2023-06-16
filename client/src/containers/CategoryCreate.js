import React, {useState} from 'react';
import { Form, Input, Button } from 'antd';
import api from "../utils/api";

const CategoryForm = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = (values) => {
        setLoading(true);
        api.post("/categories/create", {
            name: values.name
        })
            .then((response) => {
                // Lógica adicional después de un registro exitoso
                console.log("Category created:", response.data);
            })
            .catch((error) => {
                // Lógica de manejo de error
                console.error("Create error:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Form
            name="categoryForm"
            onFinish={onFinish}
            layout="vertical"
        >
            <Form.Item
                label="Nombre de la categoría"
                name="name"
                rules={[
                    {
                        required: true,
                        message: 'Por favor, ingresa el nombre de la categoría',
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Crear categoría
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CategoryForm;

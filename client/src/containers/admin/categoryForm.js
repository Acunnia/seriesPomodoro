import React, { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';

const CategoryForm = ({ category, onSave }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (category) {
            setIsEditing(true);
            form.setFieldsValue(category);
        }
    }, [category, form]);

    const onFinish = (values) => {
        onSave(values);
        form.resetFields();
    };

    return (
        <Form form={form} onFinish={onFinish}>
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the category name!' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Description" name="description">
                <Input />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    {isEditing ? 'Update' : 'Create'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default CategoryForm;
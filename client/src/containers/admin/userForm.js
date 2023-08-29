import React, { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';

const UserForm = ({ user, onSave }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setIsEditing(true);
            form.setFieldsValue(user);
        }
    }, [user, form]);

    const onFinish = (values) => {
        onSave(values);
        form.resetFields();
    };

    return (
        <Form form={form} onFinish={onFinish}>
            <Form.Item label="ID" name="_id">
                <Input disabled/>
            </Form.Item>
            <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input the category name!' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Email" name="email">
                <Input />
            </Form.Item>
            <Form.Item label="Image" name="image">
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

export default UserForm;
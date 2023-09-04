import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';

const RoleForm = ({ roletoEdit, onSave }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (roletoEdit) {
            form.setFieldsValue(roletoEdit);
        }
    }, [roletoEdit, form]);

    const onFinish = (values) => {
        onSave(values);
        form.resetFields();
    };

    return (
        <div>
            <Form form={form} onFinish={onFinish}>
                <Form.Item label="ID" name="_id">
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input the role name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label="Admin Level" name="admin_level">
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" name="roleSubmitButton">
                        {roletoEdit ? 'Update' : 'Create'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default RoleForm;

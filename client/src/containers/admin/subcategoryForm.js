import React, { useState, useEffect } from 'react';
import { Form, Input, Button } from 'antd';

const SubcategoryForm = ({ subcategory, onSave }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (subcategory) {
            setIsEditing(true);
            form.setFieldsValue(subcategory);
        }
    }, [subcategory, form]);

    const onFinish = (values) => {
        onSave(values);
        form.resetFields();
    };

    return (
        <Form form={form} onFinish={onFinish}>
            {isEditing && (
                <Form.Item label="ID" name="_id">
                    <Input disabled />
                </Form.Item>
            )}
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the subcategory name!' }]}>
                <Input />
            </Form.Item>
            <Form.Item label="Category ID" name="category">
                <Input disabled />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    {isEditing ? 'Update' : 'Create'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default SubcategoryForm;

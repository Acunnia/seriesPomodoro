import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';

const UserForm = ({ user, onSave, roles }) => {
    const [form] = Form.useForm();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (user) {
            setIsEditing(true);
            console.log(user);
            user.roleId = user.role._id
            form.setFieldsValue(user);
        }
    }, [user, form]);

    const onFinish = (values) => {
        onSave(values);
        user = {}
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
            <Form.Item label="Role" name="roleId">
            <Select defaultValue={user.role._id} style={{ width: '100%' }}>
                {roles.map(role => (
                    <Select.Option key={role._id} value={role._id}>
                        {role.name}
                    </Select.Option>
                ))}
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Update</Button>
            </Form.Item>
        </Form>
    );
};

export default UserForm;
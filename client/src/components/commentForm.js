import React, {Component} from 'react';
import {Button, Form, Input} from "antd";

const CommentForm = ({onSubmit}) => {
    const [form] = Form.useForm();
    const onFinish = (values) => {
        onSubmit(values);
    };

    return (
        <Form form={form} onFinish={onFinish}>
            <Form.Item label="Nueva Respuesta" name={"comment"}>
                <Input.TextArea rows={4} name="newReply" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Enviar Respuesta
                </Button>
            </Form.Item>
        </Form>
    );
}

export default CommentForm;
import React, {Component} from 'react';
import {Button, Form, Input} from "antd";

class CommentForm extends Component {
    render() {
        function handleNewReply() {
            console.log("form")
        }

        return (
            <Form onFinish={handleNewReply}>
                <Form.Item label="Nueva Respuesta">
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
}

export default CommentForm;
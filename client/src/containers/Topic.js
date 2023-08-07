import React, { useState, useEffect, useContext } from 'react';
import {Row, Col, Typography, Form, Input, Button, Modal, Spin, Card, Avatar, Divider} from 'antd';
import {useSearchParams} from "react-router-dom";
import api from "../utils/api";
import Meta from "antd/es/card/Meta";
import Reply from "../components/Reply";

// antd
const { Title, Text } = Typography;
const { TextArea } = Input;

const Topic = props => {
    const [contentLoading, setContentLoading] = useState(true);
    const [topic, setTopic] = useState({})
    const [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get("id")


    useEffect(() => {
        api.get(`/topics?id=${id}`).then(result => {
            console.log(result)
            setTopic(result.data.topic)
            setContentLoading(false)
        }).catch(err => {
            Modal.error({
                title: 'An error ocurred',
                content: err.message,
            })
        })
    }, [id])

    function handleNewReply() {
        console.log("handle")
    }

    return (
        <div>
            {contentLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <Card>
                        <Meta
                            title={topic.title}
                            description={topic.description}
                        />
                        <p>Created by: {topic.author.username}</p>
                    </Card>
                        {topic.replies.length > 0 ? (
                            topic.replies.map((reply) => (
                                <div key={reply._id}>
                                    <Reply postData={reply} />
                                    <Divider />
                                </div>
                            ))
                        ) : (
                            <p>No replies yet.</p>
                        )}

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

                </>
            )}
        </div>
    );
};


export default Topic;

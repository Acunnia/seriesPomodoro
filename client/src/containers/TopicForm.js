import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Typography, Form, Input, Button, Modal, Spin } from 'antd';
import { CommentOutlined } from '@ant-design/icons';
import api from '../utils/api';
import { Link, useNavigate, useSearchParams} from 'react-router-dom';
import { AuthContext} from "../utils/auth";
import {log} from "async";

// antd
const { Title, Text } = Typography;
const { TextArea } = Input;

const TopicForm = props => {
    const [loading, setLoading] = useState(false);
    const [subcategory, setSubcategory] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { state } = useContext(AuthContext);
    const catID = searchParams.get("id")


    useEffect(() => {
        api.get(`/subcategories/info?id=${catID}`).then(result => {
            setSubcategory(result.data);
        });
    }, []);

    const onSubmit = data => {
        setLoading(true);

        const topicData = {
            ...data,
            author: state.user.id,
            subcategory: subcategory._id,
        };

        api.post('/topics/create', topicData, {
            headers: {
                'Authorization': `Bearer ${state.token}`,
                'Content-Type': 'application/json'
            },
        })
            .then(result => {
                navigate(`/topic?id=${result.data.topic._id}`);
            })
            .catch(e => {
                setLoading(false);
                Modal.error({
                    title: 'Failed to post a new topic',
                    content: e.message,
                });
            });
    };

    return (
        <div>
            <Row className={'MainRow'}>
                <Col span={24}>
                    <div className={'NewTopic'}>
                        <Title level={3}>New topic</Title>
                        <Text>
                            Posteando en{' '}
                            <Link to={`/subcategory?id=${catID}`}>
                                {subcategory ? (
                                    subcategory.name
                                ) : (
                                    <Spin size="small" style={{ marginLeft: '5px' }} />
                                )}
                            </Link>
                        </Text>
                        <Form
                            name="login"
                            onFinish={onSubmit}
                            style={{ marginTop: '40px' }}
                        >
                            <Form.Item
                                name="title"
                                rules={[
                                    {
                                        required: true,
                                        message: 'The title must be at least 5 characters long',
                                        min: 5,
                                    },
                                ]}
                            >
                                <Input placeholder="Title" disabled={loading} />
                            </Form.Item>
                            <Form.Item name="description">
                                <Input placeholder="Subtitle/Description (optional)" disabled={loading} />
                            </Form.Item>
                            <Form.Item
                                name="message"
                                rules={[
                                    {
                                        required: true,
                                        message:
                                            'The message of the topic must be at least 5 characters long',
                                        min: 5,
                                    },
                                ]}
                            >
                                <TextArea placeholder="Message" rows={8} disabled={loading} />
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<CommentOutlined />}
                                    disabled={loading}
                                >
                                    Create new topic
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default TopicForm;

import React, { useState, useEffect, useContext } from 'react';
import {Row, Col, Typography, Form, Input, Button, Modal, Spin, Card, Avatar} from 'antd';
import {useSearchParams} from "react-router-dom";
import api from "../utils/api";
import Meta from "antd/es/card/Meta";

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

    return (
        <div>
            {contentLoading ? (
                <p>Loading...</p>
            ) : (
                <Card>
                    <Meta
                        avatar={<Avatar>{topic.author.username[0].toUpperCase()}</Avatar>}
                        title={topic.title}
                        description={topic.description}
                    />
                    <p>Posted by: {topic.author.username}</p>

                    <h3>Replies:</h3>
                    {topic.replies.length > 0 ? (
                        topic.replies.map((reply) => (
                            <div key={reply._id}>
                                <p>{reply.author.username}</p>
                                <p>{reply.message}</p>
                                <p>{reply.postDate}</p>
                            </div>
                        ))
                    ) : (
                        <p>No replies yet.</p>
                    )}
                </Card>
            )}
        </div>
    );
};


export default Topic;

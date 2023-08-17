import React, { useState, useEffect, useContext } from 'react';
import {Row, Col, Typography, Form, Input, Button, Modal, Spin, Card, Avatar, Divider} from 'antd';
import {useSearchParams} from "react-router-dom";
import api from "../utils/api";
import Meta from "antd/es/card/Meta";
import Reply from "../components/Reply";
import CommentForm from "../components/commentForm";
import {AuthContext} from "../utils/auth";

// antd
const { Title, Text } = Typography;
const { TextArea } = Input;

const Topic = props => {
    const [contentLoading, setContentLoading] = useState(true);
    const [ userLogued, setUserLogued ] = useState(false)
    const [topic, setTopic] = useState({})
    const [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get("id")
    const { state } = useContext(AuthContext);

    useEffect(() => {
        if (state.user) {
            setUserLogued(state)
        }

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

    function handleNewReply(commentData) {
        console.log(commentData)
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
                            <p>No replies yet. Be the first</p>
                        )}

                    {userLogued ?
                        (<CommentForm topicId={id} userId={userLogued.user.id} onSubmit={handleNewReply} />) :
                        (<Card>
                            <p>Regístrate o inicia sesión para responder a este hilo.</p>
                        </Card>
                    )}



                </>
            )}
        </div>
    );
};


export default Topic;

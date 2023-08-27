import {Card, Divider, Input, message, Modal, Typography} from "antd";
import {useContext, useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {AuthContext} from "../utils/auth";
import api from "../utils/api";
import Meta from "antd/es/card/Meta";
import Reply from "../components/Reply";
import CommentForm from "../components/commentForm";

const Topic = props => {
    const [ contentLoading, setContentLoading ] = useState(true);
    const [ userLogued, setUserLogued ] = useState(false)
    const [ topic, setTopic ] = useState(null)
    const [ searchParams, setSearchParams ] = useSearchParams();
    const id = searchParams.get("id")
    const { state } = useContext(AuthContext);

    useEffect(() => {
        if (state.user) {
            setUserLogued(state)
        }

        if (!topic){
            fetchTopic()
        }

    }, [id, state])

    function fetchTopic() {
        api.get(`/topics?id=${id}`).then(result => {
            setTopic(result.data.topic)
            setContentLoading(false)
        }).catch(err => {
            Modal.error({
                title: 'An error ocurred',
                content: err.message,
            })
        })
    }

    function handleNewReply(commentData) {
            api.post('/reply/add', {message: commentData.comment, topicId:id }, {
                headers: {
                    'Authorization': `Bearer ${state.token}`,
                    'Content-Type': 'application/json'
                }}).then(result => {
                    message.success("Posted!")
                    fetchTopic()
                }).catch(err => {
                    message.error('Something went wrong');
                })
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

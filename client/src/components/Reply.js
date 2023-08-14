import React, {useContext, useEffect, useState} from 'react';
import { Card, Avatar, Row, Col, Typography, Space } from 'antd';
import { LikeOutlined } from '@ant-design/icons';
import api from "../utils/api";
import {AuthContext} from "../utils/auth";

const { Meta } = Card;
const { Text } = Typography;

const Reply = ({ postData }) => {
    const { _id, author, postDate, message, likedBy } = postData;
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(likedBy.length);
    const { state } = useContext(AuthContext);

    useEffect(() => {
        console.log(state)
        if (state) {
            setLiked(likedBy.includes(state.user.id));
        }
    }, [likedBy]);

    function handleLikeClick() {
         api.post('/reply/like', { id: _id }, {
                headers: {
                    'Authorization': `Bearer ${state.token}`,
                    'Content-Type': 'application/json'
                }
            }).then(response => {
             if (response.status === 200) {
                 if (!liked) {
                     setLikes(likes + 1);
                 } else {
                     setLikes(likes - 1);
                 }
                 setLiked(!liked);
             }
         }).catch(error => {
             //TODO Modal error o logout
            console.error('Error liking reply:', error);
        })
    }

    return (
        <Card>
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Space align="start">
                        <Avatar>{author.username[0].toUpperCase()}</Avatar>
                        <Text strong>{author.username}</Text>
                    </Space>
                </Col>
                <Col span={12}>
                    <Text>{message}</Text>
                </Col>
                <Col span={6}>
                    <Space direction="vertical" align="end">
                        <div>
                            <LikeOutlined
                                onClick={handleLikeClick}
                                style={{
                                    cursor: 'pointer',
                                    color: liked ? 'blue' : 'black'
                                }}
                            />{' '}
                            {likes} Likes
                        </div>
                        <div>{`${String(new Date(postDate).getHours()).padStart(2, '0')}:${String(new Date(postDate).getMinutes()).padStart(2, '0')} ${String(new Date(postDate).getDate()).padStart(2, '0')}/${String(new Date(postDate).getMonth() + 1).padStart(2, '0')}/${new Date(postDate).getFullYear()}`}</div>
                    </Space>
                </Col>
            </Row>
        </Card>
    );
};

export default Reply;
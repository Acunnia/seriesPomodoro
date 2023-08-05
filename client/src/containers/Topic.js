import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Typography, Form, Input, Button, Modal, Spin } from 'antd';
import {useSearchParams} from "react-router-dom";
import api from "../utils/api";

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
            setTopic(result.data)
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
            <p>Topic</p>
        </div>
    );
};

export default Topic;

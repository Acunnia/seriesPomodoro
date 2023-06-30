import React, {useEffect, useState} from 'react';
import {Link, useSearchParams} from "react-router-dom";
import {Col, Skeleton, Modal, Button} from "antd";
import api from "../utils/api";
import {FormOutlined} from "@ant-design/icons";

const TopicList = props => {
    const [contentLoading, setContentLoading] = useState(true);
    const [info, setInfo] = useState({ name: '', description: '' });
    const [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get("id")
    const [topics, setTopics] = useState([]);
    const [pages, setPages] = useState({
        currentPage: null,
        totalPages: null,
    });

    // Initial load
    useEffect(() => {
        api.get(`/categories/topics?id=${id}`)
            .then(result => {
                setTopics(result.data.topics);
                setInfo({
                    name: result.data.name,
                    description: result.data.description,
                });
                setPages({
                    currentPage: result.data.currentPage,
                    totalPages: result.data.totalPages * 10,
                });
                setContentLoading(false);
            })
            .catch(e => {
                Modal.error({
                    title: 'An error occurred',
                    content: e.message,
                });
            });
    }, [props.id, setContentLoading, setInfo]);

    const fetchPage = page => {
        setContentLoading(true);

        api.get(`/categories/topics?id=${props.id}&page=${page}`)
            .then(result => {
                setTopics(result.data.topics);
                setPages({
                    currentPage: result.data.currentPage,
                    totalPages: result.data.totalPages * 10,
                });
                setContentLoading(false);
            })
            .catch(e => {
                Modal.error({
                    title: 'An error occurred',
                    content: e.message,
                });
            });
    };


    return (
        <div>
            <div>
                <span>todo: sub categorias</span>
            </div>
            <div>
                <span>todo: topics</span>

                <Link
                    to={`/newsubcat?id=${id}`}
                    className={"NewTopic"}
                >
                    <Button type="primary" icon={<FormOutlined />}>
                        Create new subcategory
                    </Button>
                </Link>

                <Link
                    to={`/newtopic?id=${id}`}
                    className={"NewTopic"}
                >
                    <Button type="primary" icon={<FormOutlined />}>
                        Create new topic
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default TopicList;

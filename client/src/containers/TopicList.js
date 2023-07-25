import React, {useEffect, useState} from 'react';
import {Link, useSearchParams, useLocation} from "react-router-dom";
import {Col, Skeleton, Modal, Button} from "antd";
import api from "../utils/api";
import {FormOutlined} from "@ant-design/icons";
import SubCategory from "../components/SubCategory";

const TopicList = props => {
    const [contentLoading, setContentLoading] = useState(true);
    const [subcategories, setSubcategories] = useState([])
    const [searchParams, setSearchParams] = useSearchParams();
    const id = searchParams.get("id")
    const [topics, setTopics] = useState([]);
    const [pages, setPages] = useState({
        currentPage: null,
        totalPages: null,
    });
    const location = useLocation();
    const isSubcategory = location.state && location.state.query === 'subcat';

    useEffect(() => {
        setContentLoading(true);
        if (isSubcategory) {
            api.get(`/subcategories/topics?id=${id}`)
                .then((result) => {
                    setTopics(result.data.topics);
                    setContentLoading(false);
                })
                .catch((e) => {
                    Modal.error({
                        title: 'An error occurred',
                        content: e.message,
                    });
                });
        } else {
            api.get(`/categories/topics?id=${id}`)
                .then(result => {
                    setSubcategories(result.data.subcategories)
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
        }
    }, [props.id, isSubcategory, setContentLoading]);

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
            <div className="category-container">
                {contentLoading ? (
                    <div>
                        <Skeleton active />
                        <Skeleton active />
                        <Skeleton active />
                    </div>
                ) : (
                    subcategories.map(subcategory => {
                        return (
                            <SubCategory data={subcategory} key={subcategory._id} />
                        );
                    })
                )}
            </div>
            <div>
                {contentLoading ? (
                    <div>
                        <Skeleton active />
                        <Skeleton active />
                        <Skeleton active />
                    </div>
                ) : (
                    topics.map(topic => {
                        return <span>{topic.title}</span>

                    })
                )}

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

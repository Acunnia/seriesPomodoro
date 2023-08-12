import React, {useContext, useEffect, useState} from 'react';
import {Link, useSearchParams, useLocation, useNavigate} from "react-router-dom";
import {Skeleton, Modal, Button, Pagination, Table, Typography } from "antd";
import api from "../utils/api";
import {BulbOutlined, FormOutlined} from "@ant-design/icons";
import SubCategory from "../components/SubCategory";
import {AuthContext} from "../utils/auth";
import './styles/Forum.styles.css'

const { Text } = Typography;

const TopicList = props => {
    const navigate = useNavigate()

    const { state } = useContext(AuthContext);

    const [ubication, setUbication] = useState("")
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

    useEffect(() => { // Initial Load
        setContentLoading(true);
        if (isSubcategory) {
            api.get(`/subcategories/topics?id=${id}`)
                .then((result) => {
                    setSubcategories([])
                    setTopics(result.data.topics);
                    setUbication(result.data.name) // Just initial
                    setContentLoading(false);
                    //todo: pagination
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
                    setUbication(result.data.name) // Just initial
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

        if (isSubcategory) {
            console.log("subcategory")
            api.get(`/subcategories/topics?id=${id}&page=${page}`)
                .then((result) => {
                    setSubcategories([])
                    setTopics(result.data.topics);
                    setUbication(result.data.name)
                    setContentLoading(false);
                })
                .catch((e) => {
                    Modal.error({
                        title: 'An error occurred',
                        content: e.message,
                    });
                });
        } else {
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
        }


    };

    const columns = [
        {
            title: 'Topic',
            dataIndex: 'title',
            key: 'title',
            render: (text, topic) => (
                <div>
                    <Text strong style={{ fontSize: '18px' }}>
                        {topic.title + "  -  "}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                         {topic.description}
                    </Text>
                </div>
            ),
        },
        {
            title: 'Posts',
            dataIndex: 'replies',
            render: (replies) => replies.length,
        },
        {
            title: 'Last Update',
            dataIndex: 'lastreply.postDate',
            key: 'lastreply.postDate',
            render: (text, topic) => {
                const postDate = new Date(topic.lastreply.postDate);
                return (
                    <span>
            {`${postDate.toLocaleTimeString()} ${postDate.toLocaleDateString()}`}
          </span>
                );
            },
        },
    ];

    function rowClick() {
        console.log("awdas")
    }

    return (
        <div>
            {contentLoading ? (
                <div>
                    <Skeleton active />
                </div>
            ) : (
                <div>
                    <span>Now on: {ubication}</span>
                </div>
            )}
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
                <Table
                    columns={columns}
                    dataSource={topics}
                    rowKey={(topic) => topic._id}
                    pagination={false}
                    loading={contentLoading}
                    onRow={(topic) => ({
                        onClick: () => navigate(`/topic?id=${topic._id}`)
                    })}
                    className="hoverable-table"
                />
                <Pagination
                    current={pages.currentPage}
                    total={pages.totalPages}
                    showSizeChanger={false}
                    onChange={fetchPage}
                />

                <Link
                    to={`/newsubcat?id=${id}`}
                    className={"NewTopic"}
                >
                    <Button type="primary" icon={<FormOutlined />}>
                        Create new subcategory
                    </Button>
                </Link>


            </div>
        </div>
    );
};

export default TopicList;

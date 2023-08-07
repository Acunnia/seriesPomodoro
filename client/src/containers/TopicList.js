import React, {useContext, useEffect, useState} from 'react';
import {Link, useSearchParams, useLocation, useNavigate} from "react-router-dom";
import {Col, Skeleton, Modal, Button, Pagination} from "antd";
import api from "../utils/api";
import {BulbOutlined, FormOutlined} from "@ant-design/icons";
import SubCategory from "../components/SubCategory";
import {AuthContext} from "../utils/auth";

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
                    console.log(result)
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
                <table>
                    <thead>
                        <tr>
                            <th>
                                <BulbOutlined /> Topic
                            </th>
                            <th>
                                Posts
                            </th>
                            <th>
                                Last update
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td colSpan="3">
                            <div>
                                {!contentLoading && topics.length > 0 && pages.totalPages > 0 && (
                                    <Pagination
                                        defaultCurrent={pages.currentPage}
                                        total={pages.totalPages}
                                        showSizeChanger={false}
                                        onChange={fetchPage}
                                    />
                                )}
                                {state.isAuthenticated && (
                                    <Link
                                        to={`/newtopic?id=${id}`}
                                    >
                                        <Button type="primary" icon={<FormOutlined />}>
                                            Create new topic
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </td>
                    </tr>
                    {contentLoading ? (
                        <div>
                            <Skeleton active />
                            <Skeleton active />
                            <Skeleton active />
                        </div>
                    ) : (
                        topics.map(topic => {
                            return (
                                <tr key={topic._id}>
                                    <td>
                                        <div>
                                            <Link to={`/topic?id=${topic._id}`}>
                                                <h3>
                                                    {topic.title}
                                                </h3>
                                                <p>
                                                    {topic.description}
                                                </p>
                                            </Link>
                                        </div>
                                    </td>
                                    <td>{topic.replies.length}</td>
                                    <td>{`${String(new Date(topic.lastreply.postDate).getHours()).padStart(2, '0')}:${String(new Date(topic.lastreply.postDate).getMinutes()).padStart(2, '0')} ${String(new Date(topic.lastreply.postDate).getDate()).padStart(2, '0')}/${String(new Date(topic.lastreply.postDate).getMonth() + 1).padStart(2, '0')}/${new Date(topic.lastreply.postDate).getFullYear()}`}</td>

                                </tr>
                            )
                        })
                    )}
                    </tbody>
                </table>

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

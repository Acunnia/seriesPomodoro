import {Card, Divider, Input, message, Modal, Typography, Skeleton, Pagination} from "antd";
import {useContext, useEffect, useState} from "react";
import {useSearchParams, useNavigate} from "react-router-dom";
import {AuthContext} from "../utils/auth";
import api from "../utils/api";
import Meta from "antd/es/card/Meta";
import Reply from "../components/Reply";
import CommentForm from "../components/commentForm";

const Topic = props => {
    const navigate = useNavigate();
    const [ contentLoading, setContentLoading ] = useState(true);
    const [ pageLoading, setPageLoading ] = useState(false);
    const [ userLogued, setUserLogued ] = useState(false)
    const [ topic, setTopic ] = useState(null);
    const [ searchParams, setSearchParams ] = useSearchParams();
    const id = searchParams.get("id")
    const currentPage = searchParams.get("page")
    const { state } = useContext(AuthContext);
    const [pages, setPages] = useState({
        currentPage,
        totalPages: 1,
    });

    useEffect(() => {
        if (state.user) {
            setUserLogued(state)
        }
        api.get(`/topics?id=${id}`).then(result => {
            setTopic(result.data.topic)
            setPages({
                currentPage: result.data.page,
                totalPages: result.data.totalPages,
            })
            setContentLoading(false)
        }).catch(err => {
            Modal.error({
                title: 'An error ocurred',
                content: err.message,
            })
        })
        

    }, [id, state])

    const fetchPage = page => {
        setPageLoading(true);
    
        api.get(`/topics?id=${id}&page=${page}`)
          .then(result => {
            setTopic(result.data.topic);
            setPages({
              currentPage: result.data.page,
              totalPages: result.data.totalPages,
            });
            setPageLoading(false);
            navigate(`/topic?id=${id}&page=${page}`);
          })
          .catch(e => {
            Modal.error({
              title: 'An error occurred',
              content: e.message,
            });
          });
      };


    function handleNewReply(commentData) {
        setContentLoading(true);
        api.post('/reply/add', {message: commentData.comment, topicId:id }, {
            headers: {
                'Authorization': `Bearer ${state.token}`,
                'Content-Type': 'application/json'
            }}).then(result => {
                setContentLoading(false);
                message.success("Posted!")
                const newTotalPages = result.data.topicTotalPages;
                if (newTotalPages == pages.currentPage) {
                    const newReply = result.data.resReply;
                    setTopic(prevTopic => ({
                        ...prevTopic,
                        replies: [...prevTopic.replies, newReply],
                    }));
                } else {
                    fetchPage(newTotalPages)
                    navigate(`/topic?id=${id}&page=${newTotalPages}`);
                }

            }).catch(err => {
                message.error('Something went wrong');
            })
    }

    const pagination = (
        <div>
          <Pagination
            current={parseInt(pages.currentPage, 10)}
            total={parseInt(pages.totalPages, 10) * 10}
            showSizeChanger={false}
            onChange={fetchPage}
          />
          <Divider />
        </div>
      );

    return (
        <div>
            {contentLoading ? (
                <div>
                    <Skeleton  active avatar />
                    <Skeleton  active avatar />
                    <Skeleton  active avatar />
                    <Skeleton  active avatar />
                    <Skeleton  active avatar />
              </div>
            ) : (
                <>
                    <Card>
                        <Meta
                            title={topic.title}
                            description={topic.description}
                        />
                        <p>Created by: {topic.author.username}</p>
                    </Card>
                    <Divider />
                    {pages.totalPages > 1 && pagination}
                        {topic.replies.length > 0 ? (
                            topic.replies.map((reply) => (
                                <div key={reply._id}>
                                    <Reply postData={reply} />
                                </div>
                            )
                            )
                        
                            ) : (
                            <p>No replies yet. Be the first</p>
                        )}
                        <Divider />
                    {pages.totalPages > 1 && pagination}
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

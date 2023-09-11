import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  message as antMessage,
  Card,
  Avatar,
  Row,
  Col,
  Typography,
  Space,
  Popconfirm,
} from "antd";
import { HeartTwoTone, DeleteOutlined } from "@ant-design/icons";
import api from "../utils/api";
import { AuthContext } from "../utils/auth";

const { Text } = Typography;

const Reply = ({ postData, minimal }) => {
  const { _id, author, postDate, message, likedBy, isDeleted } = postData;
  const [deleted, setDeleted] = useState(isDeleted);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(likedBy.length);
  const [isReducedMode, setIsReducedMode] = useState(minimal);
  const { state } = useContext(AuthContext);

  useEffect(() => {
    if (state.user) {
      setLiked(likedBy.includes(state.user.id));
    }
  }, [likedBy]);

  function handleLikeClick() {
    api
      .post(
        "/reply/like",
        { id: _id },
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          if (!liked) {
            setLikes(likes + 1);
          } else {
            setLikes(likes - 1);
          }
          setLiked(!liked);
        }
      })
      .catch((error) => {
        if (error.response.status == "401") {
          antMessage.error("You need to log in before like this reply!");
        } else {
          antMessage.error("Unexpected error");
          console.error("Error liking reply:", error);
        }
      });
  }

  function handleDeleteClick() {
    api
      .delete(`/reply/${_id}`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setDeleted(true);
          antMessage.success("Reply deleted successfully");
        }
      })
      .catch((error) => {
        antMessage.error("Error deleting reply");
        console.error("Error deleting reply:", error);
      });
  }

  const canDelete =
    state.user && (state.admin_level > 1 || state.user.id === author._id);

  return (
    <Card>
      {deleted ? (
        <div
          style={{ fontStyle: "italic", color: "#888", textAlign: "center" }}
        >
          This reply has been deleted.
        </div>
      ) : (
        <>
          {!isReducedMode ? (
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Space align="center">
                  <Link to={`/profile/${author.username}`}>
                    <Avatar>{author.username[0].toUpperCase()}</Avatar>
                    <Text strong>{author.username}</Text>
                  </Link>
                </Space>
              </Col>
              <Col span={12}>
                <Text>{message}</Text>
              </Col>
              <Col span={6}>
                <Space direction="vertical" align="end">
                  <div>
                    <HeartTwoTone
                      twoToneColor={liked ? "#eb2f96" : "#151515"}
                      onClick={handleLikeClick}
                      style={{
                        cursor: "pointer",
                      }}
                    />{" "}
                    {likes} Likes
                  </div>
                  <div>{`${String(new Date(postDate).getHours()).padStart(
                    2,
                    "0"
                  )}:${String(new Date(postDate).getMinutes()).padStart(
                    2,
                    "0"
                  )} ${String(new Date(postDate).getDate()).padStart(
                    2,
                    "0"
                  )}/${String(new Date(postDate).getMonth() + 1).padStart(
                    2,
                    "0"
                  )}/${new Date(postDate).getFullYear()}`}</div>
                  {canDelete && (
                    <Popconfirm
                      title="Are you sure you want to delete this reply?"
                      onConfirm={handleDeleteClick}
                      okText="Yes"
                      cancelText="No"
                      placement="topRight"
                    >
                      <DeleteOutlined
                        style={{
                          cursor: "pointer",
                          color: "red",
                        }}
                      />
                    </Popconfirm>
                  )}
                </Space>
              </Col>
            </Row>
          ) : (
            <Space
              align="center"
              wrap={true}
              style={{ width: "100%", justifyContent: "space-around" }}
            >
              <div>
                <Avatar>{author.username[0].toUpperCase()}</Avatar>
                <Text strong>{author.username}</Text>
              </div>

              <Text>{message}</Text>
              <div>
                <div>{`${String(new Date(postDate).getHours()).padStart(
                  2,
                  "0"
                )}:${String(new Date(postDate).getMinutes()).padStart(
                  2,
                  "0"
                )} ${String(new Date(postDate).getDate()).padStart(
                  2,
                  "0"
                )}/${String(new Date(postDate).getMonth() + 1).padStart(
                  2,
                  "0"
                )}/${new Date(postDate).getFullYear()}`}</div>
                <HeartTwoTone
                  twoToneColor={liked ? "#eb2f96" : "#151515"}
                  onClick={handleLikeClick}
                  style={{
                    cursor: "pointer",
                  }}
                />
                {likes} Likes
                {canDelete && (
                  <Popconfirm
                    title="Are you sure you want to delete this reply?"
                    onConfirm={handleDeleteClick}
                    okText="Yes"
                    cancelText="No"
                    placement="topRight"
                  >
                    {" / "}
                    <DeleteOutlined
                      style={{
                        cursor: "pointer",
                        color: "red",
                      }}
                    />
                  </Popconfirm>
                )}
              </div>
            </Space>
          )}
        </>
      )}
    </Card>
  );
};

export default Reply;

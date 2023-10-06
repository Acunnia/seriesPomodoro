import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Skeleton } from "antd";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import {
  MessageOutlined,
  UserAddOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import Reply from "../../components/Reply";
import Page from "../../components/Page/Page";

// antd
const { Title } = Typography;

const Activity = (props) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/stats/activity").then((result) => {
      setActivities(result.data.activities);
      setLoading(false);
    });
  }, []);

  const activityDivStyle = {
    borderLeft: "2px solid #40a9ff",
    padding: "10px 15px",
    paddingRight: "0",
    width: "100%",
  };

  const infoStyle = {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "16px",
  };

  const postInfoStyle = {
    marginBottom: "20px",
  };

  const dateStyle = {
    color: "#bfbfbf",
  };

  const iconStyle = {
    marginRight: "5px",
  };

  const activitiesMapper = (activity) => {
    switch (activity.type) {
      case "user":
        return (
          <div style={activityDivStyle} key={activity._id}>
            <div style={infoStyle}>
              <span>
                <UserAddOutlined style={iconStyle} />
                Let's welcome our newest user,{" "}
                <Link to={`/profile/${activity.username}`}>
                  {activity.username}
                </Link>
              </span>
            </div>
          </div>
        );
      case "topic":
        return (
          <div style={activityDivStyle} key={activity._id}>
            <div style={infoStyle}>
              <span>
                <CommentOutlined style={iconStyle} />
                <Link to={`/profile/${activity.author.username}`}>
                  {activity.author.username}
                </Link>{" "}
                created a new topic:{" "}
                <Link to={`/topic?id=${activity._id}`}>{activity.title}</Link>{" "}
                in{" "}
                <Link
                  to={`/category?id=${activity.category._id}`}
                  state={{
                    query: "subcat",
                    id: activity._id,
                    name: activity.name,
                    description: activity.description,
                  }}
                >
                  {activity.category.name}
                </Link>
              </span>
            </div>
          </div>
        );
      case "reply":
        return (
          <div style={activityDivStyle} key={activity._id}>
            <div style={postInfoStyle}>
              <span>
                <MessageOutlined style={iconStyle} />
                <Link to={`/profile/${activity.author.username}`}>
                  {activity.author.username}
                </Link>{" "}
                posted a reply in the topic{" "}
                <Link to={`/topic?id=${activity.topic._id}`}>
                  {activity.topic.title}
                </Link>
              </span>
            </div>
            <Reply minimal postData={activity} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Page>
      <div>
        <Row>
          <Title style={{ margin: "60px 0", color: "white" }}>
            Recent activity
          </Title>
        </Row>
        <Row>
          <Col style={{ width: "100%" }}>
            <div
              style={{
                borderRadius: "3px",
                boxShadow: "0 0 10px #00276617",
                margin: "auto",
                padding: "40px",
              }}
            >
              {loading ? (
                <>
                  <Skeleton active />
                  <Skeleton active />
                  <Skeleton active />
                  <Skeleton active />
                  <Skeleton active />
                </>
              ) : (
                activities.map(activitiesMapper)
              )}
            </div>
          </Col>
        </Row>
      </div>
    </Page>
  );
};

export default Activity;

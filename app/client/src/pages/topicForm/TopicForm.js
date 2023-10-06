import React, { useState, useEffect, useContext } from "react";
import {
  Row,
  Col,
  Typography,
  Form,
  Input,
  Button,
  Modal,
  Spin,
  Card,
} from "antd";
import { CommentOutlined } from "@ant-design/icons";
import api from "../../utils/api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../../utils/auth";

const { Title, Text } = Typography;
const { TextArea } = Input;

const TopicForm = (props) => {
  const [loading, setLoading] = useState(false);
  const [subcategory, setSubcategory] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { state } = useContext(AuthContext);
  const catID = searchParams.get("id");

  useEffect(() => {
    api.get(`/subcategories/info?id=${catID}`).then((result) => {
      setSubcategory(result.data);
    });
  }, []);

  const onSubmit = (data) => {
    setLoading(true);

    const topicData = {
      ...data,
      author: state.user.id,
      subcategory: catID,
    };

    api
      .post("/topics/create", topicData, {
        headers: {
          Authorization: `Bearer ${state.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((result) => {
        navigate(`/topic?id=${result.data.topic._id}`);
      })
      .catch((e) => {
        setLoading(false);
        Modal.error({
          title: "Failed to post a new topic",
          content: e.message,
        });
      });
  };

  const redirectToCategory = () => {
    navigate(`/category?id=${catID}`, {
      state: {
        query: "subcat",
      },
    });
  };

  return (
    <Row justify="center" align="middle" style={{ "margin-top": "100px" }}>
      <Col span={8}>
        <Card
          style={{
            padding: "24px",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            background: "#333",
            color: "#fff",
          }}
        >
          <Title level={3}>New topic</Title>
          <Text>
            Posteando en{" "}
            <span
              onClick={() => {
                navigate(`/category?id=${catID}`, {
                  state: {
                    query: "subcat",
                  },
                });
              }}
              style={{
                cursor: "pointer",
                color: "blue",
                textDecoration: "underline",
              }}
            >
              {subcategory ? (
                subcategory.name
              ) : (
                <Spin size="small" style={{ marginLeft: "5px" }} />
              )}
            </span>
          </Text>
          <Form name="login" onFinish={onSubmit} style={{ marginTop: "40px" }}>
            <Form.Item
              name="title"
              rules={[
                {
                  required: true,
                  message: "The title must be at least 5 characters long",
                  min: 5,
                },
              ]}
            >
              <Input placeholder="Title" disabled={loading} />
            </Form.Item>
            <Form.Item name="description">
              <Input
                placeholder="Subtitle/Description (optional)"
                disabled={loading}
              />
            </Form.Item>
            <Form.Item
              name="message"
              rules={[
                {
                  required: true,
                  message:
                    "The message of the topic must be at least 5 characters long",
                  min: 5,
                },
              ]}
            >
              <TextArea placeholder="Message" rows={8} disabled={loading} />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                icon={<CommentOutlined />}
                disabled={loading}
              >
                Create new topic
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default TopicForm;

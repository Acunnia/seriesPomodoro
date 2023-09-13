import React, { useContext, useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Skeleton,
  Modal,
  Button,
  Pagination,
  Table,
  Typography,
  Divider,
  Tooltip,
} from "antd";
import api from "../../utils/api";
import {
  FormOutlined,
  CloseCircleOutlined,
  PushpinOutlined,
} from "@ant-design/icons";
import SubCategory from "../../components/SubCategory/SubCategory";
import { AuthContext } from "../../utils/auth";
import Page from "../../components/Page/Page";
import styles from "./TopicList.module.css";
import Category from "../../components/Category/Category";

const { Text } = Typography;

const TopicList = (props) => {
  const navigate = useNavigate();

  const [ubication, setUbication] = useState("");
  const [contentLoading, setContentLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [subcategories, setSubcategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id");
  const currentPage = searchParams.get("page");
  const [topics, setTopics] = useState([]);
  const [pages, setPages] = useState({
    currentPage,
    totalPages: 1,
  });

  const location = useLocation();
  const isSubcategory = location.state && location.state.query === "subcat";

  useEffect(() => {
    // Initial Load
    setContentLoading(true);
    if (isSubcategory) {
      api
        .get(`/subcategories/topics?id=${id}`)
        .then((result) => {
          console.log(result.data);
          setSubcategories([]);
          setTopics(result.data.topics);
          setUbication(result.data.name);
          setPages({
            currentPage: result.data.page,
            totalPages: result.data.totalPages,
          });
          setContentLoading(false);
        })
        .catch((e) => {
          Modal.error({
            title: "An error occurred",
            content: e.message,
          });
        });
    } else {
      api
        .get(`/categories/topics?id=${id}`)
        .then((result) => {
          console.log(result.data);
          setSubcategories(result.data.subcategories);
          setTopics(result.data.topics);
          setUbication(result.data.name);
          setPages({
            currentPage: result.data.page,
            totalPages: result.data.totalPages,
          });
          setContentLoading(false);
        })
        .catch((e) => {
          Modal.error({
            title: "An error occurred",
            content: e.message,
          });
        });
    }
  }, [id]);

  const fetchPage = (page) => {
    setPageLoading(true);

    if (isSubcategory) {
      api
        .get(`/subcategories/topics?id=${id}&page=${page}`)
        .then((result) => {
          console.log(result.data);
          setSubcategories([]);
          setTopics(result.data.topics);
          setUbication(result.data.name);
          setPages({
            currentPage: result.data.page,
            totalPages: result.data.totalPages,
          });
          setPageLoading(false);
          navigate(`/category?id=${id}&page=${page}`, {
            state: {
              query: "subcat",
            },
          });
        })
        .catch((e) => {
          Modal.error({
            title: "An error occurred",
            content: e.message,
          });
        });
    } else {
      api
        .get(`/categories/topics?id=${id}&page=${page}`)
        .then((result) => {
          console.log(result.data);
          setTopics(result.data.topics);
          setPages({
            currentPage: result.data.page,
            totalPages: result.data.totalPages,
          });
          setPageLoading(false);
          navigate(`/category?id=${id}&page=${page}`);
        })
        .catch((e) => {
          Modal.error({
            title: "An error occurred",
            content: e.message,
          });
        });
    }
  };

  const pagination = (
    <div>
      <Divider />
      <Pagination
        current={parseInt(pages.currentPage, 10)}
        total={parseInt(pages.totalPages, 10) * 10}
        showSizeChanger={false}
        onChange={fetchPage}
      />
    </div>
  );

  const columns = [
    {
      title: "Status",
      key: "status",
      render: (_, topic) => (
        <div>
          {topic.isClosed ? (
            <Tooltip title="Closed">
              <CloseCircleOutlined style={{ color: "red", marginRight: 8 }} />
            </Tooltip>
          ) : null}
          {topic.isPinned ? (
            <Tooltip title="Pinned">
              <PushpinOutlined style={{ color: "blue" }} />
            </Tooltip>
          ) : null}
        </div>
      ),
    },
    {
      title: "Topic",
      dataIndex: "title",
      key: "title",
      render: (text, topic) => (
        <div>
          <Text strong style={{ fontSize: "18px" }}>
            {topic.title + "  -  "}
          </Text>
          <Text type="secondary" style={{ fontSize: "14px" }}>
            {topic.description}
          </Text>
        </div>
      ),
    },
    {
      title: "Posts",
      dataIndex: "replies",
      render: (replies) => replies.length,
    },
    {
      title: "Last Update",
      dataIndex: "lastreply.postDate",
      key: "lastreply.postDate",
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

  return (
    <Page>
      <div className={styles.CategoryMain}>
        {contentLoading ? (
          <div>
            <Skeleton active />
          </div>
        ) : (
          <div>
            <span>Now on: {ubication}</span>
          </div>
        )}
        <div className={styles.TopicListContainers}>
          {contentLoading ? (
            <div>
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
            </div>
          ) : (
            subcategories.map((subcategory) => {
              return <SubCategory data={subcategory} key={subcategory._id} />;
            })
          )}
        </div>
        <div>
          {isSubcategory && (
            <Link to={`/newtopic?id=${id}`} className={"NewTopic"}>
              <Button type="primary" icon={<FormOutlined />}>
                Create new topic
              </Button>
            </Link>
          )}

          {pages.totalPages > 1 && pagination}
          <Divider />
          <Table
            columns={columns}
            dataSource={topics}
            rowKey={(topic) => topic._id}
            pagination={false}
            loading={contentLoading}
            onRow={(topic) => ({
              onClick: () => navigate(`/topic?id=${topic._id}`),
            })}
            className={styles.HoverableTable}
          />
          {pages.totalPages > 1 && pagination}
          {pages.totalPages > 1 && <Divider />}
        </div>
      </div>
    </Page>
  );
};

export default TopicList;

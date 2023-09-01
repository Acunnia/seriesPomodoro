import React, { useEffect, useState } from 'react';
import { Row, Col, Typography, Skeleton } from 'antd';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import {
  MessageOutlined,
  UserAddOutlined,
  CommentOutlined,
} from '@ant-design/icons';
import Reply from '../components/Reply';

// antd
const { Title } = Typography;

const Activity = props => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/stats/activity').then(result => {
      console.log(result.data.activities);
      setActivities(result.data.activities);
      setLoading(false);
    });
  }, []);

  const activitiesMapper = activity => {
    switch (activity.type) {
      case 'user':
        return (
          <div key={activity._id}>
            <div>
              <span>
                <UserAddOutlined />
                Let's welcome our newest user,{' '}
                <Link to="/">{activity.username}</Link>
              </span>
            </div>
          </div>
        );
      case 'topic':
        return (
          <div key={activity._id}>
            <div>
              <span>
                <CommentOutlined />
                <Link to="/">{activity.author.username}</Link> created a new
                topic:{' '}
                <Link to={`/topic?id=${activity._id}`} >
                  {activity.title}
                </Link>{' '}
                in{' '}
                <Link to={`/category?id=${activity.category._id}`} state={{query: "subcat",id: activity._id,name: activity.name,description: activity.description}}>
                  {activity.category.name}
                </Link>
              </span>
            </div>
          </div>
        );
      case 'reply':
        return (
          <div key={activity._id}>
            <div>
              <span>
                <MessageOutlined />
                <Link to="/">{activity.author.username}</Link> posted a reply in
                the topic{' '}
                <Link to={`/topic?id=${activity.topic._id}`}>
                  {activity.topic.title}
                </Link>
              </span>
            </div>
            <Reply postData={activity} minimal notimestamp />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Row>
        <Title style={{ margin: '60px 0', color: 'white' }}>
          Recent activity
        </Title>
      </Row>
      <Row>
        <Col span={18}>
          <div>
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
  );
};

export default Activity;
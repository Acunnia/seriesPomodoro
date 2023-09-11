import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Card, Avatar, Row, Col, Button, message as antMessage } from "antd";
import { UserOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { AuthContext } from "../../utils/auth";
import api from "../../utils/api";
import Page from "../../components/Page/Page";
import styles from "./Profile.module.css";

const UserPublicProfile = () => {
  const { name } = useParams();
  const { state } = useContext(AuthContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get(`/users/search/${name}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [name]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleBanUser = () => {
    api
      .delete(`/users/${user._id}`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          antMessage.success("Reply deleted successfully");
        }
      })
      .catch((error) => {
        antMessage.error("Error deleting reply");
        console.error("Error deleting reply:", error);
      });
  };

  return (
    <Page>
      <div className={styles.user_profile_card}>
        <Card
          title={
            <h2>
              <strong>{user.username}</strong>
            </h2>
          }
          bordered={false}
        >
          {user ? (
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <div className="profile-avatar">
                  <Avatar size={120} icon={<UserOutlined />} />
                </div>
              </Col>
              <Col xs={24} sm={12} md={16}>
                <div className="profile-details">
                  <p>
                    <strong>Biografía:</strong> {user.bio || "Nothing yet..."}
                  </p>
                  <p>
                    <strong>Fecha de registro:</strong>{" "}
                    {new Date(user.registerDate).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p>
                    <strong>Cantidad de respuestas:</strong> {user.numReplies}
                  </p>
                  <p>
                    <strong>Cantidad de temas:</strong> {user.numTopics}
                  </p>
                </div>
                <div className="edit-profile-button">
                  <Button icon={<EditOutlined />} type="primary">
                    Editar Perfil
                  </Button>
                  <Button
                    icon={<DeleteOutlined />}
                    danger
                    onClick={handleBanUser}
                  >
                    Banear Usuario
                  </Button>
                </div>
              </Col>
            </Row>
          ) : (
            <p>Cargando...</p>
          )}
        </Card>
      </div>
    </Page>
  );
};

export default UserPublicProfile;

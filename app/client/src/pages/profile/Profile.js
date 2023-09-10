import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Avatar, Row, Col, Button } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { AuthContext } from '../../utils/auth';
import api from '../../utils/api';

const UserPublicProfile = () => {
    const { name } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        api.get(`/users/search/${name}`)
            .then(response => {
                setUser(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [name]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <Card
            title= {<h2><strong>{user.username}</strong></h2>}
            bordered={false}
            className="user-profile-card"
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
                            <p><strong>Biografía:</strong> {user.bio || 'Nothing yet...'}</p>
                            <p><strong>Fecha de registro:</strong> {new Date(user.registerDate).toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p><strong>Cantidad de respuestas:</strong> {user.numReplies}</p>
                            <p><strong>Cantidad de temas:</strong> {user.numTopics}</p>
                        </div>
                        <div className="edit-profile-button">
                            <Button icon={<EditOutlined />} type="primary">Editar Perfil</Button>
                        </div>
                    </Col>
                </Row>
            ) : (
                <p>Cargando...</p>
            )}
        </Card>
    );
};

export default UserPublicProfile;

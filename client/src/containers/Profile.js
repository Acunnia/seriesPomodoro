import React, { useState, useEffect, useContext } from 'react';
import { Card, Avatar, Row, Col, Button } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { AuthContext } from '../utils/auth';

const UserPublicProfile = () => {
    const { state } = useContext(AuthContext);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (state.user) {
            setUser(state.user);
        }
    }, [state]);

    return (
        <Card
            title="Perfil de Usuario"
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
                            <p><strong>Nombre de usuario:</strong> {user.username}</p>
                            <p><strong>Correo electrónico:</strong> {user.email}</p>
                            <p><strong>Biografía:</strong> {user.bio || 'No hay biografía disponible.'}</p>
                            <p><strong>Fecha de registro:</strong> {new Date(user.registerDate).toLocaleDateString("es-ES", { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            <p><strong>Cantidad de respuestas:</strong> {user.replies ? user.replies.length : 0}</p>
                            <p><strong>Cantidad de temas:</strong> {user.topics ? user.topics.length : 0}</p>
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

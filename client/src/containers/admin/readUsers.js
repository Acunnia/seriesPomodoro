import React, {useContext, useEffect, useState} from 'react';
import {Button, Modal, Space, Table} from "antd";
import api from "../../utils/api";
import {AuthContext} from "../../utils/auth";

export default function Readusers() {
    const { state } = useContext(AuthContext);
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        setLoading(true)
        api.get("/users", {
            headers: {
                'Authorization': `Bearer ${state.token}`,
                'Content-Type': 'application/json'
            },})
            .then((response) => {
                setUsers(response.data.users);
            })
            .catch((error) => {
            }).finally(() => setLoading(false));
    };

    const onDelete = (id) => {
        //TODO: Modal de confirmacion de eliminacion
        api.delete(`/users/delete/${id}`, {
            headers: {
                'Authorization': `Bearer ${state.token}`,
                'Content-Type': 'application/json'
            },
        }).then(r => {
            fetchUsers();
        }).catch(error => {// ToDo: Mensaje de error
            console.error('Error al eliminar la categoría:', error);
        });
    };

    const handleEdit = (data) => {
        setSelectedUser(data);
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSelectedUser(null);
    };

    const handleSave = (data) => {
        setIsModalVisible(false);
        setSelectedUser(null);
        
        api.put(`/users/edit/${data._id}`, {
            name: data.name,
            description: data.description,
            image: data.image
        })
            .then((response) => {
                fetchUsers();
            })
            .catch((error) => {
                console.error("Create error:", error);
            })
    };
    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            key: 'role',
            dataIndex: 'role',
            render: role => <span>{role.name}</span>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, user) => (
                <Space size="middle">
                    <button onClick={() => handleEdit(user)}>Edit {user.username}</button>
                    <button onClick={() => onDelete(user._id)}>Delete</button>
                </Space>
            ),
        },
    ];



    return (
        <div>
            <Table columns={columns} rowKey={(user) => user._id} dataSource={users}></Table>        
        </div>
    );
}
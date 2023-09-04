import React, {useContext, useEffect, useState} from 'react';
import {Button, Modal, Space, Table} from "antd";
import api from "../../utils/api";
import  RoleForm from "./RoleForm"
import {AuthContext} from "../../utils/auth";


export default function ReadRoles() {
    const { state } = useContext(AuthContext);
    const [loading, setLoading] = useState(false)
    const [roles, setRoles] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);


    const [mode, setMode] = useState("create")

    useEffect(() => {
        fetchRoles();
    }, []);

    const fetchRoles = () => {
        setLoading(true)
        api.get("/roles")
            .then((response) => {
                console.log(response)
                setRoles(response.data.roles);
            })
            .catch((error) => {
            }).finally(() => setLoading(false));
    };

    const onDelete = (id) => {
        //TODO: Modal de confirmacion de eliminacion
        api.delete(`/roles/delete/${id}`, {
            headers: {
                'Authorization': `Bearer ${state.token}`,
                'Content-Type': 'application/json'
            },
        }).then(r => {
            fetchRoles();
        }).catch(error => {// ToDo: Mensaje de error
            console.error('Error al eliminar la categoría:', error);
        });
    };

    const handleEdit = (data) => {
        setMode("edit")
        setSelectedRole(data);
        setIsModalVisible(true);
    };

    const handleCreate = () => {
        setMode("create")
        setSelectedRole(null);
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSelectedRole({});
    };

    const handleSave = (data) => {
        setIsModalVisible(false);
        setSelectedRole(null);
        if (mode === "create") {
            api.post("/role/create", {
                name: data.name,
                description: data.description,
                image: data.image
            })
                .then((response) => {
                    fetchRoles();
                })
                .catch((error) => {
                    console.error("Create error:", error);
                })
        } else {
            api.put(`/roles/edit/${data._id}`, {
                name: data.name,
                description: data.description,
                image: data.image
            })
                .then((response) => {
                    fetchRoles();
                })
                .catch((error) => {
                    console.error("Create error:", error);
                })
        }

    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name'
        },
        {
            title: 'Admin Level',
            dataIndex: 'admin_level',
            key: 'admin_level',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, role) => (
                <Space size="middle">
                    <button onClick={() => handleEdit(role)}>Edit {role.name}</button>
                    <button onClick={() => onDelete(role._id)}>Delete</button>
                </Space>
            ),
        },
    ];



    return (
        <div>
            <Button type="primary" onClick={handleCreate}>Create Role</Button>
            <Table columns={columns} dataSource={roles}></Table>

            <Modal
                title={selectedRole ? 'Edit Role' : 'Create Role'}
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}>
                <RoleForm roletoEdit={selectedRole} onSave={handleSave}  />
            </Modal>
        </div>
    );
}
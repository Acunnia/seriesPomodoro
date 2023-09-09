import React, { useContext, useEffect, useState } from "react";
import { Button, Modal, Space, Table } from "antd";
import api from "../../utils/api";
import { AuthContext } from "../../utils/auth";
import UserForm from "./userForm";

export default function Readusers() {
  const { state } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    api
      .get("/users", {
        headers: {
          Authorization: `Bearer ${state.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log(response.data);
        setRoles(response.data.response.roles);
        setUsers(response.data.response.users);
      })
      .catch((error) => {})
      .finally(() => setLoading(false));
  };

  const onDelete = (id) => {
    //TODO: Modal de confirmacion de eliminacion
    api
      .delete(`/users/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((r) => {
        fetchUsers();
      })
      .catch((error) => {
        // ToDo: Mensaje de error
        console.error("Error al eliminar la categoría:", error);
      });
  };

  const handleEdit = (data) => {
    setSelectedUser(data);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedUser({});
  };

  const handleSave = (data) => {
    setIsModalVisible(false);
    setSelectedUser(null);

    console.log(data);

    api
      .put(
        `/users/edit/${data._id}`,
        {
          username: data.username,
          email: data.email,
          role: data.roleId,
        },
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        fetchUsers();
      })
      .catch((error) => {
        console.error("Create error:", error);
      });
  };
  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      key: "role",
      dataIndex: "role",
      render: (role) => <span>{role.name}</span>,
    },
    {
      title: "Action",
      key: "action",
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
      <Table
        columns={columns}
        rowKey={(user) => user._id}
        dataSource={users}
      ></Table>

      <Modal
        title="Edit Category"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <UserForm user={selectedUser} onSave={handleSave} roles={roles} />
      </Modal>
    </div>
  );
}

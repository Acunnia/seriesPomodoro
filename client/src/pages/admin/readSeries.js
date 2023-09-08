import React, { useContext, useEffect, useState } from "react";
import { Button, Modal, Space, Table, Alert } from "antd";
import api from "../../utils/api";
import RoleForm from "./RoleForm";
import { AuthContext } from "../../utils/auth";
import SerieForm from "./serieForm";
import TWITCH from "../../utils/clientConfig";

export default function ReadSeries() {
  const { state } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [series, setSeries] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSerie, setSelectedSerie] = useState(null);
  const [accessToken, setAccessToken] = useState("");

  const [mode, setMode] = useState("create");

  useEffect(() => {
    fetchSeries();
  }, []);

  const obtenerAccessToken = async () => {
    try {
      const response = await fetch("https://id.twitch.tv/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `client_id=${TWITCH.client}&client_secret=${TWITCH.secret}&grant_type=client_credentials`,
      });

      const data = await response.json();
      if (data.access_token) {
        setAccessToken(data.access_token); // Guarda el token de acceso en el estado
      } else {
        console.error("No se pudo obtener el token de acceso.");
      }
    } catch (error) {
      console.error("Error al obtener el token de acceso:", error);
    }
  };

  function searchUser(nick) {
    console.log("Buscando.... ", nick);
  }

  const fetchSeries = () => {
    setLoading(true);
    api
      .get("/series")
      .then((response) => {
        console.log(response);
        setSeries(response.data.roles);
      })
      .catch((error) => {})
      .finally(() => setLoading(false));
  };

  const onDelete = (id) => {
    //TODO: Modal de confirmacion de eliminacion
    api
      .delete(`/series/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
          "Content-Type": "application/json",
        },
      })
      .then((r) => {
        fetchSeries();
      })
      .catch((error) => {
        // ToDo: Mensaje de error
        console.error("Error al eliminar la serie:", error);
      });
  };

  const handleEdit = (data) => {
    setMode("edit");
    setSelectedSerie(data);
    setIsModalVisible(true);
  };

  const handleCreate = () => {
    setMode("create");
    setSelectedSerie(null);
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedSerie({});
  };

  const handleSave = (data) => {
    setIsModalVisible(false);
    setSelectedSerie(null);
    if (mode === "create") {
      api
        .post("/series/create", {
          name: data.name,
          description: data.description,
          image: data.image,
        })
        .then((response) => {
          fetchSeries();
        })
        .catch((error) => {
          console.error("Create error:", error);
        });
    } else {
      api
        .put(`/series/edit/${data._id}`, {
          name: data.name,
          description: data.description,
          image: data.image,
        })
        .then((response) => {
          fetchSeries();
        })
        .catch((error) => {
          console.error("Create error:", error);
        });
    }
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "name",
    },
    {
      title: "Categoria",
      dataIndex: "admin_level",
      key: "admin_level",
    },
    {
      title: "Action",
      key: "action",
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
      <Button type="primary" onClick={handleCreate}>
        Create Role
      </Button>
      <Table columns={columns} dataSource={series}></Table>

      <Modal
        title={selectedSerie ? "Edit Role" : "Create Role"}
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={null}
      >
        <SerieForm
          serietoEdit={selectedSerie}
          onSave={handleSave}
          accessToken={accessToken}
        />
      </Modal>
      {accessToken ? (
        <Alert
          message="Token de acceso disponible"
          description="Tienes un token de acceso válido."
          type="success"
          showIcon
        />
      ) : (
        <Button type="primary" onClick={obtenerAccessToken}>
          Obtener Token de Acceso
        </Button>
      )}
    </div>
  );
}

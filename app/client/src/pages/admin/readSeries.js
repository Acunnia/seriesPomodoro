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
    console.log("effect read");
    try {
      fetchSeries();
    } catch {
      console.log("Error fetching series");
    }
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

  const fetchSeries = () => {
    setLoading(true);
    api
      .get("/series")
      .then((response) => {
        setLoading(false);
        setSeries(response.data.series);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  const onDelete = (id) => {
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
    setSelectedSerie(null);
  };

  const handleSave = (data) => {
    setIsModalVisible(false);
    if (mode === "create") {
      api
        .post("/series/create", data)
        .then((response) => {
          fetchSeries();
        })
        .catch((error) => {
          console.error("Create error:", error);
        });
    } else {
      const serieID = selectedSerie._id;
      api
        .put(`/series/edit/${serieID}`, data, {
          headers: {
            Authorization: `Bearer ${state.token}`,
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          fetchSeries();
        })
        .catch((error) => {
          console.error("Create error:", error);
        });
    }
    setSelectedSerie(null);
  };

  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "name",
    },
    {
      title: "Categoria",
      dataIndex: "categoria",
      key: "categoria",
    },
    {
      title: "Action",
      key: "action",
      render: (_, serie) => (
        <Space size="middle">
          <button onClick={() => handleEdit(serie)}>Edit {serie.nombre}</button>
          <button onClick={() => onDelete(serie._id)}>Delete</button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={handleCreate}>
        Create new Serie
      </Button>
      <Table
        columns={columns}
        rowKey={(serie) => serie._id}
        dataSource={series}
      ></Table>

      <Modal
        title={selectedSerie ? "Edit Serie" : "Create Serie"}
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

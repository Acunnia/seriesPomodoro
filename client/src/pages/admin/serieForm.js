import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, Checkbox, Select } from "antd";
import TWITCH from "../../utils/clientConfig";

const { Option } = Select;

const SerieForm = ({ serietoEdit, onSave, accessToken }) => {
  const [categoriaID, setCategoriaID] = useState("");
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [form] = Form.useForm();
  const [streamers, setStreamers] = useState([]);
  const [streamerResults, setStreamerResults] = useState([]);
  const [verifiedStreamers, setVerifiedStreamers] = useState([]);

  useEffect(() => {
    // Simula la carga inicial de los topics desde la API o tu fuente de datos
    const initialTopics = [
      { _id: "1", name: "Topic 1" },
      { _id: "2", name: "Tortilla" },
      { _id: "3", name: "Cosa" },
      // Agrega más topics según sea necesario
    ];

    setTopics(initialTopics);
  }, []);

  const onFinish = (values) => {};

  // Función para obtener el ID de la categoría desde la API de Twitch
  const obtenerCategoriaID = async () => {
    try {
      // Realizar la solicitud GET a la API de Twitch para obtener el ID de la categoría
      const response = await fetch(
        "https://api.twitch.tv/helix/games?name=" +
          form.getFieldValue("categoria"),
        {
          method: "GET",
          headers: {
            "Client-ID": TWITCH.client, // Reemplaza con tu propio Client-ID de Twitch
            Authorization: `Bearer ${accessToken}`, // Usar el token de acceso obtenido
          },
        }
      );

      const data = await response.json();
      if (data.data && data.data.length > 0) {
        // Obtener el ID de la primera coincidencia (asumiendo que la API devuelve resultados)
        const id = data.data[0].id;
        setCategoriaID(id);
        // Establecer el valor en el campo de formulario
        form.setFieldsValue({ categoriaID: id });
      } else {
        console.error("No se encontró ninguna categoría con ese nombre.");
      }
    } catch (error) {
      console.error("Error al obtener el ID de la categoría:", error);
    }
  };

  const handleTopicSearch = (value) => {
    var filteredTopics = [];
    if (value !== "") {
      filteredTopics = topics.filter((topic) =>
        topic.name.toLowerCase().includes(value.toLowerCase())
      );
    } else {
      filteredTopics = topics;
    }
    setFilteredTopics(filteredTopics);
  };

  const handleStreamerChange = async (values) => {
    // Filtrar streamers nuevos que aún no se han verificado
    const newStreamers = values.filter(
      (streamer) => !streamers.includes(streamer)
    );

    // Verificar la validez de los nuevos streamers
    if (newStreamers.length > 0) {
      const verifiedResults = await verificarStreamers(newStreamers);

      // Actualizar la lista de streamers y los resultados de la verificación
      setStreamers([
        ...streamers,
        ...verifiedResults.map((result) => result.username),
      ]);
      setVerifiedStreamers([...verifiedStreamers, ...verifiedResults]);
    }
  };

  const verificarStreamers = async (streamersToVerify) => {
    const verifiedStreamers = [];

    for (const streamer of streamersToVerify) {
      try {
        console.log("Consultando, ", streamer);
        const response = await fetch(
          `https://api.twitch.tv/helix/users?login=${streamer}`,
          {
            method: "GET",
            headers: {
              "Client-ID": TWITCH.client,
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();
        if (data.data && data.data.length > 0) {
          // El streamer es válido
          verifiedStreamers.push({ username: streamer, valid: true });
        } else {
          // El streamer no es válido
          verifiedStreamers.push({ username: streamer, valid: false });
        }
      } catch (error) {
        console.error("Error al verificar el streamer:", error);
      }
    }

    return verifiedStreamers;
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      onFinish={onFinish}
    >
      <Form.Item
        label="Nombre"
        name="nombre"
        rules={[
          {
            required: true,
            message: "Por favor ingresa el nombre de la serie",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Categoría"
        name="categoria"
        rules={[
          {
            required: true,
            message: "Por favor ingresa la categoría de la serie",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Button type="default" onClick={obtenerCategoriaID}>
        Obtener Categoria ID
      </Button>

      <Form.Item label="Categoría ID" name="categoriaID">
        <Input disabled />
      </Form.Item>

      <Form.Item label="Streamers" name="streamers">
        <Select
          mode="tags"
          placeholder="Añadir streamers"
          onChange={handleStreamerChange}
          tokenSeparators={[","]}
        >
          {verifiedStreamers.map((result) => (
            <Option
              key={result.username}
              value={result.username}
              style={{ backgroundColor: result.valid ? "green" : "red" }}
            >
              {result.username}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Activa" name="activa" valuePropName="checked">
        <Checkbox />
      </Form.Item>

      <Form.Item label="Fecha de Inicio" name="inicio">
        <DatePicker />
      </Form.Item>

      <Form.Item label="Fecha de Fin" name="fin">
        <DatePicker />
      </Form.Item>

      <Form.Item label="Tema Relacionado" name="relatedTopic">
        <Select
          showSearch
          placeholder="Selecciona un tema"
          filterOption={false}
          onSearch={handleTopicSearch}
        >
          {filteredTopics.map((topic) => (
            <Option key={topic._id} value={topic._id}>
              {topic.name}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
        <Button type="primary" htmlType="submit">
          Enviar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SerieForm;

import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, Checkbox, Select } from "antd";
import TWITCH from "../../utils/clientConfig";
import api from "../../utils/api";
import dayjs from "dayjs";

const { Option } = Select;
const { RangePicker } = DatePicker;

const SerieForm = ({ serietoEdit, onSave, accessToken }) => {
  const [topics, setTopics] = useState([]);
  const [filteredTopics, setFilteredTopics] = useState([]);
  const [form] = Form.useForm();
  const [streamers, setStreamers] = useState([]);
  const [verifiedStreamers, setVerifiedStreamers] = useState([]);
  const dateFormat = "YYYY/MM/DD";

  useEffect(() => {
    console.log("effect form");
    getTopics();
    if (serietoEdit) {
      console.log(
        serietoEdit,
        "inicio ",
        dayjs(serietoEdit.inicio, dateFormat),
        "fin ",
        dayjs(serietoEdit.fin, dateFormat)
      );
      const fechas = [
        dayjs(serietoEdit.inicio, dateFormat),
        dayjs(serietoEdit.fin, dateFormat),
      ];
      form.setFieldsValue({ ...serietoEdit, fechas });
    }
  }, []);

  function getTopics() {
    api.get("/topics/all").then((result) => {
      setTopics(result.data);
      setFilteredTopics(filteredTopics);
    });
  }

  const onFinish = (values) => {
    values.inicio = values.fechas[0];
    values.fin = values.fechas[1];

    onSave(values);
    form.resetFields();
  };

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
        const id = data.data[0].id;
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
        topic.title.toLowerCase().includes(value.toLowerCase())
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
          verifiedStreamers.push({ username: streamer, valid: true });
        } else {
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
      labelCol={{ span: 7 }}
      wrapperCol={{ span: 11 }}
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

      <Form.Item label="Inicio" name="fechas">
        <RangePicker />
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
              {topic.title}
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

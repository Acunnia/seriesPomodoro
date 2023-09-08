import React, { useEffect, useState } from "react";
import { Form, Input, Button, DatePicker, Checkbox, Select } from "antd";

const { Option } = Select;

const SerieForm = ({ serietoEdit, onSave }) => {
  const [categoriaID, setCategoriaID] = useState("");
  const [topics, setTopics] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    // Simula la carga inicial de los topics desde la API o tu fuente de datos
    const initialTopics = [
      { _id: "1", name: "Topic 1" },
      { _id: "2", name: "Topic 2" },
      { _id: "3", name: "Topic 3" },
      // Agrega más topics según sea necesario
    ];

    setTopics(initialTopics);
  }, []);

  const onFinish = (values) => {
    console.log("Formulario enviado:", values);
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
            "Client-ID": "TU_CLIENT_ID", // Reemplaza con tu propio Client-ID de Twitch
            Authorization: "Bearer TU_ACCESS_TOKEN", // Reemplaza con tu propio token de acceso de Twitch
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
    const filteredTopics = topics.filter((topic) =>
      topic.name.toLowerCase().includes(value.toLowerCase())
    );
    setTopics(filteredTopics);
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

      <Form.Item label="Categoría ID" name="categoriaID">
        <Input disabled />
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
          {topics.map((topic) => (
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
        <Button type="default" onClick={obtenerCategoriaID}>
          Obtener Categoria ID
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SerieForm;

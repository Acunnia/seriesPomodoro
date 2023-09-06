import React, { useEffect, useState, useContext } from 'react';
import { Form, Input, Button, Slider, Alert, message } from 'antd';
import api from '../../utils/api'
import { AuthContext } from '../../utils/auth';

const ConfigForm = () => {
  const [form] = Form.useForm();
  const [ configValues, setConfigValues ] = useState({})
  const { state } = useContext(AuthContext);

  const handleFormSubmit = (values) => {
    try {
        api.put('/config/edit',{values},{
            headers: {
                'Authorization': `Bearer ${state.token}`,
                'Content-Type': 'application/json'}
        }).then(response => {
            message.success("")
        })
    } catch {
        console.log(values);
    }
    
  };

  useEffect(() => {
    try {
        api.get('/config/',  {
            headers: {
                'Authorization': `Bearer ${state.token}`,
                'Content-Type': 'application/json'
            },}).then(response => {
                setConfigValues(response.data)
                form.setFieldsValue(response.data);
            })
    } catch {

    }
}, []);

const marks = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
  }

  return (
    <div>
        <Alert message= "Site configuration!! WARNING"
        description="This is the configuration of the application permissions, a user with the role with sufficient access permissions is able to perform the actions that are below their access level.
        By default a Administrator has access level 5 and moderators level 3" 
        type="warning"
        showIcon
         />
        <Form
      form={form}
      initialValues={configValues}
      onFinish={handleFormSubmit}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
    >
      <Form.Item
        label="create_category"
        name="create_category"
        rules={[
          {
            required: true,
            message: 'Este campo es requerido',
          },
        ]}
      >
        <Slider min={1} max={5} marks={marks}/>
      </Form.Item>

      <Form.Item
        label="create_subcategory"
        name="create_subcategory"
        rules={[
          {
            required: true,
            message: 'Este campo es requerido',
          },
        ]}
      >
        <Slider min={1} max={5} marks={marks}/>
      </Form.Item>

      <Form.Item
        label="edit_category"
        name="edit_category"
        rules={[
          {
            required: true,
            message: 'Este campo es requerido',
          },
        ]}
      >
        <Slider min={1} max={5} marks={marks}/>
      </Form.Item>

      <Form.Item
        label="edit_subcategory"
        name="edit_subcategory"
        rules={[
          {
            required: true,
            message: 'Este campo es requerido',
          },
        ]}
      >
        <Slider min={1} max={5} marks={marks}/>
      </Form.Item>

      <Form.Item
        label="delete_subcategory"
        name="delete_subcategory"
        rules={[
          {
            required: true,
            message: 'Este campo es requerido',
          },
        ]}
      >
        <Slider min={1} max={5} marks={marks}/>
      </Form.Item>

      <Form.Item
        label="edit_user"
        name="edit_user"
        rules={[
          {
            required: true,
            message: 'Este campo es requerido',
          },
        ]}
      >
        <Slider min={1} max={5} marks={marks}/>
      </Form.Item>

      <Form.Item
        label="delete_user"
        name="delete_user"
        rules={[
          {
            required: true,
            message: 'Este campo es requerido',
          },
        ]}
      >
        <Slider min={1} max={5} marks={marks}/>
      </Form.Item>

      <Form.Item
        label="create_role"
        name="create_role"
        rules={[
          {
            required: true,
            message: 'Este campo es requerido',
          },
        ]}
      >
        <Slider min={1} max={5} marks={marks}/>
      </Form.Item>

      <Form.Item
        label="edit_role"
        name="edit_role"
        rules={[
          {
            required: true,
            message: 'Este campo es requerido',
          },
        ]}
      >
        <Slider min={1} max={5} marks={marks}/>
      </Form.Item>

      <Form.Item
        label="delete_role"
        name="delete_role"
        rules={[
          {
            required: true,
            message: 'Este campo es requerido',
          },
        ]}
      >
       <Slider min={1} max={5} marks={marks}/>
      </Form.Item>

      <Form.Item
        label="motd"
        name="motd"
        rules={[
          {
            required: true,
            message: 'Este campo es requerido',
          },
        ]}
      >
        <Input type="text" />
      </Form.Item>

      <Form.Item
        label="banner"
        name="banner"
        rules={[
          {
            required: true,
            message: 'Este campo es requerido',
          },
        ]}
      >
        <Input type="url" />
      </Form.Item>

      {/* Repite este patrón para los demás campos del modelo */}
      
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Guardar
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
};

export default ConfigForm;
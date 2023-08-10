import React, {useContext, useEffect, useState} from 'react';
import {Button, Modal, Space, Table} from "antd";
import api from "../../utils/api";
import CategoryForm from "./categoryForm";
import {AuthContext} from "../../utils/auth";

export default function Read() {
    const { state } = useContext(AuthContext);
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [mode, setMode] = useState("create")

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        setLoading(true)
        api.get("/categories")
            .then((response) => {
                console.log(response.data)
                setCategories(response.data.categories);
            })
            .catch((error) => {
                //TODO: Modal con error
            }).finally(() => setLoading(false));
    };

    const onDelete = (id) => {
        //TODO: Modal de confirmacion de eliminacion
        api.delete(`/categories/delete/${id}`, {
            headers: {
                'Authorization': `Bearer ${state.token}`,
                'Content-Type': 'application/json'
            },
        }).then(r => {
            console.log(r.data.message);
        }).catch(error => {
            console.error('Error al eliminar la categoría:', error);
        });
    };

    const handleEdit = (category) => {
        setMode("edit")
        setSelectedCategory(category);
        setIsModalVisible(true);
    };

    const handleCreate = () => {
        setMode("create")
        setSelectedCategory(null);
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSelectedCategory(null);
    };

    const handleSave = (categoryData) => {
        setIsModalVisible(false);
        setSelectedCategory(null);
        if (mode === "create") {

        } else {

        }

    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Subcategories',
            key: 'subcategories',
            dataIndex: 'subcategories',
            render: (_, { subcategories }) => (
                <>
                    {subcategories.map((subcat) => {
                        return (
                            <p key={subcat}>
                                {subcat.name}
                            </p>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, cat) => (
                <Space size="middle">
                    <button onClick={() => handleEdit(cat)}>Edit {cat.name}</button>
                    <button onClick={() => onDelete(cat._id)}>Delete</button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Button type="primary" onClick={handleCreate}>Create Category</Button>
            <Table columns={columns} dataSource={categories}></Table>

            <Modal
                title={selectedCategory ? 'Edit Category' : 'Create Category'}
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
            >
                <CategoryForm category={selectedCategory} onSave={handleSave} />
            </Modal>
        </div>
    );
}
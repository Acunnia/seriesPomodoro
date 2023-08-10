import React, { useEffect, useState } from 'react';
import {Button, Modal, Space, Table} from "antd";
import api from "../../utils/api";
import CategoryForm from "./categoryForm";

export default function Read() {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

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
        // TODO: Implementa la lógica para eliminar la categoría con el ID dado
    };

    const handleEdit = (category) => {
        setSelectedCategory(category);
        setIsModalVisible(true);
    };

    const handleCreate = () => {
        setSelectedCategory(null);
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSelectedCategory(null);
    };

    const handleSave = (categoryData) => {
        // TODO: Implementa la lógica para guardar los datos editados/creados en la base de datos
        setIsModalVisible(false);
        setSelectedCategory(null);
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
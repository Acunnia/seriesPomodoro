import React, { useEffect, useState } from 'react';
import {Space, Table} from "antd";
import api from "../../utils/api";

export default function Read() {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = () => {
        setLoading(true)
        api.get("/subcategories")
            .then((response) => {
                console.log(response.data)
                setCategories(response.data.categories);
            })
            .catch((error) => {
                //TODO: Modal con error
            }).finally(() => setLoading(false));
    };

    const onDelete = (id) => {
        //todo: onDelete
    }

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
                                {subcat.toUpperCase()}
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
                    <button>Edit {cat.name}</button>
                    <button onClick={onDelete(cat._id)}>Delete</button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Table columns={columns} dataSource={categories}></Table>
        </div>
    )
}
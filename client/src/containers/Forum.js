import React, { useEffect, useState } from 'react';
import {List, Skeleton} from 'antd';
import api from '../utils/api';

const Forum = () => {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([]);

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
                console.error("Error al obtener las categorías:", error);
            }).finally(() => setLoading(false));
    };

    return (
        <div>
            {loading ? (
                <div>
                    <Skeleton active />
                    <Skeleton active />
                    <Skeleton active />
                </div>
            ) : (
                categories.map(category => {
                    return <span>{category.name}</span>;
                })
            )}
        </div>
    );
};

export default Forum;

import React, { useEffect, useState } from 'react';
import { Skeleton} from 'antd';
import api from '../utils/api';
import Category from '../components/Category'

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
                setCategories(response.data.categories);
            })
            .catch((error) => {
            }).finally(() => setLoading(false));
    };

    return (
        <div className={"main-forum"}>
            <div className="category-container">
                {loading ? (
                    <div>
                        <Skeleton active />
                        <Skeleton active />
                        <Skeleton active />
                    </div>
                ) : (
                    categories.map(category => {
                        return (
                            <Category data={category} key={category._id} />
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default Forum;

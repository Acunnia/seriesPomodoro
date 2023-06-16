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
                //TODO: Modal con error
            }).finally(() => setLoading(false));
    };

    return (
        <div >
            <section >
                {loading ? (
                    <div>
                        <Skeleton active />
                        <Skeleton active />
                        <Skeleton active />
                    </div>
                ) : (
                    categories.map(category => {
                        return (
                            <a className={"category-box"} style={{'border-color': '#0088CC'}}>
                            //TODO Componente dumb hijo que muestra datitos
                                <div className={"category-box-inner"}>
                                    <div className={"description"}>{category.name}</div>
                                </div>
                            </a>
                        );
                    })
                )}
            </section>
        </div>
    );
};

export default Forum;

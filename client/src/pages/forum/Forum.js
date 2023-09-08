import React, { useEffect, useState } from 'react';
import { Skeleton, Row, Col} from 'antd';
import api from '../../utils/api';
import Category from '../../components/Category/Category'
import Page from '../../components/Page/Page';
import styles from  './Forum.module.css'

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
        <Page>
            <div className={styles.ForumWrapper}>
                <div className={styles.ForumCategoryList}>
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
        </Page>
    );
};

export default Forum;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SubCategory.module.css'

const Category = props => {
    const navigate = useNavigate();

    const goToSubCategory = () => {
        navigate(`/category?id=${props.data._id}`, {
            state: {
                query: "subcat",
                id: props.data._id,
                name: props.data.name,
                description: props.data.description,
            },
        });
    }

    return (
        <div onClick={goToSubCategory} className={styles.SubCategoryBox}>
            <div className={styles.SubCategoryName}>
                {props.data.name}
            </div>
        </div>
    );
};

export default Category;

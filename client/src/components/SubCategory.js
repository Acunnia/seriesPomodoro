import React from 'react';
import "./styles/Category.styles.css"
import { useNavigate } from 'react-router-dom';

const Category = props => {
    const navigate = useNavigate();
    const goToSubCategory = () => {
        navigate(`/category?id=${props.data._id}`, {
            state: {
                id: props.data._id,
                name: props.data.name,
                description: props.data.description,
            },
        });
    }

    return (
        <div onClick={goToSubCategory} className="category-box">
            <div className="category-name">
                {props.data.name}
            </div>
            <div className="category-desc">
                {props.data.description}
            </div>
        </div>
    );
};

export default Category;

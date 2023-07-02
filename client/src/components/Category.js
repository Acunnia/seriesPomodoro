import React from 'react';
import "./styles/Category.styles.css"
import { useNavigate } from 'react-router-dom';

const Category = props => { //TODO: se puede hacer refactor para mergear Category y subcategory
    const navigate = useNavigate();
    const goToCategory = () => {
        navigate(`/category?id=${props.data._id}`, {
            state: {
                id: props.data._id,
                name: props.data.name,
                description: props.data.description,
            },
        });
    }

    return (
        <div onClick={goToCategory} className="category-box">
            <div className="category-name">
                {props.data.name}
            </div>
            <div className="category-desc">
                {props.data.description}
            </div>
            <div className="subcategory-list">
                {props.data.subcategories.map(subcategory => (
                    <div className="subcategory" key={subcategory.id}>
                        {subcategory.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Category;
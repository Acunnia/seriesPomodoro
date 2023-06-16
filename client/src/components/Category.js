import React from 'react';
import "./styles/Category.styles.css"

const Category = props => {
    return (
        <div className="category-box">
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

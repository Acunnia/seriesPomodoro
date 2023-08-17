import React from 'react';
import "./styles/Category.styles.css"
import { useNavigate } from 'react-router-dom';
import {createFromIconfontCN} from "@ant-design/icons";
import {Col, Row} from "antd";

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

    const IconFont = createFromIconfontCN({
        scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
    });

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
                    <div className="subcategory" key={subcategory._id}>
                        {subcategory.name}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Category;

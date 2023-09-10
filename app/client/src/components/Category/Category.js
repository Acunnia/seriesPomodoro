import React, {useState} from 'react';
import styles from  "./Category.module.css"
import { useNavigate } from 'react-router-dom';

const Category = props => {
    const navigate = useNavigate();
    const [isHovered, setIsHovered] = useState(false);

    const goToCategory = () => {
        navigate(`/category?id=${props.data._id}`, {
            state: {
                id: props.data._id,
                name: props.data.name,
                description: props.data.description,
            },
        });
    }

    const categoryStyle = {
        backgroundImage: `linear-gradient(to right, rgba(20,20,20,0.9) 30%, 80%, transparent), url(${props.data.image})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        position: 'relative',
        height: '150px'

    };

    const hoverStyle = {
        content: '',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        pointerEvents: 'none',
        opacity: isHovered ? 1 : 0,
        transition: 'opacity 0.3s',
    };

    return (
            <div
                onClick={goToCategory}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={styles.CategoryInfo}
                style={categoryStyle}
            >
                <div style={hoverStyle}></div>
                <div className={styles.CategoryName}>
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

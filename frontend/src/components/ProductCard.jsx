import "../styles/ProductCard.css";
import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";

function getImageUrl(image) {
    if (!image) return heroImage;
    if (image.startsWith("http")) return image;
    if (image.startsWith("/products/")) return `http://localhost:8000${image}`;
    return `http://localhost:8000/products/${encodeURIComponent(image)}`;
}

function ProductCard({ product }) {
    return (
        <div className="product-card">
            <img src={getImageUrl(product.image)} alt={product.name} />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <h2>Цена: {product.price} т.</h2>
            <Link to={`/product/${product.id}`}><button>Подробнее</button></Link>
        </div>
    )
}
export default ProductCard;


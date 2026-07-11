import "../styles/ProductCard.css";
import { Link } from "react-router-dom";
function ProductCard({ product }) {
    return (
        <div className="product-card">
            <img src={product.image} alt={product.name} />
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <h2>Цена: {product.price} т.</h2>
            <Link to={`/product/${product.id}`}><button>Подробнее</button></Link>
        </div>
    )
}
export default ProductCard;


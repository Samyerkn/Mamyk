import "../styles/ProductCard.css";
import { Link } from "react-router-dom";
import tshirtImage from "../assets/tshirt.png";

function ProductCard({ product }) {

    const category =
        product.fastening_type === "buttons"
            ? "Кнопки"
            : product.fastening_type === "magnets"
            ? "Магниты"
            : "Липучки";

    return (
        <div className="product-card">

            <div className="product-image">
            <img
  src={product.image}
  alt={product.name}
/>
            </div>

            <div className="product-content">

                <span className="category">
                    {category}
                </span>

                <h2 className="product-title">
                    {product.name}
                </h2>

                <div className="price-box">


                    <div className="price">
                        {Number(product.price).toLocaleString("ru-RU")} ₸
                    </div>

                </div>

                <Link to={`/product/${product.id}`}>
                    <button className="details-btn">
                        Подробнее →
                    </button>
                </Link>

            </div>

        </div>
    );
}

export default ProductCard;
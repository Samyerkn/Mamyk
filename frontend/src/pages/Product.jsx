import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Product.css";
import Header from "../components/Header";
import axios from "axios";
import heroImage from "../assets/hero.png";



function getImageUrl(image) {
  if (!image) return heroImage;
  if (image.startsWith("http")) return image;
  if (image.startsWith("/products/")) return `http://localhost:8000${image}`;
  return `http://localhost:8000/products/${encodeURIComponent(image)}`;
}

function Product() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/products/${id}/`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [id]);

  if (!product) {
    return <h1>Товар не найден</h1>;
  }

  return (
    <>
    <Header />
    <button className="back-btn" onClick={() => navigate(-1)}>
      Назад
    </button>
    <div className="product-page">
      <div className="product-image">
        <img src={getImageUrl(product.image)} alt={product.name} />
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="description">{product.description}</p>
        <p className="price">Цена: {product.price} т.</p>
        <h3>Размеры</h3>
        <div className="sizes">
          {product.sizes?.map((size) => (
            <button
              key={size.id}
              onClick={() => setSelectedSize(size.size)}
              style={{ background: selectedSize === size.size ? "#333" : "#f2f2f2", color: selectedSize === size.size ? "#fff" : "#000" }}
            >
              {size.size}
            </button>
          ))}
        </div>
        <Link to={`/checkout?product_id=${product.id}&size=${selectedSize}&product_name=${encodeURIComponent(product.name)}`}>
          <button className="buy-btn">Купить</button>
        </Link>
      </div>
    
    </div>
    </>
  );
}

export default Product;
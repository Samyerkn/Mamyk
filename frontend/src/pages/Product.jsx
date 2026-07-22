import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Product.css";
import axios from "axios";
import heroImage from "../assets/hero.png";
import { addToCart } from "../services/cart";

function getImageUrl(image) {
  if (!image) return heroImage;
  if (image.startsWith("http")) return image;
  if (image.startsWith("/products/")) {
    return `http://localhost:8000${image}`;
  }
  return `http://localhost:8000/products/${encodeURIComponent(image)}`;
}

function Product() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("M");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/products/${id}/`)
      .then((response) => {
        setProduct(response.data);

        if (response.data.sizes?.length > 0) {
          setSelectedSize(response.data.sizes[0].size);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
    });

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2500);
  };

  if (!product) {
    return <h1>Товар не найден</h1>;
  }

  return (
    <>
      <button
        className="back-btn"
        onClick={() => navigate(-1)}
      >
        Назад
      </button>

      {added && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            background: "#4CAF50",
            color: "#fff",
            padding: "14px 22px",
            borderRadius: 10,
            zIndex: 1000,
            boxShadow: "0 5px 15px rgba(0,0,0,.2)",
          }}
        >
          ✅ Товар добавлен в корзину
        </div>
      )}

      <div className="product-page">
        <div className="product-image">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
          />
        </div>

        <div className="product-info">
          <h1>{product.name}</h1>

          <p className="description">
            {product.description}
          </p>

          <p className="price">
            Цена: {product.price} ₸
          </p>

          <h3>Размер</h3>

          <div className="sizes">
            {product.sizes?.map((size) => (
              <button
                key={size.id}
                onClick={() => setSelectedSize(size.size)}
                style={{
                  background:
                    selectedSize === size.size
                      ? "#333"
                      : "#f2f2f2",
                  color:
                    selectedSize === size.size
                      ? "#fff"
                      : "#000",
                }}
              >
                {size.size}
              </button>
            ))}
          </div>

          <button
            className="buy-btn"
            onClick={handleAddToCart}
          >
            🛒 Добавить в корзину
          </button>
        </div>
      </div>
    </>
  );
}

export default Product;
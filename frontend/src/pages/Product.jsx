import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/Product.css";
import axios from "axios";
import tshirtImage from "../assets/tshirt.png";
import { addToCart } from "../services/cart";



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
    const token = localStorage.getItem("access_token");
    
    if (!token) {
      navigate("/login");
      return;
    }
  
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: tshirtImage,
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
            src={tshirtImage}
            alt={product.name}
         />
        </div>

        <div className="product-info">

  <span className="product-badge">
    Адаптивная одежда
  </span>

  <h1>{product.name}</h1>

  <p className="product-subtitle">
    Комфортная одежда для ежедневного использования.
  </p>

  <div className="price-box">
    <span>Цена</span>

    <div className="price">
      {Number(product.price).toLocaleString("ru-RU")} ₸
    </div>
  </div>

  <div className="size-section">
    <h3>Выберите размер</h3>

    <div className="sizes">
      {product.sizes?.map((size) => (
        <button
          key={size.id}
          className={selectedSize === size.size ? "active-size" : ""}
          onClick={() => setSelectedSize(size.size)}
        >
          {size.size}
        </button>
      ))}
    </div>
  </div>

  <button
    className="buy-btn"
    onClick={handleAddToCart}
  >
    Добавить в корзину
  </button>

</div>
      </div>
    </>
  );
}

export default Product;
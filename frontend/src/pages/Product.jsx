import { useParams } from "react-router-dom";
import "../styles/Product.css";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
const products = [
    {
    id: 1,
    name: "Адаптивная футболка",
    price: 18000,
    fastening: "Магниты",
    image: "https://picsum.photos/500/500?1",
    description: "Удобная адаптивная футболка с магнитной застежкой.",
  },
  {
    id: 2,
    name: "Футболка на липучках",
    price: 17500,
    fastening: "Липучки",
    image: "https://picsum.photos/500/500?2",
    description: "Футболка с застежкой на липучках.",
  },
  {
    id: 3,
    name: "Футболка на пуговицах",
    price: 16000,
    fastening: "Пуговицы",
    image: "https://picsum.photos/500/500?3",
    description: "Классическая модель на пуговицах.",
  },
];

function Product() {
  const navigate = useNavigate();
  const { id } = useParams();
  const product = products.find((p) => p.id === parseInt(id));

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
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="description">{product.description}</p>
        <p className="price">Цена: {product.price} т.</p>
        <h3>размер</h3>
        <div className="sizes">
          <button>S</button>
          <button>M</button>
          <button>L</button>
          <button>XL</button>
        </div>
        <button className="buy-btn">Добавить в корзину</button>
      </div>
    
    </div>
    </>
  );
}

export default Product;
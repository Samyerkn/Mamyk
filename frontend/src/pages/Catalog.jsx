import{useState} from "react";
import ProductCard from "../components/ProductCard";
import "../styles/Catalog.css";
import Header from "../components/Header";
const products = [
    {
    id: 1,
    name: "Адаптивная футболка",
    price: 18000,
    fastening: "Магниты",
    image: "https://picsum.photos/250/250?1",
    },
    {
    id: 2,
    name: "Футболка на липучках",
    price: 17500,
    fastening: "Липучки",
    image: "https://picsum.photos/250/250?2",

    },
    {
    id: 3,
    name: "Футболка на пуговицах",
    price: 16000,
    fastening: "Пуговицы",
    image: "https://picsum.photos/250/250?3",
    },

    

];


function Catalog() {
    const [filter, setFilter] = useState("Все");
    const filteredProducts = filter === "Все" ? products : products.filter(product => product.fastening === filter);
    return (
        <>
       
        <Header />
        <div className="catalog">
            <h1>Каталог товаров</h1>
            <div className="filters">
                <button onClick={() => setFilter("Все")}>Все</button>
                <button onClick={() => setFilter("Магниты")}>Магниты</button>
                <button onClick={() => setFilter("Липучки")}>Липучки</button>
                <button onClick={() => setFilter("Пуговицы")}>Пуговицы</button>
            </div>
            <div className="products">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
         </>
    );
}

export default Catalog;
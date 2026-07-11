import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "../styles/Catalog.css";
import Header from "../components/Header";
import axios from "axios";

function Catalog() {
    const [products, setProducts] = useState([]);
    const [filter, setFilter] = useState("Все");

    const filterMap = {
        Все: null,
        Магниты: "magnets",
        Липучки: "velcro",
        Кнопки: "buttons",
    };

    const filteredProducts =
        filter === "Все"
            ? products
            : products.filter((product) => product.fastening_type === filterMap[filter]);

    useEffect(() => {
        const endpoint = filterMap[filter] ? `/api/products/?fastening_type=${filterMap[filter]}` : "/api/products/";

        axios
            .get(`http://localhost:8000${endpoint}`)
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            });
    }, [filter]);

    return (
        <>
            <Header />
            <div className="catalog">
                <h1>Каталог товаров</h1>
                <div className="filters">
                    <button onClick={() => setFilter("Все")}>Все</button>
                    <button onClick={() => setFilter("Магниты")}>Магниты</button>
                    <button onClick={() => setFilter("Липучки")}>Липучки</button>
                    <button onClick={() => setFilter("Кнопки")}>Кнопки</button>
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
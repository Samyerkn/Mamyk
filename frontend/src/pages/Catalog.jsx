import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "../styles/Catalog.css";
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

    useEffect(() => {
        const endpoint = filterMap[filter]
            ? `/api/products/?fastening_type=${filterMap[filter]}`
            : "/api/products/";

        axios
            .get(`http://localhost:8000${endpoint}`)
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Ошибка загрузки товаров:", error);
            });
    }, [filter]);

    return (
        <section className="catalog">

           <div className="catalog-header">
           <span className="catalog-tag">
                  MAMYK 
           </span>

         <h1>
           Каталог товаров
         </h1>

        <p>
           Адаптивная одежда, созданная для комфорта детей
           и удобства родителей.
        </p>
     </div>

            <div className="filters">
                {Object.keys(filterMap).map((item) => (
                    <button
                        key={item}
                        className={filter === item ? "active" : ""}
                        onClick={() => setFilter(item)}
                    >
                        {item}
                    </button>
                ))}
            </div>

            <div className="products">
                {products.length === 0 ? (
                    <div className="empty-catalog">
                        <h2>Товары не найдены</h2>
                        <p>Попробуйте выбрать другую категорию.</p>
                    </div>
                ) : (
                    products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))
                )}
            </div>

        </section>
    );
}

export default Catalog;
import { Link } from "react-router-dom";
import "./Items.css";
import Item from "./Item";
import axios from "axios";
import { useState, useEffect } from "react";

import Loader from "../../components/Loader"; // Import du composant Loader

const Items = ({ filtres, urlGlobal }) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 10; // Nombre fixe d'éléments par page

  // Construction des paramètres de requête
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (filtres.title) params.append("title", filtres.title);
    if (filtres.priceMin) params.append("priceMin", filtres.priceMin);
    if (filtres.priceMax) params.append("priceMax", filtres.priceMax);
    if (filtres.sort) params.append("sort", filtres.sort);

    // Ajout des paramètres de pagination
    params.append("page", currentPage);
    params.append("limit", itemsPerPage);

    return params.toString();
  };

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const queryParams = buildQueryParams();
      const url = `${urlGlobal}/offers?${queryParams}`;
      const response = await axios.get(url);

      // Mise à jour des données et gestion de la pagination
      setItems(response.data.offers);
      setTotalPages(Math.ceil(response.data.count / itemsPerPage));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Erreur lors de la récupération des données :", error);
    }
  };

  // Requête au chargement de la page ou changement de page
  useEffect(() => {
    fetchItems();
  }, [currentPage, filtres]);

  // Gestion du changement de page
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="items-wrapper">
      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {"<"}
        </button>
        <span>
          Page {currentPage} sur {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {">"}
        </button>
      </div>

      {/* Affichage des articles */}
      <div className="items-card-wrapper">
        {isLoading ? (
          <Loader />
        ) : (
          items.map((item) => (
            <Link key={item._id} to={`/offers/${item._id}`}>
              <Item
                avatar={item.owner.account.avatar}
                username={item.owner.account.username}
                productImage={item.product_image.secure_url}
                price={item.product_price}
                size={item.product_details[1]?.TAILLE}
                brand={item.product_details[0]?.MARQUE}
              />
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Items;

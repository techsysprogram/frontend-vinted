import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Offer.css";

import Loader from "../../components/Loader"; // Import du composant Loader

const Offer = ({ handleButton, setLastPageView, urlGlobal, setStripeAchat }) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();

  useEffect(() => {
    setLastPageView("/offers/" + id);
  }, [id, setLastPageView]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${urlGlobal}/offers/${id}`); // Fetch des données
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Erreur lors du chargement de l'offre :", error);
      }
    };
    fetchData();
  }, [id, urlGlobal]);

  useEffect(() => {
    if (data) {
      setStripeAchat((prev) => ({
        ...prev,
        title: data.product_name, // Mise à jour du nom du produit
        amount: data.product_price * 100, // Conversion en centimes
      }));
    }
  }, [data, setStripeAchat]); // Déclenché uniquement lorsque `data` change

  if (isLoading) {
    return <Loader />;
  }

  return (
    <main className="offer-main">
      <div className="offer-container">
        {data.product_image?.secure_url ? (
          <div className="offer-left">
            <img
              src={data.product_image.secure_url}
              alt={data.product_name || "Produit"}
              className="offer-image"
            />
          </div>
        ) : (
          <div className="offer-left">
            <p>Aucune image disponible</p>
          </div>
        )}
        <div className="offer-right">
          <h2 className="offer-price">
            {data.product_price
              ? `${data.product_price} €`
              : "Prix non disponible"}
          </h2>
          <ul className="offer-details">
            {data.product_details
              ? data.product_details.map((detail, index) => {
                  const keyInObj = Object.keys(detail)[0];
                  return (
                    <li key={index} className="offer-detail-item">
                      <span className="detail-key">{keyInObj}:</span>{" "}
                      <span className="detail-value">{detail[keyInObj]}</span>
                    </li>
                  );
                })
              : null}
          </ul>
          <div className="offer-description">
            <h3>{data.product_name || "Nom du produit non disponible"}</h3>
            <p>{data.product_description || "Description non disponible"}</p>
          </div>
          <div className="offer-owner">
            {data.owner?.account?.avatar?.secure_url ? (
              <img
                src={data.owner.account.avatar.secure_url}
                alt={data.owner.account.username || "Utilisateur"}
                className="owner-avatar"
              />
            ) : (
              <p>？</p>
            )}
            <span>
              {data.owner?.account?.username || "Nom d'utilisateur inconnu"}
            </span>
          </div>
          <button
            className="offer-buy-button"
            onClick={() => handleButton("acheter")}
          >
            Acheter
          </button>
        </div>
      </div>
    </main>
  );
};

export default Offer;

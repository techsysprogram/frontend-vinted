import { useState } from "react";
import Notification from "../../components/Notification"; // Import du composant Notification
import "./Publish.css";
import axios from "axios";

import Loader from "../../components/Loader"; // Import du composant Loader

const Publish = ({ token, urlGlobal }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    condition: "",
    city: "",
    brand: "",
    size: "",
    color: "",
    picture: null,
    newsLetter: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null); // Pour la prévisualisation de l'image
  const [notification, setNotification] = useState({
    message: "",
    type: "",
    visible: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        picture: file,
      }));
      setPreview(URL.createObjectURL(file)); // URL temporaire pour la prévisualisation
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prevData) => ({
      ...prevData,
      picture: null,
    }));
    setPreview(null); // Supprime la prévisualisation
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (token === null) {
      setNotification({
        message: "Vous devez être connecté pour publier une annonce",
        type: "error",
        visible: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("condition", formData.condition);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("size", formData.size);
      formDataToSend.append("color", formData.color);
      if (formData.picture) {
        formDataToSend.append("picture", formData.picture); // Ajoute le fichier image
      }
      formDataToSend.append("newsLetter", formData.newsLetter);

      const response = await axios.post(
        `${urlGlobal}/offers/publish`,
        formDataToSend,
        {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setIsLoading(false);

      setNotification({
        message: "Annonce publiée avec succès !",
        type: "success",
        visible: true,
      });
    } catch (error) {
      // console.log(error.response?.data?.message);
      setIsLoading(false);
      // console.log(error.response);
      setNotification({
        message:
          error.response?.data?.message ||
          "Une erreur est survenue. Veuillez réessayer.",
        type: "error",
        visible: true,
      });
    }
  };

  return (
    <div className="publish-main">
      {isLoading && <Loader />}
      <div className="publish-container">
        <h2>Vends ton article</h2>
        <form onSubmit={handleSubmit}>
          {/* Téléchargement de photo */}
          <div className="file-select">
            {preview ? (
              <div className="dashed-preview-image">
                <img src={preview} alt="pré-visualisation" />
                <div className="remove-img-button" onClick={handleRemovePhoto}>
                  X
                </div>
              </div>
            ) : (
              <label htmlFor="photo-upload" className="label-file">
                <span className="input-design-default">+ Ajoute une photo</span>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="input-file"
                  onChange={handlePhotoChange}
                />
              </label>
            )}
          </div>

          {/* Champs texte */}
          <div className="text-input-section">
            <div className="text-input">
              <h4>Titre</h4>
              <input
                type="text"
                name="title"
                placeholder="ex: Chemise Sézane verte"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="text-input">
              <h4>Décris ton article</h4>
              <textarea
                name="description"
                rows="5"
                placeholder="ex: porté quelquefois, taille correctement"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="text-input-section">
            <div className="text-input">
              <h4>Marque</h4>
              <input
                type="text"
                name="brand"
                placeholder="ex: Zara"
                value={formData.brand}
                onChange={handleInputChange}
              />
            </div>
            <div className="text-input">
              <h4>Taille</h4>
              <input
                type="text"
                name="size"
                placeholder="ex: L / 40 / 12"
                value={formData.size}
                onChange={handleInputChange}
              />
            </div>
            <div className="text-input">
              <h4>Couleur</h4>
              <input
                type="text"
                name="color"
                placeholder="ex: Fushia"
                value={formData.color}
                onChange={handleInputChange}
              />
            </div>
            <div className="text-input">
              <h4>Etat</h4>
              <input
                type="text"
                name="condition"
                placeholder="Neuf avec étiquette"
                value={formData.condition}
                onChange={handleInputChange}
              />
            </div>
            <div className="text-input">
              <h4>Lieu</h4>
              <input
                type="text"
                name="city"
                placeholder="ex: Paris"
                value={formData.city}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Prix et échange */}
          <div className="text-input-section">
            <div className="text-input">
              <h4>Prix</h4>
              <div className="checkbox-section-droite">
                <input
                  type="number"
                  name="price"
                  placeholder="0,00 €"
                  value={formData.price}
                  onChange={handleInputChange}
                  inputMode="numeric" // Active le clavier numérique sur mobile
                  step="any" // Permet d'accepter les décimales
                />
                <div className="checkbox-input">
                  <label htmlFor="exchange" className="checkbox-design"></label>
                  <input
                    type="checkbox"
                    name="newsLetter"
                    id="exchange"
                    checked={formData.newsLetter}
                    onChange={handleInputChange}
                  />
                  <span>Je suis intéressé(e) par les échanges</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bouton d'envoi */}
          <div className="form-button-div">
            <button type="submit" className="form-validation">
              Ajouter
            </button>
          </div>
        </form>

        {/* Notification */}
        {notification.visible && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification({ ...notification, visible: false })}
          />
        )}
      </div>
    </div>
  );
};

export default Publish;

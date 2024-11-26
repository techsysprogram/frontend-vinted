import { useState } from "react";
import "./styles/Modal.css";
import axios from "axios";

import Loader from "../components/Loader"; // Import du composant Loader

const Modal = ({
  onClose,
  type,
  handleConnexionStatus,
  handleButton,
  urlGlobal,
}) => {
  //   State qui gère le message d'erreur
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // États pour stocker les données des champs
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    newsletter: false,
  });

  const urlLogin = `${urlGlobal}/user/login`;
  const urlSignUp = `${urlGlobal}/user/signup`;

  // Gestion des changements dans les champs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    //   Je fais disparaitre un éventuel message d'erreur
    setErrorMessage(null);

    if (type === "signup") {
      try {
        setIsLoading(true);
        const response = await axios.post(urlSignUp, {
          email: formData.email,
          username: formData.username,
          password: formData.password,
          newsletter: formData.newsletter,
        });

        handleConnexionStatus(response.data.token);
        setIsLoading(false);

        // Fermer le modal après soumission
        onClose();
        // navigate("/");
      } catch (error) {
        setIsLoading(false);
        if (error.response.status === 409) {
          // error conflit
          // je fais appraître un message d'erreur
          setErrorMessage("Cette adresse email est déjà utilisée :)");
        } else if (error.response.data.message === "Missing parameters") {
          // Si je reçois le message Missing parameters idem
          setErrorMessage("Veuillez remplir tous les champs");
        } else {
          // Si je tombe dans le catch pour une raison inconnue
          setErrorMessage("Une erreur est survenue, veuillez réessayer !");
        }
      }
    } else if (type === "login") {
      try {
        setIsLoading(true);
        const response = await axios.post(urlLogin, {
          email: formData.email,
          password: formData.password,
        });
        handleConnexionStatus(response.data.token);
        // Fermer le modal après soumission
        setIsLoading(false);
        onClose();

        // console.log(response.data);
      } catch (error) {
        setIsLoading(false);
        if (error.response.status === 401) {
          // je fais appraître un message d'erreur
          setErrorMessage(
            "Email ou mot de passe erroné, veuillez réessayer, s'il vous plaît."
          );
        }
      }
    }
  };

  return (
    <div className="modal-overlay">
      {isLoading && <Loader />}
      <div className="modal-container">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {type === "signup" ? (
          <div className="modal-content">
            <h2>S'inscrire</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Nom d'utilisateur"
                value={formData.username}
                onChange={handleChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
              />

              <div className="newsletter">
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleChange}
                />
                <span>S'inscrire à notre newsletter</span>
              </div>

              <p className="modal-description">
                En m'inscrivant je confirme avoir lu et accepté les Termes &amp;
                Conditions et Politique de Confidentialité. Je confirme avoir au
                moins 18 ans.
              </p>
              <button type="submit" className="modal-submit">
                S'inscrire
              </button>
              {errorMessage && (
                <p style={{ color: "red", marginTop: "10px" }}>
                  {errorMessage}
                </p>
              )}
            </form>
            <p className="modal-switch" onClick={() => handleButton("login")}>
              Tu as déjà un compte ? Connecte-toi !
            </p>
          </div>
        ) : (
          <div className="modal-content">
            <h2>Se connecter</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                placeholder="Adresse email"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={formData.password}
                onChange={handleChange}
              />
              <button type="submit" className="modal-submit">
                Se connecter
              </button>
              {errorMessage && (
                <p style={{ color: "red", marginTop: "10px" }}>
                  {errorMessage}
                </p>
              )}
            </form>
            <p className="modal-switch" onClick={() => handleButton("signup")}>
              Pas encore de compte ? Inscris-toi !
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;

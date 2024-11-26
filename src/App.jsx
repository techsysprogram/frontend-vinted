import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import axios from "axios"; // Import d'axios

import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

//components
import Header from "./components/Header";
import HomeHero from "./components/HomeHero";
import Modal from "./components/Modal";
import Notification from "./components/Notification";

//pages
import Items from "./pages/offers/Offers";
import Offer from "./pages/offer/Offer";
import Publish from "./pages/publish/Publish";
import PaymentPage from "./pages/PaymentPage/PaymentPage";

import config from "./config";

import { loadStripe } from "@stripe/stripe-js";
// import { Elements } from "@stripe/react-stripe-js";
// import CheckoutForm from "./components/CheckoutForm";

const stripePromise = loadStripe(
  "pk_test_51IwqT2BynYg7O0QXLqDqQ15e5l36VsPactY4jOmrWXbpOIUFSmR7HRN8GKes9rAE5TDqIyUniEK5btqRVQR5pkYj00CLjT2ZLS"
);

function App() {
  const navigate = useNavigate();
  const [lastPageView, setLastPageView] = useState("/");
  const [filtres, setFiltres] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [token, setToken] = useState(Cookies.get("vinted-token") || null);

  const [notification, setNotification] = useState({
    message: "",
    type: "",
    visible: false,
  });

  const [stripeAchat, setStripeAchat] = useState({
    mode: "payment",
    title: "Article sur Vinted",
    amount: 500, // 5 EUR (en centimes)
    currency: "eur",
    description: "Achat d'un article sur Vinted",
    clientSecret: null,
  });

  const urlGlobal = config.API_BASE_URL;

  const handleAchat = async () => {
    try {
      const response = await axios.post(`${urlGlobal}/payment`, {
        amount: stripeAchat.amount,
        currency: stripeAchat.currency,
        description: stripeAchat.description,
      });
      setStripeAchat((prev) => ({
        ...prev,
        clientSecret: response.data.clientSecret,
      }));
      navigate("/payment");
    } catch (error) {
      console.error("Erreur lors de la récupération du clientSecret :", error);
    }
  };

  const handleButton = (Action) => {
    if (isOpen) {
      setIsOpen(false);
      setTimeout(() => {
        executeAction(Action);
      }, 100);
    } else {
      executeAction(Action);
    }
  };

  const executeAction = (Action) => {
    switch (Action) {
      case "signup":
        setModalType("signup");
        setIsOpen(true);
        break;
      case "login":
        setModalType("login");
        setIsOpen(true);
        break;
      case "logout":
        handleConnexionStatus(null);
        if (lastPageView === "/publish") {
          setLastPageView("/");
          navigate("/");
        }
        break;

      case "acheter": // Achat d'un article mais le token est important
        if (token === null) {
          setModalType("login");
          setIsOpen(true);
        } else {
          setLastPageView("/");
          handleAchat();
        }
        break;

      case "commencerVendre":
        setLastPageView("/publish");
        if (token === null) {
          setModalType("login");
          setIsOpen(true);
        } else {
          navigate("/publish");
        }
        break;

      case "vendsArticles":
        setLastPageView("/publish");
        if (token === null) {
          setModalType("login");
          setIsOpen(true);
        } else {
          navigate("/publish");
        }
        break;
      default:
        break;
    }
  };

  const handleConnexionStatus = (token) => {
    if (token === null) {
      Cookies.remove("vinted-token");
      setNotification({
        message: "Vous êtes déconnecté(e)",
        type: "error",
        visible: true,
      });
    } else {
      Cookies.set("vinted-token", token, { expires: 14 });

      setNotification({
        message: "Vous êtes connecté(e)",
        type: "success",
        visible: true,
      });
    }
    setToken(token);
    navigate(lastPageView);
  };

  const location = useLocation();
  const AfficherHomeHero =
    !location.pathname.includes("/offers") &&
    !location.pathname.includes("/publish") &&
    !location.pathname.includes("/payment");

  return (
    <>
      {/* Afficher le Header sauf sur la route /payment */}
      <Header
        setFiltres={setFiltres}
        handleButton={handleButton}
        token={token}
      />

      {AfficherHomeHero && <HomeHero handleButton={handleButton} />}

      <Routes>
        <Route
          path="/payment"
          element={
            stripeAchat.clientSecret ? (
              <PaymentPage
                stripePromise={stripePromise}
                stripeAchat={stripeAchat}
                urlGlobal={urlGlobal}
              />
            ) : (
              <div>Chargement des informations de paiement...</div>
            )
          }
        />

        <Route
          path="/"
          element={<Items filtres={filtres} urlGlobal={urlGlobal} />}
        />

        <Route
          path="/offers/:id"
          element={
            <Offer
              handleButton={handleButton}
              setLastPageView={setLastPageView}
              urlGlobal={urlGlobal}
              setStripeAchat={setStripeAchat}
            />
          }
        />
        <Route
          path="/publish"
          element={<Publish token={token} urlGlobal={urlGlobal} />}
        />
      </Routes>

      {notification.visible && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ ...notification, visible: false })}
        />
      )}

      {isOpen && (
        <Modal
          onClose={() => setIsOpen(false)}
          type={modalType}
          handleConnexionStatus={handleConnexionStatus}
          handleButton={handleButton}
          urlGlobal={urlGlobal}
        />
      )}
    </>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;

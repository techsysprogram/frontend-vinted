import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

import Notification from "../../components/Notification";
import "./PaymentPage.css";

const CheckoutForm = ({ urlGlobal, stripeAchat }) => {
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState("");
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNotificationClose = () => {
    if (notification.type === "success") {
      navigate("/");
    }
    setNotification(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      setNotification({ message: "Stripe n'est pas correctement initialisé.", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${urlGlobal}`, // Redirection après le paiement
        },
        redirect: "if_required",
      });

      setLoading(false);

      if (error) {
        setNotification({ message: error.message, type: "error" });
      } else if (paymentIntent.status === "succeeded") {
        setNotification({ message: "Paiement réussi ! 🎉", type: "success" });
      } else {
        setNotification({ message: `Paiement en attente : ${paymentIntent.status}`, type: "error" });
      }
    } catch (err) {
      console.error("Erreur inattendue :", err);
      setNotification({ message: "Une erreur inattendue s'est produite.", type: "error" });
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="checkout-form">
        <PaymentElement options={{ paymentMethodOrder: ["card"] }} />
        <button disabled={loading} className="pay-button">
          {loading ? "Paiement en cours..." : "Pay"}
        </button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </form>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleNotificationClose}
        />
      )}
    </div>
  );
};

const PaymentPage = ({ stripePromise, stripeAchat, urlGlobal }) => {
  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="summary-container">
          <h2>Résumé de la commande</h2>
          <ul className="order-summary">
            <li>
              <span>Commande</span>
              <span>{(stripeAchat.amount / 100).toFixed(2)} €</span>
            </li>
            <li>
              <span>Frais protection acheteurs</span>
              <span>0.40 €</span>
            </li>
            <li>
              <span>Frais de port</span>
              <span>0.80 €</span>
            </li>
          </ul>
          <div className="total">
            <span>Total</span>
            <span>{(stripeAchat.amount / 100 + 0.4 + 0.8).toFixed(2)} €</span>
          </div>
          <p className="product-info">
            Il ne vous reste plus qu'une étape pour vous offrir{" "}
            <strong className="strong">{stripeAchat.title}</strong>. Vous allez
            payer{" "}
            <strong className="strong">
              {(stripeAchat.amount / 100 + 0.4 + 0.8).toFixed(2)} €
            </strong>{" "}
            (frais de protection et frais de port inclus).
          </p>
        </div>
        <Elements
          stripe={stripePromise}
          options={{ clientSecret: stripeAchat.clientSecret }}
        >
          <CheckoutForm urlGlobal={urlGlobal} stripeAchat={stripeAchat} />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentPage;

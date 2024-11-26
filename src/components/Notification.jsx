import { useEffect } from "react";
import "./styles/Notification.css"; // Style du composant

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    // Ferme automatiquement la notification après 3 secondes
    const timer = setTimeout(() => {
      onClose();
    }, 1000);

    return () => clearTimeout(timer); // Nettoie le timer si le composant est démonté
  }, [onClose]);

  return (
    <div className={`notification ${type === "success" ? "success" : "error"}`}>
      <span>{message}</span>
      <button className="close-button" onClick={onClose}>
        &times;
      </button>
    </div>
  );
};

export default Notification;


import "./styles/Button.css";

const Button = ({ label, onClick, style }) => {
  return (
    <button
      // className="header-button button-login-signup"
      className={`header-button ${style}`}
  
      onClick={onClick}
  
    >
      {label}
    </button>
  );
};

export default Button;

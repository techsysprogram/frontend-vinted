import { useState, useEffect } from "react";

import { Link, useLocation } from "react-router-dom";

import "./styles/Header.css";

//import components
import Button from "./Button";
import SearchInput from "./SearchInput";
import ToggleSwitch from "./ToggleSwitch";
import RangeSlider from "./RangeSlider";

import logo from "../assets/img/logo-a7c93c98.png";

const Header = ({ setFiltres, handleButton, token }) => {
  const [searchValue, setSearchValue] = useState("");
  const [isActive, setIsActive] = useState(false);

  const [values, setValues] = useState([10, 100]); // Min et Max

  useEffect(() => {
    setFiltres({
      title: searchValue,
      priceMin: values[0],
      priceMax: values[1],
      sort: isActive ? "price-desc" : "price-asc",
    });
  }, [searchValue, isActive, values]);

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const location = useLocation();

  const AfficherFiltre = !location.pathname.includes("/offers") && !location.pathname.includes("/publish") && !location.pathname.includes("/payment");

  return (
    <>
      <header className="header-container">
        <Link to="/">
          <img className="header-logo" src={logo} alt="vinted" />
        </Link>

        <div>
          <SearchInput
            placeholder="Recherche des articles"
            value={searchValue}
            onChange={handleSearchChange}
          />

          {AfficherFiltre  && (
            <div className="search-filtres">
              <ToggleSwitch onClick={handleToggle} isActive={isActive} />
              <RangeSlider values={values} setValues={setValues} />
            </div>
          )}
        </div>

        <div className="header-links">
          {token === null ? ( //si non identifié
            <>
              <Button
                label="S'inscrire"
                onClick={() => handleButton("signup")}
                style="header-button button-login-signup"
              />
              <Button
                label="Se connecter"
                onClick={() => handleButton("login")}
                style="header-button button-login-signup"
              />
            </>
          ) : (
            // identifié
            <Button
              label="Se déconnecter"
              onClick={() => handleButton("logout")}
              style="header-button button-desconenct"
            />
          )}
        </div>

        <Button
          label="Vends tes articles"
          onClick={() => handleButton("vendsArticles")}
          style="header-button button-solid"
        />
      </header>
    </>
  );
};

export default Header;

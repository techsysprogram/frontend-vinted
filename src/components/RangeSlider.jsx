import { useEffect, useState } from "react";
import { Range } from "react-range";
import "./styles/RangeSlider.css";

const RangeSlider = ({ values, setValues }) => {
  const STEP = 1; // Pas du slider
  const MIN = 0; // Limite minimale
  const MAX = 500; // Limite maximale

  // État local pour suivre les valeurs en temps réel
  const [tempValues, setTempValues] = useState(values);

  useEffect(() => {
    // Fonction pour mettre à jour les valeurs finales
    const handleMouseUp = () => {
      setValues(tempValues); // Met à jour les valeurs finales
    };

    // Ajouter les écouteurs globaux
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("touchend", handleMouseUp);

    // Nettoyer les écouteurs lorsqu'ils ne sont plus nécessaires
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleMouseUp);
    };
  }, [tempValues, setValues]); // Dépend de tempValues et setValues

  return (
    <div className="slider-container">
      <div className="slider-values">
        <span>Prix entre :</span>
      </div>
      <Range
        step={STEP}
        min={MIN}
        max={MAX}
        values={tempValues}
        onChange={(newValues) => setTempValues(newValues)} // Suivi en temps réel
        renderTrack={({ props, children }) => (
          <div {...props} className="slider-track">
            {children}
          </div>
        )}
        renderThumb={({ props, index }) => {
          const { key, ...restProps } = props;
          return (
            <div key={key} {...restProps} className="slider-thumb">
              <div className="slider-value">{tempValues[index]}€</div>
            </div>
          );
        }}
      />
    </div>
  );
};

export default RangeSlider;

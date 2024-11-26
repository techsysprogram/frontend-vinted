import "./styles/ToggleSwitch.css";

const ToggleSwitch = ({ onClick, isActive }) => {
  return (
    <div>
      <span style={{ marginRight: "10px"}}>Trier par prix :</span>
      <div className={`wrapper ${isActive ? "active" : ""}`} onClick={onClick}>
        <div className="knob">{isActive ? <span>⇣</span> : <span>⇡</span>}</div>
      </div>
    </div>
  );
};

export default ToggleSwitch;

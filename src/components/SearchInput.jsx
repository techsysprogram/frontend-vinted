import "./styles/SearchInput.css";

const SearchInput = ({ placeholder, onChange, value }) => {
  return (
    <div className="search-container">
      <span className="search-input-icon">🔍</span>
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

export default SearchInput;

const Item = ({ avatar, username, productImage, price, size, brand }) => {

    return (
      <div className="card-container">
        <div className="card-avatar-username">
          {avatar?.secure_url && <img alt={`Avatar de ${username}`} src={avatar.secure_url} />}
  
          <span>{username}</span>
  
        </div>
        <div>
          {productImage && <img src={productImage} alt="Product" />}
          <div className="card-price-size-brand">
            <span>{price} €</span>
            <span>{size}</span>
            <span>{brand}</span>
          </div>
        </div>
      </div>
    );
  };
  
  export default Item;
  
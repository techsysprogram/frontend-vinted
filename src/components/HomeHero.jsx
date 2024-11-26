import "./styles/HomeHero.css"; // Assurez-vous d'importer votre fichier CSS.

const HomeHero = ({ handleButton }) => {
  return (
    <div className="home-hero-bg-img">
      <img
        src="/src/assets/img/tear-cb30a259.svg"
        alt="forme"
        className="home-hero-forme"
      />
      <div>
        <div className="home-hero-ready">
          Prêts à faire du tri dans vos placards ?
          <button onClick={()=>handleButton("commencerVendre")}>Commencer à vendre</button>
        </div>
      </div>
    </div>
  );
};

export default HomeHero;

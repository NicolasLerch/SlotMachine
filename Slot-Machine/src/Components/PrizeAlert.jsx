import { useState, useEffect } from "react";
import "./prizeAlert.css";

export default function PrizeAlert({ prize, img, setVisible }) {
  const [prizeName, setPrizeName] = useState("");

  const handleClick = (e) => {
    e.preventDefault();
    setVisible(false);
  }


  return (
    <div className="prize-alert">
      <div className="prize-alert-container">
        <h1>¡FELICIDADES!</h1>
        <h2>Ganaste {prize}</h2>
        <img className="prize-img" src={img} alt={prizeName} />
        <button className="play-again-button" onClick={handleClick}>Jugar de nuevo</button>
      </div>
    </div>
  );
}
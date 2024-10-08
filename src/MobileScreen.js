import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import "./MobileScreen.css";

const MobileScreen = () => {
  const [playerName, setPlayerName] = useState("");
  const history = useHistory();

  const handleJoin = () => {
    if (playerName) {
      // Redirect to main screen with player name as query param
      history.push(`/?player=${encodeURIComponent(playerName)}`);
    }
  };

  return (
    <div className="mobile-container">
      <h1>Join the KBC Game</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className="player-input"
      />
      <button onClick={handleJoin} className="join-btn">
        Join Game
      </button>
    </div>
  );
};

export default MobileScreen;

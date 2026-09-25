import { useLocation } from "react-router-dom";
import LAYOUTS from "../../layouts/layouts";

const Game = () => {
  const location = useLocation();
  const players = location.state?.players ?? 2;
  const layout = LAYOUTS[players];

  if (!layout) {
    return <p>Invalid player count: {players}</p>;
  }

  return (
    <div className="flex flex-row">
      <div className="flex flex-col gap-5 ml-30 mt-30">
        <button>FLIP</button>
        <button>FREEZE</button>
      </div>
      <div className="game-board relative">
        {/* Deck sits at the center of the board */}
        <div
          className="deck absolute -translate-x-1/2 -translate-y-1/2"
          style={{
            left: "50%",
            top: "50%",
          }}
        >
          <p>Deck</p>
        </div>

        {layout.map((player, index) => (
          <div
            key={index}
            className={`player player-${index + 1} absolute -translate-x-1/2 -translate-y-1/2`}
            style={{
              left: `${player.x * 100}%`,
              top: `${player.y * 100}%`,
            }}
          >
            <p>{player.name}</p>
          </div>
        ))}
      </div>

      <div>
        <button className="mt-165 mr-10">How To Play</button>
      </div>
    </div>
  );
};

export default Game;

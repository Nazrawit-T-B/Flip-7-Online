import { useLocation } from "react-router-dom";
import LAYOUTS from "../../layouts/layouts";
const Game = () => {
  const location = useLocation();
  const players = location.state?.players ?? 2;
  {
    /** Different layout for different number of Players */
  }
  const layout = LAYOUTS[players];
  return (
    <div className="flex flex-row">
    <div className="flex flex-col gap-5 ml-30 mt-30">
    <button >FLIP</button>
    <button >FREZZE</button>
    </div>
    <div className="game-board">
      {layout.map((player, index) => (
        <div
          key={index}
          className={`player player-${index + 1}`}
          style={{
            left: `${player.x}px`,
            top: `${player.y}px`,
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

import { useState } from "react";
import "./app.css";
import {useNavigate} from 'react-router-dom';
const App = () => {
  const nav=useNavigate();
  const [players, setplayers] = useState(2);

  const addPlayer = () => {
    const value = players + 1;
    if (value < 6) {
      setplayers(value);
    } else {
      setplayers(6);
    }
  };

  const removePlayer = () => {
    const value = players - 1;
    if (value > 2) {
      setplayers(value);
    } else {
      setplayers(2);
    }
  };

  return (

    <div className="flex flex-col items-center justify-center gap-10 m-30">
      <h1 className="text-[#d8bfc8]">FLIP 7</h1>
      <h3 className="text-[#d8bfc8]"> PUSH YOUR LUCK</h3> 
      <div className="flex flex-row items-center justify-center gap-10">
        <div>
          <button onClick={addPlayer}>Add player +</button>
        </div>
        <div className="player-count">
          <h1 className="text-[#d8bfc8]">{players}</h1>
        </div>
        <div>
          <button onClick={removePlayer}>Remove player -</button>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center gap-10">
        <button onClick={()=>{nav('/play',{state:{players}})}}>Play Game </button>
        <button onClick={()=>{nav('/howto',{state:{players}})}}>How To Play</button>
      </div>
    </div>

  );
};
export default App;

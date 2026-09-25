import { useNavigate,useLocation } from "react-router-dom";
import RuleCTA from "/src/components/RuleCTA";

import Anatomy from "../components/AnatomyCTA";
import Special from "../components/SpecialCTA";

const How = () => {
  const nav = useNavigate();
  const location=useLocation();
  const players=location.state?.players??2;
  return (
    <div>
      <RuleCTA />
      <Anatomy />
      <Special />
      <div className="flex flex-row items-center justify-center gap-5 pb-5">
        <button onClick={()=>{
          nav('/play',{state:{players}})
        }}>Play Game </button>
        <button
          onClick={() => {
            nav("/");
          }}
        >
          Select Player Amount
        </button>
      </div>
    </div>
  );
};
export default How;

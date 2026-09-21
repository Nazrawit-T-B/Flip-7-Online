import { useNavigate } from "react-router-dom";
import RuleCTA from "/src/components/RuleCTA";

import Anatomy from "../components/AnatomyCTA";
import Special from "../components/SpecialCTA";

const How = () => {
  const nav = useNavigate();
  return (
    <div>
      <RuleCTA />
      <Anatomy />
      <Special />
      <div className="flex flex-row items-center justify-center gap-10">
        <button>Play Game </button>
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

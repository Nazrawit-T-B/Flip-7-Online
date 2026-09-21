import { Users, AlarmClock, Award, BadgeCheck } from "lucide-react";
const Rule = () => {
  return (
    <>
      <div className="pl-30 pt-10 pb-10">
        <div className="box">
          <div className="flex flex-row gap-30">
            <div className="text-[#5c2438]">
              <div className="bg-[#a8547184] rounded-xl w-70 pl-5 flex gap-2 pt-1 pb-1">
                <BadgeCheck/>
                <p>OFFICIAL RULES GUIDE</p>
              </div>
              <h2>Flip 7 Card Game</h2>
            </div>
            {/** 
            <div className="bg-[#5c2438] p-5 rounded-xl">
              <h2>7</h2>
            </div>
            */}
          </div>
          <p>Designed by Eric P.Ferry</p>
          <p>Fast, Tense, Addictive Card Flipping</p>
          <div className=" flex flex-row gap-10  pt-4">
            <div className=" text-[#5c2438] bg-white flex flex-col gap-3 justify-center items-center p-6 rounded-xl ">
              <Users />
              <p>2-8</p>
              <p>Players</p>
            </div>
            <div className=" text-[#5c2438] bg-white flex flex-col gap-3 justify-center items-center p-6 rounded-xl ">
              <AlarmClock />
              <p>15-20</p>
              <p>Mins</p>
            </div>
            <div className=" text-[#5c2438] bg-white flex flex-col gap-3 justify-center items-center p-6 rounded-xl ">
              <Award />
              <p>200 Pts</p>
              <p>To Win</p>
            </div>
          </div>
          <h3 className="text-[#5c2438]">The Objective</h3>
          <p>
            Score the most points by flipping cards into your active row. Bank
            your points by choosing to <span>Freeze,</span> or push your luck to
            collect <span>7 unique number cards</span> for a massive jackpot
            bonus.
          </p>
        </div>
      </div>
    </>
  );
};
export default Rule;

import { PlayingCards, Snowflake } from "lucide-react";
const Anatomy = () => {
  return (
    <>
      <h3 className="pl-30 pb-10">Anatomy of a turn</h3>
      <div className="pl-30 pb-10">
        <div className="box">
          <h3 className="text-[#5c2438]">Flip or Freeze </h3>
          <p>
            On your turn, choose to FLIP the top card from the deck into your
            collection, or FREEZE to lock in and safely bank your accumulated
            round points
          </p>
          <div className="pt-3 flex flex-row gap-2 justify-center items-center">
            <div className="flex flex-col gap-1 bg-[#a8547184] text-[#5c2438] justify-center items-center rounded-xl p-2">
              <PlayingCards />
              <h4>Flip</h4>
              <p>Draw & add to hand</p>
            </div>
            <div className="flex flex-col gap-1 bg-[#a8547184] text-[#5c2438] justify-center items-center rounded-xl p-2">
              <Snowflake />
              <h4>Flip</h4>
              <p>Bank points & stay</p>
            </div>
          </div>
        </div>
      </div>
      <div className="pl-30 pb-10 grid grid-cols-3 gap-20">
        <div className="a-box ">
          <h3 className="text-[#5c2438]">Avoid the Duplicate </h3>
          <p>
            Cards numbered 0 through 12 populate the deck.If you flip a number
            you already have in your active hand this round: YOU BUST! You
            forefiet all points accumulated for this round.
          </p>
        </div>
        <div className="a-box">
          <h3 className="text-[#5c2438]">Flip 7= Jackpot! </h3>
          <p>
            If you successfully reveal 7 unique number cards without busting,
            you trigger an instant round win, collect an extra +15 bonus points,
            and immediately lock in your score
          </p>
        </div>
      </div>
    </>
  );
};
export default Anatomy;

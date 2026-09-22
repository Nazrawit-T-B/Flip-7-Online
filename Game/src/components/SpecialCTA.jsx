const Special=()=>{
    return(
        <>
        <h3 className="pl-30 pb-10 text-[#5c2438]">Special Cards</h3>
        <div className=" pr-30 pl-30 pb-10 grid grid-cols-2 gap-5">
        <div className="a-box ">
          <h3 className="text-[#5c2438]">Second Chance </h3>
          <p className="text-[#c77d98]">
           Hold this card in front of you.When you draw a duplicate number card that would bust you, discard Second Chance instead of busting!
          </p>
        </div>
        <div className="a-box">
          <h3 className="text-[#5c2438]">Freeze Card </h3>
          <p className="text-[#c77d98]">
         Forces a chosen player (or yourself) to immediately stop flipping and lock in their current card score for the round
          </p>
        </div>
        <div className="a-box">
          <h3 className="text-[#5c2438]">Flip 3 </h3>
          <p className="text-[#c77d98]">
           You must immediately flip 3 cards consecutively! If any one duplicates, you bust out instantly unless protected.
          </p>
        </div>
        <div className="a-box">
          <h3 className="text-[#5c2438]">Modifiers </h3>
          <p className="text-[#c77d98]">
           Modifiers do not count as number cards toward the 7-card threshold, but add flat bonus points toward your banked round score!
          </p>
        </div>
      </div>
        </>
    )
}
export default Special
export const RoomMember = () => {

  const memberArray = ["ああきき", "いいああ", "うういい", "ええうう", "おおええ", "かかおお", "ききかか"];

  return (
    <div className="w-5/6 flex flex-col text-2xl space-y-2">
      {memberArray.map((member, index) => (
        <div key={index} className="p-1 w-full border-2 border-yellow-800 rounded-3xl text-center">{member}</div>
      ))}
    </div>
  );
};

export const RoomMember = () => {
  const memberArray = [
    "ああきき",
    "いいああ",
    "うういい",
    "ええうう",
    "おおええ",
    "かかおお",
    "ききかか",
  ];

  return (
    <div className="flex w-5/6 flex-col space-y-2 text-2xl">
      {memberArray.map((member, index) => (
        <div key={index} className="w-full rounded-3xl border-2 border-yellow-800 p-1 text-center">
          {member}
        </div>
      ))}
    </div>
  );
};

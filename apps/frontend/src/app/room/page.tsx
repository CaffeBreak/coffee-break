import { SelectRoom } from "../../components/ui/button/selectRoom";

const Room = () => {
  return (
    <div className="flex h-2/3 flex-col items-center justify-center space-y-10">
      <SelectRoom msg="部屋を作る" route="/room/create" />
      <SelectRoom msg="部屋へ参加" route="/room/join" />
    </div>
  );
};

export default Room;

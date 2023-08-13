import { SelectRoom } from "../../components/ui/button/selectRoom";

const Room = () => {
  return (
    <div className="flex h-2/3 flex-col items-center justify-center space-y-10">
      <SelectRoom msg="部屋を作る" />
      <SelectRoom msg="部屋へ参加" />
    </div>
  );
};

export default Room;

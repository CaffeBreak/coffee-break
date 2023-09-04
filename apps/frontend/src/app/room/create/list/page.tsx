import { ControlRoom } from "@/components/ui/button/controlRoom";
import { RoomInfo } from "@/components/ui/roomInfo";
import { RoomMember } from "@/components/ui/roomMember";

const RoomCreateList = () => {
  return (
    <div className="w-full h-2/3 flex">
      <div className="flex w-1/2 h-full flex-col items-center justify-center space-y-10">
        <ControlRoom msg="部屋を解散" type="end" />
        <RoomInfo />
        <ControlRoom msg="ゲームの開始" type="start" />
      </div>
      <div className="flex w-1/2 h-full flex-col items-center justify-center space-y-10">
        <RoomMember />
      </div>
    </div>
  );
};

export default RoomCreateList;

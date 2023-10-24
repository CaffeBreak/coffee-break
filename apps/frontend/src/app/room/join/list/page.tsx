import { ControlRoom } from "@/components/ui/button/controlRoom";
import { RoomInfo } from "@/components/ui/roomInfo";
import { RoomMember } from "@/components/ui/roomMember";

const RoomJoinList = () => {
  return (
    <div className="flex h-2/3 w-full">
      <div className="flex h-full w-1/2 flex-col items-center justify-center space-y-10">
        <ControlRoom msg="部屋を退出" type="end" />
        <RoomInfo />
        <ControlRoom msg="ゲームの開始" type="start" />
      </div>
      <div className="flex h-full w-1/2 flex-col items-center justify-center space-y-10">
        <RoomMember />
      </div>
    </div>
  );
};

export default RoomJoinList;

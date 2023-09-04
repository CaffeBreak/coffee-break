import { Enter } from "@/components/ui/button/enter";
import { InputText } from "@/components/ui/form/inputText";

const RoomCreate = () => {
  return (
    <div className="flex h-2/3 flex-col items-center justify-center space-y-10">
      <InputText placeholder="合言葉を入力" />
      <Enter dest="/room/create/list" />
    </div>
  );
};

export default RoomCreate;

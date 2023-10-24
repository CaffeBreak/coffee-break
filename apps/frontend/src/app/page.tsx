import { Enter } from "@/components/ui/button/enter";
import { InputText } from "@/components/ui/form/inputText";

const Home = () => {
  return (
    <>
      <div className="my-[70px] flex w-full flex-col items-center justify-center">
        <div className="my-2 mr-[130px] font-serif text-8xl italic">Caffe</div>
        <div className="my-2 ml-[130px] font-serif text-8xl italic">Break</div>
      </div>
      <div className="flex w-full justify-center">
        <InputText placeholder="名前を入力して焼きあがる" />
      </div>
      <div className="mt-[70px] flex w-full justify-center">
        <Enter dest="/room" />
      </div>
    </>
  );
};

export default Home;

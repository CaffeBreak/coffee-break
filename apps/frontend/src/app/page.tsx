import { Enter } from "../components/ui/button/enter";
import { Input } from "../components/ui/form/input";
import { Header } from "../components/ui/global/header";

const Home = () => {
  return (
    <div className="h-screen w-screen">
      <Header />
      <div className="my-[70px] flex w-full flex-col items-center justify-center">
        <div className="my-2 mr-[130px] font-serif text-8xl italic">Caffe</div>
        <div className="my-2 ml-[130px] font-serif text-8xl italic">Break</div>
      </div>
      <div className="flex w-full justify-center">
        <InputName />
      </div>
      <div className="mt-[70px] flex w-full justify-center">
        <Enter />
      </div>
    </div>
  );
};

export default Home;

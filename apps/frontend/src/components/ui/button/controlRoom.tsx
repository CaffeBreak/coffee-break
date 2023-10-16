interface Props {
  msg: string;
  type: string;
}

export const ControlRoom = (props: Props) => {
  let classValue;

  if (props.type === "end")
    classValue =
      "h-[60px] w-[200px] rounded-3xl border-2 border-yellow-800 bg-red-500 text-3xl text-white";
  else if (props.type === "start")
    classValue =
      "h-[60px] w-[200px] rounded-3xl border-2 border-yellow-800 bg-yellow-500 text-3xl text-white";

  return <button className={classValue}>{props.msg}</button>;
};

interface Props {
  msg: string;
  onClick: () => void;
}

export const EnterButton = (props: Props) => {
  return (
    <button
      className="h-[60px] w-[200px] rounded-3xl bg-yellow-500 text-3xl text-white"
      onClick={props.onClick}
    >
      {props.msg}
    </button>
  );
};

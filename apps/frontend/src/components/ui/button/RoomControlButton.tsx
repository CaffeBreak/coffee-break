interface Props {
  msg: string;
  color: string;
  onClick: () => void;
}

export const RoomControlButton = (props: Props) => {
  return (
    <button
      className={`h-[60px] w-[250px] rounded-3xl ${props.color} text-3xl text-white`}
      onClick={props.onClick}
    >
      {props.msg}
    </button>
  );
};

interface Props {
  onClick: () => void;
}

export const BackButton = (props: Props) => {
  return (
    <div className="flex h-full items-center">
      <button className="ml-[10px] text-3xl text-white" onClick={props.onClick}>
        {"<-|"}
      </button>
    </div>
  );
};

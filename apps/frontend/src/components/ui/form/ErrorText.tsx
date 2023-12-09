interface Props {
  msg: string;
}

export const ErrorText = (props: Props) => {
  return <div className="text-red-600">{props.msg}</div>;
};

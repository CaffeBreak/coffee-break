interface Props {
  placeholder: string;
}

export const InputText = (props: Props) => {
  return (
    <input
      type="text"
      placeholder={props.placeholder}
      className="h-[60px] w-[450px] rounded border-b-8 border-yellow-900 bg-yellow-500 px-2 text-center text-3xl text-white placeholder:text-white"
    />
  );
};

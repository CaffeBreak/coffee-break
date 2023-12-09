import { Dispatch, SetStateAction } from "react";

interface Props {
  value?: string;
  placeholder?: string;
  onChange: Dispatch<SetStateAction<string>>;
  hideError?: Dispatch<SetStateAction<boolean>>;
  onKeyDown?: () => void;
}

export const InputText = (props: Props) => {
  return (
    <input
      type="text"
      className="h-[60px] w-[450px] rounded border-b-8 border-yellow-900 bg-yellow-500 px-2 text-center text-3xl text-white placeholder:text-white"
      value={props.value}
      placeholder={props.placeholder}
      onChange={(event) => {
        props.onChange(event.target.value);
        props.hideError && props.hideError(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          props.onKeyDown && props.onKeyDown();
        }
      }}
    />
  );
};

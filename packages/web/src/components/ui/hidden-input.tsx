export function HiddenInput(props: Partial<HTMLInputElement>) {
  return (
    <input
      name={props.name}
      readOnly
      type="text"
      hidden
      aria-hidden
      aria-readonly
      value={props.value}
      className="hidden"
    />
  );
}

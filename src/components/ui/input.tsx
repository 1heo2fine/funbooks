"use client";

export function Input(props: { placeholder: string; }) {
  return (
    <input
      type="text"
      placeholder={props.placeholder}
      className="border border-base-content/50 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
    />
  );
}
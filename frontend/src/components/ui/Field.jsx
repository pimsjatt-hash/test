import React from "react";

export function Label({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
    >
      {children}
    </label>
  );
}

export function Input(props) {
  return (
    <input
      {...props}
      className={[
        "w-full rounded-xl border border-neutral-300 dark:border-neutral-700",
        "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100",
        "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
        "px-3.5 py-2.5 text-sm",
        "focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40",
        "focus:border-blue-500 transition-all",
        props.className || ""
      ].join(" ")}
    />
  );
}

export function Textarea(props) {
  return (
    <textarea
      rows={props.rows ?? 4}
      {...props}
      className={[
        "w-full rounded-xl border border-neutral-300 dark:border-neutral-700",
        "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100",
        "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
        "px-3.5 py-2.5 text-sm",
        "focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/40",
        "focus:border-blue-500 transition-all resize-y",
        props.className || ""
      ].join(" ")}
    />
  );
}

export function HelpText({ children }) {
  return (
    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{children}</p>
  );
}

export function ErrorText({ children }) {
  if (!children) return null;
  return <p className="text-sm text-red-600 mt-2">{children}</p>;
}

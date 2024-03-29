import React from "react";
import { Link } from "react-router-dom";

type FormNoSubmittingBtn = (e: React.MouseEvent<HTMLButtonElement>) => void;

type SimpleBtn = () => void;
interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  to?: string;
  type: "primary" | "small" | "secondary" | "round";
  onClick?: SimpleBtn | FormNoSubmittingBtn;
}

const Button: React.FC<ButtonProps> = ({
  children,
  disabled,
  to,
  type,
  onClick,
}) => {
  const base =
    "inline-block text-sm  rounded-full bg-lime-500  font-semibold uppercase tracking-wide text-gray-700 transition-colors duration-300 hover:bg-lime-400 focus:bg-lime-400 focus:outline-none focus:ring focus:ring-lime-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400";

  const styles = {
    primary: base + " px-4 py-3 md:px-6 md:py-4",
    small: base + " py-2 md:px-5 md:py-2.5 text-xs",
    round: base + " px-2 py-1 md:px-3.5 md:py-2 text-sm rounded-full",
    secondary:
      "inline-block text-sm rounded-full bg-transparent  font-semibold border-2 border-stone-300 uppercase tracking-wide text-gray-700 transition-colors duration-300 hover:bg-stone-300 focus:bg-stone-300 hover:text-stone-800 focus:outline-none focus:ring focus:ring-stone-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-slate-400 px-4 py-2.5 md:px-6 md:py-3.5",
  };

  if (to) {
    return (
      <Link className={styles[type]} to={to}>
        {children}
      </Link>
    );
  }

  if (onClick) {
    return (
      <button onClick={onClick} disabled={disabled} className={styles[type]}>
        {children}
      </button>
    );
  }
  return (
    <button disabled={disabled} className={styles[type]}>
      {children}
    </button>
  );
};

export default Button;

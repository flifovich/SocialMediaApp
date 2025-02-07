import { ButtonHTMLAttributes } from "react";
import classes from "./Button.module.scss";
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    outline?: boolean;
    size: "small" | "medium" | "large"
}

export function Button({outline, size = "large", className, children, ...others} : ButtonProps){
    return <button {...others} className={`${classes.root} ${outline ? classes.outline : ""} ${classes[size]} ${className}`}>{children}</button>
}
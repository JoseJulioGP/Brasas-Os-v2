import { useState } from "react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthInput } from "./AuthInput";

export const AuthPasswordInput = ({ ...props }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <AuthInput
      label="Contraseña"
      type={isVisible ? "text" : "password"}
      placeholder="••••••••"
      icon={FaLock}
      endContent={
        <button
          type="button"
          onClick={() => setIsVisible(!isVisible)}
          className="focus:outline-none shrink-0"
        >
          {isVisible ? (
            <FaEyeSlash className="text-xl text-white/30 pointer-events-none" />
          ) : (
            <FaEye className="text-xl text-white/30 pointer-events-none" />
          )}
        </button>
      }
      {...props}
    />
  );
};

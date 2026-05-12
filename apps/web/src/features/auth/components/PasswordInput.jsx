import { useState } from "react";
import { Input } from "@heroui/react";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export const PasswordInput = ({ label, placeholder, value, onChange, showToggle = true, size = "lg", className, ...props }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Input
      label={label}
      labelPlacement="outside"
      type={isVisible ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      isRequired
      variant="bordered"
      size={size}
      className={className}
      startContent={<FaLock className="text-white/40 mr-2 text-sm" />}
      endContent={
        showToggle ? (
          <button className="focus:outline-none" type="button" onClick={() => setIsVisible(!isVisible)}>
            {isVisible ? (
              <FaEyeSlash className="text-xl text-white/40 pointer-events-none" />
            ) : (
              <FaEye className="text-xl text-white/40 pointer-events-none" />
            )}
          </button>
        ) : undefined
      }
      classNames={{
        label: "font-body font-medium text-white/70 pb-1 text-sm",
        input: "font-body text-[#f5f0eb]",
        inputWrapper: "bg-white/[0.03] border-white/10 hover:border-orange-500/30 group-data-[focus=true]:border-orange-500/50 group-data-[focus=true]:ring-1 group-data-[focus=true]:ring-orange-500/20",
      }}
      {...props}
    />
  );
};

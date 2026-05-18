import { Button } from "@heroui/react";
import { FaArrowRight } from "react-icons/fa";

export const AuthSubmitButton = ({ children, isLoading, ...props }) => (
  <Button
    type="submit"
    size="lg"
    className="w-full font-bold bg-orange-600 text-white shadow-md hover:bg-orange-500 shadow-orange-600/20"
    isLoading={isLoading}
    endContent={!isLoading && <FaArrowRight className="ml-2" />}
    {...props}
  >
    {children}
  </Button>
);

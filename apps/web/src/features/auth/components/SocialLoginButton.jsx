import { Button } from "@heroui/react";
import { FaGoogle } from "react-icons/fa";

export const SocialLoginButton = ({ provider = "google", ...props }) => {
  const config = {
    google: { icon: FaGoogle, label: "Continuar con Google" },
  };
  const { icon: Icon, label } = config[provider] || config.google;

  return (
    <Button
      variant="bordered"
      size="lg"
      className="w-full font-semibold text-white/60 border-white/[0.12] hover:bg-white/[0.06]"
      startContent={<Icon className="text-red-400 mr-2" />}
      {...props}
    >
      {label}
    </Button>
  );
};

import { Input } from "@heroui/react";

export const AuthInput = ({ icon: Icon, ...props }) => (
  <Input
    variant="bordered"
    size="lg"
    fullWidth
    startContent={Icon && <Icon className="text-white/30 mr-2 text-sm shrink-0" />}
    classNames={{
      label: "font-semibold text-white/60 pb-1 font-body",
      input: "text-[#f5f0eb] font-body",
      inputWrapper:
        "glass border-white/[0.06] hover:border-orange-500/30 focus-within:border-orange-500/30 w-full",
    }}
    {...props}
  />
);

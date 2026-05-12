import { Alert } from "@heroui/react";

export const AuthErrorAlert = ({ error }) => {
  if (!error) return null;

  return (
    <Alert color="danger" variant="flat" className="mb-5">
      {error}
    </Alert>
  );
};

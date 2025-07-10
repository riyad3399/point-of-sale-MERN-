import React from "react";

interface CanProps {
  role: string;
  userPermissions: string[];
  children: React.ReactNode;
}

const Can = ({ role, userPermissions, children }: CanProps) => {
  return userPermissions.includes(role) ? <>{children}</> : null;
};

export default Can;

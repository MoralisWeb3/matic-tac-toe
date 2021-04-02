import React, { FC } from "react";

export const Header: FC<{ className?: string }> = ({ children, className }) => {
  return (
    <div className={`bg-light py-5 mb-4 ${className ?? ""}`}>
      <div className="container">{children}</div>
    </div>
  );
};

export const MainTitle = () => {
    return <h4 className="text-center">MaTic Tac Toe</h4>
}
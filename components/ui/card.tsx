import { FC, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card: FC<CardProps> = ({ children, className }) => (
  <div className={`p-4 bg-white rounded-2xl shadow ${className}`}>{children}</div>
);

export const CardContent: FC<CardProps> = ({ children, className }) => (
  <div className={`space-y-2 ${className}`}>{children}</div>
);

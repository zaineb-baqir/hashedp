import { FC, ReactNode } from "react";

export const Table: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <table className={`w-full border-collapse ${className}`}>{children}</table>
);

export const TableHeader: FC<{ children: ReactNode }> = ({ children }) => (
  <thead className="bg-gray-100">{children}</thead>
);

export const TableBody: FC<{ children: ReactNode }> = ({ children }) => <tbody>{children}</tbody>;

export const TableRow: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <tr className={`border-b ${className}`}>{children}</tr>
);

export const TableCell: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <td className={`p-2 ${className}`}>{children}</td>
);

import { type ReactNode } from "react";

type CardProps = {
  title: string;
  children?: ReactNode;
};

export function Card({ title, children }: CardProps) {
  return (
    <div className="bg-white px-6 py-8">
      <span className="font-display mb-4 inline-block text-2xl leading-tight font-bold text-blue-900 uppercase">
        {title}
      </span>
      <div className="text-blue-900">{children}</div>
    </div>
  );
}

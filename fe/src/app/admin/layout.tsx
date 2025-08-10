import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="bg-background min-h-screen">{children}</section>;
}

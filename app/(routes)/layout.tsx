import { Navbar } from "@/components/Navbar";
import "../globals.css";
export default async function RoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

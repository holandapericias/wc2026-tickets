import Navbar from "@/components/Navbar";

export default function RobertoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="max-w-[1600px] mx-auto px-4 py-6">
        {children}
      </main>
    </>
  );
}

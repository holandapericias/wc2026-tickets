import Navbar from "@/components/Navbar";
import SimulationBanner from "@/components/SimulationBanner";

export default function ScraperLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <SimulationBanner />
      <main className="max-w-[1600px] mx-auto px-4 py-6">
        {children}
      </main>
    </>
  );
}

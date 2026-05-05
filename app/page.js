import WeatherClient from "@/components/WeatherClient";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('/images/background.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/45 via-slate-950/30 to-slate-950/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_55%)]" />
      </div>

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
        <WeatherClient />
      </main>
    </div>
  );
}

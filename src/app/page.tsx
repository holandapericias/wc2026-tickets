export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-zinc-950 text-zinc-100">
      <div className="w-full max-w-md text-center space-y-4">
        <div className="inline-flex w-16 h-16 rounded-2xl bg-red-600 text-white text-2xl font-bold items-center justify-center mx-auto">
          WC
        </div>
        <h1 className="text-2xl font-bold">Meu Chaveamento — Copa 2026</h1>
        <p className="text-zinc-400 text-sm">
          Em construção. Etapa 1 de 9 (Setup) — pronto.
        </p>
        <p className="text-zinc-500 text-xs pt-4">
          Próxima etapa: carregar os 104 jogos, 12 grupos e seus 18 pacotes como seed.
        </p>
      </div>
    </main>
  );
}

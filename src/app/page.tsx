import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-8 px-6 py-16">
      <header className="space-y-2">
        <p className="text-sm font-medium tracking-wide text-content-subtle uppercase">
          Fase 0 · Cimientos
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Sistema de solicitudes</h1>
        <p className="text-content-muted">
          Prácticas profesionales y servicio social del CETIS 145.
        </p>
      </header>

      <section className="rounded-lg border border-line bg-surface p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Botones</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primario</Button>
          <Button variant="secondary">Secundario</Button>
          <Button variant="ghost">Fantasma</Button>
          <Button variant="danger">Peligro</Button>
          <Button isLoading>Cargando</Button>
        </div>
      </section>
    </main>
  );
}

export default function TrafficPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-2xl font-medium text-gray-900">AI Traffic</h1>
      <p className="mt-2 text-sm text-gray-500">
        Build this page per <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[12px]">docs/FEATURE_1.md</code>.
        Mock data is at <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[12px]">/visits.json</code> (run{" "}
        <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[12px]">npm run seed:visits</code> to generate it).
      </p>
      <div className="mt-8 rounded-xl border border-dashed border-gray-300 bg-gray-50/60 p-12 text-center text-sm text-gray-500">
        Replace this placeholder with the AI Traffic dashboard.
      </div>
    </main>
  );
}

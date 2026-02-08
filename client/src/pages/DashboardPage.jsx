import { Link } from 'react-router-dom';
import { models } from '../data/models';

export default function DashboardPage() {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Models Dashboard</h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {models.map((model) => (
          <article key={model.id} className="card">
            <h3 className="font-semibold">{model.name}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{model.summary}</p>
            <Link to={`/models/${model.id}`} className="mt-4 inline-block rounded-lg bg-brand-500 px-3 py-1.5 text-sm font-medium text-white">Open Model</Link>
          </article>
        ))}
      </div>
    </div>
  );
}

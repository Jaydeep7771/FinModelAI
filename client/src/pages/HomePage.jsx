import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const sections = [
  {
    title: 'What is Financial Modeling?',
    text: 'Financial modeling uses spreadsheet-style logic to simulate company outcomes and make better decisions.'
  },
  {
    title: 'Why It Matters',
    text: 'It improves valuation, budgeting, hiring, fundraising, and strategic planning with data-backed projections.'
  },
  {
    title: 'Who Should Use This?',
    text: 'Students, analysts, founders, and investors can all use scenario simulations to understand business performance.'
  }
];

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="card bg-gradient-to-r from-brand-600 to-cyan-600 text-white">
        <h2 className="text-3xl font-bold">Model smarter with FinModel Lab</h2>
        <p className="mt-3 max-w-2xl text-sm text-cyan-50">Interactive financial models with real-time outputs, charts, and educational guidance.</p>
        <Link to="/models" className="mt-6 inline-block rounded-xl bg-white px-4 py-2 font-semibold text-brand-700">Start Modeling</Link>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {sections.map((section) => (
          <motion.article key={section.title} whileHover={{ y: -4 }} className="card">
            <h3 className="font-semibold">{section.title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{section.text}</p>
          </motion.article>
        ))}
      </section>
    </div>
  );
}

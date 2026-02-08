import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
  Legend,
  Area,
  AreaChart
} from 'recharts';
import { commonEducation, modelConfigs } from '../../data/models';
import { fetchCompanyData, fetchFx, fetchMacro, fetchRatios } from '../../services/api';
import { exportCSV, exportPDF } from '../../utils/export';
import { useScenario } from '../../context/ScenarioContext';

const fallback = {
  overview: 'This model teaches assumptions, calculations, and decisions using practical finance logic.',
  analysts: 'Analysts use this model for planning, valuation, and risk analysis in investment memos.'
};

const healthBand = (value, metric) => {
  if (metric === 'de') return value < 1 ? 'Healthy' : value < 2 ? 'Moderate' : 'Risky';
  return value > 0.15 ? 'Healthy' : value > 0.08 ? 'Moderate' : 'Risky';
};

export default function ModelPage({ models }) {
  const { modelId } = useParams();
  const [symbolA, setSymbolA] = useState('AAPL');
  const [symbolB, setSymbolB] = useState('MSFT');
  const [remote, setRemote] = useState({});
  const config = modelConfigs[modelId];
  const { scenarios, saveScenario } = useScenario();
  const [inputs, setInputs] = useState(config?.defaults || { growthRate: 8, marginImprovement: 2 });

  useEffect(() => {
    if (config) {
      setInputs(scenarios[modelId] || config.defaults);
    }
  }, [modelId]);

  useEffect(() => {
    async function run() {
      try {
        const [companyA, companyB, ratios, macro, fx] = await Promise.all([
          fetchCompanyData(symbolA),
          fetchCompanyData(symbolB),
          fetchRatios(symbolA),
          fetchMacro('USA'),
          fetchFx('USD')
        ]);
        setRemote({ companyA, companyB, ratios, macro, fx });
      } catch {
        setRemote({});
      }
    }
    run();
  }, [symbolA, symbolB]);

  const model = models.find((item) => item.id === modelId);
  const result = useMemo(() => (config ? config.compute(inputs, remote.companyA?.revenue || 1000) : null), [inputs, remote, config]);

  if (!model) return <div className="card">Model not found</div>;

  const chartData =
    result?.cashFlows ||
    result?.schedule?.slice(0, 12) ||
    [
      { year: 1, value: result?.valuation || result?.units || result?.futureValue || 0 },
      { year: 2, value: result?.runway || result?.revenue || result?.wealthGained || 0 }
    ];

  const outputRows = Object.entries(result || {}).filter(([, value]) => typeof value === 'number');

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-2xl font-bold">{model.name}</h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{fallback.overview}</p>
        <p className="mt-2 rounded-lg bg-slate-100 p-2 text-sm dark:bg-slate-800"><strong>Formula:</strong> {config?.formula || 'Model-specific formula and logic vary by data source.'}</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="card">
          <h3 className="font-semibold">Editable Inputs</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {Object.entries(inputs).map(([key, value]) => (
              <label key={key} className="text-xs font-medium uppercase tracking-wide" title={`Assumption used in ${model.name} formula`} >
                {key}
                <input className="input" type="number" value={value} onChange={(e) => setInputs((prev) => ({ ...prev, [key]: Number(e.target.value) }))} />
              </label>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="rounded-lg bg-brand-500 px-3 py-1.5 text-sm text-white" onClick={() => saveScenario(modelId, inputs)}>Save Scenario</button>
            <button className="rounded-lg border px-3 py-1.5 text-sm" onClick={() => exportCSV(`${modelId}-summary.csv`, [['Metric', 'Value'], ...outputRows])}>Export CSV</button>
            <button className="rounded-lg border px-3 py-1.5 text-sm" onClick={() => exportPDF(model.name, outputRows.map(([k, v]) => `${k}: ${v.toFixed?.(2) || v}`).join('\n'))}>Export PDF</button>
          </div>
        </section>

        <section className="card">
          <h3 className="font-semibold">Real-time Outputs</h3>
          <div className="mt-3 space-y-2 text-sm">
            {outputRows.map(([key, value]) => (
              <div key={key} className="flex justify-between rounded-lg bg-slate-100 px-3 py-2 dark:bg-slate-800">
                <span>{key}</span>
                <strong>{value.toFixed(2)}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="card">
        <h3 className="font-semibold">Graph Visualization</h3>
        <div className="mt-3 h-72">
          <ResponsiveContainer>
            {modelId === 'break-even' ? (
              <LineChart data={Array.from({ length: 10 }, (_, i) => ({ x: i + 1, costs: inputs.fixedCosts + inputs.variableCost * (i + 1) * 100, revenue: inputs.price * (i + 1) * 100 }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line dataKey="costs" stroke="#ef4444" />
                <Line dataKey="revenue" stroke="#22c55e" />
              </LineChart>
            ) : modelId === 'loan' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="principal" fill="#2563eb" />
                <Bar dataKey="interest" fill="#f59e0b" />
              </BarChart>
            ) : (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={chartData[0]?.year ? 'year' : 'month'} />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey={chartData[0]?.fcf ? 'fcf' : chartData[0]?.value ? 'value' : 'principal'} stroke="#06b6d4" fill="#67e8f9" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="card">
          <h3 className="font-semibold">Live Example with Real Company Data</h3>
          <div className="mt-2 flex gap-2">
            <input className="input" value={symbolA} onChange={(e) => setSymbolA(e.target.value.toUpperCase())} />
            <input className="input" value={symbolB} onChange={(e) => setSymbolB(e.target.value.toUpperCase())} />
          </div>
          <p className="mt-3 text-sm">{symbolA}: Revenue {remote.companyA?.revenue?.toLocaleString?.() || '—'} vs {symbolB}: Revenue {remote.companyB?.revenue?.toLocaleString?.() || '—'}</p>
          <p className="text-sm">GDP benchmark: {remote.macro?.gdpGrowth || '—'}%</p>
          <p className="text-sm">USD/EUR: {remote.fx?.rates?.EUR || '—'}</p>
        </article>
        <article className="card">
          <h3 className="font-semibold">Ratio Health Indicator</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {remote.ratios && ['pe', 'roe', 'de', 'current'].map((metric) => {
              const val = Number(remote.ratios?.[metric] || 0);
              const band = healthBand(val, metric);
              const color = band === 'Healthy' ? 'text-emerald-500' : band === 'Moderate' ? 'text-amber-500' : 'text-rose-500';
              return <li key={metric} className="flex justify-between"><span>{metric.toUpperCase()}</span><strong className={color}>{val} ({band})</strong></li>;
            })}
          </ul>
        </article>
      </section>


      <section className="card text-sm">
        <h3 className="font-semibold">Mini Case Study Example</h3>
        <p className="mt-2">A mid-size SaaS company with improving margins uses this model to compare base vs conservative scenarios before board planning.</p>
      </section>

      <section className="card text-sm">
        <h3 className="font-semibold">How Analysts Use This</h3>
        <p className="mt-2">{fallback.analysts}</p>
        <h4 className="mt-4 font-semibold">Common Mistakes Analysts Make</h4>
        <ul className="list-inside list-disc">{commonEducation.mistakes.map((m) => <li key={m}>{m}</li>)}</ul>
        <h4 className="mt-4 font-semibold">Interview Questions Related to This Model</h4>
        <ul className="list-inside list-disc">{commonEducation.interview.map((q) => <li key={q}>{q}</li>)}</ul>
      </section>
    </div>
  );
}

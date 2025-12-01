import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const cards = [
  { title: 'Food diary', description: 'Scan barcodes, track macros, view daily totals and correlations.' },
  { title: 'Workouts', description: 'Strength + cardio logging with progress charts and routines.' },
  { title: 'Bowel tracker', description: 'Bristol scale, pain/blood flags, fiber correlations.' },
  { title: 'Meds & supplements', description: 'Doses, reminders, half-life timelines, Apple Health optional import.' },
  { title: 'Mood & libido', description: 'Daily sliders and insights.' },
  { title: 'Journal', description: 'Searchable notes with tags and audit trail.' },
  { title: 'Blood-work', description: 'Upload CSV/PDF, parse labs, trend markers over time.' },
  { title: 'AI coaching', description: 'Ollama-powered daily and weekly plans.' }
]

function App() {
  const [status, setStatus] = useState('checking...')
  const [plugins, setPlugins] = useState<string[]>([])

  useEffect(() => {
    axios.get('/api/health').then(res => setStatus(res.data.status)).catch(() => setStatus('offline'))
    axios.get('/api/').then(res => setPlugins(res.data.plugins)).catch(() => setPlugins([]))
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <header className="p-6 border-b border-slate-700 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Chronos Health</h1>
          <p className="text-slate-300">Privacy-first personal health OS — status: {status}</p>
          <p className="text-xs text-slate-400">Plugins loaded: {plugins.join(', ') || 'none'}</p>
        </div>
        <div className="text-right">
          <p>PWA ready · Offline capable</p>
          <p className="text-sm">AI model: configurable Ollama</p>
        </div>
      </header>
      <main className="p-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(card => (
          <article key={card.title} className="bg-slate-800 border border-slate-700 rounded-xl p-4 shadow-lg">
            <h2 className="text-xl font-semibold">{card.title}</h2>
            <p className="text-slate-300 text-sm">{card.description}</p>
          </article>
        ))}
        <article className="bg-emerald-800/40 border border-emerald-500 rounded-xl p-4">
          <h2 className="text-xl font-semibold">Automations</h2>
          <ul className="list-disc list-inside text-sm text-emerald-100">
            <li>Nightly: integrations + coaching</li>
            <li>Weekly: PDF reports + encrypted backups</li>
            <li>Rclone to ProtonDrive/Drive/Dropbox or local-only</li>
          </ul>
        </article>
      </main>
    </div>
  )
}

export default App

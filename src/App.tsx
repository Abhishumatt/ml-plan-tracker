import { useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { SettingsView } from './components/SettingsView';
import { TodayView } from './components/TodayView';
import { WeekView } from './components/WeekView';
import { usePlanStore } from './hooks/usePlanStore';

type Tab = 'dashboard' | 'today' | 'week' | 'settings';

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '◈' },
  { id: 'today', label: 'Today', icon: '◎' },
  { id: 'week', label: 'Milestones', icon: '◆' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('today');
  const { state, setStartDate, toggleTask, updateTask, setDayMeta, toggleMapItem, resetState, importState } =
    usePlanStore();

  return (
    <div className="mx-auto min-h-screen max-w-4xl px-4 py-6 pb-24">
      <nav className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-indigo-400">ML Mastery</p>
          <h1 className="text-lg font-semibold text-white">18-Week Tracker</h1>
        </div>
        <div className="hidden gap-1 md:flex">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                tab === t.id
                  ? 'bg-indigo-500/20 text-indigo-300'
                  : 'text-[var(--color-muted)] hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main>
        {tab === 'dashboard' && <Dashboard state={state} />}
        {tab === 'today' && (
          <TodayView
            state={state}
            toggleTask={toggleTask}
            updateTask={updateTask}
            setDayMeta={setDayMeta}
          />
        )}
        {tab === 'week' && <WeekView state={state} toggleMapItem={toggleMapItem} />}
        {tab === 'settings' && (
          <SettingsView
            state={state}
            startDate={state.startDate}
            setStartDate={setStartDate}
            importState={importState}
            resetState={resetState}
          />
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-4xl">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-3 text-xs ${
                tab === t.id ? 'text-indigo-400' : 'text-[var(--color-muted)]'
              }`}
            >
              <span className="text-base">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

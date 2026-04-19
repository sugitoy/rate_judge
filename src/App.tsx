import { useState } from 'react';
import { Settings, Edit3, BarChart2, Trash2, Plus } from 'lucide-react';
import { ConfigurationTab } from './components/features/configuration/ConfigurationTab';
import { ScoringTab } from './components/features/scoring/ScoringTab';
import { DashboardTab } from './components/features/dashboard/DashboardTab';
import { useTournamentStore } from './store/useTournamentStore';
import { useScoringStore } from './store/useScoringStore';
import { MESSAGES } from './constants/messages';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState<'config' | 'score' | 'dash'>('config');
  const [triggerCreateNew, setTriggerCreateNew] = useState(0);

  const {
    tournaments,
    activeTournamentId,
    setActiveTournament,
    clearTournaments
  } = useTournamentStore();

  const {
    clearAllScores
  } = useScoringStore();

  const handleAddTournament = () => {
    setActiveTab('config');
    setTriggerCreateNew(prev => prev + 1);
  };

  const handleGlobalClear = () => {
    if (window.confirm(MESSAGES.HEADER_CLEAR_CONFIRM)) {
      clearTournaments();
      clearAllScores();
      alert(MESSAGES.HEADER_CLEAR_SUCCESS);
    }
  };

  const tournamentList = Object.values(tournaments);

  return (
    <div className="app-container tabular-nums">
      <header className="app-header">
        <div className="container-fluid header-content" style={{ whiteSpace: 'nowrap', flexWrap: 'nowrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'nowrap', minWidth: 0 }}>
            <h1 className="app-title">{MESSAGES.APP_TITLE}</h1>

            {/* 大会切り替え */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid var(--color-border)', paddingLeft: '1.5rem', paddingTop: '0.25rem', paddingBottom: '0.25rem', whiteSpace: 'nowrap' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>{MESSAGES.HEADER_TOURNAMENT_SELECT}</span>
              {tournamentList.length > 0 ? (
                <select
                  className="form-input py-1 px-2 text-sm max-w-xs font-bold"
                  value={activeTournamentId || ''}
                  onChange={(e) => setActiveTournament(e.target.value)}
                >
                  {tournamentList.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.division})</option>
                  ))}
                </select>
              ) : (
                <span className="text-sm text-gray-400">{MESSAGES.HEADER_UNSET}</span>
              )}
              <button onClick={handleAddTournament} className="btn btn-primary flex items-center gap-1" style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}>
                <Plus size={14} /> {MESSAGES.CONFIG_ADD_TOURNAMENT}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
            <nav className="tab-nav">
              <button
                className={`tab-btn ${activeTab === 'config' ? 'active' : ''}`}
                onClick={() => setActiveTab('config')}
              >
                <Settings size={18} /> {MESSAGES.TAB_CONFIG}
              </button>
              <button
                className={`tab-btn ${activeTab === 'score' ? 'active' : ''}`}
                onClick={() => setActiveTab('score')}
              >
                <Edit3 size={18} /> {MESSAGES.TAB_SCORING}
              </button>
              <button
                className={`tab-btn ${activeTab === 'dash' ? 'active' : ''}`}
                onClick={() => setActiveTab('dash')}
              >
                <BarChart2 size={18} /> {MESSAGES.TAB_DASHBOARD}
              </button>
            </nav>

            <div style={{ borderLeft: '1px solid var(--color-border)', paddingLeft: '1rem', marginLeft: '0.25rem' }}>
              <button onClick={handleGlobalClear} className="btn" style={{ color: 'var(--color-danger)', background: 'var(--color-danger-bg)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.4rem 0.8rem', whiteSpace: 'nowrap' }}>
                <Trash2 size={14} /> {MESSAGES.HEADER_CLEAR_DATA}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container-fluid main-content">
        {activeTab === 'config' && <ConfigurationTab triggerCreateNew={triggerCreateNew} />}
        {activeTab === 'score' && <ScoringTab />}
        {activeTab === 'dash' && <DashboardTab />}
      </main>
    </div>
  );
}

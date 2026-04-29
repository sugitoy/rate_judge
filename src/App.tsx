import { useState, useRef, useEffect } from 'react';
import { Settings, Edit3, BarChart2, Trash2, Plus, Menu, X } from 'lucide-react';
import { ConfigurationTab } from './components/features/configuration/ConfigurationTab';
import { ScoringTab } from './components/features/scoring/ScoringTab';
import { AnalysisTab } from './components/features/analysis/AnalysisTab';
import { useTournamentStore } from './store/useTournamentStore';
import { useScoringStore } from './store/useScoringStore';
import { MESSAGES } from './constants/messages';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState<'config' | 'score' | 'analysis'>('config');
  const [triggerCreateNew, setTriggerCreateNew] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const {
    tournaments,
    activeTournamentId,
    setActiveTournament,
    clearTournaments
  } = useTournamentStore();

  const {
    clearAllScores
  } = useScoringStore();

  // メニュー外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddTournament = () => {
    setActiveTournament('');
    setActiveTab('config');
    setTriggerCreateNew(prev => prev + 1);
  };

  /** 設定タブボタンのクリックハンドラー
   * - 登録済み大会がない場合のみ新規作成モードをトリガーする
   * - 登録済み大会がある場合は選択中の大会を編集モードで開く
   */
  const handleOpenConfig = () => {
    setActiveTab('config');
    if (tournamentList.length === 0) {
      setTriggerCreateNew(prev => prev + 1);
    }
  };

  const handleGlobalClear = () => {
    if (window.confirm(MESSAGES.HEADER_CLEAR_CONFIRM)) {
      clearTournaments();
      clearAllScores();
      alert(MESSAGES.HEADER_CLEAR_SUCCESS);
    }
  };

  const handleTabChange = (tab: 'config' | 'score' | 'analysis') => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  const tournamentList = Object.values(tournaments);

  // 大会コントロール（デスクトップ・モバイル共通パーツ）
  // 大会コントロール（デスクトップ・モバイル共通パーツ）
  const TournamentControls = ({ fullWidth = false }: { fullWidth?: boolean }) => (
    <div className={fullWidth ? 'flex flex-col gap-2 items-center py-1' : 'hidden lg:flex items-center gap-2 border-l border-slate-200 pl-6 py-1 whitespace-nowrap'}>
      <span className="font-medium text-slate-500 whitespace-nowrap">
        {MESSAGES.HEADER_TOURNAMENT_SELECT}
      </span>
      {tournamentList.length > 0 ? (
        <select
          className="form-input py-1 px-2 text-sm font-bold w-full max-w-64 lg:max-w-none"
          value={activeTournamentId || ''}
          onChange={(e) => { setActiveTournament(e.target.value); if (fullWidth) setMenuOpen(false); }}
        >
          {/* 未選択状態（新規作成中など）のプレースホルダー */}
          {!activeTournamentId && (
            <option value='' disabled>（未選択）</option>
          )}
          {tournamentList.map(t => (
            <option key={t.id} value={t.id}>{t.name} ({t.division})</option>
          ))}
        </select>
      ) : (
        <span className="text-sm text-slate-400">{MESSAGES.HEADER_UNSET}</span>
      )}
      <button
        onClick={() => { handleAddTournament(); setMenuOpen(false); }}
        className="btn btn-primary flex items-center gap-1 w-full lg:w-auto"
      >
        <Plus size={14} /> {MESSAGES.CONFIG_ADD_TOURNAMENT}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col pt-16 tabular-nums bg-slate-50 text-slate-950">
      <header className="bg-white border-b border-slate-200 fixed top-0 left-0 right-0 z-50 shadow-sm" ref={headerRef}>
        <div className="w-full px-4 lg:px-8 h-16 flex items-center justify-between">

          {/* 左側: タイトル + デスクトップ用大会コントロール */}
          <div className="flex items-center gap-6 min-w-0">
            <h1 className="text-xl font-bold text-primary tracking-tight whitespace-nowrap">
              {MESSAGES.APP_TITLE}
            </h1>
            <TournamentControls />
          </div>

          {/* 右側: デスクトップ用タブナビ + クリアボタン */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            <nav className="flex gap-2">
              <button
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'config' ? 'bg-primary-light text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'}`}
                onClick={handleOpenConfig}
              >
                <Settings size={18} /> {MESSAGES.TAB_CONFIG}
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'score' ? 'bg-primary-light text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'}`}
                onClick={() => setActiveTab('score')}
              >
                <Edit3 size={18} /> {MESSAGES.TAB_SCORING}
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'analysis' ? 'bg-primary-light text-primary' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950'}`}
                onClick={() => setActiveTab('analysis')}
              >
                <BarChart2 size={18} /> {MESSAGES.TAB_ANALYSIS}
              </button>
            </nav>

            <div className="border-l border-slate-200 pl-4 ml-1">
              <button
                onClick={handleGlobalClear}
                className="btn bg-danger-bg text-danger hover:opacity-80 flex items-center gap-1 px-3 py-1.5 whitespace-nowrap"
              >
                <Trash2 size={14} /> {MESSAGES.HEADER_CLEAR_DATA}
              </button>
            </div>
          </div>

          {/* ハンバーガーボタン（狭い画面のみ表示） */}
          <button
            className="lg:hidden flex items-center justify-center p-2 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-950 transition-all"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* モバイルドロップダウンメニュー */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-6 flex flex-col gap-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
            {/* タブナビ */}
            <nav className="flex justify-center gap-2 border-b border-slate-100 pb-4">
              <button
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'config' ? 'bg-primary-light text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
                onClick={() => { handleOpenConfig(); setMenuOpen(false); }}
              >
                <Settings size={18} /> {MESSAGES.TAB_CONFIG}
              </button>
              <button
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'score' ? 'bg-primary-light text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
                onClick={() => handleTabChange('score')}
              >
                <Edit3 size={18} /> {MESSAGES.TAB_SCORING}
              </button>
              <button
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'analysis' ? 'bg-primary-light text-primary' : 'text-slate-500 hover:bg-slate-50'}`}
                onClick={() => handleTabChange('analysis')}
              >
                <BarChart2 size={18} /> {MESSAGES.TAB_ANALYSIS}
              </button>
            </nav>

            {/* 大会セレクター等 */}
            <TournamentControls fullWidth />

            {/* 全データ初期化 */}
            <div className="flex justify-center border-t border-slate-100 pt-4">
              <button
                onClick={() => { handleGlobalClear(); setMenuOpen(false); }}
                className="btn bg-danger-bg text-danger hover:opacity-80 flex items-center gap-1 px-5 py-2"
              >
                <Trash2 size={14} /> {MESSAGES.HEADER_CLEAR_DATA}
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 w-full py-6">
        <div className="px-4 lg:px-8 mx-auto max-w-[1600px]">
          {activeTab === 'config' && <ConfigurationTab triggerCreateNew={triggerCreateNew} />}
          {activeTab === 'score' && <ScoringTab />}
          {activeTab === 'analysis' && <AnalysisTab />}
        </div>
      </main>
    </div>
  );
}

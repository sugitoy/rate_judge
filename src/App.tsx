import { useState, useRef, useEffect } from 'react';
import { Settings, Edit3, BarChart2, Menu, X, Moon, Sun } from 'lucide-react';
import { ConfigurationTab } from './components/features/configuration/ConfigurationTab';
import { ScoringTab } from './components/features/scoring/ScoringTab';
import { AnalysisTab } from './components/features/analysis/AnalysisTab';
import { useTournamentStore } from './store/useTournamentStore';
import { MESSAGES } from './constants/messages';
import { useUIStore } from './store/useUIStore';
import { cn } from './utils/cn';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState<'config' | 'score' | 'analysis'>('config');
  const [triggerCreateNew, setTriggerCreateNew] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  const {
    tournaments,
    activeTournamentId
  } = useTournamentStore();

  const activeT = activeTournamentId ? tournaments[activeTournamentId] : null;

  const { isSidePanelOpen, isConfigDirty, theme, setTheme } = useUIStore();

  // テーマの適用
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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

  const handleTabChange = (tab: 'config' | 'score' | 'analysis') => {
    if (activeTab === 'config' && tab !== 'config' && isConfigDirty) {
      if (!window.confirm(MESSAGES.CONFIG_UNSAVED_CONFIRM)) return;
    }
    setActiveTab(tab);
    setMenuOpen(false);
  };

  const tournamentList = Object.values(tournaments);

  return (
    <div className="min-h-screen flex flex-col pt-16 tabular-nums bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <header className="bg-white border-b border-slate-200 fixed top-0 left-0 right-0 z-50 shadow-sm dark:bg-slate-900 dark:border-slate-600 dark:shadow-[0_4px_25px_rgba(0,0,0,0.6)]" ref={headerRef}>
        <div className="w-full px-4 lg:px-8 h-16 flex items-center justify-between">

          {/* 左側: タイトル + 大会情報 + 主要タブ */}
          <div className="flex items-center gap-8 min-w-0 flex-1">
            <div className="flex items-center gap-4 shrink-0">
              <h1
                className="text-xl font-black tracking-tight whitespace-nowrap cursor-pointer hover:opacity-80 transition-all text-slate-900 dark:text-white"
                onClick={() => handleTabChange('config')}
              >
                Rate<span className="text-primary dark:text-cyan-400">Judge</span>{import.meta.env.DEV && " (テスト環境)"}
              </h1>
              {activeT && (
                <div className="hidden sm:flex items-center gap-3 border-l border-slate-200 dark:border-slate-800 pl-4 overflow-hidden">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate max-w-[200px] lg:max-w-none">
                    {activeT.name}
                  </span>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded shadow-sm shrink-0">
                    {activeT.division}
                  </span>
                </div>
              )}
            </div>

            <nav className="hidden lg:flex gap-1">
              <button
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'score' ? 'bg-primary-light text-primary dark:bg-cyan-500/20 dark:text-cyan-400 dark:shadow-[0_0_12px_rgba(6,182,212,0.2)]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'}`}
                onClick={() => handleTabChange('score')}
              >
                <Edit3 size={18} /> {MESSAGES.TAB_SCORING}
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'analysis' ? 'bg-primary-light text-primary dark:bg-cyan-500/20 dark:text-cyan-400 dark:shadow-[0_0_12px_rgba(6,182,212,0.2)]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'}`}
                onClick={() => handleTabChange('analysis')}
              >
                <BarChart2 size={18} /> {MESSAGES.TAB_ANALYSIS}
              </button>
            </nav>
          </div>

          {/* 右側: 設定タブ + テーマ切替 */}
          <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-950 transition-all dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'config' ? 'bg-primary-light text-primary dark:bg-cyan-500/20 dark:text-cyan-400 dark:shadow-[0_0_12px_rgba(6,182,212,0.2)]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'}`}
              onClick={handleOpenConfig}
            >
              <Settings size={18} /> {MESSAGES.TAB_CONFIG}
            </button>
          </div>

          {/* ハンバーガーボタン（狭い画面のみ表示） */}
          <button
            className="lg:hidden flex items-center justify-center p-2 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-950 dark:hover:text-slate-100 transition-all"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label={menuOpen ? MESSAGES.SIDE_PANEL_CLOSE : MESSAGES.SIDE_PANEL_OPEN}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* モバイルドロップダウンメニュー */}
        {menuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-6 flex flex-col gap-6 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
            {/* モバイル用テーマ切替 */}
            <div className="flex items-center justify-between px-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Rate<span className="text-primary dark:text-cyan-400">Judge</span>
              </h1>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
              >
                {theme === 'dark' ? <><Sun size={18} /> ライトモード</> : <><Moon size={18} /> ダークモード</>}
              </button>
            </div>
            {/* タブナビ */}
            <nav className="flex justify-center gap-2 border-t border-slate-100 dark:border-slate-800 pt-6">
              <button
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'config' ? 'bg-primary-light text-primary dark:bg-cyan-500/20 dark:text-cyan-400 dark:shadow-[0_0_12px_rgba(6,182,212,0.2)]' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'}`}
                onClick={() => { handleOpenConfig(); setMenuOpen(false); }}
              >
                <Settings size={18} /> {MESSAGES.TAB_CONFIG}
              </button>
              <button
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'score' ? 'bg-primary-light text-primary dark:bg-cyan-500/20 dark:text-cyan-400 dark:shadow-[0_0_12px_rgba(6,182,212,0.2)]' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'}`}
                onClick={() => handleTabChange('score')}
              >
                <Edit3 size={18} /> {MESSAGES.TAB_SCORING}
              </button>
              <button
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'analysis' ? 'bg-primary-light text-primary dark:bg-cyan-500/20 dark:text-cyan-400 dark:shadow-[0_0_12px_rgba(6,182,212,0.2)]' : 'text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'}`}
                onClick={() => handleTabChange('analysis')}
              >
                <BarChart2 size={18} /> {MESSAGES.TAB_ANALYSIS}
              </button>
            </nav>
          </div>
        )}
      </header>

      <main className={cn(
        "flex-1 w-full py-6 transition-all duration-300",
        isSidePanelOpen ? "lg:pr-80" : "lg:pr-16"
      )}>
        <div className="px-4 lg:px-8 mx-auto max-w-[1600px]">
          {activeTab === 'config' && (
            <ConfigurationTab
              triggerCreateNew={triggerCreateNew}
              onTriggerConsumed={() => setTriggerCreateNew(0)}
            />
          )}
          {activeTab === 'score' && <ScoringTab />}
          {activeTab === 'analysis' && <AnalysisTab />}
        </div>
      </main>
    </div>
  );
}

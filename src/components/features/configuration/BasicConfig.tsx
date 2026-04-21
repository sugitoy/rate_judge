// src/components/features/configuration/BasicConfig.tsx
import React from 'react';
import { Upload, Download, Plus, Trash2 } from 'lucide-react';
import type { TournamentConfig, Criteria } from '../../../types';
import { MESSAGES } from '../../../constants/messages';

interface BasicConfigProps {
  localT: TournamentConfig;
  setLocalT: React.Dispatch<React.SetStateAction<TournamentConfig>>;
  handleConfigCSV: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExportConfig: () => void;
  downloadConfigSample: () => void;
}

export const BasicConfig: React.FC<BasicConfigProps> = ({
  localT,
  setLocalT,
  handleConfigCSV,
  handleExportConfig,
  downloadConfigSample
}) => {

  const addCriteria = () => {
    setLocalT(prev => ({
      ...prev,
      criteria: [...prev.criteria, { id: Date.now().toString() + Math.random(), name: '', maxScore: 10 }]
    }));
  };

  const updateCriteria = (id: string, field: keyof Criteria, value: string | number) => {
    setLocalT(prev => ({
      ...prev,
      criteria: prev.criteria.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  const removeCriteria = (id: string) => {
    setLocalT(prev => ({ ...prev, criteria: prev.criteria.filter(c => c.id !== id) }));
  };

  return (
    <div className="card shadow-md bg-white w-full animate-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 border-b border-slate-100 pb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 leading-none mb-1">{MESSAGES.CONFIG_BASIC_TITLE}</h3>
          <p className="text-xs text-slate-400">{MESSAGES.CONFIG_NAME_LABEL}・審査項目等の管理</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={downloadConfigSample} className="text-primary hover:text-primary-hover text-[10px] uppercase font-bold px-3 py-1.5 rounded bg-primary-light/50 transition-colors mr-2">
            {MESSAGES.CSV_SAMPLE_DL}
          </button>
          <label className="btn btn-outline btn-action cursor-pointer flex items-center gap-1.5 shadow-sm bg-white">
            <Download size={16} /> {MESSAGES.CSV_CONFIG_SAMPLE}
            <input type="file" accept=".csv" onChange={handleConfigCSV} className="hidden" />
          </label>
          <button onClick={handleExportConfig} className="btn btn-outline btn-action flex items-center gap-1.5 shadow-sm bg-white">
            <Upload size={16} /> {MESSAGES.CSV_CONFIG_EXPORT}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: General Info */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{MESSAGES.CONFIG_NAME_LABEL} <span className="text-danger">{MESSAGES.REQUIRE_MARK}</span></label>
            <input
              type="text"
              className="form-input text-base py-2.5 px-4 bg-slate-50/50 border-slate-200 focus:bg-white"
              value={localT.name}
              onChange={e => setLocalT({ ...localT, name: e.target.value })}
              placeholder={MESSAGES.CONFIG_NAME_PH}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{MESSAGES.CONFIG_DIV_LABEL}</label>
            <input
              type="text"
              className="form-input text-base py-2.5 px-4 bg-slate-50/50 border-slate-200 focus:bg-white"
              value={localT.division}
              onChange={e => setLocalT({ ...localT, division: e.target.value })}
              placeholder={MESSAGES.CONFIG_DIV_PH}
            />
          </div>

          <div className="flex flex-col gap-1.5 w-full md:w-56">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{MESSAGES.CONFIG_INPUT_UNIT_LABEL}</label>
            <select
              className="form-input text-base py-2.5 px-4 bg-slate-50/50 border-slate-200 focus:bg-white cursor-pointer"
              value={localT.inputUnit}
              onChange={e => setLocalT({ ...localT, inputUnit: Number(e.target.value) })}
            >
              <option value="1">{MESSAGES.CONFIG_UNIT_1}</option>
              <option value="0.5">{MESSAGES.CONFIG_UNIT_05}</option>
              <option value="0.1">{MESSAGES.CONFIG_UNIT_01}</option>
            </select>
          </div>
        </div>

        {/* Right: Criteria Settings */}
        <div className="flex-1 lg:border-l lg:border-slate-100 lg:pl-10">
          <div className="flex justify-between items-center mb-5">
            <h4 className="font-bold text-slate-700 text-sm flex items-center gap-2">
              {MESSAGES.CONFIG_CRITERIA_TITLE}
            </h4>
            {localT.criteria.length > 0 && (
              <div className="text-[10px] font-bold bg-primary-light text-primary px-3 py-1 rounded-full border border-primary/10 flex items-center gap-1.5">
                <span className="opacity-60">{MESSAGES.CONFIG_CRITERIA_TOTAL}</span>
                <span className="text-sm">{localT.criteria.reduce((sum, c) => sum + c.maxScore, 0)}</span>
                <span className="opacity-60">{MESSAGES.CONFIG_CRITERIA_PT}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {localT.criteria.map((c) => (
              <div key={c.id} className="flex gap-2 items-center group/item animate-in slide-in-from-right-2 duration-200">
                <input
                  type="text"
                  className="form-input text-sm py-2 px-3 flex-1 border-slate-200 bg-slate-50 group-hover/item:bg-white group-hover/item:border-slate-300 transition-all font-medium"
                  value={c.name}
                  onChange={e => updateCriteria(c.id, 'name', e.target.value)}
                  placeholder={MESSAGES.CONFIG_CRITERIA_PH}
                />
                <div className="relative w-24 shrink-0 group/score">
                  <input
                    type="number"
                    className="form-input text-sm py-2 pl-3 pr-8 w-full border-slate-200 bg-slate-50 group-hover/item:bg-white group-hover/item:border-slate-300 transition-all font-bold text-primary text-right"
                    value={c.maxScore}
                    onChange={e => updateCriteria(c.id, 'maxScore', Number(e.target.value))}
                    min={1}
                  />
                  <span className="text-[10px] font-bold text-slate-300 absolute right-2.5 top-1/2 -translate-y-1/2 uppercase select-none group-hover/score:text-primary/40 transition-colors">pt</span>
                </div>
                <button 
                  onClick={() => removeCriteria(c.id)} 
                  className="w-10 h-10 flex items-center justify-center text-slate-300 hover:text-danger hover:bg-danger-bg rounded-lg transition-all opacity-0 group-hover/item:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}

            {localT.criteria.length === 0 && (
              <div className="p-8 border-2 border-dashed border-slate-100 rounded-xl flex flex-col items-center justify-center gap-2">
                <div className="bg-slate-50 w-10 h-10 rounded-full flex items-center justify-center">
                  <Plus size={20} className="text-slate-200" />
                </div>
                <span className="text-xs text-slate-400 italic font-medium">
                  {MESSAGES.CONFIG_CRITERIA_EMPTY}
                </span>
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <button 
              onClick={addCriteria} 
              className="btn bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-primary hover:border-primary w-full flex items-center justify-center gap-2 py-3 dashed-border transition-all"
              style={{ borderStyle: 'dashed' }}
            >
              <Plus size={18} /> {MESSAGES.CONFIG_CRITERIA_ADD}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

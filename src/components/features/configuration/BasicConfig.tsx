// src/components/features/configuration/BasicConfig.tsx
import React from 'react';
import { Upload, Plus, Trash2 } from 'lucide-react';
import type { TournamentConfig, Criteria } from '../../../types';
import { MESSAGES } from '../../../constants/messages';

interface BasicConfigProps {
  localT: TournamentConfig;
  setLocalT: React.Dispatch<React.SetStateAction<TournamentConfig>>;
  handleConfigCSV: (e: React.ChangeEvent<HTMLInputElement>) => void;
  downloadConfigSample: () => void;
}

export const BasicConfig: React.FC<BasicConfigProps> = ({
  localT,
  setLocalT,
  handleConfigCSV,
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
    <div className="card shadow-sm bg-white" style={{ flex: 1, minWidth: 0 }}>
      <h3 className="text-xl font-bold mb-4 flex justify-between items-center border-b pb-4">
        <span className="flex-1">{MESSAGES.CONFIG_BASIC_TITLE}</span>
        <div className="flex gap-2">
          <button onClick={downloadConfigSample} className="btn text-blue-600 hover:underline text-sm p-0 gap-1 border-none bg-transparent">
            {MESSAGES.CSV_SAMPLE_DL}
          </button>
          <label className="btn btn-outline text-sm py-1 px-3 cursor-pointer mb-0 inline-flex items-center gap-1">
            <Upload size={14} /> {MESSAGES.CSV_CONFIG_SAMPLE}
            <input type="file" accept=".csv" onChange={handleConfigCSV} style={{ display: 'none' }} />
          </label>
        </div>
      </h3>

      <div style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group mb-0">
            <label className="form-label text-sm text-gray-500">{MESSAGES.CONFIG_NAME_LABEL} <span className="text-danger">{MESSAGES.REQUIRE_MARK}</span></label>
            <input 
              type="text" 
              className="form-input" 
              value={localT.name} 
              onChange={e => setLocalT({...localT, name: e.target.value})} 
              placeholder={MESSAGES.CONFIG_NAME_PH}
            />
          </div>
          
          <div className="form-group mb-0">
            <label className="form-label text-sm text-gray-500">{MESSAGES.CONFIG_DIV_LABEL}</label>
            <input 
              type="text" 
              className="form-input" 
              value={localT.division} 
              onChange={e => setLocalT({...localT, division: e.target.value})} 
              placeholder={MESSAGES.CONFIG_DIV_PH}
            />
          </div>
          
          <div className="form-group mb-0 w-48">
            <label className="form-label text-sm text-gray-500">{MESSAGES.CONFIG_INPUT_UNIT_LABEL}</label>
            <select 
              className="form-input" 
              value={localT.inputUnit}
              onChange={e => setLocalT({...localT, inputUnit: Number(e.target.value)})}
            >
              <option value="1">{MESSAGES.CONFIG_UNIT_1}</option>
              <option value="0.5">{MESSAGES.CONFIG_UNIT_05}</option>
              <option value="0.1">{MESSAGES.CONFIG_UNIT_01}</option>
            </select>
          </div>
        </div>
        
        <div style={{ flex: 1, borderLeft: '1px solid var(--color-border)', paddingLeft: '1.5rem' }}>
          <h4 className="font-bold text-gray-700 mb-3 text-sm flex justify-between items-center">
            {MESSAGES.CONFIG_CRITERIA_TITLE}
            {localT.criteria.length > 0 && (
              <span className="text-xs font-normal bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                {MESSAGES.CONFIG_CRITERIA_TOTAL}{localT.criteria.reduce((sum, c) => sum + c.maxScore, 0)}{MESSAGES.CONFIG_CRITERIA_PT}
              </span>
            )}
          </h4>
          <div className="flex flex-col gap-2">
            {localT.criteria.map((c) => (
              <div key={c.id} className="flex gap-2 items-center group">
                <input 
                  type="text" 
                  className="form-input text-sm py-1 flex-1" 
                  value={c.name} 
                  onChange={e => updateCriteria(c.id, 'name', e.target.value)} 
                  placeholder={MESSAGES.CONFIG_CRITERIA_PH}
                />
                <div className="relative" style={{ width: '5.5rem', flexShrink: 0 }}>
                  <input 
                    type="number" 
                    className="form-input text-sm py-1 pr-7" 
                    value={c.maxScore} 
                    onChange={e => updateCriteria(c.id, 'maxScore', Number(e.target.value))} 
                    min={1}
                    style={{ width: '100%' }}
                  />
                  <span className="text-xs text-gray-400 absolute right-2 top-1/2 -translate-y-1/2" style={{ whiteSpace: 'nowrap' }}>pt</span>
                </div>
                <button onClick={() => removeCriteria(c.id)} className="btn text-danger hover:bg-danger-bg p-1.5 opacity-50 group-hover:opacity-100 transition-opacity" style={{ flexShrink: 0 }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            
            {localT.criteria.length === 0 && (
              <div className="text-xs text-gray-400 italic text-center mt-2">
                {MESSAGES.CONFIG_CRITERIA_EMPTY}
              </div>
            )}
          </div>
          <div className="mt-3 flex">
            <button onClick={addCriteria} className="btn btn-outline text-sm text-gray-600">
              <Plus size={14} className="mr-1 inline" /> {MESSAGES.CONFIG_CRITERIA_ADD}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

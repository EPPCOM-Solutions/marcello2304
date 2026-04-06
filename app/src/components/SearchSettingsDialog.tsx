"use client";

import React, { useState } from 'react';
import { SearchSettings, SearchIntent } from '../types/property';
import { Settings, X, Info, Save } from 'lucide-react';

interface Props {
  settings: SearchSettings;
  setSettings: (s: SearchSettings) => void;
  onClose: () => void;
}

export const SearchSettingsDialog: React.FC<Props> = ({ settings, setSettings, onClose }) => {
  const [localSettings, setLocalSettings] = useState<SearchSettings>(settings);

  const handleSave = () => {
    setSettings(localSettings);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-xl p-6 flex flex-col overflow-y-auto hide-scrollbar">
      <div className="flex justify-between items-center mb-8 pt-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="text-emerald-400" />
          Such-Filter
        </h2>
        <button onClick={onClose} className="p-2 bg-slate-800 rounded-full text-slate-300">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-emerald-900/20 border border-emerald-500/20 p-4 rounded-xl text-emerald-100 text-sm mb-6 flex gap-3">
        <Info className="w-5 h-5 text-emerald-400 shrink-0" />
        <p>Deine Sucheinstellungen werden portalübergreifend angewandt (ImmoScout24, Immowelt, Kleinanzeigen).</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3 block">Art der Suche</label>
          <div className="grid grid-cols-3 gap-2">
            {(['rent', 'buy', 'investment'] as SearchIntent[]).map(intent => (
              <button
                key={intent}
                onClick={() => setLocalSettings({...localSettings, intent})}
                className={`p-3 rounded-xl text-sm font-semibold transition-all border ${localSettings.intent === intent ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-700'}`}
              >
                {intent === 'rent' ? 'Zur Miete' : intent === 'buy' ? 'Kauf (Selbst)' : 'Kapitalanlage'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3 block">Ort / Bereich</label>
          <input 
            type="text"
            value={localSettings.location || ''}
            onChange={e => setLocalSettings({...localSettings, location: e.target.value})}
            placeholder="Stadt, PLZ oder Stadtteil..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none placeholder-slate-500"
          />
        </div>

        <div>
           <label className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3 flex justify-between">
             <span>Maximal-Preis</span>
             <span className="text-emerald-400">{localSettings.maxPrice.toLocaleString('de-DE')} €</span>
           </label>
           <input 
             type="range" 
             min={localSettings.intent === 'rent' ? 300 : 50000} 
             max={localSettings.intent === 'rent' ? 5000 : 2000000} 
             step={localSettings.intent === 'rent' ? 50 : 10000}
             value={localSettings.maxPrice}
             onChange={e => setLocalSettings({...localSettings, maxPrice: Number(e.target.value)})}
             className="w-full accent-emerald-500"
           />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3 block">Zimmer (Min)</label>
            <input 
              type="number"
              value={localSettings.minRooms}
              onChange={e => setLocalSettings({...localSettings, minRooms: Number(e.target.value)})}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
            />
          </div>
          <div>
             <label className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3 block">Fläche m² (Min)</label>
            <input 
              type="number"
              value={localSettings.minSpace}
              onChange={e => setLocalSettings({...localSettings, minSpace: Number(e.target.value)})}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:border-emerald-500 outline-none"
            />
          </div>
        </div>
      </div>
      
      <button onClick={handleSave} className="mt-auto mb-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg p-4 rounded-2xl w-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all">
        <Save className="w-5 h-5" /> Speichern & Suchen
      </button>
    </div>
  );
};

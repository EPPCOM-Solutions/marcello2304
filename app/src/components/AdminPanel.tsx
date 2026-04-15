"use client";

import React, { useState, useEffect } from 'react';
import { Users, Trash2, Key, Shield, UserPlus } from 'lucide-react';

export const AdminPanel = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('user');
  const [msg, setMsg] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/admin');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newEmail, password: newPassword, role: newRole })
      });
      const data = await res.json();
      if (res.ok) {
         setNewEmail('');
         setNewPassword('');
         fetchUsers();
         setMsg('User angelegt.');
      } else {
         alert(data.error);
      }
    } catch (e) {
      alert('Netzwerkfehler');
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm('Nutzer dauerhaft löschen?')) return;
    try {
      const res = await fetch(`/api/auth/admin?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchUsers();
      else alert('Fehler beim Löschen');
    } catch (e) {}
  };

  const handleResetPassword = async (id: number) => {
    const pw = prompt('Neues Passwort eingeben:');
    if(!pw) return;
    try {
      const res = await fetch('/api/auth/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password: pw })
      });
      if (res.ok) alert('Passwort geändert.');
      else alert('Fehler');
    } catch (e) {}
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 mb-8">
      <h2 className="text-lg font-black text-white flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-rose-500" /> Admin Interface
      </h2>

      {/* Create User */}
      <form onSubmit={handleCreateUser} className="bg-stone-950 p-4 rounded-xl border border-stone-800 mb-6">
         <h3 className="text-sm font-bold text-stone-300 mb-3 flex items-center gap-2"><UserPlus className="w-4 h-4"/> Neuer Nutzer</h3>
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <input required type="email" placeholder="E-Mail" value={newEmail} onChange={e => setNewEmail(e.target.value)} className="bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-sm text-white" />
            <input required type="text" placeholder="Initiales Passwort" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-sm text-white" />
         </div>
         <div className="flex gap-3">
            <select value={newRole} onChange={e => setNewRole(e.target.value)} className="bg-stone-900 border border-stone-700 p-2.5 rounded-lg text-sm text-white focus:outline-none">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="flex-1 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold p-2.5 rounded-lg transition-colors border border-stone-700 text-sm">
               Anlegen
            </button>
         </div>
         {msg && <p className="text-emerald-400 text-xs mt-2">{msg}</p>}
      </form>

      {loading ? <p className="text-stone-500 text-sm">Lade Nutzer...</p> : (
        <div className="space-y-3">
          {users.map(u => (
            <div key={u.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-stone-800/50 rounded-xl border border-stone-700/50 gap-3">
               <div>
                 <div className="text-sm font-bold text-white flex items-center gap-2">
                   {u.email}
                   {u.role === 'admin' && <span className="bg-rose-500/20 text-rose-400 text-[10px] px-1.5 py-0.5 rounded uppercase">Admin</span>}
                 </div>
                 <div className="text-xs text-stone-500 mt-1">ID: {u.id} • Erstellt: {new Date(u.created_at).toLocaleDateString()}</div>
               </div>
               <div className="flex gap-2">
                 <button onClick={() => handleResetPassword(u.id)} className="p-2 bg-stone-700 hover:bg-stone-600 rounded-lg text-stone-300 transition-colors" title="Passwort ändern">
                   <Key className="w-4 h-4" />
                 </button>
                 <button onClick={() => handleDelete(u.id)} className="p-2 bg-stone-700 hover:bg-red-900/50 hover:text-red-400 rounded-lg text-stone-300 transition-colors" title="Löschen">
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

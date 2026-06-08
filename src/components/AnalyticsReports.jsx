import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Calendar, Award, Zap, Clock } from 'lucide-react';
import { playClickFeedback } from '../utils/audio';

export default function AnalyticsReports({ stats }) {
  const [period, setPeriod] = useState('week');

  // Formatação amigável! Converte para Horas e Minutos.
  const formatMinutes = (minutes) => {
    if (minutes === 0) return '0m';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const getChartData = () => {
    if (period === 'month') {
      return stats.monthlyFocus.map((item, idx) => ({
        label: idx % 3 === 0 ? `D${item.date}` : '',
        value: Math.round((item.minutes / 60) * 10) / 10,
        originalMinutes: item.minutes,
      }));
    }
    if (period === 'year') {
      return stats.yearlyFocus.map((item) => ({
        label: item.month,
        value: Math.round((item.minutes / 60) * 10) / 10,
        originalMinutes: item.minutes,
      }));
    }
    return stats.weeklyFocus.map((item) => ({
      label: item.day,
      value: Math.round((item.minutes / 60) * 10) / 10,
      originalMinutes: item.minutes,
    }));
  };

  const handlePeriodChange = (newPeriod) => {
    playClickFeedback();
    setPeriod(newPeriod);
  };

  const chartData = getChartData();

  const totalFocusHoursToday = (stats.focusMinutesToday / 60).toFixed(1);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-slate-900 text-slate-100 border border-[#F8F6F0]/20 rounded-xl text-xs font-mono shadow-xl">
          <p className="font-bold text-center border-b border-white/10 pb-1 mb-1.5">{data.label || 'Sessão'}</p>
          <p className="text-blue-400">Tempo: <b className="font-bold text-white">{formatMinutes(data.originalMinutes)}</b></p>
          <p className="text-slate-400">Total: <b className="font-bold text-white">{data.value} Horas</b></p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 rounded-2xl bg-brand-card border border-brand-border flex flex-col h-full shadow-xl hover:shadow-2xl duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 shrink-0">
        <div>
          <h4 className="text-sm font-display font-extrabold text-brand-text">Histórico de Foco</h4>
        </div>

        <div className="flex gap-1 bg-brand-bg border border-brand-border rounded-xl p-1 shrink-0 self-end sm:self-auto">
          {[
            { id: 'week', label: 'Semana' },
            { id: 'month', label: 'Mês' },
            { id: 'year', label: 'Ano' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handlePeriodChange(tab.id)}
              className={`px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider cursor-pointer transition-all ${
                period === tab.id
                  ? 'bg-brand-text text-brand-bg font-heavy shadow-sm'
                  : 'text-brand-text/60 hover:text-brand-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 shrink-0">
        <div className="p-2 bg-brand-bg/40 border border-brand-border rounded-xl flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg shrink-0">
            <Clock size={12} />
          </div>
          <div>
            <div className="text-[8px] font-mono uppercase text-brand-text/40 font-bold">Hoje</div>
            <div className="text-xs font-black text-brand-text font-mono">{totalFocusHoursToday}h</div>
          </div>
        </div>

        <div className="p-2 bg-brand-bg/40 border border-brand-border rounded-xl flex items-center gap-2">
          <div className="p-1.5 bg-orange-500/10 text-orange-400 rounded-lg shrink-0">
            <Zap size={12} />
          </div>
          <div>
            <div className="text-[8px] font-mono uppercase text-brand-text/40 font-bold">Streak Ativo</div>
            <div className="text-xs font-black text-brand-text font-mono">{stats.currentStreak} d</div>
          </div>
        </div>

        <div className="p-2 bg-brand-bg/40 border border-brand-border rounded-xl flex items-center gap-2">
          <div className="p-1.5 bg-rose-500/10 text-rose-500 rounded-lg shrink-0">
            <Award size={12} />
          </div>
          <div>
            <div className="text-[8px] font-mono uppercase text-brand-text/40 font-bold">Máx Streak</div>
            <div className="text-xs font-black text-brand-text font-mono">{stats.longestStreak} d</div>
          </div>
        </div>

        <div className="p-2 bg-brand-bg/40 border border-brand-border rounded-xl flex items-center gap-2">
          <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg shrink-0">
            <Calendar size={12} />
          </div>
          <div>
            <div className="text-[8px] font-mono uppercase text-brand-text/40 font-bold">Dias Ativos</div>
            <div className="text-xs font-black text-brand-text font-mono">{stats.totalDaysActive} d</div>
          </div>
        </div>
      </div>

      <div className="h-[150px] w-full mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.15)" />
            <XAxis 
              dataKey="label" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'currentColor', fontSize: 10, fontFamily: 'monospace' }}
              className="text-brand-text/40"
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'currentColor', fontSize: 10, fontFamily: 'monospace' }}
              className="text-brand-text/40"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(128,128,128,0.06)' }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.value > 0 ? '#3b82f6' : 'rgba(128,128,128,0.15)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
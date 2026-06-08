/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Calendar, Award, Zap, Clock } from 'lucide-react';
import { UserStats } from '../types';
import { playClickFeedback } from '../utils/audio';

type PeriodType = 'week' | 'month' | 'year';

interface AnalyticsReportsProps {
  stats: UserStats;
}

export default function AnalyticsReports({ stats }: AnalyticsReportsProps) {
  const [period, setPeriod] = useState<PeriodType>('week');

  // Formatação amigável! Converte para Horas e Minutos. Extracao (1H E 45M) - (Horas / Minutos extaídos)
  const formatMinutes = (minutes: number) => {
    if (minutes === 0) return '0m';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const getChartData = () => {
    if (period === 'month') {
      // Controlar visibilidade. (Demonstrando à cada 3 dia. Limita colisões estéticas / Sobreposições indesejada em ambientes padrões.)
      return stats.monthlyFocus.map((item, idx) => ({
        label: idx % 3 === 0 ? `D${item.date}` : '',
        value: Math.round((item.minutes / 60) * 10) / 10, // hours
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
    // Parametros (Semana). Modificado para o valor base ou valores padrões (Data base inicial ex "A semana")
    return stats.weeklyFocus.map((item) => ({
      label: item.day,
      value: Math.round((item.minutes / 60) * 10) / 10,
      originalMinutes: item.minutes,
    }));
  };

  const handlePeriodChange = (newPeriod: PeriodType) => {
    playClickFeedback();
    setPeriod(newPeriod);
  };

  const chartData = getChartData();

  // Capturar em Resumo os atributos (Rápidos) estatísticos e os parâmetros de perfis
  const totalFocusHoursToday = (stats.focusMinutesToday / 60).toFixed(1);

  // Dicas customizadas / Caixas para a moldagem estética (Para encaixe / adaptação de Recharts nas visões / temas originais).
  const CustomTooltip = ({ active, payload }: any) => {
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

        {/* Barra de Filtros / Seletivos */}
        <div className="flex gap-1 bg-brand-bg border border-brand-border rounded-xl p-1 shrink-0 self-end sm:self-auto">
          {[
            { id: 'week', label: 'Semana' },
            { id: 'month', label: 'Mês' },
            { id: 'year', label: 'Ano' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handlePeriodChange(tab.id as PeriodType)}
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

      {/* Grade visual dos indicadores numéricos primordiais (Quicks/Rapidos) */}
      <div className="grid grid-cols-2 gap-2 mb-4 shrink-0">
        {/* Estatística / Cards de Informações  Nro 1 */}
        <div className="p-2 bg-brand-bg/40 border border-brand-border rounded-xl flex items-center gap-2">
          <div className="p-1.5 bg-blue-500/10 text-blue-500 rounded-lg shrink-0">
            <Clock size={12} />
          </div>
          <div>
            <div className="text-[8px] font-mono uppercase text-brand-text/40 font-bold">Hoje</div>
            <div className="text-xs font-black text-brand-text font-mono">{totalFocusHoursToday}h</div>
          </div>
        </div>

        {/* Estatística / Cards de Informações  Nro 2 */}
        <div className="p-2 bg-brand-bg/40 border border-brand-border rounded-xl flex items-center gap-2">
          <div className="p-1.5 bg-orange-500/10 text-orange-400 rounded-lg shrink-0">
            <Zap size={12} />
          </div>
          <div>
            <div className="text-[8px] font-mono uppercase text-brand-text/40 font-bold">Streak Ativo</div>
            <div className="text-xs font-black text-brand-text font-mono">{stats.currentStreak} d</div>
          </div>
        </div>

        {/* Estatística / Cards de Informações  Nro 3 */}
        <div className="p-2 bg-brand-bg/40 border border-brand-border rounded-xl flex items-center gap-2">
          <div className="p-1.5 bg-rose-500/10 text-rose-500 rounded-lg shrink-0">
            <Award size={12} />
          </div>
          <div>
            <div className="text-[8px] font-mono uppercase text-brand-text/40 font-bold">Máx Streak</div>
            <div className="text-xs font-black text-brand-text font-mono">{stats.longestStreak} d</div>
          </div>
        </div>

        {/* Estatística / Cards de Informações  Nro 4 */}
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

      {/* Area Gráfica (Painel de renderização Canvas dos gráficos de performance) */}
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

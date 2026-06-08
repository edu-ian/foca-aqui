import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Check, ChevronDown, ChevronUp, Trash2, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { playClickFeedback } from '../utils/audio';

export default function TodoList({
  tasks,
  onAddTask,
  onToggleComplete,
  onUpdateTask,
  onDeleteTask,
}) {
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newEstimated, setNewEstimated] = useState(2);
  const [newPriority, setNewPriority] = useState('normal');
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    
    playClickFeedback();
    onAddTask(
      newTitle.trim().substring(0, 50), 
      newDescription.trim().substring(0, 200), 
      newEstimated, 
      newPriority
    );
    
    setNewTitle('');
    setNewDescription('');
    setNewEstimated(2);
    setNewPriority('normal');
    setCurrentPage(1);
  };

  const handleToggleExpand = (id) => {
    playClickFeedback();
    setExpandedId(expandedId === id ? null : id);
  };

  const handleToggleDone = (e, id) => {
    e.stopPropagation();
    playClickFeedback();
    onToggleComplete(id);
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / itemsPerPage));
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  
  const startIndex = (activePage - 1) * itemsPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + itemsPerPage);

  const prevPage = () => {
    if (activePage > 1) {
      playClickFeedback();
      setCurrentPage(activePage - 1);
    }
  };

  const nextPage = () => {
    if (activePage < totalPages) {
      playClickFeedback();
      setCurrentPage(activePage + 1);
    }
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'urgente':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'importante':
        return 'bg-orange-500/10 border-orange-500/30 text-orange-400';
      default:
        return 'bg-slate-500/10 border-slate-500/30 text-slate-400';
    }
  };

  const getPriorityLabel = (p) => {
    switch (p) {
      case 'urgente': return 'Urgente';
      case 'importante': return 'Importante';
      default: return 'Normal';
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-brand-card border border-brand-border flex flex-col h-full shadow-xl hover:shadow-2xl duration-300">
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h3 className="font-display font-medium text-brand-text/60 text-xs font-mono tracking-widest">
          LISTA DE TAREFAS
        </h3>

        <div className="flex gap-1 bg-brand-bg border border-brand-border rounded-lg p-0.5">
          {[
            { id: 'all', label: 'Tudo' },
            { id: 'pending', label: 'Pendentes' },
            { id: 'completed', label: 'Concluídas' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => {
                playClickFeedback();
                setFilter(btn.id);
                setCurrentPage(1);
              }}
              className={`px-2 py-1 text-[10px] font-bold rounded-md cursor-pointer transition-all ${
                filter === btn.id
                  ? 'bg-brand-text text-brand-bg'
                  : 'text-brand-text/60 hover:text-brand-text'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleAddTask} className="mb-6 p-4 rounded-xl bg-brand-bg/60 border border-brand-border space-y-3.5 shrink-0 shadow-sm">
        <div className="text-[10px] font-mono tracking-widest text-[#F8F6F0]/40 uppercase font-bold">
          CRIAR NOVA TAREFA
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          <div className="md:col-span-7 flex flex-col gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Título da tarefa..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                maxLength={50}
                className="w-full px-4 py-2.5 bg-brand-bg text-brand-text border border-brand-border rounded-xl placeholder:text-brand-text/30 focus:outline-none focus:border-blue-500/50 text-xs transition-all pr-12"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono text-brand-text/30">
                {newTitle.length}/50
              </span>
            </div>
            
            <div className="relative">
              <textarea
                placeholder="Anotações / Descrição..."
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                maxLength={200}
                rows={2}
                className="w-full px-4 py-2 bg-brand-bg text-brand-text border border-brand-border rounded-xl placeholder:text-brand-text/30 focus:outline-none focus:border-blue-500/50 text-xs transition-all resize-none pr-12"
              />
              <span className="absolute right-3 bottom-2 text-[9px] font-mono text-brand-text/30">
                {newDescription.length}/200
              </span>
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col justify-between gap-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-[#F8F6F0]/40 uppercase block font-bold">Prioridade:</span>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full py-1 px-2 text-xs bg-brand-bg text-brand-text border border-brand-border rounded-lg focus:outline-none cursor-pointer"
                >
                  <option value="normal">Normal</option>
                  <option value="importante">Importante</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-mono text-[#F8F6F0]/40 uppercase block font-bold">Pomodoros:</span>
                <select
                  value={newEstimated}
                  onChange={(e) => setNewEstimated(Number(e.target.value))}
                  className="w-full py-1 px-2 text-xs bg-brand-bg text-brand-text border border-brand-border rounded-lg focus:outline-none cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
            >
              <Plus size={14} strokeWidth={2.5} />
              Criar Tarefa
            </button>
          </div>
        </div>
      </form>

      <div className="flex-1 overflow-y-auto space-y-2.5 min-h-[340px]">
        <AnimatePresence mode="sync">
          {paginatedTasks.length > 0 ? (
            paginatedTasks.map((task) => {
              const isExpanded = expandedId === task.id;
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`border rounded-xl overflow-hidden transition-all duration-200 cursor-pointer ${
                    task.completed
                      ? 'bg-brand-bg/40 border-brand-border/40 opacity-55'
                      : isExpanded
                      ? 'bg-brand-bg/80 border-blue-500/30 shadow-md'
                      : 'bg-brand-bg/30 border-brand-border hover:border-brand-border/60 hover:bg-brand-bg/10'
                  }`}
                  onClick={() => handleToggleExpand(task.id)}
                >
                  <div className="p-3.5 flex items-center justify-between gap-3 select-none">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={(e) => handleToggleDone(e, task.id)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                          task.completed
                            ? 'bg-emerald-500 border-emerald-500 text-slate-900'
                            : 'border-brand-text/30 hover:border-brand-text/60 bg-brand-bg'
                        }`}
                      >
                        {task.completed && <Check size={12} strokeWidth={3} />}
                      </button>

                      <div className="flex flex-col min-w-0">
                        <span className={`text-xs font-semibold truncate ${task.completed ? 'line-through text-brand-text/40' : 'text-brand-text'}`}>
                          {task.title}
                        </span>
                        
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase tracking-wider ${getPriorityColor(task.priority || 'normal')}`}>
                            {getPriorityLabel(task.priority || 'normal')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-brand-text/5 px-2 py-0.5 rounded-md text-brand-text/60" title="Ciclos focados do total estimado">
                        {task.completedPomodoros}/{task.estimatedPomodoros} Focos
                      </span>
                      {isExpanded ? (
                        <ChevronUp size={14} className="text-brand-text/40" />
                      ) : (
                        <ChevronDown size={14} className="text-brand-text/40" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div 
                      className="px-4 pb-4 border-t border-brand-border/60 text-xs bg-brand-bg/10 space-y-3.5 pt-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="space-y-1">
                        <label className="text-brand-text/50 font-mono text-[9px] uppercase">Descrição Detalhada</label>
                        <textarea
                          placeholder="Adicione detalhes e notas para sua meta de trabalho..."
                          value={task.description || ''}
                          maxLength={200}
                          onChange={(e) => onUpdateTask(task.id, { description: e.target.value.substring(0, 200) })}
                          rows={2}
                          className="w-full p-2 bg-brand-bg/50 border border-brand-border rounded-lg text-xs placeholder:text-brand-text/20 focus:outline-none focus:border-blue-500/30 text-brand-text"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <span className="text-brand-text/50 font-mono text-[9px] uppercase block min-w-max">Ajustar prioridade:</span>
                          <div className="flex gap-1">
                            {(['normal', 'importante', 'urgente']).map((p) => (
                              <button
                                key={p}
                                type="button"
                                onClick={() => {
                                  playClickFeedback();
                                  onUpdateTask(task.id, { priority: p });
                                }}
                                className={`text-[9px] px-2 py-1 rounded border uppercase font-mono tracking-wider font-extrabold cursor-pointer transition-all ${
                                  task.priority === p 
                                    ? 'bg-blue-500 text-white border-blue-400 font-bold scale-102' 
                                    : 'bg-brand-bg/60 text-brand-text/50 border-brand-border/50 hover:text-brand-text'
                                }`}
                              >
                                {p}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-brand-text/50 font-mono text-[9px] uppercase">Focos:</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <button
                                  key={num}
                                  type="button"
                                  onClick={() => {
                                    playClickFeedback();
                                    onUpdateTask(task.id, { estimatedPomodoros: num });
                                  }}
                                  className={`w-5 h-5 flex items-center justify-center rounded font-mono text-[10px] cursor-pointer ${
                                    task.estimatedPomodoros === num
                                      ? 'bg-blue-500 text-white font-bold'
                                      : 'hover:bg-brand-text/5 text-brand-text/60'
                                  }`}
                                >
                                  {num}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              playClickFeedback();
                              onDeleteTask(task.id);
                            }}
                            className="p-1.5 border border-red-500/20 text-red-500 hover:bg-red-500/10 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
                            title="Apagar Tarefa"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })
          ) : (
            <div className="py-12 text-center text-brand-text/40 text-xs font-light">
              Sem tarefas nesta visualização. Use o campo acima para adicionar!
            </div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 pt-3 border-t border-brand-border flex items-center justify-between text-xs font-mono shrink-0">
        <span className="text-[10px] text-brand-text/50 uppercase">
          Total: {filteredTasks.length} {filteredTasks.length === 1 ? 'Tarefa' : 'Tarefas'}
        </span>

        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            disabled={activePage === 1}
            className={`p-1.5 border border-brand-border rounded-lg flex items-center justify-center transition-all ${
              activePage === 1
                ? 'opacity-30 cursor-not-allowed'
                : 'bg-brand-bg text-brand-text hover:bg-brand-text/5 cursor-pointer'
            }`}
            title="Página Anterior"
          >
            <ChevronLeft size={14} />
          </button>

          <span className="text-[10px] text-brand-text/70">
            {activePage} de {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={activePage === totalPages}
            className={`p-1.5 border border-brand-border rounded-lg flex items-center justify-center transition-all ${
              activePage === totalPages
                ? 'opacity-30 cursor-not-allowed'
                : 'bg-brand-bg text-brand-text hover:bg-brand-text/5 cursor-pointer'
            }`}
            title="Próxima Página"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
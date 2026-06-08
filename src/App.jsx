import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Coins, Flame, Smile, ShoppingBag, Zap, Award,
  ChevronLeft, Settings, Menu
} from 'lucide-react';

import { INITIAL_SHOP_ITEMS, INITIAL_TASKS, INITIAL_STATS } from './data';
import { playClickFeedback, playSound } from './utils/audio';

import HeroPage from './components/HeroPage';
import DashboardHeader from './components/DashboardHeader';
import PomodoroTimer from './components/PomodoroTimer';
import TodoList from './components/TodoList';
import PetStatus from './components/PetStatus';
import AnalyticsReports from './components/AnalyticsReports';
import ShopModal from './components/ShopModal';
import AuthScreen from './components/AuthScreen';
import NavigationSidebar from './components/NavigationSidebar';

import { isConfigured, db, auth, handleFirestoreError, OperationType } from './lib/firebase';
import { doc, getDoc, getDocs, setDoc, updateDoc, collection, deleteDoc, onSnapshot, query, where, getDocFromServer } from 'firebase/firestore';

// Utilitário auxiliar de normalização recursiva
function normalizeState(obj) {
  if (obj === null || obj === undefined) return '';
  if (typeof obj !== 'object') return String(obj);
  if (Array.isArray(obj)) {
    return '[' + obj.map(normalizeState).join(',') + ']';
  }
  const keys = Object.keys(obj).sort();
  const parts = [];
  for (const k of keys) {
    parts.push(JSON.stringify(k) + ':' + normalizeState(obj[k]));
  }
  return '{' + parts.join(',') + '}';
}

export default function App() {
  // Controle de tela
  const [screen, setScreen] = useState(() => {
    const logged = localStorage.getItem('foca_is_logged_in');
    return logged && JSON.parse(logged) ? 'app' : 'landing';
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('foca_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('foca_theme');
    return saved ? JSON.parse(saved) : 'dark';
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('foca_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('foca_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [pet, setPet] = useState(() => {
    const saved = localStorage.getItem('foca_pet');
    return saved ? JSON.parse(saved) : {
      name: 'Foca Aqui',
      level: 0,
      experience: 0,
      maxExperience: 0,
      energy: 100,
      skin: 'padrão',
      status: 'idle',
      lastEnergyDeductionTime: new Date().toISOString()
    };
  });

const [shopItems, setShopItems] = useState(() => {
  const saved = localStorage.getItem('foca_shop_items');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Se os itens salvos tiverem a propriedade 'type', usa eles
      if (parsed.length > 0 && parsed.some(item => item.type)) {
        return parsed;
      }
    } catch (err) {
      console.error("Erro ao ler shopItems", err);
    }
  }
  // Se não tem dados válidos, usa os itens iniciais e já salva corrigido
  const freshItems = [...INITIAL_SHOP_ITEMS];
  localStorage.setItem('foca_shop_items', JSON.stringify(freshItems));
  return freshItems;
});

  const [friends, setFriends] = useState(() => {
    const saved = localStorage.getItem('foca_friends');
    return saved ? JSON.parse(saved) : [
      { uid: 'friend-1', username: 'LucasGamer', level: 4, coins: 150, focusMinutes: 45 },
      { uid: 'friend-2', username: 'Mariana_Estudos', level: 6, coins: 340, focusMinutes: 80 }
    ];
  });
  //  FORÇA A LIMPEZA E RECARGA DOS ITENS DO MERCADO (remova depois que funcionar)
useEffect(() => {
  const saved = localStorage.getItem('foca_shop_items');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Se qualquer item não tiver a propriedade 'type', substitui tudo
      if (!parsed.length || !parsed.some(item => item.type)) {
        console.log("Itens corrompidos detectados. Substituindo pelos dados corretos...");
        localStorage.setItem('foca_shop_items', JSON.stringify(INITIAL_SHOP_ITEMS));
        setShopItems([...INITIAL_SHOP_ITEMS]);
      }
    } catch (e) {
      console.error("Erro ao ler localStorage, resetando...", e);
      localStorage.setItem('foca_shop_items', JSON.stringify(INITIAL_SHOP_ITEMS));
      setShopItems([...INITIAL_SHOP_ITEMS]);
    }
  } else {
    // Se não tem nada, salva os itens corretos
    localStorage.setItem('foca_shop_items', JSON.stringify(INITIAL_SHOP_ITEMS));
    setShopItems([...INITIAL_SHOP_ITEMS]);
  }
}, []);

  const [socialSessions, setSocialSessions] = useState(() => {
    const saved = localStorage.getItem('foca_sessions');
    return saved ? JSON.parse(saved) : [
      {
        id: 'session-1',
        title: 'Estudos Engenharia de Software TCC 💻',
        hostId: 'friend-2',
        hostName: 'Mariana_Estudos',
        createdAt: new Date().toISOString(),
        isActive: true,
        timerMode: 'focus',
        currentTimer: 1500,
        participants: [
          { uid: 'friend-2', username: 'Mariana_Estudos', status: 'focusing', joinedAt: new Date().toISOString() }
        ]
      }
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState(null);
  const [currentHash, setCurrentHash] = useState(() => window.location.hash || '#/dashboard');
  const [alertNotification, setAlertNotification] = useState(null);
  const lastSyncedRef = React.useRef("");

  // Roteamento por hash
  useEffect(() => {
    if (screen === 'app' && !window.location.hash) {
      window.location.hash = '/dashboard';
    }
    const handleHashChange = () => {
      setCurrentHash(window.location.hash || '#/dashboard');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [screen]);

  const isShopOpen = currentHash === '#/mercado';
  const isNavOpen = ['#/perfil', '#/rank', '#/social', '#/inventario', '#/amigos', '#/suporte'].includes(currentHash);

  const setIsShopOpen = (open) => {
    window.location.hash = open ? '/mercado' : '/dashboard';
  };

  const setIsNavOpen = (open) => {
    window.location.hash = open ? '/perfil' : '/dashboard';
  };

  useEffect(() => {
    if (isNavOpen || isShopOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isNavOpen, isShopOpen]);

  const username = user?.displayName || user?.email?.split('@')[0] || pet.name || 'Produtor';

  const syncUserToFirestore = async (updatedPet, updatedStats, updatedShop) => {
    if (!isConfigured || !db || !user?.uid) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        pet: updatedPet,
        stats: updatedStats,
        shopItems: updatedShop,
        lastActiveTime: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
    }
  };

  // Auto-sincronização com debounce
  useEffect(() => {
    if (!isConfigured || !db || !user?.uid) return;
    const currentStr = normalizeState({ pet, stats, shopItems });
    if (currentStr === lastSyncedRef.current) return;
    const timeout = setTimeout(async () => {
      try {
        lastSyncedRef.current = currentStr;
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          pet, stats, shopItems,
          lastActiveTime: new Date().toISOString()
        });
      } catch (err) {
        console.error("Firestore save error:", err);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [pet, stats, shopItems, user?.uid]);

  // Autenticação
  useEffect(() => {
    if (!isConfigured || !auth) return;
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || undefined,
          uid: firebaseUser.uid
        });
        localStorage.setItem('foca_user', JSON.stringify({
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || undefined,
          uid: firebaseUser.uid
        }));
        setScreen('app');
      } else {
        setUser(null);
        localStorage.removeItem('foca_user');
      }
    });
    return () => unsubscribe();
  }, []);

  // Sincroniza perfil do Firestore
  useEffect(() => {
    const uid = user?.uid;
    if (!isConfigured || !db || !uid) return;
    let unsubscribe;
    const setupUserSync = async () => {
      try {
        const userDocRef = doc(db, 'users', uid);
        await getDocFromServer(userDocRef).catch(() => {});
        const snapshot = await getDoc(userDocRef);
        if (!snapshot.exists()) {
          const initialData = {
            userId: uid,
            username: user.displayName || user.email.split('@')[0],
            pet: pet,
            stats: stats,
            shopItems: shopItems,
            createdAt: new Date().toISOString()
          };
          lastSyncedRef.current = normalizeState({ pet, stats, shopItems });
          await setDoc(userDocRef, initialData);
        } else {
          const data = snapshot.data();
          lastSyncedRef.current = normalizeState({ pet: data.pet, stats: data.stats, shopItems: data.shopItems });
          if (data.pet) setPet(data.pet);
          if (data.stats) setStats(data.stats);
          if (data.shopItems) setShopItems(data.shopItems);
        }
        unsubscribe = onSnapshot(userDocRef, (snap) => {
          if (snap.metadata.hasPendingWrites) return;
          if (snap.exists()) {
            const data = snap.data();
            const incomingStr = normalizeState({ pet: data.pet, stats: data.stats, shopItems: data.shopItems });
            if (incomingStr !== lastSyncedRef.current) {
              lastSyncedRef.current = incomingStr;
              if (data.pet) setPet(data.pet);
              if (data.stats) setStats(data.stats);
              if (data.shopItems) setShopItems(data.shopItems);
            }
          }
        }, (err) => handleFirestoreError(err, OperationType.GET, `users/${uid}`));
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${uid}`);
      }
    };
    setupUserSync();
    return () => { if (unsubscribe) unsubscribe(); };
  }, [user?.uid]);

  // Sincroniza tarefas
  useEffect(() => {
    const uid = user?.uid;
    if (!isConfigured || !db || !uid) return;
    let unsubscribe;
    const setupTasksSync = async () => {
      try {
        const tasksCollection = collection(db, 'users', uid, 'tasks');
        const snapshot = await getDocs(tasksCollection);
        if (snapshot.empty && tasks.length > 0) {
          for (const task of tasks) {
            const taskDocRef = doc(db, 'users', uid, 'tasks', task.id);
            await setDoc(taskDocRef, task);
          }
        }
        unsubscribe = onSnapshot(tasksCollection, (snap) => {
          if (snap.metadata.hasPendingWrites) return;
          const loadedTasks = [];
          snap.forEach((docSnap) => loadedTasks.push(docSnap.data()));
          loadedTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setTasks(loadedTasks);
        }, (err) => handleFirestoreError(err, OperationType.GET, `users/${uid}/tasks`));
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${uid}/tasks`);
      }
    };
    setupTasksSync();
    return () => { if (unsubscribe) unsubscribe(); };
  }, [user?.uid]);

  // Sessões sociais
  useEffect(() => {
    if (!isConfigured || !db || !user?.uid) return;
    let unsubscribe;
    try {
      const sessionsCollection = collection(db, 'social_sessions');
      const q = query(sessionsCollection, where("isActive", "==", true));
      unsubscribe = onSnapshot(q, (snap) => {
        const loadedSessions = [];
        snap.forEach((docSnap) => loadedSessions.push(docSnap.data()));
        setSocialSessions(loadedSessions);
      }, (err) => handleFirestoreError(err, OperationType.GET, 'social_sessions'));
    } catch (err) {
      console.error("Failed to setup social sessions subscription", err);
    }
    return () => { if (unsubscribe) unsubscribe(); };
  }, [user?.uid]);

  // Persistência localStorage
  useEffect(() => {
    localStorage.setItem('foca_is_logged_in', JSON.stringify(screen === 'app'));
  }, [screen]);
  useEffect(() => { if (user) localStorage.setItem('foca_user', JSON.stringify(user)); else localStorage.removeItem('foca_user'); }, [user]);
  useEffect(() => { localStorage.setItem('foca_theme', JSON.stringify(theme)); }, [theme]);
  useEffect(() => { localStorage.setItem('foca_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('foca_stats', JSON.stringify(stats)); }, [stats]);
  useEffect(() => { localStorage.setItem('foca_pet', JSON.stringify(pet)); }, [pet]);
  useEffect(() => { localStorage.setItem('foca_shop_items', JSON.stringify(shopItems)); }, [shopItems]);
  useEffect(() => { localStorage.setItem('foca_friends', JSON.stringify(friends)); }, [friends]);
  useEffect(() => { localStorage.setItem('foca_sessions', JSON.stringify(socialSessions)); }, [socialSessions]);

  // Alertas
  useEffect(() => {
    if (alertNotification) {
      const timer = setTimeout(() => setAlertNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alertNotification]);

  const triggerAlert = (message, type = 'info') => setAlertNotification({ message, type });

  // Lógica de energia do pet (mantida igual à sua)
  useEffect(() => {
    if (screen !== 'app') return;
    const handleDeductions = () => {
      const now = Date.now();
      const lastActive = localStorage.getItem('foca_last_active_time');
      const lastEnergyReceived = localStorage.getItem('foca_last_energy_received_time') || new Date().toISOString();
      const lastActiveTime = lastActive ? new Date(lastActive).getTime() : now;
      const lastReceivedTime = new Date(lastEnergyReceived).getTime();
      const hoursSinceEnergy = (now - lastReceivedTime) / (3600 * 1000);
      if (hoursSinceEnergy >= 48) {
        setPet((prev) => {
          if (prev.status === 'dead') return prev;
          playSound('sound_zen');
          return { ...prev, energy: 0, status: 'dead' };
        });
        localStorage.setItem('foca_last_active_time', new Date().toISOString());
        return;
      }
      const hoursSinceActive = (now - lastActiveTime) / (3600 * 1000);
      if (hoursSinceActive > 0) {
        setPet((prev) => {
          if (prev.status === 'dead') return prev;
          const energyLoss = hoursSinceActive * 2.1;
          const finalEnergy = Math.max(0, Math.round(prev.energy - energyLoss));
          return { ...prev, energy: finalEnergy, status: finalEnergy <= 0 ? 'sleeping' : prev.status };
        });
      }
      localStorage.setItem('foca_last_active_time', new Date().toISOString());
    };
    handleDeductions();
    const interval = setInterval(handleDeductions, 60000);
    return () => clearInterval(interval);
  }, [screen]);

  const handleCycleComplete = (mode, minutes) => {
    const rewardCoins = mode === 'focus' ? minutes : 0;
    const gainedXp = mode === 'focus' ? 30 : 10;
    const energyDelta = mode === 'focus' ? 15 : 20;
    localStorage.setItem('foca_last_energy_received_time', new Date().toISOString());
    let nextStats;
    setStats((prev) => {
      const updatedCoins = prev.coins + rewardCoins;
      const updatedMinutesToday = prev.focusMinutesToday + (mode === 'focus' ? minutes : 0);
      const weekUpdated = [...prev.weeklyFocus];
      const todayIndex = new Date().getDay();
      const mappedIndex = todayIndex === 0 ? 6 : todayIndex - 1;
      if (weekUpdated[mappedIndex]) weekUpdated[mappedIndex].minutes += (mode === 'focus' ? minutes : 0);
      nextStats = { ...prev, coins: updatedCoins, focusMinutesToday: updatedMinutesToday, weeklyFocus: weekUpdated };
      return nextStats;
    });
    setPet((prev) => {
      if (prev.status === 'dead') return prev;
      let newXp = prev.experience + gainedXp;
      let newLevel = prev.level;
      let newMaxXp = prev.maxExperience;
      let levelUpOccurred = false;
      if (newXp >= newMaxXp) {
        newXp -= newMaxXp;
        newLevel += 1;
        newMaxXp = Math.round(newMaxXp * 1.5);
        levelUpOccurred = true;
      }
      const newEnergy = Math.min(100, prev.energy + energyDelta);
      if (levelUpOccurred) {
        setTimeout(() => {
          playSound('sound_retro');
          triggerAlert(`Seu Mascote subiu para o Nível ${newLevel}! Parabéns!`, 'success');
        }, 500);
      }
      const nextPet = { ...prev, level: newLevel, experience: newXp, maxExperience: newMaxXp, energy: newEnergy, status: 'happy' };
      if (nextStats) syncUserToFirestore(nextPet, nextStats, shopItems);
      return nextPet;
    });
    if (mode === 'focus') {
      triggerAlert(`Foco concluído! +${minutes} minutos focados. Ganhou +${rewardCoins} moedas e +${gainedXp} XP!`, 'success');
      setTasks((prevTasks) => {
        let updated = false;
        const nextTasks = prevTasks.map((t) => {
          if (!t.completed && !updated) {
            updated = true;
            const newPoms = Math.min(t.estimatedPomodoros, t.completedPomodoros + 1);
            const updatedT = { ...t, completedPomodoros: newPoms, completed: newPoms >= t.estimatedPomodoros };
            if (isConfigured && db && user?.uid) {
              const taskDocRef = doc(db, 'users', user.uid, 'tasks', t.id);
              updateDoc(taskDocRef, { completedPomodoros: newPoms, completed: updatedT.completed }).catch(e => console.error(e));
            }
            return updatedT;
          }
          return t;
        });
        return nextTasks;
      });
    } else {
      triggerAlert(`Excelente! Fizemos uma pausa bem merecida.`, 'info');
    }
    setTimeout(() => {
      setPet((p) => {
        const nextP = p.status === 'dead' ? p : { ...p, status: 'idle' };
        if (isConfigured && db && user?.uid && p.status !== 'dead') {
          const userDocRef = doc(db, 'users', user.uid);
          updateDoc(userDocRef, { "pet.status": "idle" }).catch(err => console.error(err));
        }
        return nextP;
      });
    }, 4000);
  };

  const handleTimerRunningChange = (isRunning) => {
    setPet((prev) => {
      if (prev.status === 'dead') return prev;
      return { ...prev, status: isRunning ? 'focusing' : 'idle' };
    });
  };

  const handleAddTask = async (title, description = '', estimatedPomodoros = 2, priority = 'normal') => {
    const safeEstimated = Math.max(1, Math.round(Number(estimatedPomodoros) || 1));
    const newTask = {
      id: `task-${Date.now()}`,
      title, description,
      estimatedPomodoros: safeEstimated,
      completedPomodoros: 0,
      completed: false,
      createdAt: new Date().toISOString(),
      priority,
    };
    setTasks((prev) => [newTask, ...prev]);
    let nextPet = null;
    setPet((prev) => {
      if (prev.status === 'dead') return prev;
      nextPet = { ...prev, energy: Math.max(10, prev.energy - 3) };
      return nextPet;
    });
    if (isConfigured && db && user?.uid) {
      try {
        const taskDocRef = doc(db, 'users', user.uid, 'tasks', newTask.id);
        await setDoc(taskDocRef, newTask);
        if (nextPet) {
          const userDocRef = doc(db, 'users', user.uid);
          await updateDoc(userDocRef, { "pet.energy": Math.max(10, pet.energy - 3) });
        }
      } catch (err) { handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/tasks/${newTask.id}`); }
    }
    triggerAlert('Nova meta agendada!', 'info');
  };

  const handleToggleComplete = async (id) => {
    let toggledTask = null;
    setTasks((prev) => prev.map((t) => {
      if (t.id === id) {
        const nextCompleted = !t.completed;
        toggledTask = { ...t, completed: nextCompleted };
        if (nextCompleted) {
          setPet((p) => {
            if (p.status === 'dead') return p;
            return { ...p, energy: Math.min(100, p.energy + 10), status: 'happy' };
          });
          localStorage.setItem('foca_last_energy_received_time', new Date().toISOString());
          setTimeout(() => triggerAlert('Meta concluída com sucesso! Energia recuperada.', 'success'), 200);
          setTimeout(() => setPet((p) => (p.status === 'dead' ? p : { ...p, status: 'idle' })), 3000);
        }
        return toggledTask;
      }
      return t;
    }));
    if (isConfigured && db && user?.uid && toggledTask) {
      try {
        const taskDocRef = doc(db, 'users', user.uid, 'tasks', id);
        await setDoc(taskDocRef, toggledTask);
        const nextEnergy = toggledTask.completed ? Math.min(100, pet.energy + 10) : pet.energy;
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, { "pet.energy": nextEnergy, "pet.status": toggledTask.completed ? 'happy' : pet.status });
      } catch (err) { handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/tasks/${id}`); }
    }
  };

  const handleUpdateTask = async (id, updates) => {
    let updatedTask = null;
    const sanitizedUpdates = { ...updates };
    if ('estimatedPomodoros' in sanitizedUpdates) {
      const val = sanitizedUpdates.estimatedPomodoros;
      sanitizedUpdates.estimatedPomodoros = (val === undefined || val === null || isNaN(Number(val)) || Number(val) <= 0) ? 1 : Math.round(Number(val));
    }
    setTasks((prev) => prev.map((t) => {
      if (t.id === id) {
        updatedTask = { ...t, ...sanitizedUpdates };
        return updatedTask;
      }
      return t;
    }));
    if (isConfigured && db && user?.uid && updatedTask) {
      try {
        const taskDocRef = doc(db, 'users', user.uid, 'tasks', id);
        await setDoc(taskDocRef, updatedTask);
      } catch (err) { handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/tasks/${id}`); }
    }
  };

  const handleDeleteTask = async (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (isConfigured && db && user?.uid) {
      try {
        const taskDocRef = doc(db, 'users', user.uid, 'tasks', id);
        await deleteDoc(taskDocRef);
      } catch (err) { handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/tasks/${id}`); }
    }
    triggerAlert('Meta removida.', 'info');
  };

  // Loja / Mercado
  const handleBuyItem = (itemId) => {
    const item = shopItems.find((i) => i.id === itemId);
    if (!item) return;
    if (stats.coins < item.price) {
      triggerAlert('Moedas insuficientes! Foque mais.', 'info');
      return;
    }
    if (itemId === 'potion_revive' && (item.weeklyPurchasedCount || 0) >= 2) {
      triggerAlert('Limite de Poção de Reviver atingido! Máximo 2 por semana.', 'info');
      return;
    }
    playClickFeedback();
    setStats((prev) => ({ ...prev, coins: prev.coins - item.price }));
    setShopItems((prevItems) => prevItems.map((i) => {
      if (i.id === itemId) {
        const isConsumable = i.type === 'food' || i.id === 'potion_revive' || i.type === 'mystery_box';
        if (isConsumable) {
          return { ...i, purchased: true, quantity: (i.quantity || 0) + 1, weeklyPurchasedCount: i.id === 'potion_revive' ? (i.weeklyPurchasedCount || 0) + 1 : i.weeklyPurchasedCount };
        } else {
          return { ...i, purchased: true };
        }
      }
      return i;
    }));
    triggerAlert(`Você comprou "${item.name}".`, 'success');
  };

  const handleEquipItem = (itemId) => {
    playClickFeedback();
    const item = shopItems.find((i) => i.id === itemId);
    if (!item || !item.purchased) return;
    const isCurrentlyEquipped = !!item.equipped;
    setShopItems((prevItems) => prevItems.map((i) => {
      if (i.id === itemId) return { ...i, equipped: !isCurrentlyEquipped };
      if (i.type === item.type) return { ...i, equipped: false };
      return i;
    }));
    if (item.type === 'skin') {
      setPet((prev) => ({ ...prev, skin: isCurrentlyEquipped ? 'default' : itemId }));
      triggerAlert(isCurrentlyEquipped ? `Traje removido.` : `Visual "${item.name}" equipado!`, 'success');
    } else if (item.type === 'sound') {
      triggerAlert(isCurrentlyEquipped ? `Toque padrão restaurado.` : `Toque "${item.name}" configurado!`, 'success');
    }
  };

  const handleConsumeItem = (itemId) => {
    const item = shopItems.find(i => i.id === itemId);
    if (!item || !item.quantity || item.quantity <= 0) {
      triggerAlert('Item não encontrado ou quantidade zerada.', 'info');
      return;
    }
    playClickFeedback();
    if (itemId === 'potion_revive') {
      if (pet.status !== 'dead') {
        triggerAlert('Seu mascote já está vivo!', 'info');
        return;
      }
      setPet((prev) => ({ ...prev, status: 'idle', energy: 100, experience: 0 }));
      setShopItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i));
      localStorage.setItem('foca_last_energy_received_time', new Date().toISOString());
      playSound('sound_retro');
      triggerAlert('A Foca ressuscitou com 100% de Energia! 💖', 'success');
      return;
    }
    if (pet.status === 'dead') {
      triggerAlert('Mascote falecido! Use uma Poção de Reviver.', 'info');
      return;
    }
    if (item.type === 'food') {
      const energyMatch = item.description.match(/\+(\d+)/);
      const energyBoost = energyMatch ? parseInt(energyMatch[1], 10) : 15;
      setPet(p => ({ ...p, energy: Math.min(100, p.energy + energyBoost), status: 'happy' }));
      setShopItems(prev => prev.map(i => i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i));
      localStorage.setItem('foca_last_energy_received_time', new Date().toISOString());
      triggerAlert(`Consumiu ${item.name}! +${energyBoost} Energia.`, 'success');
      setTimeout(() => setPet(p => (p.status === 'dead' ? p : { ...p, status: 'idle' })), 3000);
      return;
    }
    if (itemId === 'mystery_box') {
      const allConsumables = shopItems.filter(i => i.type === 'food' || i.id === 'potion_revive');
      if (allConsumables.length === 0) return;
      const roll = Math.random();
      let rewardedItemId = '';
      let quantityGained = 1;
      let rollReward = '';
      if (roll < 0.1) {
        rewardedItemId = 'potion_revive';
        quantityGained = 1;
        rollReward = 'INACREDITÁVEL! Você ganhou 1 Poção de Reviver Grátis! 🎉';
      } else {
        const foods = allConsumables.filter(i => i.type === 'food');
        const randomFood = foods[Math.floor(Math.random() * foods.length)];
        rewardedItemId = randomFood.id;
        quantityGained = 2;
        rollReward = `+2 ${randomFood.name} adicionados ao Inventário!`;
      }
      setShopItems(prev => prev.map(i => {
        if (i.id === itemId) return { ...i, quantity: i.quantity - 1 };
        if (i.id === rewardedItemId) return { ...i, quantity: (i.quantity || 0) + quantityGained };
        return i;
      }));
      playSound('sound_retro');
      triggerAlert(`Abriu Caixa Misteriosa! Recompensa: ${rollReward}`, 'success');
    }
  };

  const handleAddFriend = (emailOrNick) => {
    const clearName = emailOrNick.includes('@') ? emailOrNick.split('@')[0] : emailOrNick;
    if (!clearName.trim()) return false;
    const newFriend = {
      uid: `friend-${Date.now()}`,
      username: clearName.charAt(0).toUpperCase() + clearName.slice(1),
      level: Math.floor(Math.random() * 8) + 1,
      coins: Math.floor(Math.random() * 500) + 50,
      focusMinutes: Math.floor(Math.random() * 90) + 10
    };
    setFriends(prev => [newFriend, ...prev]);
    triggerAlert(`${newFriend.username} agora é seu companheiro de foco.`, 'success');
    return true;
  };

  const handleCreateSession = async (title) => {
    const newSession = {
      id: `session-${Date.now()}`,
      title,
      hostId: user?.uid || 'user-123',
      hostName: user?.displayName || username,
      createdAt: new Date().toISOString(),
      isActive: true,
      timerMode: 'focus',
      currentTimer: 1500,
      participants: [{ uid: user?.uid || 'user-123', username: user?.displayName || username, status: 'focusing', joinedAt: new Date().toISOString() }]
    };
    setSocialSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    if (isConfigured && db && user?.uid) {
      try {
        const sessionDocRef = doc(db, 'social_sessions', newSession.id);
        await setDoc(sessionDocRef, newSession);
      } catch (err) { handleFirestoreError(err, OperationType.WRITE, `social_sessions/${newSession.id}`); }
    }
    triggerAlert(`Sessão "${title}" criada!`, 'success');
  };

  const handleJoinSession = async (sessionId) => {
    if (!sessionId) {
      const prevActiveId = activeSessionId;
      setActiveSessionId(null);
      if (isConfigured && db && user?.uid && prevActiveId) {
        try {
          const sessionDocRef = doc(db, 'social_sessions', prevActiveId);
          const currentSnap = await getDoc(sessionDocRef);
          if (currentSnap.exists()) {
            const currentSession = currentSnap.data();
            const updatedParticipants = currentSession.participants.filter(p => p.uid !== user.uid);
            await updateDoc(sessionDocRef, { participants: updatedParticipants });
          }
        } catch (err) { handleFirestoreError(err, OperationType.WRITE, `social_sessions/${prevActiveId}`); }
      }
      triggerAlert('Você saiu da sessão.', 'info');
      return;
    }
    setActiveSessionId(sessionId);
    if (isConfigured && db && user?.uid) {
      try {
        const sessionDocRef = doc(db, 'social_sessions', sessionId);
        const currentSnap = await getDoc(sessionDocRef);
        if (currentSnap.exists()) {
          const currentSession = currentSnap.data();
          const withoutMe = currentSession.participants.filter(p => p.uid !== user.uid);
          const updatedParticipants = [...withoutMe, { uid: user.uid, username: user.displayName || username, status: 'focusing', joinedAt: new Date().toISOString() }];
          await updateDoc(sessionDocRef, { participants: updatedParticipants });
        }
      } catch (err) { handleFirestoreError(err, OperationType.WRITE, `social_sessions/${sessionId}`); }
    }
    triggerAlert('Ingressou na sala conjunta!', 'success');
  };

  const handleLoginSuccess = async (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem('foca_user', JSON.stringify(loggedInUser));
    if (isConfigured && db) {
      try {
        const userDocRef = doc(db, 'users', loggedInUser.uid);
        const snapshot = await getDoc(userDocRef);
        if (!snapshot.exists()) {
          const initialData = {
            userId: loggedInUser.uid,
            username: loggedInUser.displayName || loggedInUser.email.split('@')[0],
            pet: pet,
            stats: stats,
            shopItems: shopItems,
            createdAt: new Date().toISOString()
          };
          lastSyncedRef.current = normalizeState({ pet, stats, shopItems });
          await setDoc(userDocRef, initialData);
          const tasksCollection = collection(db, 'users', loggedInUser.uid, 'tasks');
          if (tasks.length > 0) {
            for (const task of tasks) {
              const taskDocRef = doc(db, 'users', loggedInUser.uid, 'tasks', task.id);
              await setDoc(taskDocRef, task);
            }
          }
        } else {
          const data = snapshot.data();
          lastSyncedRef.current = normalizeState({ pet: data.pet, stats: data.stats, shopItems: data.shopItems });
          if (data.pet) setPet(data.pet);
          if (data.stats) setStats(data.stats);
          if (data.shopItems) setShopItems(data.shopItems);
        }
      } catch (err) { console.error("Error during login sync:", err); }
    }
    setScreen('app');
    triggerAlert(`Bem-vindo, ${loggedInUser.displayName || loggedInUser.email}!`, 'success');
  };

  const handleUpdateUsername = (newName) => {
    if (newName.length > 20) return;
    setPet(p => ({ ...p, name: newName }));
    if (user) setUser({ ...user, displayName: newName });
    triggerAlert(`Nome alterado para "${newName}"!`, 'success');
  };

  // Renderização condicional de telas
  if (screen === 'auth') {
    return <AuthScreen onBack={() => setScreen('landing')} onLoginSuccess={handleLoginSuccess} />;
  }
  if (screen === 'landing') {
    return <HeroPage onEnterApp={() => setScreen('auth')} />;
  }

  return (
    <div className={`min-h-screen font-sans transition-all duration-500 bg-brand-bg text-brand-text select-none relative ${theme === 'dark' ? 'theme-dark' : 'theme-light'}`}>
      <div className={`absolute inset-0 opacity-[0.22] pointer-events-none z-0 ${theme === 'dark' ? 'bg-texture-dark' : 'bg-texture-light'}`} />
      <span className="absolute top-0 left-0 w-full h-[600px] pointer-events-none opacity-30 bg-gradient-to-b from-blue-500/5 to-transparent" />
      <main className="relative max-w-7xl mx-auto px-4 py-8 xl:py-12 space-y-6 z-10">
        <AnimatePresence>
          {alertNotification && (
            <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl border shadow-xl flex items-center gap-2 max-w-md text-xs font-semibold ${alertNotification.type === 'success' ? 'bg-emerald-500 text-[#07091e] border-emerald-400' : 'bg-indigo-600 text-white border-indigo-500'}`}>
              <span>{alertNotification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="w-full flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button onClick={() => { playClickFeedback(); setScreen('landing'); }} className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider hover:text-blue-500 transition-colors cursor-pointer">
              <ChevronLeft size={14} /> Ver Landing Explicativa
            </button>
          </div>
          <span className="text-[10px] font-mono opacity-30">FOCA AQUI BETA // FAIXA SOCIAL</span>
        </motion.div>
        <DashboardHeader
          theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          streak={stats.currentStreak} userEmail={user?.email || 'eduianbf@gmail.com'}
          onOpenSidebar={() => setIsNavOpen(true)} onOpenShop={() => setIsShopOpen(true)}
          onLogout={async () => { if (isConfigured && auth) try { await auth.signOut(); } catch (err) { console.error(err); } setUser(null); localStorage.removeItem('foca_user'); setScreen('landing'); }}
        />
        <div className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
              <PomodoroTimer onCycleComplete={handleCycleComplete} onTimerRunningChange={handleTimerRunningChange} />
            </div>
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
              <PetStatus pet={pet} shopItems={shopItems} onEquipItem={handleEquipItem} onConsumeItem={handleConsumeItem} />
            </div>
          </div>
          <div className="py-2 flex items-center justify-between">
            <div className="h-[1px] bg-brand-border flex-grow" />
            <span className="px-4 text-[9px] font-mono tracking-[0.4em] opacity-30 select-none uppercase">METAS & MERCADO DE RECOMPENSAS</span>
            <div className="h-[1px] bg-brand-border flex-grow" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
              <TodoList tasks={tasks} onAddTask={handleAddTask} onToggleComplete={handleToggleComplete} onUpdateTask={handleUpdateTask} onDeleteTask={handleDeleteTask} />
            </div>
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
              <div className="p-6 rounded-2xl bg-brand-card border border-brand-border h-full shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden text-center items-center">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-yellow-400/[0.04] group-hover:bg-yellow-400/[0.08] rounded-full blur-[48px] pointer-events-none transition-colors duration-500" />
                <div className="space-y-6 flex flex-col items-center w-full">
                  <div className="flex flex-col items-center gap-2">
                    <motion.div whileHover={{ scale: 1.15, rotate: 12 }} whileTap={{ scale: 0.9 }} onClick={() => { playClickFeedback(); setIsShopOpen(true); }} className="cursor-pointer p-2 rounded-xl bg-yellow-400/10 text-yellow-500 hover:bg-yellow-400/20 hover:text-yellow-400 transition-all shadow-md w-max">
                      <ShoppingBag size={18} />
                    </motion.div>
                    <h3 className="font-display font-medium text-brand-text/60 text-xs font-mono tracking-widest uppercase">MERCADO DO MASCOTE</h3>
                  </div>
                  <div className="space-y-2 flex flex-col items-center">
                    <span className="text-[9px] text-brand-text/40 font-mono font-bold tracking-wider uppercase">Saldo Atual</span>
                    <div className="flex flex-col items-center gap-1">
                      <motion.div animate={{ scale: [1, 1.08, 1], rotate: [0, 6, -6, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} onClick={() => { playClickFeedback(); setIsShopOpen(true); }} className="cursor-pointer p-2.5 rounded-full bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-500 transition-all shadow-sm w-max mb-1">
                        <Coins size={32} className="text-yellow-400" />
                      </motion.div>
                      <div className="flex items-baseline gap-1.5 justify-center">
                        <span className="font-display font-black text-4xl text-yellow-400 font-mono tracking-tight">{stats.coins}</span>
                        <span className="text-xs text-brand-text/40 font-mono uppercase font-black">moedas</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#F8F6F0]/50 leading-relaxed font-light text-center">As moedas são ganhas exclusivamente realizando focos pelo timer Pomodoro. Use-as no Mercado para destravar trajes cosméticos, comidas nutritivas e fortificantes para o seu amigo!</p>
                </div>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => { playClickFeedback(); setIsShopOpen(true); }} className="w-full mt-6 py-4 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-extrabold text-xs uppercase tracking-widest rounded-xl cursor-pointer shadow-lg hover:shadow-yellow-400/20 transition-all flex items-center justify-center gap-2">
                  <ShoppingBag size={14} /> Ir ao Mercado de Recompensas
                </motion.button>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center py-6 text-[10px] text-brand-text/30 font-mono uppercase tracking-widest">Foca Aqui &copy; {new Date().getFullYear()} - Gamificação de Resultados da Atenção // TCC Eduardo</div>
      </main>
      {/* MODAL DO MERCADO - CORRETAMENTE RENDERIZADO */}
      <ShopModal
        isOpen={isShopOpen}
        onClose={() => setIsShopOpen(false)}
        coins={stats.coins}
        items={shopItems}
        onBuyItem={handleBuyItem}
        onEquipItem={handleEquipItem}
        onOpenMysteryBox={() => handleConsumeItem('mystery_box')}
      />
      <NavigationSidebar
        isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} userEmail={user?.email || 'eduianbf@gmail.com'}
        username={user?.displayName || pet.name} onUpdateUsername={handleUpdateUsername}
        pet={pet} stats={stats} shopItems={shopItems} onEquipItem={handleEquipItem} onConsumeItem={handleConsumeItem}
        friends={friends} onAddFriend={handleAddFriend} socialSessions={socialSessions}
        onCreateSession={handleCreateSession} onJoinSession={handleJoinSession} activeSessionId={activeSessionId}
        theme={theme}
      />
    </div>
  );
}
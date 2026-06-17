// src/hooks/useFriends.js
import { useState, useEffect, useRef } from 'react';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { ref, onValue } from 'firebase/database';
import { db, rtdb } from '../lib/firebase';

export function useFriends(uid) {
  const rtdbListeners = useRef({});
  const profileListeners = useRef({});
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) {
      setFriends([]);
      setLoading(false);
      return;
    }

    // Busca amizades (pendentes ou aceitas) onde o usuário participa
    const friendsQuery = query(
      collection(db, 'friendships'),
      where('users', 'array-contains', uid)
    );

    const unsubscribeFirestore = onSnapshot(friendsQuery, (snapshot) => {
      const currentAcceptedIds = [];
      const pendingMap = new Map(); // Usando Map para evitar duplicados nas solicitações também

      snapshot.docs.forEach(docSnap => {
        const data = docSnap.data();
        const friendId = data.users.find(id => id !== uid);
        if (!friendId) return;

        const friendData = { 
          friendshipId: docSnap.id, 
          friendId, 
          username: data.usernames?.[friendId] || 'Usuário',
          status: 'offline',
          activeSessionId: null
        };

        if (data.status === 'accepted') {
          currentAcceptedIds.push(friendData);

            // Só escuta o RTDB para amigos aceitos
            if (!rtdbListeners.current[friendId]) {
              const statusRef = ref(rtdb, `/status/${friendId}`);
              rtdbListeners.current[friendId] = onValue(statusRef, (snap) => {
                const val = snap.val() || { state: 'offline' };
                setFriends(prev => prev.map(f => 
                  f.friendId === friendId ? { ...f, status: val.state, activeSessionId: val.activeSessionId } : f
                ));
              });
            }

            // NOVO: Escuta o Perfil do Amigo no Firestore para pegar o Desempenho (Stats/Level)
            if (!profileListeners.current[friendId]) {
              const userRef = doc(db, 'users', friendId);
              profileListeners.current[friendId] = onSnapshot(userRef, (snap) => {
                if (snap.exists()) {
                  const userData = snap.data();
                  // Calcula o total de minutos da semana
                  const weeklyTotal = userData.stats?.weeklyFocus?.reduce((acc, curr) => acc + (curr.minutes || 0), 0) || 0;
                  const level = userData.pet?.level || 0;

                  setFriends(prev => prev.map(f => 
                    f.friendId === friendId ? { ...f, focusMinutes: weeklyTotal, level: level } : f
                  ));
                }
              });
            }
        } else if (data.status === 'pending' && data.requestedBy !== uid) {
          // Só mostra na lista de "pendentes" se for um convite RECEBIDO
          if (!pendingMap.has(friendId)) {
            pendingMap.set(friendId, friendData);
          }
        }
      });

      // Atualiza a lista base preservando os dados meta (status/stats) já carregados
      setFriends(prev => {
        return currentAcceptedIds.map(base => {
          const existing = prev.find(f => f.friendId === base.friendId);
          return existing ? { ...existing, ...base } : base;
        });
      });

      setRequests(Array.from(pendingMap.values()));
      setLoading(false);
    }, (error) => {
      console.error('[useFriends] Erro ao buscar amigos no Firestore:', error);
      setLoading(false);
    });

    return () => {
      unsubscribeFirestore();
      Object.values(rtdbListeners.current).forEach(unsub => unsub());
      Object.values(profileListeners.current).forEach(unsub => unsub());
      rtdbListeners.current = {};
      profileListeners.current = {};
    };
  }, [uid]);

  return { friends, requests, loading };
}
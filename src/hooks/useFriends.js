// src/hooks/useFriends.js
import { useState, useEffect, useRef } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { ref, onValue } from 'firebase/database';
import { db, rtdb } from '../lib/firebase';

export function useFriends(uid) {
  const rtdbListeners = useRef({});
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
      const accepted = [];
      const pending = [];

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const friendId = data.users.find(id => id !== uid);
        const friendData = { 
          friendshipId: doc.id, 
          friendId, 
          username: data.usernames?.[friendId] || 'Usuário',
          status: 'offline',
          activeSessionId: null
        };

        if (data.status === 'accepted') {
          accepted.push(friendData);
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
        } else if (data.status === 'pending' && data.requestedBy !== uid) {
          // Só mostra na lista de "pendentes" se for um convite RECEBIDO
          pending.push(friendData);
        }
      });

      setFriends(accepted);
      setRequests(pending);
      setLoading(false);
    }, (error) => {
      console.error('[useFriends] Erro ao buscar amigos no Firestore:', error);
      setLoading(false);
    });

    return () => {
      unsubscribeFirestore();
      Object.values(rtdbListeners.current).forEach(unsub => unsub());
      rtdbListeners.current = {};
    };
  }, [uid]);

  return { friends, requests, loading };
}
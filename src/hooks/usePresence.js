// src/hooks/usePresence.js
import { useEffect } from 'react';
import { ref, onValue, set, onDisconnect, serverTimestamp } from 'firebase/database';
import { rtdb } from '../lib/firebase';

export function usePresence(uid, currentState = 'online', sessionId = null) {
  useEffect(() => {
    if (!uid) return;

    // Referência para o status deste usuário específico no RTDB
    const userStatusRef = ref(rtdb, `/status/${uid}`);
    
    // Nó especial do Firebase que monitora se o cliente está conectado ao servidor
    const connectedRef = ref(rtdb, '.info/connected');

    const unsubscribe = onValue(connectedRef, (snapshot) => {
      // Se não estiver conectado, não fazemos nada
      if (snapshot.val() === false) {
        return;
      }

      // 1. Prepara o gatilho de desconexão no SERVIDOR.
      // Se a internet cair ou a aba fechar, o Firebase roda isso sozinho:
      onDisconnect(userStatusRef).set({
        state: 'offline',
        lastChanged: serverTimestamp(),
      }).then(() => {
        // 2. Só depois de garantir o gatilho de desconexão, marcamos como online:
        set(userStatusRef, {
          state: currentState,
          lastChanged: serverTimestamp(),
          activeSessionId: sessionId
        });
      });
    });

    // Limpa o listener quando o componente desmontar
    return () => unsubscribe();
  }, [uid, currentState, sessionId]);
}
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Cole as configurações do seu projeto do Firebase aqui
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const isConfigured = true; // Ou a sua lógica para verificar a configuração

// Baseado no seu App.jsx, você também precisa exportar esses dois:
export const handleFirestoreError = (error) => {
  console.error(error);
};

export const OperationType = {
  // Seus tipos de operação aqui
};
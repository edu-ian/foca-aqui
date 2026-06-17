import { initializeApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Verificação robusta: a chave deve existir e não ser um valor default ou "undefined" do Vite
const rawKey = firebaseConfig.apiKey;
const hasValidKey = !!(rawKey && 
                      String(rawKey).trim() !== "undefined" && 
                      String(rawKey).trim().length > 10);

let dbInstance = null;
let authInstance = null;
let rtdbInstance = null;
let firebaseInitialized = false;

if (hasValidKey) {
  try {
    const app = initializeApp(firebaseConfig);
    
    // Configuração Sênior: ignoreUndefinedProperties evita o erro de "Unsupported field value: undefined"
    dbInstance = initializeFirestore(app, {
      ignoreUndefinedProperties: true
    });
    authInstance = getAuth(app);
    rtdbInstance = getDatabase(app);
    firebaseInitialized = true;
  } catch (error) {
    console.error("Falha ao inicializar serviços do Firebase:", error);
    firebaseInitialized = false;
  }
}

export const isConfigured = firebaseInitialized;
export const db = dbInstance;
export const auth = authInstance;
export const rtdb = rtdbInstance;

export const handleFirestoreError = (error) => {
  console.error(error);
};

export const OperationType = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  GET: 'get'
};
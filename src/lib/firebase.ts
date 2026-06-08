import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, getDocs, onSnapshot, query, where, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const isConfigured = firebaseConfig && firebaseConfig.apiKey && firebaseConfig.apiKey !== "";

let app;
let db: any;
let auth: any;

if (isConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");
    auth = getAuth(app);
  } catch (error) {
    console.error("Erro ao inicializar Firebase real, usando fallback offline:", error);
    app = null;
    db = null;
    auth = null;
  }
} else {
  console.log("Firebase não configurado (API Key ausente). Usará modo Local Offline inteligente.");
  app = null;
  db = null;
  auth = null;
}

export { app, db, auth, isConfigured };

// Executivos ou "Diretivos Manipuladores" construídos estritamente e necessários conformes descrições de integração das skills do firebase.
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || null,
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || null,
      isAnonymous: auth?.currentUser?.isAnonymous || null,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map((provider: any) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Details: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

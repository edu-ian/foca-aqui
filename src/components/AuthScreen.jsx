import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, ArrowLeft, Sparkles, AlertCircle, CheckCircle, Chrome } from 'lucide-react';
import { playClickFeedback } from '../utils/audio';
import { isConfigured, auth } from '../lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from 'firebase/auth';

export default function AuthScreen({ onBack, onLoginSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const googleProvider = new GoogleAuthProvider();

  const handleAuthError = (err) => {
    console.error("Auth error:", err);
    let BrazilError = "Ocorreu um erro ao processar. Verifique as credenciais.";
    if (err.code === 'auth/wrong-password') BrazilError = "Senha incorreta.";
    else if (err.code === 'auth/user-not-found') BrazilError = "Usuário não encontrado.";
    else if (err.code === 'auth/email-already-in-use') BrazilError = "Este e-mail já está cadastrado.";
    else if (err.code === 'auth/invalid-email') BrazilError = "E-mail inválido.";
    else if (err.code === 'auth/weak-password') BrazilError = "A senha deve ter no mínimo 6 caracteres.";
    
    setMessage({ text: BrazilError, type: 'error' });
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    playClickFeedback();
    setLoading(true);
    setMessage(null);

    if (!email.trim() || !password.trim()) {
      setMessage({ text: "Por favor, preencha todos os campos.", type: 'error' });
      setLoading(false);
      return;
    }

    if (isSignUp && !username.trim()) {
      setMessage({ text: "Defina um nome de usuário para o cadastro.", type: 'error' });
      setLoading(false);
      return;
    }

    if (isSignUp && username.length > 20) {
      setMessage({ text: "O nome de usuário deve ter no máximo 20 caracteres.", type: 'error' });
      setLoading(false);
      return;
    }

    if (isConfigured && auth) {
      try {
        if (isSignUp) {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          onLoginSuccess({
            email: userCredential.user.email || email,
            displayName: username,
            uid: userCredential.user.uid,
          });
        } else {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          onLoginSuccess({
            email: userCredential.user.email || email,
            displayName: userCredential.user.displayName || email.split('@')[0],
            uid: userCredential.user.uid,
          });
        }
      } catch (err) {
        handleAuthError(err);
      } finally {
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        setLoading(false);
        if (isSignUp) {
          setMessage({ text: "Conta demonstrativa criada localmente com sucesso!", type: 'success' });
          setTimeout(() => {
            onLoginSuccess({
              email,
              displayName: username,
              uid: `demo-uid-${Date.now()}`
            });
          }, 1500);
        } else {
          onLoginSuccess({
            email,
            displayName: email.split('@')[0],
            uid: `demo-uid-${Date.now()}`
          });
        }
      }, 1000);
    }
  };

  const handleGoogleLogin = async () => {
    playClickFeedback();
    setLoading(true);
    setMessage(null);

    if (isConfigured && auth) {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        onLoginSuccess({
          email: result.user.email || '',
          displayName: result.user.displayName || undefined,
          uid: result.user.uid,
        });
      } catch (err) {
        handleAuthError(err);
      } finally {
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        setLoading(false);
        onLoginSuccess({
          email: 'eduianbf@gmail.com',
          displayName: 'Eduardo Ian',
          uid: 'demo-google-uid-1234'
        });
      }, 1000);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    playClickFeedback();
    setLoading(true);
    setMessage(null);

    if (!email.trim()) {
      setMessage({ text: "Insira seu e-mail para receber as instruções.", type: 'error' });
      setLoading(false);
      return;
    }

    if (isConfigured && auth) {
      try {
        await sendPasswordResetEmail(auth, email);
        setMessage({ text: "E-mail de recuperação enviado com sucesso! Verifique sua caixa de entrada.", type: 'success' });
        setTimeout(() => setIsForgotPassword(false), 3000);
      } catch (err) {
        handleAuthError(err);
      } finally {
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        setLoading(false);
        setMessage({ text: "[Demo-Modo] E-mail de recuperação simulado com sucesso!", type: 'success' });
        setTimeout(() => setIsForgotPassword(false), 3000);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#060824] text-[#F8F6F0] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/[0.15] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-45 -right-45 w-[450px] h-[450px] bg-blue-500/[0.12] rounded-full blur-3xl pointer-events-none" />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-bold font-mono tracking-wider text-[#F8F6F0]/60 hover:text-white cursor-pointer transition-colors"
      >
        <ArrowLeft size={16} />
        Voltar à Home
      </motion.button>

      <div className="w-full max-w-md bg-[#0a0d33] border border-[#F8F6F0]/10 rounded-2xl p-6 md:p-8 shadow-2xl relative z-10 transition-all">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-400 mb-3">
            <img src="https://i.imgur.com/E6ow4Ip.png" alt="Logo" className="w-8 h-8 object-contain" />
          </div>
          <h2 className="font-display font-black text-2xl uppercase tracking-tight text-white mb-1.5">
            {isForgotPassword ? "Recuperar Senha" : isSignUp ? "Fazer Cadastro" : "Iniciar Sessão"}
          </h2>
          <p className="text-xs text-[#F8F6F0]/40 font-mono font-medium uppercase tracking-wider">
            {isForgotPassword 
              ? "Receba um convite para criar nova senha" 
              : isSignUp 
              ? "Cadastre-se para acompanhar sua evolução" 
              : "Economia Gamificada Foca Aqui"
            }
          </p>
        </div>

        <AnimatePresence mode="wait">
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-3.5 mb-5 rounded-lg border text-xs font-semibold flex items-start gap-2.5 ${
                message.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/10 border-red-500/20 text-red-400'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle size={16} className="shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
              )}
              <span>{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {isForgotPassword ? (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-widest text-[#F8F6F0]/40 font-bold uppercase">
                Endereço de E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F8F6F0]/30" size={16} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#070921] border border-[#F8F6F0]/10 rounded-xl focus:outline-none focus:border-blue-500 text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/15"
            >
              {loading ? "Enviando..." : "Enviar instruções de redefinição"}
            </button>

            <button
              type="button"
              onClick={() => {
                playClickFeedback();
                setIsForgotPassword(false);
              }}
              className="w-full text-center text-xs text-indigo-400 hover:text-indigo-300 font-medium pt-2 block transition-colors"
            >
              Voltar ao login
            </button>
          </form>
        ) : (
          <form onSubmit={handleEmailAuth} className="space-y-4">
            
            {isSignUp && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono tracking-widest text-[#F8F6F0]/40 font-bold uppercase">
                  Nome de Usuário (massa)
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F8F6F0]/30" size={16} />
                  <input
                    type="text"
                    maxLength={20}
                    placeholder="ex: FocaGamer"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#070921] border border-[#F8F6F0]/10 rounded-xl focus:outline-none focus:border-blue-500 text-xs text-white"
                  />
                </div>
                <span className="text-[9px] text-[#F8F6F0]/30 font-mono italic block text-right">
                  {username.length}/20 caracteres
                </span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono tracking-widest text-[#F8F6F0]/40 font-bold uppercase">
                Endereço de E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F8F6F0]/30" size={16} />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#070921] border border-[#F8F6F0]/10 rounded-xl focus:outline-none focus:border-blue-500 text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono tracking-widest text-[#F8F6F0]/40 font-bold uppercase">
                  Sua Senha Segura
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => {
                      playClickFeedback();
                      setIsForgotPassword(true);
                      setMessage(null);
                    }}
                    className="text-[10px] hover:underline text-indigo-400 font-medium"
                  >
                    Esqueceu?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F8F6F0]/30" size={16} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#070921] border border-[#F8F6F0]/10 rounded-xl focus:outline-none focus:border-blue-500 text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/15"
            >
              {loading ? "Processando..." : isSignUp ? "Cadastrar Conta" : "Entrar no App"}
            </button>

            <div className="relative my-6 block">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#F8F6F0]/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono tracking-widest">
                <span className="bg-[#0a0d33] px-3 text-[#F8F6F0]/40">ou via rede</span>
              </div>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full py-3 bg-brand-bg hover:bg-brand-text/5 border border-[#F8F6F0]/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Chrome size={15} className="text-blue-400" />
              Entrar com o Google
            </button>

            <div className="pt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  playClickFeedback();
                  setIsSignUp(!isSignUp);
                  setMessage(null);
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
              >
                {isSignUp 
                  ? "Já possui uma conta? Conecte-se" 
                  : "Não tem conta? Crie uma grátis agora!"
                }
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
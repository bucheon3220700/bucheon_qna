import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Mail, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert('회원가입 실패: ' + error.message);
      else {
        alert('회원가입이 완료되었습니다. 로그인해주세요.');
        setIsSignUp(false);
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert('로그인 실패: 이메일 또는 비밀번호를 확인해주세요.');
      else navigate('/admin');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-bwyf-purple/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-6 h-6 text-bwyf-purple" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{isSignUp ? '회원가입' : '관리자 로그인'}</h1>
          <p className="text-sm text-gray-500 mt-2">부천여성청소년재단 경영정보부 Q&A</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bwyf-purple focus:border-bwyf-purple outline-none transition-all" 
                placeholder="admin@bwyf.or.kr" 
                required 
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">비밀번호</label>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-bwyf-purple focus:border-bwyf-purple outline-none transition-all" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 bg-bwyf-purple text-white rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 group shadow-md shadow-bwyf-purple/20"
          >
            {isSignUp ? '가입하기' : '로그인'}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {isSignUp ? (
            <p>이미 계정이 있으신가요? <button type="button" onClick={() => setIsSignUp(false)} className="text-bwyf-purple font-bold hover:underline">로그인</button></p>
          ) : (
            <p>계정이 없으신가요? <button type="button" onClick={() => setIsSignUp(true)} className="text-bwyf-purple font-bold hover:underline">회원가입</button></p>
          )}
        </div>
      </div>
    </div>
  );
}

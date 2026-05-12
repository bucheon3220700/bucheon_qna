import { useState, useEffect } from 'react';
import { MessageCircle, Lock, User, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function MainPage() {
  const [showForm, setShowForm] = useState(false);
  const [notices, setNotices] = useState([]);
  const [questions, setQuestions] = useState([]);
  
  // 폼 상태
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSecret, setIsSecret] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchNotices();
    fetchQuestions();
  }, []);

  const fetchNotices = async () => {
    const { data } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
    if (data) setNotices(data);
  };

  const fetchQuestions = async () => {
    const { data } = await supabase.from('questions').select('*').order('created_at', { ascending: false });
    if (data) setQuestions(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) return alert('제목과 내용을 입력해주세요.');
    
    const { error } = await supabase.from('questions').insert([
      { title, content, is_secret: isSecret, password, author: '익명' }
    ]);
    
    if (error) {
      alert('질문 등록에 실패했습니다.');
    } else {
      alert('질문이 등록되었습니다.');
      setShowForm(false);
      setTitle(''); setContent(''); setIsSecret(false); setPassword('');
      fetchQuestions();
    }
  };

  return (
    <div className="space-y-8">
      {/* 공지사항 */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-bwyf-purple"></div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-bwyf-purple/10 text-bwyf-purple flex items-center justify-center text-sm">📢</span>
          공지사항
        </h2>
        <ul className="space-y-3">
          {notices.length === 0 ? (
            <li className="text-sm text-gray-500 py-2">등록된 공지사항이 없습니다.</li>
          ) : (
            notices.map(notice => (
              <li key={notice.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="shrink-0 px-2 py-1 bg-bwyf-green/10 text-bwyf-green text-xs font-bold rounded-md mt-0.5">공지</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">{notice.title}</p>
                  <p className="text-xs text-gray-500 mt-1">관리자 • {new Date(notice.created_at).toLocaleDateString()}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </section>

      {/* Q&A 게시판 */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-bwyf-purple" />
            질문 게시판
          </h2>
          <button 
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-4 py-2 bg-bwyf-purple text-white text-sm font-medium rounded-lg hover:bg-opacity-90 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            질문하기
          </button>
        </div>

        {/* 질문하기 폼 */}
        {showForm && (
          <div className="mb-8 p-5 bg-gray-50 rounded-xl border border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">새 질문 작성</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bwyf-purple focus:border-bwyf-purple outline-none transition-all" placeholder="질문 제목을 입력하세요" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                <textarea rows="4" value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-bwyf-purple focus:border-bwyf-purple outline-none transition-all resize-none" placeholder="질문 내용을 자세히 적어주세요" required></textarea>
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isSecret} onChange={(e) => setIsSecret(e.target.checked)} className="w-4 h-4 text-bwyf-purple rounded border-gray-300 focus:ring-bwyf-purple" />
                  <span className="text-sm text-gray-700 flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> 비밀글로 작성</span>
                </label>
                {isSecret && (
                  <div className="flex-1 max-w-xs">
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-bwyf-purple focus:border-bwyf-purple outline-none transition-all" required={isSecret} />
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">취소</button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-bwyf-green rounded-lg hover:bg-opacity-90 shadow-sm">등록하기</button>
              </div>
            </form>
          </div>
        )}

        {/* 게시글 목록 */}
        <div className="space-y-0 divide-y divide-gray-100 border-t border-gray-100">
          {questions.length === 0 ? (
            <div className="py-8 text-center text-gray-500 text-sm">등록된 질문이 없습니다. 첫 질문을 작성해보세요!</div>
          ) : (
            questions.map(q => (
              <div key={q.id} className="py-4 flex items-center gap-4 hover:bg-gray-50 px-2 transition-colors -mx-2 rounded-lg cursor-pointer">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {q.status === '답변대기' ? (
                      <span className="px-2 py-0.5 bg-bwyf-yellow/20 text-yellow-800 text-xs font-bold rounded">답변대기</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-bwyf-green/20 text-green-800 text-xs font-bold rounded">답변완료</span>
                    )}
                    
                    {q.is_secret ? (
                      <h4 className="text-sm font-semibold text-gray-500 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> 비밀글입니다.
                      </h4>
                    ) : (
                      <h4 className="text-sm font-semibold text-gray-900">{q.title}</h4>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {q.author}</span>
                    <span>{new Date(q.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

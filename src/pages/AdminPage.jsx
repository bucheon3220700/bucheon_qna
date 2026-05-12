import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Megaphone, MessageSquare, Trash2, Edit, CheckCircle, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('notices');
  const [session, setSession] = useState(null);
  const [notices, setNotices] = useState([]);
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  // 새 공지사항 폼
  const [showNoticeForm, setShowNoticeForm] = useState(false);
  const [noticeTitle, setNoticeTitle] = useState('');

  // 답변 내용 폼
  const [answerContent, setAnswerContent] = useState({});

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      alert('로그인이 필요한 페이지입니다.');
      navigate('/login');
    } else {
      setSession(session);
      fetchData();
    }
  };

  const fetchData = async () => {
    const { data: nData } = await supabase.from('notices').select('*').order('created_at', { ascending: false });
    if (nData) setNotices(nData);

    const { data: qData } = await supabase.from('questions').select('*').order('created_at', { ascending: false });
    if (qData) setQuestions(qData);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // 공지사항 로직
  const createNotice = async (e) => {
    e.preventDefault();
    if (!noticeTitle) return;
    const { error } = await supabase.from('notices').insert([{ title: noticeTitle }]);
    if (!error) {
      setNoticeTitle('');
      setShowNoticeForm(false);
      fetchData();
    }
  };

  const deleteNotice = async (id) => {
    if (confirm('삭제하시겠습니까?')) {
      await supabase.from('notices').delete().eq('id', id);
      fetchData();
    }
  };

  // Q&A 로직
  const deleteQuestion = async (id) => {
    if (confirm('게시물을 삭제하시겠습니까?')) {
      await supabase.from('questions').delete().eq('id', id);
      fetchData();
    }
  };

  const submitAnswer = async (questionId) => {
    const content = answerContent[questionId];
    if (!content) return alert('답변을 입력해주세요.');

    const { error } = await supabase.from('answers').insert([{ question_id: questionId, content }]);
    if (!error) {
      await supabase.from('questions').update({ status: '답변완료' }).eq('id', questionId);
      setAnswerContent({ ...answerContent, [questionId]: '' });
      fetchData();
      alert('답변이 등록되었습니다.');
    } else {
      alert('오류가 발생했습니다.');
    }
  };

  if (!session) return null;

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <aside className="w-full md:w-64 shrink-0">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-800">관리자 메뉴</h2>
            <button onClick={handleLogout} className="text-gray-500 hover:text-red-500" title="로그아웃">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
          <nav className="flex flex-row md:flex-col p-2 gap-1">
            <button onClick={() => setActiveTab('notices')} className={`flex-1 md:w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'notices' ? 'bg-bwyf-purple/10 text-bwyf-purple' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Megaphone className="w-4 h-4" /> 공지사항 관리
            </button>
            <button onClick={() => setActiveTab('qna')} className={`flex-1 md:w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'qna' ? 'bg-bwyf-purple/10 text-bwyf-purple' : 'text-gray-600 hover:bg-gray-50'}`}>
              <MessageSquare className="w-4 h-4" /> Q&A 관리
            </button>
          </nav>
        </div>
      </aside>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        {activeTab === 'notices' ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">공지사항 관리</h3>
              <button onClick={() => setShowNoticeForm(!showNoticeForm)} className="px-3 py-1.5 bg-bwyf-purple text-white text-sm font-medium rounded-lg hover:bg-opacity-90">새 공지 등록</button>
            </div>
            
            {showNoticeForm && (
              <form onSubmit={createNotice} className="mb-6 flex gap-2">
                <input type="text" value={noticeTitle} onChange={e => setNoticeTitle(e.target.value)} placeholder="공지사항 제목" className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-bwyf-purple" required />
                <button type="submit" className="px-4 py-2 bg-bwyf-green text-white font-medium rounded-lg">저장</button>
              </form>
            )}

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-medium">제목</th>
                    <th className="px-4 py-3 font-medium w-32">작성일</th>
                    <th className="px-4 py-3 font-medium w-24 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {notices.map(notice => (
                    <tr key={notice.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-900 font-medium">{notice.title}</td>
                      <td className="px-4 py-3 text-gray-500">{new Date(notice.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => deleteNotice(notice.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4 inline" /></button>
                      </td>
                    </tr>
                  ))}
                  {notices.length === 0 && <tr><td colSpan="3" className="px-4 py-8 text-center text-gray-500">등록된 공지사항이 없습니다.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-6">Q&A 게시판 관리</h3>
            <div className="space-y-4">
              {questions.map(q => (
                <div key={q.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-bold rounded ${q.status === '답변대기' ? 'bg-bwyf-yellow/20 text-yellow-800' : 'bg-bwyf-green/20 text-green-800'}`}>{q.status}</span>
                      <h4 className="font-semibold text-gray-900">
                        {q.is_secret && <Lock className="w-3.5 h-3.5 inline mr-1 text-gray-500" />}
                        {q.title}
                      </h4>
                    </div>
                    <button onClick={() => deleteQuestion(q.id)} className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-md">{q.content}</p>
                  
                  {q.status === '답변대기' && (
                    <div className="border-t border-gray-100 pt-3 mt-3">
                      <label className="block text-xs font-bold text-gray-500 mb-1">답변 작성</label>
                      <div className="flex gap-2">
                        <textarea 
                          value={answerContent[q.id] || ''}
                          onChange={(e) => setAnswerContent({...answerContent, [q.id]: e.target.value})}
                          rows="2" className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-bwyf-purple outline-none resize-none" placeholder="답변을 입력하세요..."></textarea>
                        <button onClick={() => submitAnswer(q.id)} className="px-4 py-2 bg-bwyf-green text-white text-sm font-medium rounded-lg hover:bg-opacity-90 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" /> 등록
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {questions.length === 0 && <div className="py-8 text-center text-gray-500">질문 내역이 없습니다.</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

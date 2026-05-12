import { Outlet, Link } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/bwyf_ci.png" alt="부천여성청소년재단 로고" className="h-8 object-contain" />
            <span className="font-bold text-gray-800 hidden sm:inline-block">경영정보부 Q&A</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-bwyf-purple transition-colors">
              로그인
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 lg:p-8">
        <Outlet />
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} 부천여성청소년재단 경영정보부. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

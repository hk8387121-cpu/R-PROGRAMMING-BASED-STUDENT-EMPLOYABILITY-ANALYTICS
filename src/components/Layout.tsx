import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <Header />
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

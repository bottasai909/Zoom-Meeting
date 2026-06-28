import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, PlusSquare, Video, Settings } from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();

  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Join Meeting', icon: Video, path: '/join' },
    { name: 'Schedule Meeting', icon: PlusSquare, path: '/schedule' },
  ];

  return (
    <aside className="w-64 hidden md:flex flex-col border-r border-gray-800 bg-[#14141c]/50 h-[calc(100vh-4rem)] p-4 justify-between">
      <div className="flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const isActive = router.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-zoom-blue text-white shadow-lg shadow-blue-500/10'
                  : 'text-zoom-textMuted hover:bg-zoom-button hover:text-white'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-white' : 'text-zoom-textMuted'} />
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Sidebar Footer */}
      <div className="border-t border-gray-800/80 pt-4 flex flex-col gap-2">
        <button className="flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-zoom-textMuted hover:bg-zoom-button hover:text-white transition-colors w-full text-left">
          <Settings size={16} />
          Settings
        </button>
        <div className="px-4 text-[10px] text-gray-600 font-medium">
          v1.0.0 • SQLite Connected
        </div>
      </div>
    </aside>
  );
}

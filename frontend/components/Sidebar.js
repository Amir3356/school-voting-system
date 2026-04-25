'use client';

import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/candidates', label: 'Candidates', icon: '👥' },
    { href: '/vote', label: 'Vote', icon: '🗳️' },
    { href: '/results', label: 'Results', icon: '📈' },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg min-h-screen">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Navigation</h2>
        <nav className="space-y-2">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                pathname === link.href
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-2xl">{link.icon}</span>
              <span className="font-medium">{link.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

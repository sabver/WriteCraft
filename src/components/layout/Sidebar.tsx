'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  LayoutDashboard,
  History,
  CheckCircle2,
  Layers,
  Settings,
  HelpCircle,
  LogOut,
  Edit3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { ThemeSwitcher } from '@/components/common/ThemeSwitcher';

type NavKey = 'dashboard' | 'history' | 'review' | 'flashcards';

const NAV_ITEMS: Array<{
  key: NavKey;
  href: string;
  icon: React.ElementType;
  badge?: number;
}> = [
  { key: 'dashboard', href: '/', icon: LayoutDashboard },
  { key: 'history', href: '/history', icon: History },
  { key: 'review', href: '/review', icon: CheckCircle2, badge: 35 },
  { key: 'flashcards', href: '/flashcard/review', icon: Layers },
];

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('nav');

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary/10 rounded-xl p-2 flex items-center justify-center text-primary">
          <Edit3 className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight font-display">WriteCraft</h1>
          <span className="text-[10px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
            {t('proPlan')}
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-4" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group",
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/20"
                  : "text-slate-600 hover:bg-slate-50"
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-400 group-hover:text-primary")} />
                <span className={cn("text-[15px] font-semibold", isActive ? "text-white" : "text-slate-600")}>
                  {t(item.key)}
                </span>
              </div>
              {item.badge && (
                <span className={cn(
                  "text-[10px] font-bold px-2 py-0.5 rounded-full",
                  isActive ? "bg-white/20 text-white" : "bg-primary text-white"
                )}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-2">
        <div className="h-px bg-slate-100 my-2" />
      </div>

      <div className="p-4 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all group"
          aria-label={t('settings')}
        >
          <Settings className="w-5 h-5 text-slate-400 group-hover:text-primary" />
          <span className="text-[15px] font-semibold">{t('settings')}</span>
        </Link>
        <Link
          href="/help"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 transition-all group"
          aria-label={t('helpSupport')}
        >
          <HelpCircle className="w-5 h-5 text-slate-400 group-hover:text-primary" />
          <span className="text-[15px] font-semibold">{t('helpSupport')}</span>
        </Link>

        <div className="mt-2">
          <ThemeSwitcher />
        </div>

        <div className="mt-2">
          <LanguageSwitcher />
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-full bg-slate-200 bg-cover bg-center ring-2 ring-white shadow-sm"
              style={{ backgroundImage: `url('https://picsum.photos/seed/user/100/100')` }}
              role="img"
              aria-label="User avatar"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold text-slate-900 truncate max-w-[100px]">Jane Doe</span>
              <span className="text-[11px] text-slate-500 truncate max-w-[100px]">jane@example.com</span>
            </div>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-100 transition-colors"
            aria-label={t('logout')}
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

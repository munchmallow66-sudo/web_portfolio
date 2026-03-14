'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Locale } from '@/lib/i18n';

export function LanguageSwitcher({ currentLang }: { currentLang: Locale }) {
    const pathname = usePathname();

    const redirectedPathName = (locale: Locale) => {
        if (!pathname) return '/';

        // Convert path e.g. /th/about to /en/about
        const segments = pathname.split('/');
        segments[1] = locale; // Index 1 is always the locale
        return segments.join('/');
    };

    return (
        <div className="flex items-center gap-1 bg-white/5 backdrop-blur rounded-full p-1 border border-white/10">
            <Link
                href={redirectedPathName('th')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${currentLang === 'th'
                        ? 'bg-indigo-500 text-white shadow-md'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                aria-label="เปลี่ยนเป็นภาษาไทย"
            >
                TH
            </Link>
            <Link
                href={redirectedPathName('en')}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${currentLang === 'en'
                        ? 'bg-indigo-500 text-white shadow-md'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                aria-label="Switch to English"
            >
                EN
            </Link>
        </div>
    );
}

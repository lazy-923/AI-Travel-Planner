'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';

const Header = () => {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    // Do not render header on login or signup pages
    if (pathname === '/login' || pathname === '/signup') {
        return null;
    }

    const getLinkClass = (path: string) => {
        return pathname === path ? 'text-indigo-600 font-semibold' : 'text-gray-700 hover:text-gray-900';
    };

    return (
        <header className="bg-white shadow-md absolute top-0 left-0 right-0 z-20">
            <nav className="container mx-auto px-6 py-3">
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-xl font-semibold text-gray-700">
                        AI Travel Planner
                    </Link>
                    <div className="flex items-center">
                        <Link href="/" className={`mx-3 ${getLinkClass('/')}`}>
                            主页
                        </Link>
                        <Link href="/profile" className={`mx-3 ${getLinkClass('/profile')}`}>
                            个人中心
                        </Link>
                        <Link href="/history" className={`mx-3 ${getLinkClass('/history')}`}>
                            我的旅行
                        </Link>
                        <button onClick={handleLogout} className="text-gray-700 mx-3 hover:text-gray-900">
                            退出登录
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
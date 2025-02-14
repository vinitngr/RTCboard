import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Video, History, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { handleLogout, authUser } = useAuthStore();
  const navigation = [
    { name: 'Rooms', href: '/', icon: Video },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Meeting History', href: '/meetings', icon: History },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-zinc-900 backdrop-blur-xl border-b border-zinc-800/50">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-white font-semibold text-xl">
              RTCboard
            </Link>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-zinc-400 hover:text-white p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${isActive(item.href)
                      ? 'bg-white/10 text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
          {
            authUser && (

              <div className='text-red-500 cursor-pointer bg-white/10 p-2 rounded-lg text-sm font-medium transition-colors duration-150 '
                onClick={handleLogout}
              >Logout</div>
            )
          }
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${isActive(item.href)
                        ? 'bg-white/10 text-white'
                        : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar
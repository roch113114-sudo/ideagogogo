import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Rocket, 
  Home, 
  Compass, 
  LogOut, 
  PlusCircle, 
  LayoutDashboard,
  Menu,
  X,
  User as UserIcon
} from 'lucide-react';
import type { User } from '@/types';

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
}

export function Navbar({ currentUser, onLogout }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: '首页', icon: Home },
    { path: '/explore', label: '发现', icon: Compass },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 custom-expo ${
        isScrolled
          ? 'py-3'
          : 'py-5'
      }`}
    >
      <div
        className={`mx-auto transition-all duration-500 custom-expo ${
          isScrolled
            ? 'max-w-4xl px-6 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full mx-4 sm:mx-auto'
            : 'max-w-7xl px-6'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Rocket className="w-6 h-6 text-neon-green transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 bg-neon-green/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">IDEA</span>
              <span className="text-neon-green">GOGOGO</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full group ${
                  isActive(link.path)
                    ? 'text-dark-bg'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                {isActive(link.path) && (
                  <span className="absolute inset-0 bg-neon-green rounded-full" />
                )}
                <span className="relative flex items-center gap-2">
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <>
                {/* 只有需求方(client)才能看到发布需求按钮 */}
                {currentUser.role === 'client' && (
                  <Button
                    onClick={() => navigate('/post')}
                    className="bg-neon-green text-dark-bg hover:bg-neon-green/90 font-medium gap-2"
                    size="sm"
                  >
                    <PlusCircle className="w-4 h-4" />
                    发布需求
                  </Button>
                )}
                <div className="flex items-center gap-2 pl-3 border-l border-white/10">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/5"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    后台
                  </button>
                  <button
                    onClick={onLogout}
                    className="p-2 text-white/50 hover:text-white transition-colors rounded-full hover:bg-white/5"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="text-white/70 hover:text-white hover:bg-white/5"
                  size="sm"
                >
                  登录
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-neon-green text-dark-bg hover:bg-neon-green/90 font-medium"
                  size="sm"
                >
                  注册
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white/70 hover:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 animate-slide-up">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive(link.path)
                      ? 'bg-neon-green text-dark-bg'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/10 mt-2 pt-2">
                {currentUser ? (
                  <>
                    {/* 只有需求方(client)才能看到发布需求按钮 */}
                    {currentUser.role === 'client' && (
                      <button
                        onClick={() => {
                          navigate('/post');
                          setIsMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-neon-green hover:bg-white/5 rounded-xl w-full"
                      >
                        <PlusCircle className="w-5 h-5" />
                        发布需求
                      </button>
                    )}
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 rounded-xl w-full"
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      后台管理
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 rounded-xl w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      退出登录
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        navigate('/login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/5 rounded-xl w-full"
                    >
                      <UserIcon className="w-5 h-5" />
                      登录
                    </button>
                    <button
                      onClick={() => {
                        navigate('/register');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 px-4 py-3 text-neon-green hover:bg-white/5 rounded-xl w-full"
                    >
                      <UserIcon className="w-5 h-5" />
                      注册
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

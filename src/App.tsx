import { useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/sections/HeroSection';
import { ExplorePage } from '@/pages/ExplorePage';
import { PostRequirementPage } from '@/pages/PostRequirementPage';
import { ApplyPage } from '@/pages/ApplyPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { useUserStore, useRequirementStore, useApplicationStore } from '@/hooks/useStore';
import type { RequirementFormData, ApplicationFormData, UserRegisterData, Requirement, User } from '@/types';

// Home Page Component
interface HomePageProps {
  currentUser?: User | null;
}

function HomePage({ currentUser }: HomePageProps) {
  const navigate = useNavigate();
  return (
    <main style={{ backgroundColor: '#0a0a0f', minHeight: '100vh' }}>
      <HeroSection currentUser={currentUser} />
      
      {/* Features Section */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: '#0a0a0f' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
              如何<span style={{ color: '#d4edac' }}>开始</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', maxWidth: '42rem', margin: '0 auto' }}>
              无论你是需求方还是开发者，IDEAGOGOGO 都能帮你快速找到合适的合作伙伴
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {[
              {
                step: '01',
                title: '发布需求',
                description: '使用 AI 辅助，快速描述你的项目需求，系统会自动优化并生成专业的需求文档。',
                icon: '📝',
              },
              {
                step: '02',
                title: '匹配开发者',
                description: '平台会根据需求标签智能匹配，开发者可以浏览并申请参与你的项目。',
                icon: '🔍',
              },
              {
                step: '03',
                title: '开始合作',
                description: '查看开发者的报价和方案，选择最合适的合作伙伴，开启项目之旅。',
                icon: '🚀',
              },
            ].map((feature, index) => (
              <div
                key={index}
                style={{ 
                  padding: '2rem', 
                  borderRadius: '1rem', 
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #2a2a2a'
                }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{feature.icon}</div>
                <div style={{ color: 'rgba(212,237,172,0.5)', fontSize: '0.875rem', fontFamily: 'monospace', marginBottom: '0.75rem' }}>
                  {feature.step}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', marginBottom: '0.75rem' }}>
                  {feature.title}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', lineHeight: '1.625' }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '6rem 1.5rem', backgroundColor: '#0a0a0f' }}>
        <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
          <div style={{
            padding: '3rem',
            borderRadius: '1.5rem',
            background: 'linear-gradient(to bottom right, rgba(212,237,172,0.2), transparent)',
            border: '1px solid rgba(212,237,172,0.3)',
            textAlign: 'center'
          }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
              准备好开始了吗？
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem', maxWidth: '36rem', marginLeft: 'auto', marginRight: 'auto' }}>
              加入 IDEAGOGOGO，与优秀的开发者一起，将你的创意转化为现实
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }} className="sm:flex-row">
              {/* 发布需求：未登录或需求方时显示 */}
              {(!currentUser || currentUser.role === 'client') && (
                <button
                  onClick={() => navigate('/post')}
                  style={{
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.8125rem',
                    backgroundColor: '#d4edac',
                    color: 'black',
                    fontWeight: '500',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-block'
                  }}
                >
                  发布需求
                </button>
              )}
              {/* 探索机会：未登录或开发者时显示 */}
              {(!currentUser || currentUser.role === 'developer') && (
                <button
                  onClick={() => navigate('/explore')}
                  style={{
                    padding: '0.25rem 0.75rem',
                    fontSize: '0.8125rem',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: '500',
                    borderRadius: '9999px',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    display: 'inline-block',
                  }}
                >
                  探索机会
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '3rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: '#0a0a0f' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }} className="md:flex-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                <span style={{ color: 'white' }}>IDEA</span>
                <span style={{ color: '#d4edac' }}>GOGOGO</span>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>首页</Link>
              <Link to="/explore" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>发现</Link>
              <Link to="/dashboard" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>后台</Link>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.875rem' }}>
              © 2024 IDEAGOGOGO. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function App() {
  const { currentUser, isLoaded, register, login, logout } = useUserStore();
  const { requirements, create: createRequirement, getById } = useRequirementStore();
  const { applications, create: createApplication, updateStatus, hasApplied } = useApplicationStore();

  // All hooks must be called before any conditional returns
  const handleRegister = useCallback((data: UserRegisterData): boolean => {
    const result = register(data);
    return result !== null;
  }, [register]);

  const handleLogin = useCallback((phone: string) => {
    return login(phone) !== null;
  }, [login]);

  const handleCreateRequirement = useCallback((data: RequirementFormData) => {
    if (currentUser) {
      createRequirement(data, currentUser);
    }
  }, [createRequirement, currentUser]);

  const handleCreateApplication = useCallback((data: ApplicationFormData, requirement: Requirement): boolean => {
    if (currentUser) {
      const result = createApplication(data, requirement, currentUser);
      return result !== null;
    }
    return false;
  }, [createApplication, currentUser]);

  // Wait for store to load
  if (!isLoaded) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0a0a0f' }}>
        <div style={{ width: '2rem', height: '2rem', border: '2px solid #d4edac', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <HashRouter>
      <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0f' }}>
        <Navbar currentUser={currentUser} onLogout={logout} />
        <Routes>
          <Route path="/" element={<HomePage currentUser={currentUser} />} />
          <Route path="/explore" element={<ExplorePage requirements={requirements} />} />
          <Route 
            path="/post" 
            element={
              <PostRequirementPage 
                currentUser={currentUser} 
                onCreate={handleCreateRequirement} 
              />
            } 
          />
          <Route
            path="/apply/:id"
            element={
              <ApplyPage
                currentUser={currentUser}
                getRequirement={getById}
                onApply={handleCreateApplication}
                hasApplied={hasApplied}
              />
            }
          />
          <Route 
            path="/register" 
            element={<RegisterPage onRegister={handleRegister} />} 
          />
          <Route 
            path="/login" 
            element={<LoginPage onLogin={handleLogin} />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <DashboardPage 
                currentUser={currentUser}
                requirements={requirements}
                applications={applications}
                onUpdateApplicationStatus={updateStatus}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;

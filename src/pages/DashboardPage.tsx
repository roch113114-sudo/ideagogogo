import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User as UserIcon,
  Phone,
  ArrowRight,
  Handshake,
  Check,
  X,
  MessageSquare,
  FileText,
  Users,
  ChevronDown
} from 'lucide-react';
import type { User, Requirement, Application } from '@/types';

interface DashboardPageProps {
  currentUser: User | null;
  requirements: Requirement[];
  applications: Application[];
  onUpdateApplicationStatus: (id: string, status: 'accepted' | 'rejected') => void;
}

// 可展开文本组件
function ExpandableText({ text, label }: { text: string; label: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const threshold = 60; // 约 3 行的字符数

  if (!text) return null;

  return (
    <div className="p-3 rounded-lg bg-white/5">
      <p className={`text-sm text-white/70 ${isExpanded ? '' : 'line-clamp-3'}`}>
        <span className="text-white/40">{label}:</span> {text}
      </p>
      {text.length > threshold && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 mt-2 text-xs text-white/40 hover:text-neon-green transition-colors"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
          {isExpanded ? '收起' : '展开全部'}
        </button>
      )}
    </div>
  );
}

export function DashboardPage({
  currentUser,
  requirements,
  applications,
  onUpdateApplicationStatus
}: DashboardPageProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const isClient = currentUser?.role === 'client';
  const isAdmin = currentUser?.role === 'admin';

  // Filter data based on user role - must be called before any early returns
  const myRequirements = useMemo(() => {
    if (!currentUser) return [];
    if (isAdmin) return requirements;
    if (isClient) return requirements.filter(r => r.authorId === currentUser.id);
    return [];
  }, [requirements, currentUser, isClient, isAdmin]);

  const myApplications = useMemo(() => {
    if (!currentUser) return [];
    if (isAdmin) return applications;
    return applications.filter(a => a.developerId === currentUser.id);
  }, [applications, currentUser, isAdmin]);

  const receivedApplications = useMemo(() => {
    if (!currentUser) return [];
    if (isAdmin) return applications;
    if (isClient) {
      const myReqIds = myRequirements.map(r => r.id);
      return applications.filter(a => myReqIds.includes(a.requirementId));
    }
    return [];
  }, [applications, myRequirements, currentUser, isClient, isAdmin]);

  const stats = {
    totalRequirements: myRequirements.length,
    totalApplications: myApplications.length,
    pendingApplications: receivedApplications.filter(a => a.status === 'pending').length,
    acceptedApplications: receivedApplications.filter(a => a.status === 'accepted').length,
    totalViews: myRequirements.length * 150, // Placeholder: 150 views per requirement on average
  };

  // Early return after all hooks are called
  if (!currentUser) {
    navigate('/login', { state: { from: '/dashboard' } });
    return null;
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              后台<span className="text-gradient">管理</span>
            </h1>
            <p className="text-white/50">
              欢迎回来，{currentUser.name}
            </p>
          </div>
          {isClient && (
            <Button
              onClick={() => navigate('/post')}
              className="bg-neon-green text-dark-bg hover:bg-neon-green/90"
            >
              发布新需求
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { 
              label: isClient ? '我的需求' : '我的申请', 
              value: isClient ? stats.totalRequirements : stats.totalApplications,
              icon: FileText 
            },
            { 
              label: '待处理申请', 
              value: stats.pendingApplications,
              icon: MessageSquare 
            },
            { 
              label: '已接受', 
              value: stats.acceptedApplications,
              icon: Check 
            },
            {
              label: '总浏览量',
              value: stats.totalViews.toLocaleString(),
              icon: Users
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-dark-card border border-dark-border rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <stat.icon className="w-5 h-5 text-neon-green" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-dark-card border border-dark-border mb-6">
            <TabsTrigger value="overview" className="data-[state=active]:bg-neon-green data-[state=active]:text-dark-bg">
              总览
            </TabsTrigger>
            {(isClient || isAdmin) && (
              <TabsTrigger value="requirements" className="data-[state=active]:bg-neon-green data-[state=active]:text-dark-bg">
                我的需求
              </TabsTrigger>
            )}
            {(isClient || isAdmin) && (
              <TabsTrigger value="received" className="data-[state=active]:bg-neon-green data-[state=active]:text-dark-bg">
                收到的申请
              </TabsTrigger>
            )}
            <TabsTrigger value="applications" className="data-[state=active]:bg-neon-green data-[state=active]:text-dark-bg">
              我的申请
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Requirements */}
              {(isClient || isAdmin) && (
                <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">最近发布</h3>
                    <button
                      onClick={() => setActiveTab('requirements')}
                      className="text-neon-green text-sm hover:underline"
                    >
                      查看全部
                    </button>
                  </div>
                  <div className="space-y-4">
                    {myRequirements.slice(0, 3).map((req) => (
                      <div
                        key={req.id}
                        className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                        onClick={() => setActiveTab('requirements')}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-white font-medium mb-1 line-clamp-1">
                              {req.title}
                            </h4>
                            <p className="text-white/40 text-sm">
                              {new Date(req.createdAt).toLocaleDateString('zh-CN')}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className={
                              req.type === 'enterprise'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-purple-500/20 text-purple-400'
                            }
                          >
                            {req.type === 'enterprise' ? '企业' : '创新'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {myRequirements.length === 0 && (
                      <p className="text-white/40 text-center py-8">暂无发布的需求</p>
                    )}
                  </div>
                </div>
              )}

              {/* Recent Applications */}
              <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">
                    {(isClient || isAdmin) ? '最新申请' : '我的申请'}
                  </h3>
                  <button
                    onClick={() => setActiveTab((isClient || isAdmin) ? 'received' : 'applications')}
                    className="text-neon-green text-sm hover:underline"
                  >
                    查看全部
                  </button>
                </div>
                <div className="space-y-4">
                  {((isClient || isAdmin) ? receivedApplications : myApplications).slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-white font-medium mb-1">
                            {app.requirementTitle}
                          </h4>
                          <p className="text-white/40 text-sm">
                            {app.developerName} · {new Date(app.createdAt).toLocaleDateString('zh-CN')}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={
                            app.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : app.status === 'accepted'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }
                        >
                          {app.status === 'pending' ? '待处理' : app.status === 'accepted' ? '已接受' : '已拒绝'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {((isClient || isAdmin) ? receivedApplications : myApplications).length === 0 && (
                    <p className="text-white/40 text-center py-8">
                      {(isClient || isAdmin) ? '暂无收到的申请' : '暂无提交的申请'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Requirements Tab */}
          {(isClient || isAdmin) && (
            <TabsContent value="requirements">
              <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">我的需求</h3>
                <div className="space-y-4">
                  {myRequirements.map((req) => (
                    <div
                      key={req.id}
                      className="p-6 rounded-xl bg-white/5"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-white font-semibold text-lg mb-2">
                            {req.title}
                          </h4>
                          <p className="text-white/50 text-sm line-clamp-2">
                            {req.description}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className={
                            req.type === 'enterprise'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-purple-500/20 text-purple-400'
                          }
                        >
                          {req.type === 'enterprise' ? '企业需求' : '创新 Idea'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        {req.budget && (
                          <span className="text-neon-green">
                            预算: ¥{req.budget.toLocaleString()}
                          </span>
                        )}
                        <span className="text-white/40">
                          {new Date(req.createdAt).toLocaleDateString('zh-CN')}
                        </span>
                        <span className="text-white/40">
                          申请: {receivedApplications.filter(a => a.requirementId === req.id).length}
                        </span>
                      </div>
                    </div>
                  ))}
                  {myRequirements.length === 0 && (
                    <p className="text-white/40 text-center py-12">暂无发布的需求</p>
                  )}
                </div>
              </div>
            </TabsContent>
          )}

          {/* Received Applications Tab */}
          {(isClient || isAdmin) && (
            <TabsContent value="received">
              <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">收到的申请</h3>
                <div className="space-y-4">
                  {receivedApplications.map((app) => (
                    <div
                      key={app.id}
                      className="p-6 rounded-xl bg-white/5"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-white font-semibold text-lg mb-1">
                            {app.requirementTitle}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-white/50">
                            <span className="flex items-center gap-1">
                              <UserIcon className="w-4 h-4" />
                              {app.developerName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {app.developerPhone}
                            </span>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={
                            app.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : app.status === 'accepted'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }
                        >
                          {app.status === 'pending' ? '待处理' : app.status === 'accepted' ? '已接受' : '已拒绝'}
                        </Badge>
                      </div>

                      {app.type === 'quote' && (app.price || app.duration) && (
                        <div className="flex items-center gap-6 mb-4 text-sm">
                          {app.price && (
                            <span className="text-neon-green">
                              报价: ¥{app.price.toLocaleString()}
                            </span>
                          )}
                          {app.duration && (
                            <span className="text-white/60">
                              工期: {app.duration} 天
                            </span>
                          )}
                        </div>
                      )}

                      {app.questions && (
                        <div className="mb-4">
                          <ExpandableText text={app.questions} label="问题" />
                        </div>
                      )}

                      {app.status === 'pending' && (
                        <div className="flex items-center gap-3">
                          <Button
                            onClick={() => onUpdateApplicationStatus(app.id, 'accepted')}
                            size="sm"
                            className="bg-neon-green text-dark-bg hover:bg-neon-green/90"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            接受
                          </Button>
                          <Button
                            onClick={() => onUpdateApplicationStatus(app.id, 'rejected')}
                            size="sm"
                            variant="outline"
                            className="border-white/20 text-white hover:bg-white/5"
                          >
                            <X className="w-4 h-4 mr-1" />
                            拒绝
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  {receivedApplications.length === 0 && (
                    <p className="text-white/40 text-center py-12">暂无收到的申请</p>
                  )}
                </div>
              </div>
            </TabsContent>
          )}

          {/* My Applications Tab */}
          <TabsContent value="applications">
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">我的申请</h3>
              <div className="space-y-4">
                {myApplications.map((app) => (
                  <div
                    key={app.id}
                    className="p-6 rounded-xl bg-white/5"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-white font-semibold text-lg mb-1">
                          {app.requirementTitle}
                        </h4>
                        <p className="text-white/50 text-sm">
                          申请时间: {new Date(app.createdAt).toLocaleDateString('zh-CN')}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className={
                          app.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : app.status === 'accepted'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-red-500/20 text-red-400'
                        }
                      >
                        {app.status === 'pending' ? '待处理' : app.status === 'accepted' ? '已接受' : '已拒绝'}
                      </Badge>
                    </div>

                    {app.type === 'quote' && (app.price || app.duration) && (
                      <div className="flex items-center gap-6 mb-4 text-sm">
                        {app.price && (
                          <span className="text-neon-green">
                            报价: ¥{app.price.toLocaleString()}
                          </span>
                        )}
                        {app.duration && (
                          <span className="text-white/60">
                            工期: {app.duration} 天
                          </span>
                        )}
                      </div>
                    )}

                    {app.type === 'partnership' && (
                      <div className="mb-4">
                        <Badge variant="secondary" className="bg-purple-500/20 text-purple-400">
                          <Handshake className="w-3 h-3 mr-1" />
                          合伙申请
                        </Badge>
                      </div>
                    )}

                    {app.questions && (
                      <ExpandableText text={app.questions} label="你的问题" />
                    )}
                  </div>
                ))}
                {myApplications.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-white/40 mb-4">暂无提交的申请</p>
                    <Button
                      onClick={() => navigate('/explore')}
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/5"
                    >
                      去探索需求
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

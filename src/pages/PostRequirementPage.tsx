import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Sparkles,
  Building2,
  Lightbulb,
  Send,
  RotateCcw,
  Check,
  X,
  Tag,
  DollarSign,
  Calendar,
  Loader2,
  Wand2,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import type { User, RequirementFormData } from '@/types';

interface PostRequirementPageProps {
  currentUser: User | null;
  onCreate: (data: RequirementFormData) => void;
}

// Helper to safely parse number input
const parseNumberInput = (value: string): number | undefined => {
  if (!value.trim()) return undefined;
  const num = parseInt(value, 10);
  return Number.isNaN(num) ? undefined : num;
};

// Mock AI generation
const mockAIGenerate = async (prompt: string): Promise<Partial<RequirementFormData>> => {
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simple mock response based on keywords
  const isEnterprise = prompt.includes('系统') || prompt.includes('平台') || prompt.includes('开发');

  return {
    title: prompt.slice(0, 30) + (prompt.length > 30 ? '...' : ''),
    description: prompt,
    type: isEnterprise ? 'enterprise' : 'innovation',
    tags: ['AI生成', isEnterprise ? '企业' : '创新', '待确认'],
  };
};

export function PostRequirementPage({ currentUser, onCreate }: PostRequirementPageProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'input' | 'review' | 'success'>('input');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [formData, setFormData] = useState<RequirementFormData>({
    title: '',
    description: '',
    type: 'enterprise',
    tags: [],
    budget: undefined,
    deadline: '',
  });
  const [newTag, setNewTag] = useState('');
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Check if user is logged in and has permission
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { from: '/post' } });
    } else if (currentUser.role !== 'client' && currentUser.role !== 'admin') {
      // 开发者不能发布需求，跳转到探索页
      navigate('/explore');
    }
  }, [currentUser, navigate]);

  if (!currentUser || (currentUser.role !== 'client' && currentUser.role !== 'admin')) {
    return null;
  }

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    setAiError('');
    try {
      const result = await mockAIGenerate(aiPrompt);
      setFormData(prev => ({
        ...prev,
        ...result,
        title: result.title || prev.title,
        description: result.description || prev.description,
      }));
      setStep('review');
    } catch (error) {
      console.error('AI generation failed:', error);
      setAiError('AI 生成失败，请重试或手动填写需求');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.description.trim()) return;
    
    onCreate(formData);
    setStep('success');
  };

  const handleReset = () => {
    setAiPrompt('');
    setFormData({
      title: '',
      description: '',
      type: 'enterprise',
      tags: [],
      budget: undefined,
      deadline: '',
    });
    setStep('input');
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-green/10 border border-neon-green/30 mb-6">
            <Sparkles className="w-4 h-4 text-neon-green" />
            <span className="text-sm text-neon-green">AI 辅助发布</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            发布<span className="text-gradient">需求</span>
          </h1>
          <p className="text-white/50">
            描述你的需求，AI 会帮你优化并生成专业的需求文档
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[
            { key: 'input', label: '描述需求' },
            { key: 'review', label: '确认发布' },
            { key: 'success', label: '发布成功' },
          ].map((s, index) => (
            <div key={s.key} className="flex items-center gap-4">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                  step === s.key
                    ? 'bg-neon-green text-dark-bg'
                    : index < ['input', 'review', 'success'].indexOf(step)
                    ? 'bg-neon-green/20 text-neon-green'
                    : 'bg-white/5 text-white/40'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    step === s.key
                      ? 'bg-dark-bg text-neon-green'
                      : index < ['input', 'review', 'success'].indexOf(step)
                      ? 'bg-neon-green text-dark-bg'
                      : 'bg-white/20 text-white/60'
                  }`}
                >
                  {index < ['input', 'review', 'success'].indexOf(step) ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-sm font-medium">{s.label}</span>
              </div>
              {index < 2 && (
                <div
                  className={`w-12 h-px ${
                    index < ['input', 'review', 'success'].indexOf(step)
                      ? 'bg-neon-green'
                      : 'bg-white/10'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: AI Input */}
        {step === 'input' && (
          <div className="animate-slide-up">
            <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
              <Label className="text-white font-medium mb-4 block">
                用自然语言描述你的需求
              </Label>
              <Textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="例如：我需要开发一个电商小程序，包含商品展示、购物车、支付功能，预计2个月完成..."
                className="min-h-[200px] bg-dark-bg border-dark-border text-white placeholder:text-white/30 resize-none focus:border-neon-green focus:ring-neon-green/20"
              />
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-white/40">
                  AI 会根据你的描述生成专业的需求文档
                </p>
                <Button
                  onClick={handleAIGenerate}
                  disabled={!aiPrompt.trim() || isGenerating}
                  className="bg-neon-green text-dark-bg hover:bg-neon-green/90 font-medium gap-2"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      生成需求
                    </>
                  )}
                </Button>
              </div>
              {aiError && (
                <div className="flex items-center gap-2 mt-4 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {aiError}
                </div>
              )}
            </div>

            {/* Quick Tips */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Building2, title: '企业需求', desc: '系统开发、平台搭建' },
                { icon: Lightbulb, title: '创新项目', desc: '寻找合伙人、技术共创' },
                { icon: Tag, title: '标签管理', desc: '便于精准匹配' },
              ].map((tip, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-white/5 border border-white/5 text-center"
                >
                  <tip.icon className="w-6 h-6 text-neon-green mx-auto mb-2" />
                  <h4 className="text-white font-medium text-sm mb-1">{tip.title}</h4>
                  <p className="text-white/40 text-xs">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Review & Edit */}
        {step === 'review' && (
          <div className="animate-slide-up space-y-6">
            <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
              {/* Type Selection */}
              <div className="mb-6">
                <Label className="text-white font-medium mb-3 block">需求类型</Label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, type: 'enterprise' }))}
                    className={`flex-1 flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      formData.type === 'enterprise'
                        ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">企业需求</div>
                      <div className="text-xs opacity-70">传统报价模式</div>
                    </div>
                  </button>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, type: 'innovation' }))}
                    className={`flex-1 flex items-center gap-3 p-4 rounded-xl border transition-all ${
                      formData.type === 'innovation'
                        ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <Lightbulb className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">创新 Idea</div>
                      <div className="text-xs opacity-70">寻找合伙人</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div className="mb-6">
                <Label className="text-white font-medium mb-3 block">需求标题</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-dark-bg border-dark-border text-white focus:border-neon-green focus:ring-neon-green/20"
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <Label className="text-white font-medium mb-3 block">详细描述</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className={`bg-dark-bg border-dark-border text-white resize-none focus:border-neon-green focus:ring-neon-green/20 ${isDescExpanded ? 'min-h-[150px]' : 'min-h-[72px] max-h-[72px] overflow-hidden'}`}
                />
                {formData.description.length > 60 && (
                  <button
                    type="button"
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="flex items-center gap-1 mt-2 text-xs text-white/40 hover:text-neon-green transition-colors"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDescExpanded ? 'rotate-180' : ''}`} />
                    {isDescExpanded ? '收起' : '展开全部'}
                  </button>
                )}
              </div>

              {/* Tags */}
              <div className="mb-6">
                <Label className="text-white font-medium mb-3 block">标签</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-white/10 text-white hover:bg-white/20 px-3 py-1 flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    placeholder="添加标签..."
                    className="flex-1 bg-dark-bg border-dark-border text-white placeholder:text-white/30 focus:border-neon-green focus:ring-neon-green/20"
                  />
                  <Button
                    onClick={handleAddTag}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/5"
                  >
                    添加
                  </Button>
                </div>
              </div>

              {/* Budget & Deadline (Enterprise only) */}
              {formData.type === 'enterprise' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label className="text-white font-medium mb-3 block flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      预算范围 (可选)
                    </Label>
                    <Input
                      type="number"
                      value={formData.budget ?? ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        budget: parseNumberInput(e.target.value)
                      }))}
                      placeholder="输入预算金额"
                      className="bg-dark-bg border-dark-border text-white focus:border-neon-green focus:ring-neon-green/20"
                    />
                  </div>
                  <div>
                    <Label className="text-white font-medium mb-3 block flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      期望交付时间 (可选)
                    </Label>
                    <Input
                      type="date"
                      value={formData.deadline || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                      className="bg-dark-bg border-dark-border text-white focus:border-neon-green focus:ring-neon-green/20"
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5 gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  重新输入
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!formData.title.trim() || !formData.description.trim()}
                  className="bg-neon-green text-dark-bg hover:bg-neon-green/90 font-medium gap-2"
                >
                  <Send className="w-4 h-4" />
                  确认发布
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 'success' && (
          <div className="animate-slide-up text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neon-green/20 flex items-center justify-center">
              <Check className="w-12 h-12 text-neon-green" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              需求发布成功！
            </h2>
            <p className="text-white/50 mb-8 max-w-md mx-auto">
              你的需求已经发布到平台，开发者可以查看并申请参与。你可以在后台管理所有需求。
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={() => navigate('/explore')}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5"
              >
                查看需求
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-neon-green text-dark-bg hover:bg-neon-green/90"
              >
                进入后台
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

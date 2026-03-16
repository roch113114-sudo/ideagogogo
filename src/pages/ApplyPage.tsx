import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Lightbulb,
  DollarSign,
  Clock,
  User as UserIcon,
  Calendar,
  Send,
  ArrowLeft,
  Handshake,
  Briefcase,
  Check,
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import type { User, Requirement, ApplicationFormData } from '@/types';

interface ApplyPageProps {
  currentUser: User | null;
  getRequirement: (id: string) => Requirement | undefined;
  onApply: (data: ApplicationFormData, requirement: Requirement) => boolean;
  hasApplied?: (requirementId: string, developerId: string) => boolean;
}

// Helper to safely parse number input
const parseNumberInput = (value: string): number | undefined => {
  if (!value.trim()) return undefined;
  const num = parseInt(value, 10);
  return Number.isNaN(num) ? undefined : num;
};

export function ApplyPage({ currentUser, getRequirement, onApply, hasApplied }: ApplyPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [applicationType, setApplicationType] = useState<'quote' | 'partnership'>('quote');
  const [formData, setFormData] = useState<ApplicationFormData>({
    type: 'quote',
    price: undefined,
    duration: undefined,
    questions: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [isQuestionsExpanded, setIsQuestionsExpanded] = useState(false);
  const [isMessageExpanded, setIsMessageExpanded] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/register', { state: { from: `/apply/${id}` } });
      return;
    }

    if (id) {
      const req = getRequirement(id);
      if (req) {
        setRequirement(req);
        // Check if already applied
        if (hasApplied && hasApplied(id, currentUser.id)) {
          setAlreadyApplied(true);
        }
        // Set default application type based on requirement type
        if (req.type === 'enterprise') {
          setApplicationType('quote');
          setFormData(prev => ({ ...prev, type: 'quote' }));
        }
      } else {
        navigate('/explore');
      }
    }
  }, [id, currentUser, navigate, getRequirement, hasApplied]);

  const handleSubmit = () => {
    if (!requirement) return;

    const success = onApply({
      ...formData,
      type: applicationType,
    }, requirement);

    if (success) {
      setIsSubmitted(true);
    }
  };

  if (!requirement) return null;

  const isEnterprise = requirement.type === 'enterprise';

  // Already applied warning
  if (alreadyApplied) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-yellow-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            已申请过
          </h2>
          <p className="text-white/50 mb-8">
            你已经申请过这个需求了，请等待需求方回复。
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={() => navigate('/explore')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/5"
            >
              继续浏览
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-neon-green text-dark-bg hover:bg-neon-green/90"
            >
              查看我的申请
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-lg mx-auto px-6 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neon-green/20 flex items-center justify-center animate-pulse-glow">
            <Check className="w-12 h-12 text-neon-green" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            申请已提交！
          </h2>
          <p className="text-white/50 mb-8">
            你的申请已经成功发送给需求方，他们会尽快与你联系。
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button
              onClick={() => navigate('/explore')}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/5"
            >
              继续浏览
            </Button>
            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-neon-green text-dark-bg hover:bg-neon-green/90"
            >
              查看申请
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/explore')}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          返回列表
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Requirement Info */}
          <div className="lg:col-span-1">
            <div className="bg-dark-card border border-dark-border rounded-2xl p-6 sticky top-24">
              <Badge
                variant="secondary"
                className={`mb-4 ${
                  isEnterprise
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-purple-500/20 text-purple-400'
                }`}
              >
                {isEnterprise ? (
                  <><Building2 className="w-3 h-3 mr-1" /> 企业需求</>
                ) : (
                  <><Lightbulb className="w-3 h-3 mr-1" /> 创新 Idea</>
                )}
              </Badge>

              <h2 className="text-xl font-semibold text-white mb-4">
                {requirement.title}
              </h2>

              <div className="mb-6">
                <p className={`text-white/50 text-sm leading-relaxed ${isDescExpanded ? '' : 'line-clamp-3'}`}>
                  {requirement.description}
                </p>
                {requirement.description.length > 60 && (
                  <button
                    onClick={() => setIsDescExpanded(!isDescExpanded)}
                    className="flex items-center gap-1 mt-2 text-xs text-white/40 hover:text-neon-green transition-colors"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDescExpanded ? 'rotate-180' : ''}`} />
                    {isDescExpanded ? '收起' : '展开全部'}
                  </button>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {requirement.budget && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-neon-green" />
                    <span className="text-white/70">
                      预算: ¥{requirement.budget.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <UserIcon className="w-4 h-4 text-white/40" />
                  <span className="text-white/70">{requirement.authorName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-white/40" />
                  <span className="text-white/70">
                    {new Date(requirement.createdAt).toLocaleDateString('zh-CN')}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {requirement.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="lg:col-span-2">
            <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">
                申请参与
              </h3>

              {/* Application Type Selection */}
              {!isEnterprise && (
                <div className="mb-8">
                  <Label className="text-white font-medium mb-4 block">
                    参与方式
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setApplicationType('quote')}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        applicationType === 'quote'
                          ? 'bg-neon-green/20 border-neon-green'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <Briefcase className={`w-6 h-6 mb-2 ${
                        applicationType === 'quote' ? 'text-neon-green' : 'text-white/50'
                      }`} />
                      <div className={`font-medium mb-1 ${
                        applicationType === 'quote' ? 'text-white' : 'text-white/70'
                      }`}>
                        报价参与
                      </div>
                      <div className="text-xs text-white/40">
                        按项目报价，完成交付
                      </div>
                    </button>
                    <button
                      onClick={() => setApplicationType('partnership')}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        applicationType === 'partnership'
                          ? 'bg-neon-green/20 border-neon-green'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <Handshake className={`w-6 h-6 mb-2 ${
                        applicationType === 'partnership' ? 'text-neon-green' : 'text-white/50'
                      }`} />
                      <div className={`font-medium mb-1 ${
                        applicationType === 'partnership' ? 'text-white' : 'text-white/70'
                      }`}>
                        合伙参与
                      </div>
                      <div className="text-xs text-white/40">
                        技术入股，共同创业
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Quote Fields */}
              {applicationType === 'quote' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div>
                    <Label className="text-white font-medium mb-3 block flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      报价金额 (元)
                    </Label>
                    <Input
                      type="number"
                      value={formData.price ?? ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        price: parseNumberInput(e.target.value)
                      }))}
                      placeholder="输入你的报价"
                      className="bg-dark-bg border-dark-border text-white focus:border-neon-green focus:ring-neon-green/20"
                    />
                  </div>
                  <div>
                    <Label className="text-white font-medium mb-3 block flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      预计工时 (天)
                    </Label>
                    <Input
                      type="number"
                      value={formData.duration ?? ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        duration: parseNumberInput(e.target.value)
                      }))}
                      placeholder="预计完成天数"
                      className="bg-dark-bg border-dark-border text-white focus:border-neon-green focus:ring-neon-green/20"
                    />
                  </div>
                </div>
              )}

              {/* Questions */}
              <div className="mb-6">
                <Label className="text-white font-medium mb-3 block">
                  需要确认的问题
                </Label>
                <Textarea
                  value={formData.questions}
                  onChange={(e) => setFormData(prev => ({ ...prev, questions: e.target.value }))}
                  placeholder="你对这个需求有什么疑问？需要确认哪些细节？"
                  className={`bg-dark-bg border-dark-border text-white resize-none focus:border-neon-green focus:ring-neon-green/20 ${isQuestionsExpanded ? 'min-h-[100px]' : 'min-h-[48px] max-h-[48px] overflow-hidden'}`}
                />
                {formData.questions.length > 40 && (
                  <button
                    type="button"
                    onClick={() => setIsQuestionsExpanded(!isQuestionsExpanded)}
                    className="flex items-center gap-1 mt-2 text-xs text-white/40 hover:text-neon-green transition-colors"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isQuestionsExpanded ? 'rotate-180' : ''}`} />
                    {isQuestionsExpanded ? '收起' : '展开全部'}
                  </button>
                )}
              </div>

              {/* Message */}
              <div className="mb-8">
                <Label className="text-white font-medium mb-3 block">
                  附加信息 (可选)
                </Label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="介绍你的经验、技能或想法..."
                  className={`bg-dark-bg border-dark-border text-white resize-none focus:border-neon-green focus:ring-neon-green/20 ${isMessageExpanded ? 'min-h-[100px]' : 'min-h-[48px] max-h-[48px] overflow-hidden'}`}
                />
                {formData.message && formData.message.length > 40 && (
                  <button
                    type="button"
                    onClick={() => setIsMessageExpanded(!isMessageExpanded)}
                    className="flex items-center gap-1 mt-2 text-xs text-white/40 hover:text-neon-green transition-colors"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMessageExpanded ? 'rotate-180' : ''}`} />
                    {isMessageExpanded ? '收起' : '展开全部'}
                  </button>
                )}
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                <div className="text-sm text-white/40">
                  以 <span className="text-neon-green">{currentUser?.name}</span> 的身份申请
                </div>
                <Button
                  onClick={handleSubmit}
                  disabled={applicationType === 'quote' && (!formData.price || !formData.duration)}
                  className="bg-neon-green text-dark-bg hover:bg-neon-green/90 font-medium gap-2"
                >
                  <Send className="w-4 h-4" />
                  提交申请
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

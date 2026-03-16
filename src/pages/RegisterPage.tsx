import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User,
  Phone,
  ArrowRight,
  Check,
  Rocket,
  Code2,
  Lightbulb,
  AlertCircle,
  Building2,
  Key
} from 'lucide-react';
import type { UserRegisterData, UserRole } from '@/types';

interface RegisterPageProps {
  onRegister: (data: UserRegisterData) => boolean;
}

// 邀请码列表（实际项目中应该从后端验证）
const VALID_INVITE_CODES = ['ADMIN2024', 'IDEA2024', 'GOGO2024'];

export function RegisterPage({ onRegister }: RegisterPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/';

  const [formData, setFormData] = useState<UserRegisterData>({
    name: '',
    phone: '',
    role: 'developer',
  });
  const [inviteCode, setInviteCode] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const validatePhone = (phone: string): boolean => {
    return /^1[3-9]\d{9}$/.test(phone);
  };

  const handleSubmit = () => {
    setError('');

    if (!formData.name.trim()) {
      setError('请输入姓名');
      return;
    }

    if (!formData.phone.trim()) {
      setError('请输入手机号');
      return;
    }

    if (!validatePhone(formData.phone)) {
      setError('请输入有效的手机号（11位数字）');
      return;
    }

    // 需求方需要验证邀请码
    if (formData.role === 'client') {
      if (!inviteCode.trim()) {
        setError('需求方注册需要邀请码');
        return;
      }
      if (!VALID_INVITE_CODES.includes(inviteCode.toUpperCase())) {
        setError('邀请码无效');
        return;
      }
    }

    const success = onRegister(formData);
    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate(from);
      }, 1500);
    } else {
      setError('该手机号已注册或注册失败');
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center animate-slide-up">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-neon-green/20 flex items-center justify-center animate-pulse-glow">
            <Check className="w-12 h-12 text-neon-green" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            注册成功！
          </h2>
          <p className="text-white/50">
            正在跳转...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neon-green/10 border border-neon-green/30 mb-6">
            <Rocket className="w-8 h-8 text-neon-green" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            加入 <span className="text-gradient">IDEAGOGOGO</span>
          </h1>
          <p className="text-white/50">
            成为开发者，发现无限机会
          </p>
        </div>

        {/* Form */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <Label className="text-white font-medium mb-3 block flex items-center gap-2">
                <User className="w-4 h-4" />
                姓名
              </Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="请输入你的姓名"
                className="bg-dark-bg border-dark-border text-white placeholder:text-white/30 focus:border-neon-green focus:ring-neon-green/20"
              />
            </div>

            {/* Phone */}
            <div>
              <Label className="text-white font-medium mb-3 block flex items-center gap-2">
                <Phone className="w-4 h-4" />
                手机号
              </Label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, phone: e.target.value }));
                  setError('');
                }}
                placeholder="请输入你的手机号（11位数字）"
                className="bg-dark-bg border-dark-border text-white placeholder:text-white/30 focus:border-neon-green focus:ring-neon-green/20"
              />
            </div>

            {/* Role Selection */}
            <div>
              <Label className="text-white font-medium mb-3 block">
                选择身份
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'client' as UserRole }))}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    formData.role === 'client'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <Building2 className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium text-sm">需求方</div>
                    <div className="text-xs opacity-70">发布项目需求</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'developer' as UserRole }))}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    formData.role === 'developer'
                      ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                      : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <Code2 className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium text-sm">开发者</div>
                    <div className="text-xs opacity-70">参与项目开发</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Invite Code - Only for client role */}
            {formData.role === 'client' && (
              <div>
                <Label className="text-white font-medium mb-3 block flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  邀请码
                </Label>
                <Input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value);
                    setError('');
                  }}
                  placeholder="请输入邀请码"
                  className="bg-dark-bg border-dark-border text-white placeholder:text-white/30 focus:border-neon-green focus:ring-neon-green/20"
                />
                <p className="text-white/40 text-xs mt-2">
                  需求方注册需要邀请码，请联系管理员获取
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={!formData.name.trim() || !formData.phone.trim()}
              className="w-full bg-neon-green text-dark-bg hover:bg-neon-green/90 font-medium py-6 rounded-xl gap-2"
            >
              立即注册
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/40 text-sm">或者</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Login Link */}
          <Button
            onClick={() => navigate('/login', { state: { from } })}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/5 py-6 rounded-xl"
          >
            已有账号？立即登录
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { icon: Code2, label: '技术项目' },
            { icon: Lightbulb, label: '创新机会' },
            { icon: Rocket, label: '快速成长' },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <item.icon className="w-5 h-5 text-neon-green mx-auto mb-2" />
              <span className="text-white/50 text-xs">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

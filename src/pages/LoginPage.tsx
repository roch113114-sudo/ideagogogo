import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Phone,
  ArrowRight,
  Check,
  Rocket,
  AlertCircle
} from 'lucide-react';

interface LoginPageProps {
  onLogin: (phone: string) => boolean;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/';

  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const validatePhone = (phone: string): boolean => {
    return /^1[3-9]\d{9}$/.test(phone);
  };

  const handleSubmit = () => {
    setError('');

    if (!phone.trim()) {
      setError('请输入手机号');
      return;
    }

    if (!validatePhone(phone)) {
      setError('请输入有效的手机号（11位数字）');
      return;
    }

    const success = onLogin(phone);
    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        navigate(from);
      }, 1000);
    } else {
      setError('该手机号未注册，请先注册');
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
            登录成功！
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
            欢迎<span className="text-gradient">回来</span>
          </h1>
          <p className="text-white/50">
            登录你的 IDEAGOGOGO 账号
          </p>
        </div>

        {/* Form */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-8">
          <div className="space-y-6">
            {/* Phone */}
            <div>
              <Label className="text-white font-medium mb-3 block flex items-center gap-2">
                <Phone className="w-4 h-4" />
                手机号
              </Label>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError('');
                }}
                placeholder="请输入你的手机号"
                className="bg-dark-bg border-dark-border text-white placeholder:text-white/30 focus:border-neon-green focus:ring-neon-green/20"
              />
              {error && (
                <div className="flex items-center gap-2 mt-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={!phone.trim()}
              className="w-full bg-neon-green text-dark-bg hover:bg-neon-green/90 font-medium py-6 rounded-xl gap-2"
            >
              登录
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/40 text-sm">还没有账号？</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Register Link */}
          <Button
            onClick={() => navigate('/register', { state: { from } })}
            variant="outline"
            className="w-full border-white/20 text-white hover:bg-white/5 py-6 rounded-xl"
          >
            立即注册
          </Button>
        </div>
      </div>
    </div>
  );
}

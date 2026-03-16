import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, Zap, Code2 } from 'lucide-react';
import type { User } from '@/types';

interface HeroSectionProps {
  currentUser?: User | null;
}

export function HeroSection({ currentUser }: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section style={{ 
      position: 'relative', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      overflow: 'hidden',
      backgroundColor: '#0a0a0f'
    }}>
      {/* Background Pattern */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          opacity: 0.3,
          background: 'radial-gradient(circle at 25% 25%, #d4edac 0%, transparent 50%), radial-gradient(circle at 75% 75%, #4a5568 0%, transparent 50%)',
        }}
      />
      
      {/* Grid Pattern */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          opacity: 0.1,
          backgroundImage: 'linear-gradient(rgba(212, 237, 172, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 237, 172, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Gradient Overlay */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        zIndex: 1, 
        background: 'linear-gradient(to bottom, transparent, transparent, #0a0a0f)' 
      }} />

      {/* Content */}
      <div style={{ 
        position: 'relative', 
        zIndex: 10, 
        maxWidth: '72rem', 
        margin: '0 auto', 
        padding: '8rem 1.5rem', 
        textAlign: 'center' 
      }}>
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            marginBottom: '2rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(1rem)',
            transition: 'all 0.7s ease',
          }}
        >
          <Sparkles style={{ width: '1rem', height: '1rem', color: '#d4edac' }} />
          <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)' }}>连接创意与实现</span>
        </div>

        {/* Main Title */}
        <h1 style={{ marginBottom: '1.5rem' }}>
          <span
            style={{
              display: 'block',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: 'bold',
              letterSpacing: '-0.025em',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
              transition: 'all 0.7s ease 0.2s',
            }}
          >
            <span style={{ color: 'white' }}>将</span>
            <span style={{ color: '#d4edac' }}>创意</span>
          </span>
          <span
            style={{
              display: 'block',
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              fontWeight: 'bold',
              letterSpacing: '-0.025em',
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
              transition: 'all 0.7s ease 0.3s',
            }}
          >
            <span style={{ color: 'white' }}>转化为</span>
            <span style={{ color: '#d4edac' }}>现实</span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            maxWidth: '42rem',
            margin: '0 auto 3rem',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'rgba(255,255,255,0.6)',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
            transition: 'all 0.7s ease 0.4s',
          }}
        >
          IDEAGOGOGO 是一个连接企业与开发者的创新平台。
          <br style={{ display: 'none' }} className="sm:block" />
          发布你的需求，找到最合适的合作伙伴。
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
            transition: 'all 0.7s ease 0.5s',
          }}
          className="sm:flex-row"
        >
          {/* 探索需求：未登录或开发者时显示 */}
          {(!currentUser || currentUser.role === 'developer') && (
            <a
              href="/explore"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem 2rem',
                backgroundColor: '#d4edac',
                color: 'black',
                fontWeight: '600',
                borderRadius: '9999px',
                textDecoration: 'none',
                boxShadow: '0 0 20px rgba(212,237,172,0.3)',
              }}
            >
              <Zap style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
              探索需求
              <ArrowRight style={{ width: '1.25rem', height: '1.25rem', marginLeft: '0.5rem' }} />
            </a>
          )}
          {/* 发布需求：未登录或需求方时显示 */}
          {(!currentUser || currentUser.role === 'client') && (
            <a
              href="/post"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem 2rem',
                backgroundColor: currentUser?.role === 'client' ? '#d4edac' : 'transparent',
                border: currentUser?.role === 'client' ? 'none' : '1px solid rgba(255,255,255,0.3)',
                color: currentUser?.role === 'client' ? 'black' : 'white',
                fontWeight: '600',
                borderRadius: '9999px',
                textDecoration: 'none',
                boxShadow: currentUser?.role === 'client' ? '0 0 20px rgba(212,237,172,0.3)' : 'none',
              }}
            >
              <Code2 style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
              发布需求
            </a>
          )}
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            maxWidth: '32rem',
            margin: '5rem auto 0',
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(2rem)',
            transition: 'all 0.7s ease 0.6s',
          }}
        >
          {[
            { value: '1,203+', label: '创意提交' },
            { value: '2,500+', label: '活跃需求' },
            { value: '85%', label: '成功率' },
          ].map((stat, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 'bold', color: '#d4edac', marginBottom: '0.25rem' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div style={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        height: '8rem', 
        background: 'linear-gradient(to top, #0a0a0f, transparent)', 
        zIndex: 2 
      }} />
    </section>
  );
}

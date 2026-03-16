import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Building2,
  Lightbulb,
  DollarSign,
  ArrowRight,
  User,
  ChevronDown
} from 'lucide-react';
import type { Requirement } from '@/types';

interface RequirementCardProps {
  requirement: Requirement;
  onApply: (req: Requirement) => void;
}

export function RequirementCard({ requirement, onApply }: RequirementCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const isEnterprise = requirement.type === 'enterprise';
  const typeLabel = isEnterprise ? '企业需求' : '创新 Idea';
  const typeColor = isEnterprise ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400';

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative bg-dark-card border border-dark-border rounded-2xl p-6 transition-all duration-500 custom-expo overflow-hidden ${
          isHovered ? 'border-neon-green/50 shadow-glow -translate-y-1' : ''
        }`}
      >
        {/* Glow Effect */}
        <div
          className={`absolute -inset-px bg-gradient-to-r from-neon-green/20 via-transparent to-neon-green/20 rounded-2xl opacity-0 transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : ''
          }`}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <Badge
              variant="secondary"
              className={`flex items-center gap-1.5 px-3 py-1 ${typeColor} border-0`}
            >
              {isEnterprise ? <Building2 className="w-3.5 h-3.5" /> : <Lightbulb className="w-3.5 h-3.5" />}
              {typeLabel}
            </Badge>
            <span className="text-xs text-white/40">
              {new Date(requirement.createdAt).toLocaleDateString('zh-CN')}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2 group-hover:text-neon-green transition-colors">
            {requirement.title}
          </h3>

          {/* Description */}
          <div className="mb-4">
            <p className={`text-white/50 text-sm leading-relaxed ${isDescExpanded ? '' : 'line-clamp-2'}`}>
              {requirement.description}
            </p>
            {requirement.description.length > 50 && (
              <button
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="flex items-center gap-1 mt-2 text-xs text-white/40 hover:text-neon-green transition-colors"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDescExpanded ? 'rotate-180' : ''}`} />
                {isDescExpanded ? '收起' : '展开全部'}
              </button>
            )}
          </div>

          {/* Tags */}
          <div className="mb-5">
            <div className="flex flex-wrap gap-2">
              {requirement.tags.slice(0, isTagsExpanded ? requirement.tags.length : 4).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/60 border border-white/5"
                >
                  {tag}
                </span>
              ))}
              {!isTagsExpanded && requirement.tags.length > 4 && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-white/40">
                  +{requirement.tags.length - 4}
                </span>
              )}
            </div>
            {requirement.tags.length > 4 && (
              <button
                onClick={() => setIsTagsExpanded(!isTagsExpanded)}
                className="flex items-center gap-1 mt-2 text-xs text-white/40 hover:text-neon-green transition-colors"
              >
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isTagsExpanded ? 'rotate-180' : ''}`} />
                {isTagsExpanded ? '收起' : '展开全部'}
              </button>
            )}
          </div>

          {/* Footer Info */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-4">
              {requirement.budget && (
                <div className="flex items-center gap-1.5 text-sm">
                  <DollarSign className="w-4 h-4 text-neon-green" />
                  <span className="text-white/70">
                    ¥{requirement.budget.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-sm text-white/40">
                <User className="w-4 h-4" />
                <span>{requirement.authorName}</span>
              </div>
            </div>

            <Button
              onClick={() => onApply(requirement)}
              size="sm"
              className={`bg-neon-green/10 text-neon-green hover:bg-neon-green hover:text-dark-bg border border-neon-green/30 transition-all duration-300 ${
                isHovered ? 'translate-x-0 opacity-100' : ''
              }`}
            >
              申请参与
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

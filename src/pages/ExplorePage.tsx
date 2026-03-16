import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RequirementCard } from '@/components/RequirementCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Building2, 
  Lightbulb, 
  Grid3X3, 
  List,
  X
} from 'lucide-react';
import type { Requirement } from '@/types';

interface ExplorePageProps {
  requirements: Requirement[];
}

export function ExplorePage({ requirements }: ExplorePageProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'enterprise' | 'innovation'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredRequirements = useMemo(() => {
    return requirements.filter((req) => {
      const matchesSearch = 
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = selectedType === 'all' || req.type === selectedType;
      
      return matchesSearch && matchesType;
    });
  }, [requirements, searchQuery, selectedType]);

  const handleApply = (requirement: Requirement) => {
    navigate(`/apply/${requirement.id}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-4">
            发现<span className="text-gradient">机会</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl">
            浏览最新的企业需求和创新项目，找到适合你的合作机会
          </p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索需求标题、描述或标签..."
              className="pl-12 pr-4 py-3 bg-dark-card border-dark-border rounded-xl text-white placeholder:text-white/30 focus:border-neon-green focus:ring-neon-green/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Type Filters */}
          <div className="flex items-center gap-2">
            <Button
              variant={selectedType === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedType('all')}
              className={`rounded-full ${
                selectedType === 'all'
                  ? 'bg-neon-green text-dark-bg hover:bg-neon-green/90'
                  : 'border-white/20 text-white hover:bg-white/5'
              }`}
            >
              全部
            </Button>
            <Button
              variant={selectedType === 'enterprise' ? 'default' : 'outline'}
              onClick={() => setSelectedType('enterprise')}
              className={`rounded-full flex items-center gap-2 ${
                selectedType === 'enterprise'
                  ? 'bg-blue-500 text-white hover:bg-blue-500/90'
                  : 'border-white/20 text-white hover:bg-white/5'
              }`}
            >
              <Building2 className="w-4 h-4" />
              企业需求
            </Button>
            <Button
              variant={selectedType === 'innovation' ? 'default' : 'outline'}
              onClick={() => setSelectedType('innovation')}
              className={`rounded-full flex items-center gap-2 ${
                selectedType === 'innovation'
                  ? 'bg-purple-500 text-white hover:bg-purple-500/90'
                  : 'border-white/20 text-white hover:bg-white/5'
              }`}
            >
              <Lightbulb className="w-4 h-4" />
              创新 Idea
            </Button>
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-neon-green text-dark-bg'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-neon-green text-dark-bg'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-white/50">
            找到 <span className="text-neon-green font-semibold">{filteredRequirements.length}</span> 个需求
          </p>
        </div>

        {/* Requirements Grid/List */}
        {filteredRequirements.length > 0 ? (
          <div
            className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            }`}
          >
            {filteredRequirements.map((requirement, index) => (
              <div
                key={requirement.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <RequirementCard
                  requirement={requirement}
                  onApply={handleApply}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <Search className="w-10 h-10 text-white/30" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              没有找到匹配的需求
            </h3>
            <p className="text-white/50">
              尝试调整搜索关键词或筛选条件
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

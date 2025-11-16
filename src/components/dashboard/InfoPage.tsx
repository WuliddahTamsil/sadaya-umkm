import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  FileText,
  Megaphone,
  Tag,
  Calendar,
  Eye,
  Heart,
  MessageSquare,
  Search,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { api } from '../../config/api';

interface Content {
  id: string;
  type: 'article' | 'announcement' | 'promotion';
  title: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  status: 'published' | 'draft' | 'scheduled';
  views: number;
  likes: number;
  comments: number;
  thumbnail: string;
  category: string;
}

interface InfoPageProps {
  onViewDetail?: (id: string) => void;
}

export function InfoPage({ onViewDetail }: InfoPageProps) {
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'article' | 'announcement' | 'promotion'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContents();
  }, []);

  useEffect(() => {
    filterContents();
  }, [contents, searchQuery, activeTab]);

  const fetchContents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(api.content.getPublished);
      if (response.ok) {
        const data = await response.json();
        setContents(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching contents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterContents = () => {
    let filtered = contents;

    // Filter by type
    if (activeTab !== 'all') {
      filtered = filtered.filter(content => content.type === activeTab);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(content =>
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredContents(filtered);
  };

  const getTypeBadge = (type: string) => {
    const icons = {
      article: <FileText size={14} />,
      announcement: <Megaphone size={14} />,
      promotion: <Tag size={14} />
    };
    const colors = {
      article: '#2196F3',
      announcement: '#FF8D28',
      promotion: '#4CAF50'
    };
    const labels = {
      article: 'Artikel',
      announcement: 'Pengumuman',
      promotion: 'Promosi'
    };

    return (
      <Badge
        style={{
          backgroundColor: colors[type as keyof typeof colors] + '20',
          color: colors[type as keyof typeof colors],
          fontSize: '11px',
          border: 'none'
        }}
        className="flex items-center gap-1"
      >
        {icons[type as keyof typeof icons]}
        {labels[type as keyof typeof labels]}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleViewDetail = (contentId: string) => {
    if (onViewDetail) {
      onViewDetail(contentId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={32} style={{ color: '#FF8D28' }} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 style={{ color: '#2F4858' }}>Info & Pengumuman</h3>
        <p className="body-3 mt-2" style={{ color: '#858585' }}>
          Informasi resmi dari Admin Asli Bogor
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Tabs */}
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={activeTab === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('all')}
                  style={
                    activeTab === 'all'
                      ? { backgroundColor: '#FF8D28', color: '#FFFFFF' }
                      : {}
                  }
                >
                  Semua
                </Button>
                <Button
                  variant={activeTab === 'article' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('article')}
                  style={
                    activeTab === 'article'
                      ? { backgroundColor: '#2196F3', color: '#FFFFFF' }
                      : {}
                  }
                >
                  Artikel
                </Button>
                <Button
                  variant={activeTab === 'announcement' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('announcement')}
                  style={
                    activeTab === 'announcement'
                      ? { backgroundColor: '#FF8D28', color: '#FFFFFF' }
                      : {}
                  }
                >
                  Pengumuman
                </Button>
                <Button
                  variant={activeTab === 'promotion' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('promotion')}
                  style={
                    activeTab === 'promotion'
                      ? { backgroundColor: '#4CAF50', color: '#FFFFFF' }
                      : {}
                  }
                >
                  Promosi
                </Button>
              </div>

              {/* Search */}
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: '#858585' }} />
                <Input
                  placeholder="Cari informasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content Grid */}
      {filteredContents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
            <FileText size={48} style={{ color: '#CCCCCC' }} />
          </div>
          <h4 style={{ color: '#2F4858' }}>Tidak ada informasi ditemukan</h4>
          <p className="body-3 mt-2" style={{ color: '#858585' }}>
            {searchQuery ? 'Coba ubah kata kunci pencarian' : 'Belum ada informasi yang dipublikasikan'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {filteredContents.map((content, index) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover-scale overflow-hidden group cursor-pointer h-full flex flex-col" onClick={() => handleViewDetail(content.id)}>
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={content.thumbnail || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'}
                    alt={content.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute top-3 left-3">
                    {getTypeBadge(content.type)}
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
                </div>

                <CardContent className="p-4 flex-1 flex flex-col">
                  {/* Category */}
                  <Badge variant="outline" className="mb-2 self-start" style={{ fontSize: '10px' }}>
                    {content.category}
                  </Badge>

                  {/* Title */}
                  <h4 className="mb-2 line-clamp-2" style={{ color: '#2F4858', fontSize: '16px', fontWeight: 600 }}>
                    {content.title}
                  </h4>

                  {/* Excerpt */}
                  <p className="body-3 mb-3 line-clamp-2 flex-1" style={{ color: '#858585', fontSize: '12px' }}>
                    {content.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#E0E0E0' }}>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye size={12} style={{ color: '#858585' }} />
                        <span className="body-3" style={{ color: '#858585', fontSize: '11px' }}>
                          {content.views?.toLocaleString('id-ID') || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart size={12} style={{ color: '#FF6B6B' }} />
                        <span className="body-3" style={{ color: '#858585', fontSize: '11px' }}>
                          {content.likes || 0}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} style={{ color: '#858585' }} />
                      <span className="body-3" style={{ color: '#858585', fontSize: '11px' }}>
                        {formatDate(content.date || content.createdAt).split(' ').slice(0, 2).join(' ')}
                      </span>
                    </div>
                  </div>

                  {/* Read More Button */}
                  <Button
                    variant="ghost"
                    className="mt-3 w-full"
                    style={{ color: '#FF8D28' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetail(content.id);
                    }}
                  >
                    Baca Selengkapnya
                    <ArrowRight size={14} className="ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}


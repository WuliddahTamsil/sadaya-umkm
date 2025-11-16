import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  FileText,
  Megaphone,
  Tag,
  Calendar,
  Eye,
  Heart,
  MessageSquare,
  ArrowLeft,
  User,
  Loader2
} from 'lucide-react';
import { api } from '../../config/api';

interface Content {
  id: string;
  type: 'article' | 'announcement' | 'promotion';
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  status: 'published' | 'draft' | 'scheduled';
  views: number;
  likes: number;
  comments: number;
  thumbnail: string;
  category: string;
}

interface InfoDetailPageProps {
  contentId?: string;
  onBack?: () => void;
}

export function InfoDetailPage({ contentId, onBack }: InfoDetailPageProps) {
  const [content, setContent] = useState<Content | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (contentId) {
      fetchContent();
    }
  }, [contentId]);

  const fetchContent = async () => {
    if (!contentId) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(api.content.getById(contentId));
      if (response.ok) {
        const data = await response.json();
        setContent(data.data);
      } else {
        if (onBack) onBack();
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      if (onBack) onBack();
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeBadge = (type: string) => {
    const icons = {
      article: <FileText size={16} />,
      announcement: <Megaphone size={16} />,
      promotion: <Tag size={16} />
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
          fontSize: '12px',
          border: 'none',
          padding: '6px 12px'
        }}
        className="flex items-center gap-2"
      >
        {icons[type as keyof typeof icons]}
        {labels[type as keyof typeof labels]}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={32} style={{ color: '#FF8D28' }} />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="text-center py-12">
        <h4 style={{ color: '#2F4858' }}>Konten tidak ditemukan</h4>
        <Button
          className="mt-4"
          onClick={() => {
            if (onBack) onBack();
          }}
          style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
        >
          Kembali ke Info
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <Button
          variant="ghost"
          onClick={() => {
            if (onBack) onBack();
          }}
          className="mb-4"
          style={{ color: '#2F4858' }}
        >
          <ArrowLeft size={16} className="mr-2" />
          Kembali
        </Button>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          {/* Thumbnail */}
          {content.thumbnail && (
            <div className="relative h-64 md:h-96 overflow-hidden">
              <img
                src={content.thumbnail}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <CardContent className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                {getTypeBadge(content.type)}
                <Badge variant="outline" style={{ fontSize: '11px' }}>
                  {content.category}
                </Badge>
              </div>

              <h2 className="mb-4" style={{ color: '#2F4858', fontSize: '28px', lineHeight: '1.3' }}>
                {content.title}
              </h2>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 pt-4 border-t" style={{ borderColor: '#E0E0E0' }}>
                <div className="flex items-center gap-2">
                  <User size={16} style={{ color: '#858585' }} />
                  <span className="body-3" style={{ color: '#858585' }}>
                    {content.author}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} style={{ color: '#858585' }} />
                  <span className="body-3" style={{ color: '#858585' }}>
                    {formatDate(content.date || content.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye size={16} style={{ color: '#858585' }} />
                  <span className="body-3" style={{ color: '#858585' }}>
                    {content.views?.toLocaleString('id-ID') || 0} dilihat
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart size={16} style={{ color: '#FF6B6B' }} />
                  <span className="body-3" style={{ color: '#858585' }}>
                    {content.likes || 0} suka
                  </span>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div
              className="prose max-w-none"
              style={{
                color: '#4A4A4A',
                lineHeight: '1.8',
                fontSize: '16px'
              }}
            >
              {content.content ? (
                <div dangerouslySetInnerHTML={{ __html: content.content }} />
              ) : (
                <p className="body-3" style={{ color: '#4A4A4A', fontSize: '16px', lineHeight: '1.8' }}>
                  {content.excerpt}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}


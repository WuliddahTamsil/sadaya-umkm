import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import {
  FileText,
  Megaphone,
  Tag,
  Calendar,
  Eye,
  Heart,
  MessageSquare,
  Edit,
  Plus,
  Search,
  Filter,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { api } from '../../../config/api';

interface Content {
  id: string;
  type: 'article' | 'announcement' | 'promotion';
  title: string;
  excerpt: string;
  author: string;
  date: string;
  status: 'published' | 'draft' | 'scheduled';
  views: number;
  likes: number;
  comments: number;
  thumbnail: string;
  category: string;
}

export function ManajemenKonten() {
  const [activeTab, setActiveTab] = useState<'all' | 'article' | 'announcement' | 'promotion'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(api.content.getAll);
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

  const handleTabChange = (value: string) => {
    if (value === 'all' || value === 'article' || value === 'announcement' || value === 'promotion') {
      setActiveTab(value);
    }
  };

  const mockContents: Content[] = [
    {
      id: '1',
      type: 'article',
      title: '10 UMKM Terbaik di Bogor yang Wajib Dikunjungi',
      excerpt: 'Temukan berbagai UMKM lokal Bogor dengan produk unggulan dan kualitas terjamin...',
      author: 'Admin Asli Bogor',
      date: '2024-11-08',
      status: 'published',
      views: 1234,
      likes: 89,
      comments: 23,
      thumbnail: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
      category: 'Kuliner'
    },
    {
      id: '2',
      type: 'announcement',
      title: 'Program Diskon Spesial Akhir Tahun!',
      excerpt: 'Dapatkan diskon hingga 50% untuk berbagai produk UMKM lokal...',
      author: 'Admin Asli Bogor',
      date: '2024-11-07',
      status: 'published',
      views: 2341,
      likes: 156,
      comments: 45,
      thumbnail: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400',
      category: 'Promosi'
    },
    {
      id: '3',
      type: 'promotion',
      title: 'Flash Sale Tahu Gejrot - Diskon 30%',
      excerpt: 'Nikmati diskon special untuk produk favorit Bogor...',
      author: 'Tahu Gejrot Raos',
      date: '2024-11-09',
      status: 'scheduled',
      views: 0,
      likes: 0,
      comments: 0,
      thumbnail: 'https://images.unsplash.com/photo-1680345576151-bbc497ba969e?w=400',
      category: 'Flash Sale'
    },
    {
      id: '4',
      type: 'article',
      title: 'Sejarah Kuliner Bogor yang Legendaris',
      excerpt: 'Mengenal lebih dalam tentang asal-usul kuliner khas Bogor...',
      author: 'Tim Redaksi',
      date: '2024-11-06',
      status: 'published',
      views: 892,
      likes: 67,
      comments: 12,
      thumbnail: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
      category: 'Budaya'
    },
    {
      id: '5',
      type: 'announcement',
      title: 'Fitur Baru: Live Tracking Pesanan',
      excerpt: 'Sekarang Anda bisa melacak pesanan secara real-time...',
      author: 'Admin Asli Bogor',
      date: '2024-11-05',
      status: 'draft',
      views: 0,
      likes: 0,
      comments: 0,
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
      category: 'Update'
    },
    {
      id: '6',
      type: 'promotion',
      title: 'Bundle Hemat Kerajinan Bogor',
      excerpt: 'Beli 2 gratis 1 untuk produk kerajinan lokal pilihan...',
      author: 'Kerajinan Bambu Bogor',
      date: '2024-11-08',
      status: 'published',
      views: 567,
      likes: 43,
      comments: 8,
      thumbnail: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=400',
      category: 'Bundle'
    }
  ];

  const filteredContents = (contents.length > 0 ? contents : mockContents).filter(content => {
    const matchesTab = activeTab === 'all' || content.type === activeTab;
    const matchesSearch = 
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const stats = [
    { label: 'Total Konten', value: 156, icon: FileText, color: '#2196F3' },
    { label: 'Views Bulan Ini', value: 45789, icon: Eye, color: '#FF8D28' },
    { label: 'Total Likes', value: 3421, icon: Heart, color: '#FF6B6B' },
    { label: 'Engagement Rate', value: '24.5%', icon: TrendingUp, color: '#4CAF50' }
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      published: { bg: '#4CAF50', text: 'Published' },
      draft: { bg: '#858585', text: 'Draft' },
      scheduled: { bg: '#FF9800', text: 'Scheduled' }
    };
    const style = styles[status as keyof typeof styles];
    return (
      <Badge style={{ backgroundColor: style.bg, color: '#FFFFFF', fontSize: '10px' }}>
        {style.text}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const icons = {
      article: <FileText size={12} />,
      announcement: <Megaphone size={12} />,
      promotion: <Tag size={12} />
    };
    const colors = {
      article: '#2196F3',
      announcement: '#FF8D28',
      promotion: '#4CAF50'
    };
    return (
      <div className="flex items-center gap-1">
        <div style={{ color: colors[type as keyof typeof colors] }}>
          {icons[type as keyof typeof icons]}
        </div>
        <span className="body-3 capitalize" style={{ color: colors[type as keyof typeof colors], fontSize: '11px' }}>
          {type === 'article' ? 'Artikel' : type === 'announcement' ? 'Pengumuman' : 'Promosi'}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h3 style={{ color: '#2F4858' }}>Manajemen Konten</h3>
          <p className="body-3 mt-2" style={{ color: '#858585' }}>
            Kelola artikel, pengumuman, dan promosi untuk platform Asli Bogor
          </p>
        </div>
        <Button style={{ backgroundColor: '#FF8D28' }}>
          <Plus size={16} className="mr-2" />
          Buat Konten Baru
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <Card className="hover-scale">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: stat.color + '20' }}
                    >
                      <Icon size={20} style={{ color: stat.color }} />
                    </div>
                  </div>
                  <p className="body-3 mb-1" style={{ color: '#858585', fontSize: '11px' }}>
                    {stat.label}
                  </p>
                  <h3 style={{ color: stat.color }}>
                    {typeof stat.value === 'number' ? stat.value.toLocaleString('id-ID') : stat.value}
                  </h3>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="flex-1">
                <TabsList>
                  <TabsTrigger value="all">Semua</TabsTrigger>
                  <TabsTrigger value="article">Artikel</TabsTrigger>
                  <TabsTrigger value="announcement">Pengumuman</TabsTrigger>
                  <TabsTrigger value="promotion">Promosi</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={16} style={{ color: '#858585' }} />
                  <Input
                    placeholder="Cari konten..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <Filter size={16} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin" size={32} style={{ color: '#FF8D28' }} />
        </div>
      ) : (
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredContents.map((content, index) => (
            <motion.div
              key={content.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover-scale overflow-hidden group">
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={content.thumbnail}
                    alt={content.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    {getTypeBadge(content.type)}
                  </div>
                  <div className="absolute top-3 right-3">
                    {getStatusBadge(content.status)}
                  </div>

                  {/* Overlay on Hover */}
                  <motion.div
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center gap-2"
                    initial={false}
                    style={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button size="sm" variant="secondary">
                      <Edit size={14} className="mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="secondary">
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                  </motion.div>
                </div>

                <CardContent className="p-4">
                  {/* Category */}
                  <Badge variant="outline" className="mb-2" style={{ fontSize: '10px' }}>
                    {content.category}
                  </Badge>

                  {/* Title */}
                  <h4 className="mb-2 line-clamp-2" style={{ color: '#2F4858', fontSize: '16px' }}>
                    {content.title}
                  </h4>

                  {/* Excerpt */}
                  <p className="body-3 mb-3 line-clamp-2" style={{ color: '#858585', fontSize: '12px' }}>
                    {content.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: '#E0E0E0' }}>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye size={14} style={{ color: '#858585' }} />
                        <span className="body-3" style={{ color: '#858585', fontSize: '11px' }}>
                          {content.views.toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart size={14} style={{ color: '#FF6B6B' }} />
                        <span className="body-3" style={{ color: '#858585', fontSize: '11px' }}>
                          {content.likes}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare size={14} style={{ color: '#2196F3' }} />
                        <span className="body-3" style={{ color: '#858585', fontSize: '11px' }}>
                          {content.comments}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Author & Date */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: '#E0E0E0' }}>
                    <p className="body-3" style={{ color: '#858585', fontSize: '11px' }}>
                      {content.author}
                    </p>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} style={{ color: '#858585' }} />
                      <p className="body-3" style={{ color: '#858585', fontSize: '11px' }}>
                        {new Date(content.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      )}

      {/* Empty State */}
      {filteredContents.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
            <Search size={48} style={{ color: '#CCCCCC' }} />
          </div>
          <h4 style={{ color: '#2F4858' }}>Tidak ada konten ditemukan</h4>
          <p className="body-3 mt-2" style={{ color: '#858585' }}>
            Coba ubah filter atau kata kunci pencarian
          </p>
        </motion.div>
      )}
    </div>
  );
}

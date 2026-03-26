import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';
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
  onViewWorkshopDetail?: (workshopId: string) => void;
}

export function InfoPage({ onViewDetail, onViewWorkshopDetail }: InfoPageProps) {
  const [contents, setContents] = useState<Content[]>([]);
  const [filteredContents, setFilteredContents] = useState<Content[]>([]);
  const [workshops, setWorkshops] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'article' | 'announcement' | 'promotion' | 'academy'>('all');
  const [workshopFilter, setWorkshopFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isWorkshopsLoading, setIsWorkshopsLoading] = useState(true);

  const { user } = useAuth();

  useEffect(() => {
    fetchContents();
    fetchWorkshops();
  }, []);

  useEffect(() => {
    // Re-fetch workshops when filter changes
    if (activeTab === 'academy') {
      fetchWorkshops();
    }
  }, [workshopFilter]);

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

  const fetchWorkshops = async () => {
    try {
      setIsWorkshopsLoading(true);
      const filterParam = workshopFilter !== 'all' ? `?filter=${workshopFilter}` : '';
      const response = await fetch(`${api.workshops.getAll}${filterParam}`);
      if (response.ok) {
        const data = await response.json();
        setWorkshops(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching workshops:', error);
    } finally {
      setIsWorkshopsLoading(false);
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

  const handleRegisterWorkshop = async (workshopId: string) => {
    if (!user) {
      toast.error('Anda harus login untuk mendaftar workshop');
      return;
    }

    try {
      const response = await fetch(api.workshops.register(workshopId), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.error || 'Gagal mendaftar workshop');
      }

      await response.json();
      toast.success('Registrasi workshop berhasil');
      fetchWorkshops();
    } catch (error: any) {
      console.error('Register workshop error:', error);
      toast.error(error.message || 'Gagal mendaftar workshop');
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
          Informasi resmi dari Admin SADAYA
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
                <Button
                  variant={activeTab === 'academy' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveTab('academy')}
                  style={
                    activeTab === 'academy'
                      ? { backgroundColor: '#6A1B9A', color: '#FFFFFF' }
                      : {}
                  }
                >
                  Academy
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
            {activeTab === 'academy' && (
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm text-gray-600">Filter workshop:</span>
                <select
                  value={workshopFilter}
                  onChange={(e) => setWorkshopFilter(e.target.value as 'all' | 'upcoming' | 'past')}
                  className="border rounded-lg px-3 py-1 text-sm"
                >
                  <option value="all">Semua</option>
                  <option value="upcoming">Akan Datang</option>
                  <option value="past">Selesai</option>
                </select>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Content Grid */}
      {activeTab === 'academy' ? (
        isWorkshopsLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin" size={32} style={{ color: '#6A1B9A' }} />
          </div>
        ) : workshops.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F5F5F5' }}>
              <FileText size={48} style={{ color: '#CCCCCC' }} />
            </div>
            <h4 style={{ color: '#2F4858' }}>Tidak ada workshop ditemukan</h4>
            <p className="body-3 mt-2" style={{ color: '#858585' }}>
              Silakan tunggu sampai admin membuat workshop baru
            </p>
          </motion.div>
        ) : (
          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            {workshops.map((workshop, index) => (
              <motion.div key={workshop.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <Card className="hover-scale overflow-hidden h-full flex flex-col" >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={workshop.thumbnail || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400'}
                      alt={workshop.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent text-white">
                      <p className="text-sm">{new Date(workshop.date).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <h4 className="mb-2" style={{ color: '#2F4858', fontWeight: 700 }}>{workshop.title}</h4>
                    <p className="body-3 text-sm mb-2" style={{ color: '#858585' }}>{workshop.speaker}</p>
                    <p className="body-3 mb-2 flex-1" style={{ color: '#858585' }}>{workshop.description?.slice(0, 80)}{workshop.description?.length > 80 ? '...' : ''}</p>
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="px-2" style={{ backgroundColor: '#EEE', color: '#333', fontSize: '11px' }}>
                        Kuota: {workshop.remaining_quota}/{workshop.quota}
                      </Badge>
                      <Badge className="px-2" style={{ backgroundColor: workshop.remaining_quota > 0 ? '#E8F5E9' : '#FFEBEE', color: workshop.remaining_quota > 0 ? '#388E3C' : '#D32F2F', fontSize: '11px' }}>
                        {workshop.remaining_quota > 0 ? 'Tersedia' : 'Penuh'}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mb-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => onViewWorkshopDetail && onViewWorkshopDetail(workshop.id)}
                        style={{ borderColor: '#6A1B9A', color: '#6A1B9A' }}
                      >
                        Lihat Detail
                      </Button>
                      <Button
                        className="flex-1"
                        disabled={workshop.remaining_quota <= 0 || !user}
                        onClick={() => handleRegisterWorkshop(workshop.id)}
                        style={{ backgroundColor: workshop.remaining_quota > 0 ? '#6A1B9A' : '#BDBDBD', color: '#FFFFFF' }}
                      >
                        {workshop.remaining_quota > 0 ? 'Daftar' : 'Full'}
                      </Button>
                    </div>
                    {!user && (
                      <p className="text-xs text-red-500 mt-2">Login dulu untuk mendaftar.</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )
      ) : filteredContents.length === 0 ? (
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


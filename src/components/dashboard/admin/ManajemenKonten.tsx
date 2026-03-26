import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '../../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
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
  Loader2,
  Send,
  Trash2,
  User
} from 'lucide-react';
import { api } from '../../../config/api';
import { toast } from 'sonner';
import { useAuth } from '../../../contexts/AuthContext';

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
  createdAt?: string;
  updatedAt?: string;
}

interface ManajemenKontenProps {
  isReadOnly?: boolean;
}

export function ManajemenKonten({ isReadOnly = false }: ManajemenKontenProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'article' | 'announcement' | 'promotion'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [contents, setContents] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [editingContent, setEditingContent] = useState<Partial<Content>>({
    type: 'article',
    status: 'draft',
    category: '',
    title: '',
    excerpt: '',
    content: '',
    thumbnail: '',
  });
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      setIsLoading(true);
      // Untuk read-only, hanya ambil konten yang published
      const url = isReadOnly ? api.content.getPublished : api.content.getAll;
      const response = await fetch(url);
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

  const handleCreateNew = () => {
    setEditingContent({
      type: 'article',
      status: 'draft',
      category: '',
      title: '',
      excerpt: '',
      content: '',
      thumbnail: '',
    });
    setIsCreateDialogOpen(true);
  };

  const handleEdit = (content: Content) => {
    setEditingContent({
      ...content,
      content: content.content || content.excerpt,
    });
    setIsEditDialogOpen(true);
  };

  const handleViewDetail = async (content: Content) => {
    try {
      // Fetch full content details from API
      const response = await fetch(api.content.getById(content.id));
      if (response.ok) {
        const result = await response.json();
        setSelectedContent(result.data || content);
      } else {
        setSelectedContent(content);
      }
      
      // Fetch comments
      await fetchComments(content.id);
    } catch (error) {
      console.error('Error fetching content detail:', error);
      setSelectedContent(content);
    }
    setIsDetailDialogOpen(true);
  };

  const fetchComments = async (contentId: string) => {
    try {
      setIsLoadingComments(true);
      const response = await fetch(api.comments.getByContentId(contentId));
      if (response.ok) {
        const result = await response.json();
        setComments(result.data || []);
      } else {
        console.error('Failed to fetch comments:', response.status, response.statusText);
        setComments([]);
      }
    } catch (error: any) {
      console.error('Error fetching comments:', error);
      // Handle network errors gracefully
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('Network error: Cannot connect to server');
      }
      setComments([]);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !selectedContent || !user) {
      if (!user) {
        toast.error('Anda harus login untuk menambahkan komentar');
      } else if (!newComment.trim()) {
        toast.error('Komentar tidak boleh kosong');
      }
      return;
    }

    const commentData = {
      contentId: selectedContent.id,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userRole: user.role,
      text: newComment.trim(),
    };

    console.log('Sending comment:', commentData);
    console.log('API URL:', api.comments.create);

    try {
      const response = await fetch(api.comments.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });

      console.log('Comment response status:', response.status);
      console.log('Comment response ok:', response.ok);

      if (!response.ok) {
        let errorMessage = `Gagal menambahkan komentar (${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error('Comment error data:', errorData);
        } catch (e) {
          const errorText = await response.text().catch(() => '');
          console.error('Comment error text:', errorText);
          if (errorText) {
            try {
              const parsed = JSON.parse(errorText);
              errorMessage = parsed.error || errorMessage;
            } catch {
              errorMessage = errorText || errorMessage;
            }
          }
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Comment success:', result);

      toast.success('Komentar berhasil ditambahkan');
      setNewComment('');
      await fetchComments(selectedContent.id);
      fetchContents(); // Refresh content list to update comment count
    } catch (error: any) {
      console.error('Add comment error:', error);
      console.error('Error stack:', error.stack);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error('Tidak dapat terhubung ke server. Pastikan koneksi internet Anda aktif.');
      } else {
        toast.error(error.message || 'Gagal menambahkan komentar. Silakan coba lagi.');
      }
    }
  };

  const handleLike = async () => {
    if (!selectedContent || !user) {
      toast.error('Anda harus login untuk menyukai konten');
      return;
    }

    const likeUrl = api.content.like(selectedContent.id);
    console.log('Like URL:', likeUrl);
    console.log('Content ID:', selectedContent.id);

    try {
      const response = await fetch(likeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Like response status:', response.status);
      console.log('Like response ok:', response.ok);

      if (!response.ok) {
        let errorMessage = `Gagal menyukai konten (${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error('Like error data:', errorData);
        } catch (e) {
          const errorText = await response.text().catch(() => '');
          console.error('Like error text:', errorText);
          if (errorText) {
            try {
              const parsed = JSON.parse(errorText);
              errorMessage = parsed.error || errorMessage;
            } catch {
              errorMessage = errorText || errorMessage;
            }
          }
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Like success:', result);

      if (result.data && selectedContent) {
        setSelectedContent({
          ...selectedContent,
          likes: result.data.likes || selectedContent.likes + 1
        });
      }
      fetchContents(); // Refresh content list to update like count
      toast.success('Konten berhasil disukai');
    } catch (error: any) {
      console.error('Like content error:', error);
      console.error('Error stack:', error.stack);
      
      // Handle network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        toast.error('Tidak dapat terhubung ke server. Pastikan koneksi internet Anda aktif.');
      } else {
        toast.error(error.message || 'Gagal menyukai konten. Silakan coba lagi.');
      }
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
      return;
    }

    try {
      const response = await fetch(api.comments.delete(commentId), {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus komentar');
      }

      toast.success('Komentar berhasil dihapus');
      if (selectedContent) {
        await fetchComments(selectedContent.id);
        fetchContents(); // Refresh content list to update comment count
      }
    } catch (error) {
      console.error('Delete comment error:', error);
      toast.error('Gagal menghapus komentar');
    }
  };

  const handleSaveCreate = async () => {
    if (!editingContent.title || !editingContent.type) {
      toast.error('Judul dan tipe konten wajib diisi');
      return;
    }

    try {
      const response = await fetch(api.content.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingContent,
          author: user?.name || 'Admin SADAYA',
          date: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal membuat konten');
      }

      toast.success('Konten berhasil dibuat');
      setIsCreateDialogOpen(false);
      setEditingContent({
        type: 'article',
        status: 'draft',
        category: '',
        title: '',
        excerpt: '',
        content: '',
        thumbnail: '',
      });
      fetchContents();
    } catch (error) {
      console.error('Create content error:', error);
      toast.error('Gagal membuat konten');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingContent.id || !editingContent.title || !editingContent.type) {
      toast.error('Judul dan tipe konten wajib diisi');
      return;
    }

    try {
      const response = await fetch(api.content.update(editingContent.id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingContent,
          updatedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal mengupdate konten');
      }

      toast.success('Konten berhasil diupdate');
      setIsEditDialogOpen(false);
      setEditingContent({
        type: 'article',
        status: 'draft',
        category: '',
        title: '',
        excerpt: '',
        content: '',
        thumbnail: '',
      });
      fetchContents();
    } catch (error) {
      console.error('Update content error:', error);
      toast.error('Gagal mengupdate konten');
    }
  };

  const mockContents: Content[] = [
    {
      id: '1',
      type: 'article',
      title: '10 UMKM Terbaik di Bogor yang Wajib Dikunjungi',
      excerpt: 'Temukan berbagai UMKM lokal Bogor dengan produk unggulan dan kualitas terjamin...',
      author: 'Admin SADAYA',
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
      author: 'Admin SADAYA',
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
      author: 'Admin SADAYA',
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

  // Filter: untuk read-only, hanya tampilkan published content
  const filteredContents = (contents.length > 0 ? contents : mockContents).filter(content => {
    // Read-only hanya tampilkan published
    if (isReadOnly && content.status !== 'published') {
      return false;
    }
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
          <h3 style={{ color: '#2F4858' }}>{isReadOnly ? 'Konten' : 'Manajemen Konten'}</h3>
          <p className="body-3 mt-2" style={{ color: '#858585' }}>
            {isReadOnly 
              ? 'Lihat artikel, pengumuman, dan promosi dari platform SADAYA'
              : 'Kelola artikel, pengumuman, dan promosi untuk platform SADAYA'
            }
          </p>
        </div>
        {!isReadOnly && (
          <Button 
            style={{ backgroundColor: '#FF8D28' }}
            onClick={handleCreateNew}
          >
            <Plus size={16} className="mr-2" />
            Buat Konten Baru
          </Button>
        )}
      </motion.div>

      {/* Stats - Only show for admin */}
      {!isReadOnly && (
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
      )}

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
                {!isReadOnly && (
                  <Button variant="outline" size="icon">
                    <Filter size={16} />
                  </Button>
                )}
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
              <Card 
                className="hover-scale overflow-hidden group cursor-pointer"
                onClick={() => handleViewDetail(content)}
              >
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

                  {/* Overlay on Hover - Only show if not read-only */}
                  {!isReadOnly && (
                    <motion.div
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center gap-2"
                      initial={false}
                      style={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(content);
                        }}
                      >
                        <Edit size={14} className="mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetail(content);
                        }}
                      >
                        <Eye size={14} className="mr-1" />
                        View
                      </Button>
                    </motion.div>
                  )}
                  {/* Read-only: Show view button on hover */}
                  {isReadOnly && (
                    <motion.div
                      className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center"
                      initial={false}
                      style={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetail(content);
                        }}
                      >
                        <Eye size={14} className="mr-1" />
                        Lihat Detail
                      </Button>
                    </motion.div>
                  )}
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

      {/* Create Content Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ color: '#2F4858' }}>Buat Konten Baru</DialogTitle>
            <DialogDescription>
              Buat artikel, pengumuman, atau promosi baru
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipe Konten</Label>
                <Select
                  value={editingContent.type}
                  onValueChange={(value) => setEditingContent({ ...editingContent, type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Artikel</SelectItem>
                    <SelectItem value="announcement">Pengumuman</SelectItem>
                    <SelectItem value="promotion">Promosi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={editingContent.status}
                  onValueChange={(value) => setEditingContent({ ...editingContent, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Judul</Label>
              <Input
                value={editingContent.title}
                onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                placeholder="Masukkan judul konten"
              />
            </div>
            <div>
              <Label>Kategori</Label>
              <Input
                value={editingContent.category}
                onChange={(e) => setEditingContent({ ...editingContent, category: e.target.value })}
                placeholder="Masukkan kategori (contoh: Kuliner, Budaya, dll)"
              />
            </div>
            <div>
              <Label>Ringkasan (Excerpt)</Label>
              <Textarea
                value={editingContent.excerpt}
                onChange={(e) => setEditingContent({ ...editingContent, excerpt: e.target.value })}
                placeholder="Masukkan ringkasan konten"
                rows={3}
              />
            </div>
            <div>
              <Label>Konten Lengkap</Label>
              <Textarea
                value={editingContent.content}
                onChange={(e) => setEditingContent({ ...editingContent, content: e.target.value })}
                placeholder="Masukkan konten lengkap"
                rows={8}
              />
            </div>
            <div>
              <Label>Thumbnail URL</Label>
              <Input
                value={editingContent.thumbnail}
                onChange={(e) => setEditingContent({ ...editingContent, thumbnail: e.target.value })}
                placeholder="Masukkan URL gambar thumbnail"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsCreateDialogOpen(false)}
              >
                Batal
              </Button>
              <Button
                onClick={handleSaveCreate}
                style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
              >
                Simpan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Content Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ color: '#2F4858' }}>Edit Konten</DialogTitle>
            <DialogDescription>
              Edit artikel, pengumuman, atau promosi
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Tipe Konten</Label>
                <Select
                  value={editingContent.type}
                  onValueChange={(value) => setEditingContent({ ...editingContent, type: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Artikel</SelectItem>
                    <SelectItem value="announcement">Pengumuman</SelectItem>
                    <SelectItem value="promotion">Promosi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={editingContent.status}
                  onValueChange={(value) => setEditingContent({ ...editingContent, status: value as any })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Judul</Label>
              <Input
                value={editingContent.title}
                onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                placeholder="Masukkan judul konten"
              />
            </div>
            <div>
              <Label>Kategori</Label>
              <Input
                value={editingContent.category}
                onChange={(e) => setEditingContent({ ...editingContent, category: e.target.value })}
                placeholder="Masukkan kategori"
              />
            </div>
            <div>
              <Label>Ringkasan (Excerpt)</Label>
              <Textarea
                value={editingContent.excerpt}
                onChange={(e) => setEditingContent({ ...editingContent, excerpt: e.target.value })}
                placeholder="Masukkan ringkasan konten"
                rows={3}
              />
            </div>
            <div>
              <Label>Konten Lengkap</Label>
              <Textarea
                value={editingContent.content}
                onChange={(e) => setEditingContent({ ...editingContent, content: e.target.value })}
                placeholder="Masukkan konten lengkap"
                rows={8}
              />
            </div>
            <div>
              <Label>Thumbnail URL</Label>
              <Input
                value={editingContent.thumbnail}
                onChange={(e) => setEditingContent({ ...editingContent, thumbnail: e.target.value })}
                placeholder="Masukkan URL gambar thumbnail"
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Batal
              </Button>
              <Button
                onClick={handleSaveEdit}
                style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
              >
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Content Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ color: '#2F4858' }}>Detail Konten</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang konten
            </DialogDescription>
          </DialogHeader>
          {selectedContent && (
            <div className="space-y-6">
              {/* Thumbnail */}
              {selectedContent.thumbnail && (
                <div className="w-full h-64 overflow-hidden rounded-lg">
                  <img
                    src={selectedContent.thumbnail}
                    alt={selectedContent.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getTypeBadge(selectedContent.type)}
                    {getStatusBadge(selectedContent.status)}
                    <Badge variant="outline">{selectedContent.category}</Badge>
                  </div>
                  <h2 className="text-2xl font-bold mb-2" style={{ color: '#2F4858' }}>
                    {selectedContent.title}
                  </h2>
                  <p className="text-sm mb-4" style={{ color: '#858585' }}>
                    {selectedContent.excerpt}
                  </p>
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
                <div>
                  <p className="text-xs mb-1" style={{ color: '#858585' }}>Author</p>
                  <p className="font-semibold" style={{ color: '#2F4858' }}>{selectedContent.author}</p>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: '#858585' }}>Tanggal</p>
                  <p className="font-semibold" style={{ color: '#2F4858' }}>
                    {new Date(selectedContent.date).toLocaleDateString('id-ID', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-1" style={{ color: '#858585' }}>Views</p>
                  <p className="font-semibold" style={{ color: '#2F4858' }}>
                    {selectedContent.views.toLocaleString('id-ID')}
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-2" style={{ color: '#858585' }}>Likes</p>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold text-lg" style={{ color: '#2F4858' }}>
                      {selectedContent.likes}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleLike}
                      className="flex items-center gap-1 hover:bg-red-50 transition-colors"
                      style={{ 
                        borderColor: '#FF6B6B',
                        color: '#FF6B6B'
                      }}
                    >
                      <Heart size={16} className="fill-current" />
                      Like
                    </Button>
                  </div>
                </div>
              </div>

              {/* Full Content - Improved Formatting */}
              {selectedContent.content && (
                <div>
                  <h3 className="text-lg font-semibold mb-4" style={{ color: '#2F4858' }}>
                    Konten Lengkap
                  </h3>
                  <div 
                    className="prose max-w-none"
                    style={{ 
                      color: '#2F4858', 
                      lineHeight: '1.8',
                      fontSize: '15px'
                    }}
                  >
                    {(() => {
                      // Parse HTML if exists, otherwise format plain text
                      const content = selectedContent.content || '';
                      // Check if content contains HTML tags
                      if (content.includes('<') && content.includes('>')) {
                        // Parse HTML content
                        return (
                          <div 
                            dangerouslySetInnerHTML={{ __html: content }}
                            style={{
                              lineHeight: '1.8',
                              wordBreak: 'break-word'
                            }}
                          />
                        );
                      } else {
                        // Format plain text with proper line breaks
                        return content.split('\n').map((paragraph, index) => {
                          if (!paragraph.trim()) return <br key={index} />;
                          // Detect and format links
                          const linkRegex = /(https?:\/\/[^\s]+)/g;
                          const parts = paragraph.split(linkRegex);
                          return (
                            <p key={index} className="mb-4" style={{ textAlign: 'justify' }}>
                              {parts.map((part, partIndex) => {
                                if (part.match(linkRegex)) {
                                  return (
                                    <a
                                      key={partIndex}
                                      href={part}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ 
                                        color: '#2196F3',
                                        textDecoration: 'underline',
                                        wordBreak: 'break-all'
                                      }}
                                    >
                                      {part}
                                    </a>
                                  );
                                }
                                return part;
                              })}
                            </p>
                          );
                        });
                      }
                    })()}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <div className="pt-6 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare size={20} style={{ color: '#2F4858' }} />
                  <h3 className="text-lg font-semibold" style={{ color: '#2F4858' }}>
                    Komentar ({comments.length})
                  </h3>
                </div>

                {/* Add Comment Form */}
                <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Tulis komentar Anda di sini..."
                    rows={3}
                    className="mb-3"
                  />
                  <div className="flex justify-end">
                    <Button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
                    >
                      <Send size={16} className="mr-2" />
                      Kirim Komentar
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                {isLoadingComments ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin" size={24} style={{ color: '#FF8D28' }} />
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare size={48} style={{ color: '#CCCCCC', margin: '0 auto 12px' }} />
                    <p style={{ color: '#858585' }}>Belum ada komentar. Jadilah yang pertama!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg border"
                        style={{ 
                          borderColor: '#E0E0E0',
                          backgroundColor: '#FFFFFF'
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-10 h-10 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: '#FF8D28' + '20' }}
                            >
                              <User size={20} style={{ color: '#FF8D28' }} />
                            </div>
                            <div>
                              <p className="font-semibold text-sm" style={{ color: '#2F4858' }}>
                                {comment.userName}
                              </p>
                              <p className="text-xs" style={{ color: '#858585' }}>
                                {comment.userRole} • {new Date(comment.createdAt).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                          {(user?.role === 'admin' || user?.id === comment.userId) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </div>
                        <p className="text-sm ml-13" style={{ color: '#2F4858', lineHeight: '1.6' }}>
                          {comment.text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions for Admin */}
              {!isReadOnly && (
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleEdit(selectedContent);
                      setIsDetailDialogOpen(false);
                    }}
                  >
                    <Edit size={16} className="mr-2" />
                    Edit
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

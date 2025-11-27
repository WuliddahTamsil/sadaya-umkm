import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { 
  Search, 
  Download, 
  Edit, 
  Trash2, 
  Eye, 
  ChevronUp, 
  ChevronDown,
  MoreVertical,
  RefreshCw,
  Loader2,
  Check,
  X,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../ui/dialog';
import { api } from '../../../config/api';
import { toast } from 'sonner';
import { ExternalLink, FileText, Image as ImageIcon } from 'lucide-react';

type RoleOption = 'UMKM' | 'Driver' | 'User';

interface DataItem {
  id: string;
  name: string;
  email: string;
  role: RoleOption;
  status: 'active' | 'inactive' | 'pending';
  joinDate: string;
  totalOrders: number;
  rating: number;
  phone?: string;
  address?: string;
  description?: string;
  storeName?: string;
  storeAddress?: string;
  storeDescription?: string;
  vehicleType?: string;
  vehiclePlate?: string;
  isVerified?: boolean;
  isOnboarded?: boolean;
  createdAt?: string;
  updatedAt?: string;
  ktpFile?: string;
  simFile?: string;
  stnkFile?: string;
  selfieFile?: string;
  vehiclePhotoFile?: string;
  storePhotoFile?: string;
  businessPermitFile?: string;
}

type SortField = 'name' | 'joinDate' | 'totalOrders' | 'rating';
type SortDirection = 'asc' | 'desc';

interface NewUserState {
  role: RoleOption;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  description: string;
  storeName: string;
  storeAddress: string;
  storeDescription: string;
  vehicleType: string;
  vehiclePlate: string;
}

export function ManajemenData() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [data, setData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DataItem | null>(null);
  const initialNewUserState: NewUserState = {
    role: 'UMKM',
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    description: '',
    storeName: '',
    storeAddress: '',
    storeDescription: '',
    vehicleType: '',
    vehiclePlate: '',
  };
  const [newUser, setNewUser] = useState<NewUserState>(initialNewUserState);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmittingNewUser, setIsSubmittingNewUser] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching users from:', api.users.getAll);
      
      const response = await fetch(api.users.getAll, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
      });
      
      console.log('Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', response.status, errorText);
        const errorMsg = `Gagal mengambil data users: ${response.status} ${response.statusText}`;
        setError(errorMsg);
        throw new Error(errorMsg);
      }

      const result = await response.json();
      console.log('API Response:', result);
      
      // Validate response structure
      if (!result || typeof result !== 'object') {
        const errorMsg = 'Format response tidak valid dari server';
        setError(errorMsg);
        throw new Error(errorMsg);
      }
      
      const users = Array.isArray(result.data) ? result.data : (Array.isArray(result) ? result : []);
      
      // Transform users to DataItem format
      const transformedData: DataItem[] = users.map((user: any) => {
        if (!user || typeof user !== 'object') {
          return null;
        }
        return {
        id: user._id || user.id,
        name: user.name || 'N/A',
        email: user.email || 'N/A',
        role: user.role === 'umkm' ? 'UMKM' : user.role === 'driver' ? 'Driver' : 'User',
        status: user.isVerified ? 'active' : user.isOnboarded ? 'pending' : 'inactive',
        joinDate: user.createdAt || new Date().toISOString(),
        totalOrders: user.totalOrders || 0,
        rating: user.rating || 0,
        phone: user.phone,
        address: user.address,
        description: user.description,
        storeName: user.storeName,
        storeAddress: user.storeAddress,
        storeDescription: user.storeDescription,
        vehicleType: user.vehicleType,
        vehiclePlate: user.vehiclePlate,
        isVerified: user.isVerified,
        isOnboarded: user.isOnboarded,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        ktpFile: user.ktpFile,
        simFile: user.simFile,
        stnkFile: user.stnkFile,
        selfieFile: user.selfieFile,
        vehiclePhotoFile: user.vehiclePhotoFile,
        storePhotoFile: user.storePhotoFile,
        businessPermitFile: user.businessPermitFile,
      };
      }).filter((item): item is DataItem => item !== null);
      
      setData(transformedData);
      setError(null);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      const errorMessage = error.message || 'Gagal mengambil data users';
      setError(errorMessage);
      toast.error(errorMessage);
      // Fallback to empty data
      setData([]);
      
      // Log more details in production for debugging
      if (import.meta.env.PROD) {
        console.error('Production error details:', {
          url: api.users.getAll,
          error: error.message,
          stack: error.stack,
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    console.log('ManajemenData component mounted, fetching users...');
    fetchUsers();
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUsers();
  };

  const handleViewDetail = (item: DataItem) => {
    setSelectedItem(item);
    setIsDetailDialogOpen(true);
  };

  const handleApprove = async (item: DataItem) => {
    try {
      const response = await fetch(api.users.updateStatus(item.id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: 'active' }),
      });

      if (!response.ok) {
        throw new Error('Gagal menyetujui user');
      }

      toast.success('User berhasil disetujui');
      fetchUsers();
    } catch (error) {
      console.error('Approve error:', error);
      toast.error('Gagal menyetujui user');
    }
  };

  const handleReject = async (item: DataItem) => {
    try {
      const response = await fetch(api.users.updateStatus(item.id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: 'inactive' }),
      });

      if (!response.ok) {
        throw new Error('Gagal menolak user');
      }

      toast.success('User berhasil ditolak');
      fetchUsers();
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Gagal menolak user');
    }
  };

  const handleEdit = (item: DataItem) => {
    setEditingItem(item);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    try {
      const response = await fetch(api.users.updateProfile(editingItem.id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: editingItem.name,
          phone: editingItem.phone,
          address: editingItem.address,
          description: editingItem.description,
          storeName: editingItem.storeName,
          storeAddress: editingItem.storeAddress,
          storeDescription: editingItem.storeDescription,
          vehicleType: editingItem.vehicleType,
          vehiclePlate: editingItem.vehiclePlate,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal mengupdate user');
      }

      toast.success('User berhasil diupdate');
      setIsEditDialogOpen(false);
      setEditingItem(null);
      fetchUsers();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Gagal mengupdate user');
    }
  };

  const handleDelete = async (item: DataItem) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus ${item.name}?`)) {
      return;
    }

    try {
      const response = await fetch(api.users.delete(item.id), {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus user');
      }

      toast.success('User berhasil dihapus');
      fetchUsers();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Gagal menghapus user');
    }
  };

  const resetNewUserForm = () => {
    setNewUser(initialNewUserState);
  };

  const handleCreateUser = async () => {
    const hasName = newUser.name.trim().length > 0;
    const hasUMKMStoreName = newUser.storeName.trim().length > 0;
    if ((!hasName && newUser.role !== 'UMKM') || (newUser.role === 'UMKM' && !hasUMKMStoreName)) {
      toast.error('Nama pengguna atau nama UMKM wajib diisi');
      return;
    }

    if (!newUser.email.trim() || !newUser.password.trim()) {
      toast.error('Email dan password wajib diisi');
      return;
    }

    setIsSubmittingNewUser(true);
    try {
      const payload = {
        name: newUser.name.trim() || newUser.storeName.trim(),
        email: newUser.email.trim(),
        password: newUser.password.trim(),
        role: newUser.role.toLowerCase(),
        phone: newUser.phone.trim() || undefined,
        address: newUser.address.trim() || undefined,
        description: newUser.description.trim() || undefined,
        storeName: newUser.role === 'UMKM' ? newUser.storeName.trim() : undefined,
        storeAddress: newUser.role === 'UMKM' ? newUser.storeAddress.trim() || undefined : undefined,
        storeDescription: newUser.role === 'UMKM' ? newUser.storeDescription.trim() || undefined : undefined,
        vehicleType: newUser.role === 'Driver' ? newUser.vehicleType.trim() || undefined : undefined,
        vehiclePlate: newUser.role === 'Driver' ? newUser.vehiclePlate.trim() || undefined : undefined,
      };

      const response = await fetch(api.users.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Gagal menambahkan user');
      }

      toast.success('Pengguna berhasil ditambahkan');
      setIsAddDialogOpen(false);
      resetNewUserForm();
      fetchUsers();
    } catch (error) {
      console.error('Create user error:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal menambahkan user');
    } finally {
      setIsSubmittingNewUser(false);
    }
  };

  // Safe data calculation - ensure data is always an array (must be defined before use)
  const safeData = Array.isArray(data) ? data : [];

  const filteredData = safeData.filter(item => {
    if (!item || typeof item !== 'object') return false;
    
    const matchesSearch = 
      (item.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (item.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesRole = filterRole === 'all' || item.role === filterRole;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];
    
    if (sortField === 'joinDate') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats calculation using safeData
  const stats = {
    totalUMKM: safeData.filter(item => item?.role === 'UMKM').length,
    totalDriver: safeData.filter(item => item?.role === 'Driver').length,
    totalUser: safeData.filter(item => item?.role === 'User').length,
    pending: safeData.filter(item => item?.status === 'pending').length,
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, { bg: string; text: string; border: string }> = {
      UMKM: { bg: '#FDE08E', text: '#F57C00', border: '#FF8D28' },
      Driver: { bg: '#C8E6C9', text: '#2E7D32', border: '#4CAF50' },
      User: { bg: '#B3E5FC', text: '#1976D2', border: '#2196F3' },
    };
    const style = styles[role] || styles.User;
    return (
      <Badge 
        style={{ 
          backgroundColor: style.bg, 
          color: style.text,
          border: `1px solid ${style.border}`
        }}
      >
        {role}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      active: { bg: '#4CAF50', text: '#FFFFFF' },
      inactive: { bg: '#9E9E9E', text: '#FFFFFF' },
      pending: { bg: '#FF9800', text: '#FFFFFF' },
    };
    const style = styles[status] || styles.inactive;
    return (
      <Badge style={{ backgroundColor: style.bg, color: style.text }}>
        {status === 'active' ? 'Aktif' : status === 'pending' ? 'Pending' : 'Tidak Aktif'}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Always render something, even if there's an error
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 style={{ color: '#2F4858', fontSize: '24px', fontWeight: 700 }}>
            Manajemen Data Pengguna
          </h2>
          <p className="body-3 mt-1" style={{ color: '#858585' }}>
            Kelola data user, UMKM, dan driver
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
        >
          + Tambah Pengguna
        </Button>
      </motion.div>

      {/* Error Message */}
      {error && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 p-3 rounded" style={{ backgroundColor: '#FFEBEE' }}>
              <X size={20} style={{ color: '#D32F2F' }} />
              <div>
                <p style={{ color: '#D32F2F', fontWeight: 600 }}>Error</p>
                <p style={{ color: '#858585', fontSize: '14px' }}>{error}</p>
                <Button
                  onClick={fetchUsers}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  <RefreshCw size={14} className="mr-2" />
                  Coba Lagi
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="body-3" style={{ color: '#858585' }}>Total UMKM</p>
                  <p style={{ color: '#2F4858', fontSize: '24px', fontWeight: 700 }}>
                    {stats.totalUMKM}
                  </p>
                  <p className="body-3" style={{ color: '#4CAF50', fontSize: '12px' }}>
                    +18 dari bulan lalu
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="body-3" style={{ color: '#858585' }}>Total Driver</p>
                  <p style={{ color: '#2F4858', fontSize: '24px', fontWeight: 700 }}>
                    {stats.totalDriver}
                  </p>
                  <p className="body-3" style={{ color: '#4CAF50', fontSize: '12px' }}>
                    +12 dari bulan lalu
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="body-3" style={{ color: '#858585' }}>Total User</p>
                  <p style={{ color: '#2F4858', fontSize: '24px', fontWeight: 700 }}>
                    {stats.totalUser}
                  </p>
                  <p className="body-3" style={{ color: '#4CAF50', fontSize: '12px' }}>
                    +342 dari bulan lalu
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="body-3" style={{ color: '#858585' }}>Pending Approval</p>
                  <p style={{ color: '#2F4858', fontSize: '24px', fontWeight: 700 }}>
                    {stats.pending}
                  </p>
                  <p className="body-3" style={{ color: '#FF9800', fontSize: '12px' }}>
                    -5 dari bulan lalu
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} style={{ color: '#858585' }} />
              <Input
                placeholder="Cari berdasarkan nama atau email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-3">
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Semua Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Role</SelectItem>
                  <SelectItem value="UMKM">UMKM</SelectItem>
                  <SelectItem value="Driver">Driver</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="animate-spin" size={32} style={{ color: '#FF8D28' }} />
            </div>
          ) : paginatedData.length === 0 ? (
            <div className="text-center p-12">
              <p style={{ color: '#858585' }}>Tidak ada data yang ditemukan</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <input type="checkbox" />
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-2">
                        Nama
                        {sortField === 'name' && (
                          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('joinDate')}
                    >
                      <div className="flex items-center gap-2">
                        Tanggal Bergabung
                        {sortField === 'joinDate' && (
                          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('totalOrders')}
                    >
                      <div className="flex items-center gap-2">
                        Orders
                        {sortField === 'totalOrders' && (
                          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => handleSort('rating')}
                    >
                      <div className="flex items-center gap-2">
                        Rating
                        {sortField === 'rating' && (
                          sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="w-[100px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <TableCell>
                        <input type="checkbox" />
                      </TableCell>
                      <TableCell style={{ color: '#2F4858', fontWeight: 600 }}>
                        {item.name}
                      </TableCell>
                      <TableCell style={{ color: '#858585' }}>{item.email}</TableCell>
                      <TableCell>{getRoleBadge(item.role)}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell style={{ color: '#858585' }}>
                        {formatDate(item.joinDate)}
                      </TableCell>
                      <TableCell style={{ color: '#FF8D28', fontWeight: 600 }}>
                        {item.totalOrders}
                      </TableCell>
                      <TableCell>
                        {item.rating > 0 ? (
                          <div className="flex items-center gap-1">
                            <span style={{ color: '#FF8D28' }}>★</span>
                            <span style={{ color: '#858585' }}>{item.rating.toFixed(1)}</span>
                          </div>
                        ) : (
                          <span style={{ color: '#858585' }}>-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetail(item)}>
                              <Eye size={16} className="mr-2" />
                              Lihat Detail
                            </DropdownMenuItem>
                            {item.status === 'pending' && (
                              <>
                                <DropdownMenuItem 
                                  onClick={() => handleApprove(item)}
                                  className="text-green-600"
                                >
                                  <Check size={16} className="mr-2" />
                                  Setujui
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleReject(item)}
                                  className="text-red-600"
                                >
                                  <X size={16} className="mr-2" />
                                  Tolak
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem onClick={() => handleEdit(item)}>
                              <Edit size={16} className="mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(item)}
                              className="text-red-600"
                            >
                              <Trash2 size={16} className="mr-2" />
                              Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {/* Pagination */}
          {!isLoading && sortedData.length > 0 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="body-3" style={{ color: '#858585' }}>
                Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, sortedData.length)} dari {sortedData.length} data
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Sebelumnya
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    style={currentPage === page ? { backgroundColor: '#FF8D28' } : {}}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Selanjutnya
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ color: '#2F4858' }}>Detail Pengguna</DialogTitle>
            <DialogDescription>
              Informasi lengkap tentang pengguna
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nama</Label>
                  <p style={{ color: '#2F4858', fontWeight: 600 }}>{selectedItem.name}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p style={{ color: '#858585' }}>{selectedItem.email}</p>
                </div>
                <div>
                  <Label>Role</Label>
                  <div className="mt-1">{getRoleBadge(selectedItem.role)}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedItem.status)}</div>
                </div>
                {selectedItem.phone && (
                  <div>
                    <Label>Telepon</Label>
                    <p style={{ color: '#858585' }}>{selectedItem.phone}</p>
                  </div>
                )}
                {selectedItem.joinDate && (
                  <div>
                    <Label>Tanggal Bergabung</Label>
                    <p style={{ color: '#858585' }}>{formatDate(selectedItem.joinDate)}</p>
                  </div>
                )}
              </div>
              
              {selectedItem.role === 'UMKM' && (
                <div className="space-y-2">
                  <h4 style={{ color: '#2F4858', fontWeight: 600 }}>Informasi UMKM</h4>
                  {selectedItem.storeName && (
                    <div>
                      <Label>Nama Toko</Label>
                      <p style={{ color: '#858585' }}>{selectedItem.storeName}</p>
                    </div>
                  )}
                  {selectedItem.storeAddress && (
                    <div>
                      <Label>Alamat Toko</Label>
                      <p style={{ color: '#858585' }}>{selectedItem.storeAddress}</p>
                    </div>
                  )}
                  {selectedItem.storeDescription && (
                    <div>
                      <Label>Deskripsi</Label>
                      <p style={{ color: '#858585' }}>{selectedItem.storeDescription}</p>
                    </div>
                  )}
                  {selectedItem.storePhotoFile && (
                    <div>
                      <Label>Foto Toko</Label>
                      <div className="mt-2">
                        <a 
                          href={selectedItem.storePhotoFile} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:underline"
                        >
                          <ImageIcon size={16} />
                          Lihat Foto
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  )}
                  {selectedItem.businessPermitFile && (
                    <div>
                      <Label>Izin Usaha</Label>
                      <div className="mt-2">
                        <a 
                          href={selectedItem.businessPermitFile} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:underline"
                        >
                          <FileText size={16} />
                          Lihat Dokumen
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {selectedItem.role === 'Driver' && (
                <div className="space-y-2">
                  <h4 style={{ color: '#2F4858', fontWeight: 600 }}>Informasi Driver</h4>
                  {selectedItem.vehicleType && (
                    <div>
                      <Label>Jenis Kendaraan</Label>
                      <p style={{ color: '#858585' }}>{selectedItem.vehicleType}</p>
                    </div>
                  )}
                  {selectedItem.vehiclePlate && (
                    <div>
                      <Label>Plat Nomor</Label>
                      <p style={{ color: '#858585' }}>{selectedItem.vehiclePlate}</p>
                    </div>
                  )}
                  {selectedItem.vehiclePhotoFile && (
                    <div>
                      <Label>Foto Kendaraan</Label>
                      <div className="mt-2">
                        <a 
                          href={selectedItem.vehiclePhotoFile} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:underline"
                        >
                          <ImageIcon size={16} />
                          Lihat Foto
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="space-y-2">
                <h4 style={{ color: '#2F4858', fontWeight: 600 }}>Dokumen</h4>
                {selectedItem.ktpFile && (
                  <div>
                    <a 
                      href={selectedItem.ktpFile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <FileText size={16} />
                      KTP
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
                {selectedItem.simFile && (
                  <div>
                    <a 
                      href={selectedItem.simFile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <FileText size={16} />
                      SIM
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
                {selectedItem.stnkFile && (
                  <div>
                    <a 
                      href={selectedItem.stnkFile} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      <FileText size={16} />
                      STNK
                      <ExternalLink size={14} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle style={{ color: '#2F4858' }}>Edit Pengguna</DialogTitle>
            <DialogDescription>
              Edit informasi pengguna
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nama</Label>
                  <Input
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={editingItem.email}
                    disabled
                    className="mt-1 bg-gray-100"
                  />
                </div>
                <div>
                  <Label>Telepon</Label>
                  <Input
                    value={editingItem.phone || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, phone: e.target.value })}
                    className="mt-1"
                    placeholder="Masukkan nomor telepon"
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Input
                    value={editingItem.role}
                    disabled
                    className="mt-1 bg-gray-100"
                  />
                </div>
                <div className="col-span-2">
                  <Label>Alamat</Label>
                  <Input
                    value={editingItem.address || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, address: e.target.value })}
                    className="mt-1"
                    placeholder="Masukkan alamat"
                  />
                </div>
                {editingItem.role === 'UMKM' && (
                  <>
                    <div>
                      <Label>Nama Toko</Label>
                      <Input
                        value={editingItem.storeName || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, storeName: e.target.value })}
                        className="mt-1"
                        placeholder="Masukkan nama toko"
                      />
                    </div>
                    <div>
                      <Label>Alamat Toko</Label>
                      <Input
                        value={editingItem.storeAddress || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, storeAddress: e.target.value })}
                        className="mt-1"
                        placeholder="Masukkan alamat toko"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label>Deskripsi Toko</Label>
                      <Textarea
                        value={editingItem.storeDescription || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, storeDescription: e.target.value })}
                        className="mt-1"
                        rows={3}
                        placeholder="Masukkan deskripsi toko"
                      />
                    </div>
                  </>
                )}
                {editingItem.role === 'Driver' && (
                  <>
                    <div>
                      <Label>Jenis Kendaraan</Label>
                      <Input
                        value={editingItem.vehicleType || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, vehicleType: e.target.value })}
                        className="mt-1"
                        placeholder="Masukkan jenis kendaraan"
                      />
                    </div>
                    <div>
                      <Label>Plat Nomor</Label>
                      <Input
                        value={editingItem.vehiclePlate || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, vehiclePlate: e.target.value })}
                        className="mt-1"
                        placeholder="Masukkan plat nomor"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingItem(null);
                  }}
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
                >
                  Simpan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Dialog */}
      <Dialog
        open={isAddDialogOpen}
        onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) {
            resetNewUserForm();
          }
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle style={{ color: '#2F4858' }}>Tambah Pengguna</DialogTitle>
            <DialogDescription>
              Isi detail pengguna baru
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: RoleOption) => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UMKM">UMKM</SelectItem>
                    <SelectItem value="Driver">Driver</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="mt-1"
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="mt-1"
                  placeholder="Minimal 6 karakter"
                />
              </div>
              <div>
                <Label>Nama Lengkap / Penanggung Jawab</Label>
                <Input
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="mt-1"
                  placeholder="Nama sesuai KTP"
                />
              </div>
              {newUser.role === 'UMKM' && (
                <>
                  <div>
                    <Label>Nama UMKM / Toko</Label>
                    <Input
                      value={newUser.storeName}
                      onChange={(e) => setNewUser({ ...newUser, storeName: e.target.value })}
                      className="mt-1"
                      placeholder="Nama toko"
                    />
                  </div>
                  <div>
                    <Label>Alamat Toko</Label>
                    <Input
                      value={newUser.storeAddress}
                      onChange={(e) => setNewUser({ ...newUser, storeAddress: e.target.value })}
                      className="mt-1"
                      placeholder="Alamat lengkap toko"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label>Deskripsi UMKM</Label>
                    <Textarea
                      value={newUser.storeDescription}
                      onChange={(e) => setNewUser({ ...newUser, storeDescription: e.target.value })}
                      className="mt-1"
                      rows={3}
                      placeholder="Deskripsi singkat usaha"
                    />
                  </div>
                </>
              )}
              {newUser.role === 'Driver' && (
                <>
                  <div>
                    <Label>Jenis Kendaraan</Label>
                    <Input
                      value={newUser.vehicleType}
                      onChange={(e) => setNewUser({ ...newUser, vehicleType: e.target.value })}
                      className="mt-1"
                      placeholder="Motor / Mobil"
                    />
                  </div>
                  <div>
                    <Label>Plat Nomor</Label>
                    <Input
                      value={newUser.vehiclePlate}
                      onChange={(e) => setNewUser({ ...newUser, vehiclePlate: e.target.value })}
                      className="mt-1"
                      placeholder="F 1234 XX"
                    />
                  </div>
                </>
              )}
              <div>
                <Label>Telepon</Label>
                <Input
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  className="mt-1"
                  placeholder="+62..."
                />
              </div>
              <div>
                <Label>Alamat</Label>
                <Input
                  value={newUser.address}
                  onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                  className="mt-1"
                  placeholder="Alamat domisili"
                />
              </div>
              <div className="col-span-2">
                <Label>Deskripsi</Label>
                <Textarea
                  value={newUser.description}
                  onChange={(e) => setNewUser({ ...newUser, description: e.target.value })}
                  className="mt-1"
                  rows={3}
                  placeholder="Catatan tambahan"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  resetNewUserForm();
                }}
                disabled={isSubmittingNewUser}
              >
                Batal
              </Button>
              <Button
                onClick={handleCreateUser}
                style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}
                disabled={isSubmittingNewUser}
              >
                {isSubmittingNewUser ? 'Menyimpan...' : 'Simpan'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


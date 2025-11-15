import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
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

interface DataItem {
  id: string;
  name: string;
  email: string;
  role: 'UMKM' | 'Driver' | 'User';
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
type SortOrder = 'asc' | 'desc';

export function ManajemenData() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [data, setData] = useState<DataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DataItem | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Fetch data from API
  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams();
      if (filterRole !== 'all') params.append('role', filterRole);
      if (filterStatus !== 'all') params.append('status', filterStatus);

      const url = `${api.users.getAll}${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Gagal mengambil data users');
      }

      const result = await response.json();
      
      // Transform data dari backend ke format yang diharapkan
      const transformedData: DataItem[] = result.data.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role === 'umkm' ? 'UMKM' : user.role === 'driver' ? 'Driver' : 'User',
        status: user.status || 'pending',
        joinDate: user.joinDate || user.createdAt?.split('T')[0] || new Date().toISOString().split('T')[0],
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
      }));

      setData(transformedData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Gagal mengambil data users');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch data on mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [filterRole, filterStatus]);

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUsers();
  };

  // Get image URL
  const getImageUrl = (filePath: string | undefined) => {
    if (!filePath) return null;
    // Use relative path in production, localhost in development
    const isProduction = import.meta.env.PROD;
    const baseUrl = isProduction ? '' : 'http://localhost:3000';
    // Jika path sudah lengkap dengan uploads/, langsung gunakan
    if (filePath.startsWith('uploads/')) {
      return `${baseUrl}/${filePath}`;
    }
    return `${baseUrl}/${filePath}`;
  };

  // Handle view detail
  const handleViewDetail = (user: DataItem) => {
    setSelectedUser(user);
    setIsDetailDialogOpen(true);
  };

  // Handle status update
  const handleStatusUpdate = async (id: string, newStatus: 'active' | 'inactive' | 'pending') => {
    try {
      const response = await fetch(api.users.updateStatus(id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Gagal update status');
      }

      toast.success('Status berhasil diupdate');
      fetchUsers(); // Refresh data
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Gagal update status');
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredData = data
    .filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = filterRole === 'all' || item.role === filterRole;
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      const getValue = (item: DataItem): number | string => {
        switch (sortField) {
          case 'name':
            return item.name.toLowerCase();
          case 'joinDate':
            return new Date(item.joinDate).getTime();
          case 'totalOrders':
            return item.totalOrders;
          case 'rating':
            return item.rating;
          default:
            return item.name.toLowerCase();
        }
      };

      const valueA = getValue(a);
      const valueB = getValue(b);

      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      }

      const comparison = String(valueA).localeCompare(String(valueB));
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getStatusBadge = (status: string) => {
    const styles = {
      active: { bg: '#4CAF50', text: '#FFFFFF' },
      inactive: { bg: '#858585', text: '#FFFFFF' },
      pending: { bg: '#FF9800', text: '#FFFFFF' }
    };
    const style = styles[status as keyof typeof styles];
    return (
      <Badge style={{ backgroundColor: style.bg, color: style.text }}>
        {status === 'active' ? 'Aktif' : status === 'inactive' ? 'Nonaktif' : 'Pending'}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      UMKM: '#FF8D28',
      Driver: '#2196F3',
      User: '#4CAF50'
    };
    const color = colors[role as keyof typeof colors];
    return (
      <Badge variant="outline" style={{ borderColor: color, color: color }}>
        {role}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 style={{ color: '#2F4858' }}>Manajemen Data Pengguna</h3>
            <p className="body-3 mt-2" style={{ color: '#858585' }}>
              Kelola data UMKM, Driver, dan Pengguna dalam satu dashboard
            </p>
          </div>
          <Button style={{ backgroundColor: '#FF8D28' }}>
            <Download size={16} className="mr-2" />
            Export Data
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid md:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {[
          { label: 'Total UMKM', value: 342, color: '#FF8D28', change: '+18' },
          { label: 'Total Driver', value: 156, color: '#2196F3', change: '+12' },
          { label: 'Total User', value: 12847, color: '#4CAF50', change: '+342' },
          { label: 'Pending Approval', value: 23, color: '#FF9800', change: '-5' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            <Card className="hover-scale">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }} />
                  <Badge
                    variant="outline"
                    style={{
                      fontSize: '10px',
                      backgroundColor: stat.change.startsWith('+') ? '#C8E6C920' : '#FFE0B220',
                      color: stat.change.startsWith('+') ? '#4CAF50' : '#FF9800',
                      borderColor: stat.change.startsWith('+') ? '#4CAF50' : '#FF9800'
                    }}
                  >
                    {stat.change}
                  </Badge>
                </div>
                <p className="body-3 mb-1" style={{ color: '#858585', fontSize: '11px' }}>
                  {stat.label}
                </p>
                <h3 style={{ color: stat.color }}>{stat.value.toLocaleString('id-ID')}</h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2" size={18} style={{ color: '#858585' }} />
                <Input
                  placeholder="Cari berdasarkan nama atau email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Role Filter */}
              <Select value={filterRole} onValueChange={setFilterRole}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Role</SelectItem>
                  <SelectItem value="UMKM">UMKM</SelectItem>
                  <SelectItem value="Driver">Driver</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Nonaktif</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              {/* Refresh Button */}
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input type="checkbox" className="rounded" />
                    </TableHead>
                    <TableHead>
                      <button
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                        onClick={() => handleSort('name')}
                      >
                        Nama
                        {sortField === 'name' && (
                          sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </button>
                    </TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <button
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                        onClick={() => handleSort('joinDate')}
                      >
                        Tanggal Bergabung
                        {sortField === 'joinDate' && (
                          sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                        onClick={() => handleSort('totalOrders')}
                      >
                        Orders
                        {sortField === 'totalOrders' && (
                          sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        className="flex items-center gap-2 hover:text-primary transition-colors"
                        onClick={() => handleSort('rating')}
                      >
                        Rating
                        {sortField === 'rating' && (
                          sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                        )}
                      </button>
                    </TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <Loader2 className="animate-spin mx-auto" size={24} style={{ color: '#FF8D28' }} />
                        <p className="mt-2 body-3" style={{ color: '#858585' }}>Memuat data...</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8">
                        <p className="body-3" style={{ color: '#858585' }}>Tidak ada data</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell>
                        <input type="checkbox" className="rounded" />
                      </TableCell>
                      <TableCell>
                        <p className="body-3" style={{ color: '#2F4858', fontWeight: 600 }}>
                          {item.name}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                          {item.email}
                        </p>
                      </TableCell>
                      <TableCell>{getRoleBadge(item.role)}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                          {new Date(item.joinDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="body-3" style={{ color: '#FF8D28', fontWeight: 600 }}>
                          {item.totalOrders}
                        </p>
                      </TableCell>
                      <TableCell>
                        {item.role !== 'User' && item.rating > 0 && (
                          <p className="body-3" style={{ color: '#FFB800', fontWeight: 600 }}>
                            ⭐ {item.rating.toFixed(1)}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDetail(item)}>
                              <Eye size={14} className="mr-2" />
                              Lihat Detail
                            </DropdownMenuItem>
                            {item.status !== 'active' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(item.id, 'active')}>
                                <Edit size={14} className="mr-2" />
                                Setujui (Aktifkan)
                              </DropdownMenuItem>
                            )}
                            {item.status !== 'inactive' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(item.id, 'inactive')}>
                                <Edit size={14} className="mr-2" />
                                Nonaktifkan
                              </DropdownMenuItem>
                            )}
                            {item.status !== 'pending' && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(item.id, 'pending')}>
                                <Edit size={14} className="mr-2" />
                                Set Pending
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t flex items-center justify-between">
              <p className="body-3" style={{ color: '#858585', fontSize: '12px' }}>
                Menampilkan {filteredData.length} dari {data.length} data
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">1</Button>
                <Button variant="outline" size="sm" style={{ backgroundColor: '#FF8D28', color: '#FFFFFF' }}>2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle style={{ color: '#2F4858' }}>
              Detail {selectedUser?.role} - {selectedUser?.name}
            </DialogTitle>
            <DialogDescription>
              Email: {selectedUser?.email} | Status: {selectedUser?.status}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6 mt-4">
              {/* Informasi Lengkap User */}
              <div className="space-y-4">
                <h4 style={{ color: '#2F4858', fontWeight: 600 }}>Informasi Lengkap</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="body-3" style={{ color: '#858585' }}>Nama Lengkap</Label>
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                      {selectedUser.name || '-'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="body-3" style={{ color: '#858585' }}>Email</Label>
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                      {selectedUser.email || '-'}
                    </p>
                  </div>
                  {selectedUser.phone && (
                    <div className="space-y-2">
                      <Label className="body-3" style={{ color: '#858585' }}>Nomor Telepon</Label>
                      <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                        {selectedUser.phone}
                      </p>
                    </div>
                  )}
                  {selectedUser.address && (
                    <div className="space-y-2">
                      <Label className="body-3" style={{ color: '#858585' }}>Alamat</Label>
                      <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                        {selectedUser.address}
                      </p>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label className="body-3" style={{ color: '#858585' }}>Role</Label>
                    <div>{getRoleBadge(selectedUser.role)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="body-3" style={{ color: '#858585' }}>Status</Label>
                    <div>{getStatusBadge(selectedUser.status)}</div>
                  </div>
                  <div className="space-y-2">
                    <Label className="body-3" style={{ color: '#858585' }}>Tanggal Bergabung</Label>
                    <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                      {new Date(selectedUser.joinDate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="body-3" style={{ color: '#858585' }}>Verifikasi</Label>
                    <p className="body-3" style={{ color: selectedUser.isVerified ? '#4CAF50' : '#FF9800', fontWeight: 500 }}>
                      {selectedUser.isVerified ? '✓ Terverifikasi' : '⏳ Belum Terverifikasi'}
                    </p>
                  </div>
                  {selectedUser.totalOrders > 0 && (
                    <div className="space-y-2">
                      <Label className="body-3" style={{ color: '#858585' }}>Total Orders</Label>
                      <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                        {selectedUser.totalOrders}
                      </p>
                    </div>
                  )}
                  {selectedUser.rating > 0 && (
                    <div className="space-y-2">
                      <Label className="body-3" style={{ color: '#858585' }}>Rating</Label>
                      <p className="body-3" style={{ color: '#FFB800', fontWeight: 500 }}>
                        ⭐ {selectedUser.rating.toFixed(1)}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Informasi Khusus Driver */}
              {selectedUser.role === 'Driver' && (
                <div className="space-y-4">
                  <h4 style={{ color: '#2F4858', fontWeight: 600 }}>Informasi Driver</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedUser.vehicleType && (
                      <div className="space-y-2">
                        <Label className="body-3" style={{ color: '#858585' }}>Tipe Kendaraan</Label>
                        <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                          {selectedUser.vehicleType}
                        </p>
                      </div>
                    )}
                    {selectedUser.vehiclePlate && (
                      <div className="space-y-2">
                        <Label className="body-3" style={{ color: '#858585' }}>Nomor Plat Kendaraan</Label>
                        <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                          {selectedUser.vehiclePlate}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Informasi Khusus UMKM */}
              {selectedUser.role === 'UMKM' && (
                <div className="space-y-4">
                  <h4 style={{ color: '#2F4858', fontWeight: 600 }}>Informasi Toko</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedUser.storeName && (
                      <div className="space-y-2">
                        <Label className="body-3" style={{ color: '#858585' }}>Nama Toko</Label>
                        <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                          {selectedUser.storeName}
                        </p>
                      </div>
                    )}
                    {selectedUser.storeAddress && (
                      <div className="space-y-2">
                        <Label className="body-3" style={{ color: '#858585' }}>Alamat Toko</Label>
                        <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                          {selectedUser.storeAddress}
                        </p>
                      </div>
                    )}
                    {selectedUser.storeDescription && (
                      <div className="space-y-2">
                        <Label className="body-3" style={{ color: '#858585' }}>Deskripsi Toko</Label>
                        <p className="body-3" style={{ color: '#2F4858', fontWeight: 500 }}>
                          {selectedUser.storeDescription}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Driver Documents */}
              {selectedUser.role === 'Driver' && (
                <div className="space-y-4">
                  <h4 style={{ color: '#2F4858', fontWeight: 600 }}>Dokumen Driver</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedUser.ktpFile && (
                      <div className="space-y-2">
                        <Label className="body-3">Foto KTP</Label>
                        <div className="border rounded-lg p-2">
                          <img 
                            src={getImageUrl(selectedUser.ktpFile) || ''} 
                            alt="KTP" 
                            className="w-full h-48 object-contain rounded"
                          />
                          <a 
                            href={getImageUrl(selectedUser.ktpFile) || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink size={14} />
                            Buka di tab baru
                          </a>
                        </div>
                      </div>
                    )}
                    {selectedUser.simFile && (
                      <div className="space-y-2">
                        <Label className="body-3">Foto SIM</Label>
                        <div className="border rounded-lg p-2">
                          <img 
                            src={getImageUrl(selectedUser.simFile) || ''} 
                            alt="SIM" 
                            className="w-full h-48 object-contain rounded"
                          />
                          <a 
                            href={getImageUrl(selectedUser.simFile) || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink size={14} />
                            Buka di tab baru
                          </a>
                        </div>
                      </div>
                    )}
                    {selectedUser.stnkFile && (
                      <div className="space-y-2">
                        <Label className="body-3">Foto STNK</Label>
                        <div className="border rounded-lg p-2">
                          <img 
                            src={getImageUrl(selectedUser.stnkFile) || ''} 
                            alt="STNK" 
                            className="w-full h-48 object-contain rounded"
                          />
                          <a 
                            href={getImageUrl(selectedUser.stnkFile) || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink size={14} />
                            Buka di tab baru
                          </a>
                        </div>
                      </div>
                    )}
                    {selectedUser.selfieFile && (
                      <div className="space-y-2">
                        <Label className="body-3">Foto Selfie</Label>
                        <div className="border rounded-lg p-2">
                          <img 
                            src={getImageUrl(selectedUser.selfieFile) || ''} 
                            alt="Selfie" 
                            className="w-full h-48 object-contain rounded"
                          />
                          <a 
                            href={getImageUrl(selectedUser.selfieFile) || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink size={14} />
                            Buka di tab baru
                          </a>
                        </div>
                      </div>
                    )}
                    {selectedUser.vehiclePhotoFile && (
                      <div className="space-y-2 col-span-2">
                        <Label className="body-3">Foto Kendaraan</Label>
                        <div className="border rounded-lg p-2">
                          <img 
                            src={getImageUrl(selectedUser.vehiclePhotoFile) || ''} 
                            alt="Kendaraan" 
                            className="w-full h-64 object-contain rounded"
                          />
                          <a 
                            href={getImageUrl(selectedUser.vehiclePhotoFile) || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink size={14} />
                            Buka di tab baru
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* UMKM Documents */}
              {selectedUser.role === 'UMKM' && (
                <div className="space-y-4">
                  <h4 style={{ color: '#2F4858', fontWeight: 600 }}>Dokumen UMKM</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedUser.ktpFile && (
                      <div className="space-y-2">
                        <Label className="body-3">Foto KTP Pemilik</Label>
                        <div className="border rounded-lg p-2">
                          <img 
                            src={getImageUrl(selectedUser.ktpFile) || ''} 
                            alt="KTP" 
                            className="w-full h-48 object-contain rounded"
                          />
                          <a 
                            href={getImageUrl(selectedUser.ktpFile) || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink size={14} />
                            Buka di tab baru
                          </a>
                        </div>
                      </div>
                    )}
                    {selectedUser.storePhotoFile && (
                      <div className="space-y-2">
                        <Label className="body-3">Foto Tempat Usaha</Label>
                        <div className="border rounded-lg p-2">
                          <img 
                            src={getImageUrl(selectedUser.storePhotoFile) || ''} 
                            alt="Toko" 
                            className="w-full h-48 object-contain rounded"
                          />
                          <a 
                            href={getImageUrl(selectedUser.storePhotoFile) || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-2 text-sm text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink size={14} />
                            Buka di tab baru
                          </a>
                        </div>
                      </div>
                    )}
                    {selectedUser.businessPermitFile && (
                      <div className="space-y-2 col-span-2">
                        <Label className="body-3">Izin Usaha</Label>
                        <div className="border rounded-lg p-4 text-center">
                          {selectedUser.businessPermitFile.endsWith('.pdf') ? (
                            <div className="space-y-2">
                              <FileText size={48} className="mx-auto" style={{ color: '#858585' }} />
                              <p className="body-3" style={{ color: '#858585' }}>File PDF</p>
                              <a 
                                href={getImageUrl(selectedUser.businessPermitFile) || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline flex items-center justify-center gap-1"
                              >
                                <ExternalLink size={14} />
                                Buka PDF di tab baru
                              </a>
                            </div>
                          ) : (
                            <>
                              <img 
                                src={getImageUrl(selectedUser.businessPermitFile) || ''} 
                                alt="Izin Usaha" 
                                className="w-full h-64 object-contain rounded mx-auto"
                              />
                              <a 
                                href={getImageUrl(selectedUser.businessPermitFile) || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="mt-2 text-sm text-blue-600 hover:underline flex items-center justify-center gap-1"
                              >
                                <ExternalLink size={14} />
                                Buka di tab baru
                              </a>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(!selectedUser.ktpFile && !selectedUser.storePhotoFile && !selectedUser.simFile) && (
                <p className="body-3 text-center" style={{ color: '#858585' }}>
                  Belum ada dokumen yang diupload
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

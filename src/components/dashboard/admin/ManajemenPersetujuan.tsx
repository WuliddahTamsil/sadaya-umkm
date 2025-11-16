import { useState } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Eye, Check, X, Store, Bike } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';
import { toast } from 'sonner';

interface Application {
  id: string;
  type: 'umkm' | 'driver';
  name: string;
  email: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  details: {
    phone?: string;
    address?: string;
    description?: string;
    vehicleType?: string;
    vehiclePlate?: string;
  };
}

export function ManajemenPersetujuan() {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [applications, setApplications] = useState<Application[]>([
    {
      id: '1',
      type: 'umkm',
      name: 'Tahu Gejrot Pak Haji',
      email: 'pakhaji@email.com',
      submittedDate: '2025-11-08',
      status: 'pending',
      details: {
        phone: '+62 812-3456-7890',
        address: 'Jl. Suryakencana No. 123, Bogor',
        description: 'Tahu gejrot legendaris dengan bumbu khas Bogor'
      }
    },
    {
      id: '2',
      type: 'driver',
      name: 'Ahmad Fauzi',
      email: 'ahmad@email.com',
      submittedDate: '2025-11-08',
      status: 'pending',
      details: {
        phone: '+62 813-4567-8901',
        vehicleType: 'Motor',
        vehiclePlate: 'B 1234 XYZ'
      }
    },
    {
      id: '3',
      type: 'umkm',
      name: 'Kerajinan Bambu Ibu Siti',
      email: 'siti@email.com',
      submittedDate: '2025-11-07',
      status: 'approved',
      details: {
        phone: '+62 814-5678-9012',
        address: 'Jl. Pajajaran No. 45, Bogor',
        description: 'Kerajinan anyaman bambu berkualitas tinggi'
      }
    }
  ]);

  const handleApprove = (id: string) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'approved' as const } : app
    ));
    toast.success('Pengajuan telah disetujui!');
    setSelectedApp(null);
  };

  const handleReject = (id: string) => {
    setApplications(prev => prev.map(app => 
      app.id === id ? { ...app, status: 'rejected' as const } : app
    ));
    toast.success('Pengajuan telah ditolak.');
    setSelectedApp(null);
  };

  const pendingApps = applications.filter(app => app.status === 'pending');
  const approvedApps = applications.filter(app => app.status === 'approved');
  const rejectedApps = applications.filter(app => app.status === 'rejected');

  const ApplicationCard = ({ app }: { app: Application }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: app.type === 'umkm' ? '#FDE08E' : '#C8E6C9' }}
            >
              {app.type === 'umkm' ? (
                <Store size={24} style={{ color: '#FF8D28' }} />
              ) : (
                <Bike size={24} style={{ color: '#4CAF50' }} />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 style={{ color: '#2F4858' }}>{app.name}</h4>
                <Badge variant={app.status === 'pending' ? 'secondary' : app.status === 'approved' ? 'default' : 'destructive'}>
                  {app.status === 'pending' ? 'Pending' : app.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                </Badge>
              </div>
              <p className="body-3" style={{ color: '#858585' }}>{app.email}</p>
              <p className="body-3" style={{ color: '#CCCCCC', fontSize: '12px' }}>
                Diajukan: {new Date(app.submittedDate).toLocaleDateString('id-ID')}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedApp(app)}
            >
              <Eye size={16} className="mr-1" />
              Detail
            </Button>
            {app.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  style={{ backgroundColor: '#4CAF50', color: '#FFFFFF' }}
                  onClick={() => handleApprove(app.id)}
                >
                  <Check size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReject(app.id)}
                >
                  <X size={16} />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="pending">
            Menunggu ({pendingApps.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Disetujui ({approvedApps.length})
          </TabsTrigger>
          <TabsTrigger value="rejected">
            Ditolak ({rejectedApps.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingApps.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p style={{ color: '#858585' }}>Tidak ada pengajuan yang menunggu persetujuan</p>
              </CardContent>
            </Card>
          ) : (
            pendingApps.map(app => <ApplicationCard key={app.id} app={app} />)
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          {approvedApps.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p style={{ color: '#858585' }}>Belum ada pengajuan yang disetujui</p>
              </CardContent>
            </Card>
          ) : (
            approvedApps.map(app => <ApplicationCard key={app.id} app={app} />)
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {rejectedApps.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p style={{ color: '#858585' }}>Belum ada pengajuan yang ditolak</p>
              </CardContent>
            </Card>
          ) : (
            rejectedApps.map(app => <ApplicationCard key={app.id} app={app} />)
          )}
        </TabsContent>
      </Tabs>

      {/* Detail Dialog */}
      <Dialog open={selectedApp !== null} onOpenChange={() => setSelectedApp(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle style={{ color: '#2F4858' }}>
              Detail {selectedApp?.type === 'umkm' ? 'UMKM' : 'Driver'}
            </DialogTitle>
            <DialogDescription>
              Informasi lengkap pengajuan
            </DialogDescription>
          </DialogHeader>
          {selectedApp && (
            <div className="space-y-4">
              <div>
                <p className="body-3" style={{ color: '#858585' }}>Nama</p>
                <p style={{ color: '#2F4858' }}>{selectedApp.name}</p>
              </div>
              <div>
                <p className="body-3" style={{ color: '#858585' }}>Email</p>
                <p style={{ color: '#2F4858' }}>{selectedApp.email}</p>
              </div>
              <div>
                <p className="body-3" style={{ color: '#858585' }}>Telepon</p>
                <p style={{ color: '#2F4858' }}>{selectedApp.details.phone}</p>
              </div>
              {selectedApp.type === 'umkm' ? (
                <>
                  <div>
                    <p className="body-3" style={{ color: '#858585' }}>Alamat</p>
                    <p style={{ color: '#2F4858' }}>{selectedApp.details.address}</p>
                  </div>
                  <div>
                    <p className="body-3" style={{ color: '#858585' }}>Deskripsi</p>
                    <p style={{ color: '#2F4858' }}>{selectedApp.details.description}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="body-3" style={{ color: '#858585' }}>Jenis Kendaraan</p>
                    <p style={{ color: '#2F4858' }}>{selectedApp.details.vehicleType}</p>
                  </div>
                  <div>
                    <p className="body-3" style={{ color: '#858585' }}>Plat Nomor</p>
                    <p style={{ color: '#2F4858' }}>{selectedApp.details.vehiclePlate}</p>
                  </div>
                </>
              )}
              {selectedApp.status === 'pending' && (
                <div className="flex gap-2 pt-4">
                  <Button
                    className="flex-1"
                    style={{ backgroundColor: '#4CAF50', color: '#FFFFFF' }}
                    onClick={() => handleApprove(selectedApp.id)}
                  >
                    Setujui
                  </Button>
                  <Button
                    className="flex-1"
                    variant="destructive"
                    onClick={() => handleReject(selectedApp.id)}
                  >
                    Tolak
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

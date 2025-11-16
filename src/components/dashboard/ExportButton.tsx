import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Download, FileText, Table } from 'lucide-react';
import { toast } from 'sonner';

interface ExportButtonProps {
  filename?: string;
  variant?: 'default' | 'outline';
}

export function ExportButton({ filename = 'laporan', variant = 'outline' }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('📄 Laporan PDF berhasil diunduh!', {
      description: `File: ${filename}.pdf`
    });
    setIsExporting(false);
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('📊 Laporan Excel berhasil diunduh!', {
      description: `File: ${filename}.xlsx`
    });
    setIsExporting(false);
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('📋 Laporan CSV berhasil diunduh!', {
      description: `File: ${filename}.csv`
    });
    setIsExporting(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="sm" disabled={isExporting}>
          <motion.div
            animate={isExporting ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: isExporting ? Infinity : 0 }}
          >
            <Download size={16} className="mr-2" />
          </motion.div>
          {isExporting ? 'Mengunduh...' : 'Ekspor'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportPDF}>
          <FileText size={16} className="mr-2" style={{ color: '#FF6B6B' }} />
          Export PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportExcel}>
          <Table size={16} className="mr-2" style={{ color: '#4CAF50' }} />
          Export Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCSV}>
          <FileText size={16} className="mr-2" style={{ color: '#2196F3' }} />
          Export CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

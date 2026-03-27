import { DirectorySection } from "../components/DirectorySection";

interface UMKMItem {
  id: number;
  name: string;
  category: string;
  address: string;
  image: string;
  description: string;
  about?: string;
  phone?: string;
  operatingHours?: string;
  mapsLink?: string;
}

interface DirektoriPageProps {
  onSelectUMKM: (umkm: UMKMItem) => void;
}

export function DirektoriPage({ onSelectUMKM }: DirektoriPageProps) {
  return (
    <div className="min-h-screen bg-white">
      <DirectorySection onSelectUMKM={onSelectUMKM} />
    </div>
  );
}


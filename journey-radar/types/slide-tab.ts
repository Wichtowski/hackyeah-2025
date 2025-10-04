export interface SlideTabData {
  id: string;
  title: string;
  content: React.ReactNode;
  metadata?: Record<string, unknown>;
}

export interface SlideTabProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  width?: number;
  data?: SlideTabData;
}

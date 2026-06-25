import * as Icons from 'lucide-react';

interface LucideIconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function LucideIcon({ name, size = 20, className = '' }: LucideIconProps) {
  // Fallback to Terminal if the icon doesn't exist
  const IconComponent = (Icons as any)[name] || Icons.Terminal;
  return <IconComponent size={size} className={className} />;
}

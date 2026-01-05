
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  children?: { id: string; label: string }[];
}

export interface SocialLink {
  icon: any;
  url?: string;
}

export interface FooterLinkItem {
  label: string;
  action: () => void;
}

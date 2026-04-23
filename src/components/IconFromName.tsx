/**
 * Maps a Lucide icon name string to a React component.
 * Used by the data layer (questions.ts) to reference icons
 * without importing React components in a plain TS file.
 */
"use client";

import {
  Sparkles,
  Eye,
  Waves,
  Dice5,
  Flame,
  Heart,
  Zap,
  Search,
  Wand2,
  Users,
  Laugh,
  Smartphone,
  Trophy,
  Target,
  Rocket,
  Smile,
  HelpCircle,
  Star,
  MessageSquare,
  Palette,
  Mic,
  Bird,
  Sun,
  Tornado,
  Shield,
  Moon,
  Lightbulb,
  Ear,
  Lock,
  Droplets,
  Home,
  Mail,
  Hand,
  Clock,
  Wrench,
  Gift,
  BookOpen,
  Handshake,
  EyeOff,
  Brain,
  HeartHandshake,
  Turtle,
  Globe,
  Pause,
  CloudMoon,
  Music,
  Headphones,
  Hourglass,
  Flower2,
  Feather,
  RotateCw,
  Send,
  Compass,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  eye: Eye,
  waves: Waves,
  dice: Dice5,
  flame: Flame,
  heart: Heart,
  zap: Zap,
  search: Search,
  wand: Wand2,
  users: Users,
  laugh: Laugh,
  smartphone: Smartphone,
  trophy: Trophy,
  target: Target,
  rocket: Rocket,
  smile: Smile,
  "help-circle": HelpCircle,
  star: Star,
  "message-square": MessageSquare,
  palette: Palette,
  mic: Mic,
  bird: Bird,
  sun: Sun,
  tornado: Tornado,
  shield: Shield,
  moon: Moon,
  lightbulb: Lightbulb,
  ear: Ear,
  lock: Lock,
  droplets: Droplets,
  home: Home,
  mail: Mail,
  hand: Hand,
  clock: Clock,
  wrench: Wrench,
  gift: Gift,
  "book-open": BookOpen,
  handshake: Handshake,
  "eye-off": EyeOff,
  brain: Brain,
  "heart-handshake": HeartHandshake,
  turtle: Turtle,
  globe: Globe,
  pause: Pause,
  "cloud-moon": CloudMoon,
  music: Music,
  headphones: Headphones,
  hourglass: Hourglass,
  flower: Flower2,
  feather: Feather,
  "rotate-cw": RotateCw,
  send: Send,
  compass: Compass,
};

interface IconFromNameProps {
  name: string;
  size?: number;
  className?: string;
}

export default function IconFromName({
  name,
  size = 18,
  className,
}: IconFromNameProps) {
  const Icon = iconMap[name];
  if (!Icon) return null;
  return <Icon size={size} className={className} />;
}

export { iconMap };

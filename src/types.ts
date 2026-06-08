/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Task {
  id: string;
  title: string;
  description?: string;
  estimatedPomodoros: number;
  completedPomodoros: number;
  completed: boolean;
  createdAt: string;
  priority: 'normal' | 'importante' | 'urgente';
}

export type ItemType = 'skin' | 'sound' | 'food' | 'potion' | 'mystery_box';

export interface ShopItem {
  id: string;
  name: string;
  type: ItemType;
  price: number;
  description: string;
  iconName: string;
  purchased: boolean; // For skins/sounds
  equipped?: boolean; // For skins/sounds
  quantity?: number; // For consumables
  weeklyPurchasedCount?: number; // For revive potion tracking
}

export interface PetState {
  name: string;
  level: number;
  experience: number;
  maxExperience: number;
  energy: number; // 0 to 100
  skin: string; // 'skin_padrao' | 'skin_ninja' | 'skin_astronauta' | 'skin_mago'
  status: 'idle' | 'focusing' | 'sleeping' | 'happy' | 'dead';
  lastEnergyDeductionTime?: string; // ISO string
}

export interface UserStats {
  coins: number;
  focusMinutesToday: number;
  totalDaysActive: number;
  currentStreak: number;
  longestStreak: number;
  weeklyFocus: { day: string; minutes: number }[]; // 7 days (Mon-Sun)
  monthlyFocus: { date: string; minutes: number }[]; // days of the month
  yearlyFocus: { month: string; minutes: number }[]; // 12 months
}

export interface Friend {
  uid: string;
  username: string;
  level: number;
  coins: number;
  focusMinutes: number;
}

export interface SocialSession {
  id: string;
  title: string;
  hostId: string;
  hostName: string;
  createdAt: string;
  isActive: boolean;
  timerMode: 'focus' | 'short' | 'long';
  currentTimer: number; // in seconds
  participants: {
    uid: string;
    username: string;
    status: 'idle' | 'focusing' | 'paused';
    joinedAt: string;
  }[];
}

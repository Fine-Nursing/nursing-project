import type { AvatarConfig } from './types';

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  // Essential props to prevent random values
  hat: 'none',
  graphic: 'none',
  
  // Basic features - Professional preset
  hair: 'none',
  hairColor: 'brown',
  eyes: 'normal',
  eyebrows: 'raised',
  mouth: 'serious',
  clothing: 'dressShirt',
  clothingColor: 'white',
  accessory: 'none',
  facialHair: 'none',
  skinTone: 'light',
  body: 'chest',
  lashes: false,
  lipColor: 'red'
};

export const AVATAR_TABS = [
  { id: 'preset', label: 'Presets' },
  { id: 'custom', label: 'Customize' }
] as const;
import type { AvatarConfig } from './types';

export const DEFAULT_AVATAR_CONFIG: AvatarConfig = {
  // Essential props to prevent random values
  hat: 'none',
  graphic: 'none',
  
  // Basic features
  hair: 'bun',
  hairColor: 'brown',
  eyes: 'normal',
  eyebrows: 'raised',
  mouth: 'serious',
  clothing: 'dressShirt',
  clothingColor: 'white',
  accessory: 'roundGlasses',
  facialHair: 'none',
  skinTone: 'light',
  body: 'breasts',
  lashes: true,
  lipColor: 'red'
};

export const AVATAR_TABS = [
  { id: 'preset', label: 'Presets' },
  { id: 'custom', label: 'Customize' }
] as const;
'use client';

import React, { memo } from 'react';
import { Avatar } from 'beanheads';

export interface SimpleBeanHeadConfig {
  accessory?: string;
  body?: string;
  clothing?: string;
  clothingColor?: string;
  eyebrows?: string;
  eyes?: string;
  facialHair?: string;
  graphic?: string;
  hair?: string;
  hairColor?: string;
  hat?: string;
  hatColor?: string;
  lashes?: boolean;
  lipColor?: string;
  mouth?: string;
  skinTone?: string;
}

// Preset configurations for nurses - WITH ALL REQUIRED PROPS
export const PRESET_STYLES = [
  { 
    name: 'Professional', 
    config: { 
      hair: 'bun',
      hairColor: 'brown',
      eyes: 'normal',
      eyebrows: 'raised',
      mouth: 'serious',
      clothing: 'dressShirt',
      clothingColor: 'white',
      accessory: 'roundGlasses',
      body: 'breasts',
      skinTone: 'light',
      lashes: true,
      hat: 'none',
      graphic: 'none',
      facialHair: 'none',
      lipColor: 'red'
    }
  },
  { 
    name: 'Friendly', 
    config: { 
      hair: 'long',
      hairColor: 'blonde',
      eyes: 'happy',
      eyebrows: 'raised',
      mouth: 'openSmile',
      clothing: 'shirt',
      clothingColor: 'blue',
      body: 'breasts',
      skinTone: 'light',
      lashes: true,
      hat: 'none',
      graphic: 'none',
      facialHair: 'none',
      lipColor: 'pink'
    }
  },
  { 
    name: 'Caring', 
    config: { 
      hair: 'short',
      hairColor: 'black',
      eyes: 'content',
      eyebrows: 'concerned',
      mouth: 'grin',
      clothing: 'vneck',
      clothingColor: 'green',
      body: 'chest',
      skinTone: 'brown',
      lashes: false,
      hat: 'none',
      graphic: 'none',
      facialHair: 'stubble',
      lipColor: 'purple'
    }
  },
  { 
    name: 'Energetic', 
    config: { 
      hair: 'pixie',
      hairColor: 'orange',
      eyes: 'wink',
      eyebrows: 'raised',
      mouth: 'tongue',
      clothing: 'tankTop',
      clothingColor: 'red',
      accessory: 'shades',
      body: 'breasts',
      skinTone: 'light',
      lashes: true,
      hat: 'none',
      graphic: 'none',
      facialHair: 'none',
      lipColor: 'turqoise'
    }
  },
];

// Available options with English labels - COMPLETE AND ACCURATE
export const HAIR_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'long', label: 'Long' },
  { value: 'bun', label: 'Bun' },
  { value: 'short', label: 'Short' },
  { value: 'pixie', label: 'Pixie' },
  { value: 'balding', label: 'Balding' },
  { value: 'buzz', label: 'Buzz' },
  { value: 'afro', label: 'Afro' },
  { value: 'bob', label: 'Bob' }
];

export const HAT_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'beanie', label: 'Beanie' },
  { value: 'turban', label: 'Turban' }
];

export const EYE_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'leftTwitch', label: 'Wink' },
  { value: 'happy', label: 'Happy' },
  { value: 'content', label: 'Content' },
  { value: 'squint', label: 'Squint' },
  { value: 'simple', label: 'Simple' },
  { value: 'dizzy', label: 'Dizzy' },
  { value: 'wink', label: 'Wink Alt' },
  { value: 'heart', label: 'Hearts' }
];

export const EYEBROW_OPTIONS = [
  { value: 'raised', label: 'Raised' },
  { value: 'leftLowered', label: 'Left Lowered' },
  { value: 'serious', label: 'Serious' },
  { value: 'angry', label: 'Angry' },
  { value: 'concerned', label: 'Concerned' }
];

export const MOUTH_OPTIONS = [
  { value: 'grin', label: 'Grin' },
  { value: 'sad', label: 'Sad' },
  { value: 'openSmile', label: 'Smile' },
  { value: 'lips', label: 'Lips' },
  { value: 'open', label: 'Open' },
  { value: 'serious', label: 'Serious' },
  { value: 'tongue', label: 'Tongue' }
];

export const CLOTHING_OPTIONS = [
  { value: 'naked', label: 'None' },
  { value: 'shirt', label: 'Shirt' },
  { value: 'dressShirt', label: 'Dress Shirt' },
  { value: 'vneck', label: 'V-Neck' },
  { value: 'tankTop', label: 'Tank Top' },
  { value: 'dress', label: 'Dress' }
];

export const GRAPHIC_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'redwood', label: 'Redwood' },
  { value: 'gatsby', label: 'Gatsby' },
  { value: 'vue', label: 'Vue' },
  { value: 'react', label: 'React' },
  { value: 'graphQL', label: 'GraphQL' }
];

export const ACCESSORY_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'roundGlasses', label: 'Round Glasses' },
  { value: 'tinyGlasses', label: 'Tiny Glasses' },
  { value: 'shades', label: 'Sunglasses' }
];

export const FACIAL_HAIR_OPTIONS = [
  { value: 'none', label: 'None' },
  { value: 'stubble', label: 'Stubble' },
  { value: 'mediumBeard', label: 'Medium Beard' }
];

// Color options - ONLY VALID THEME KEYS
export const SKIN_TONE_OPTIONS = [
  { value: 'light', label: 'Light' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'brown', label: 'Brown' },
  { value: 'dark', label: 'Dark' },
  { value: 'red', label: 'Red' },
  { value: 'black', label: 'Black' }
];

export const HAIR_COLOR_OPTIONS = [
  { value: 'blonde', label: 'Blonde' },
  { value: 'orange', label: 'Orange' },
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'brown', label: 'Brown' },
  { value: 'blue', label: 'Blue' },
  { value: 'pink', label: 'Pink' }
];

export const CLOTHING_COLOR_OPTIONS = [
  { value: 'white', label: 'White' },
  { value: 'blue', label: 'Blue' },
  { value: 'black', label: 'Black' },
  { value: 'green', label: 'Green' },
  { value: 'red', label: 'Red' }
];

export const LIP_COLOR_OPTIONS = [
  { value: 'red', label: 'Red' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
  { value: 'turqoise', label: 'Turquoise' },
  { value: 'green', label: 'Green' }
];

interface SimpleBeanHeadProps {
  config: SimpleBeanHeadConfig;
  size?: number;
  className?: string;
}

function SimpleBeanHead({ config, size = 100, className = '' }: SimpleBeanHeadProps) {
  
  // Ensure ALL props have valid values - CRITICAL: Include hat and graphic!
  const avatarProps = {
    // Required to prevent random values
    hat: config.hat || 'none',
    graphic: config.graphic || 'none',
    
    // Basic features
    accessory: config.accessory || 'none',
    body: config.body || 'breasts',
    clothing: config.clothing || 'shirt',
    clothingColor: config.clothingColor || 'white',
    eyebrows: config.eyebrows || 'raised',
    eyes: config.eyes || 'normal',
    facialHair: config.facialHair || 'none',
    hair: config.hair || 'long',
    hairColor: config.hairColor || 'brown',
    hatColor: config.hatColor || 'white',
    lashes: config.lashes !== undefined ? config.lashes : true,
    lipColor: config.lipColor || 'red',
    mouth: config.mouth || 'openSmile',
    skinTone: config.skinTone || 'light',
    
    // Always set these to false
    mask: false,
    faceMask: false
  };

  // Create a unique key based on all config values to force re-render
  const configKey = JSON.stringify(avatarProps);

  try {
    return (
      <div className={className} style={{ width: size, height: size }} key={configKey}>
        <Avatar {...(avatarProps as any)} />
      </div>
    );
  } catch (error) {
    // Fallback - use a simple placeholder
    return (
      <div className={`${className} flex items-center justify-center bg-gray-200 rounded-full`} 
           style={{ width: size, height: size }}>
        <span className="text-gray-500 text-xs">Avatar</span>
      </div>
    );
  }
}

// Remove memoization for now to ensure updates work correctly
export default SimpleBeanHead;
'use client';

import React, { useCallback } from 'react';
import {
  HAIR_OPTIONS,
  HAT_OPTIONS,
  EYE_OPTIONS,
  EYEBROW_OPTIONS,
  MOUTH_OPTIONS,
  CLOTHING_OPTIONS,
  GRAPHIC_OPTIONS,
  ACCESSORY_OPTIONS,
  FACIAL_HAIR_OPTIONS,
  HAIR_COLOR_OPTIONS,
  CLOTHING_COLOR_OPTIONS,
  SKIN_TONE_OPTIONS,
  LIP_COLOR_OPTIONS
} from './SimpleBeanHead';

interface CustomizeSectionProps {
  avatarConfig: any;
  setAvatarConfig: (config: any) => void;
  theme: 'light' | 'dark';
}

export default function CustomizeSectionUpdated({ avatarConfig, setAvatarConfig, theme }: CustomizeSectionProps) {
  // Use callback to prevent stale closure issues
  const updateConfig = useCallback((key: string, value: any) => {
    setAvatarConfig((prevConfig: any) => {
      const newConfig = {
        ...prevConfig,
        [key]: value
      };
      return newConfig;
    });
  }, [setAvatarConfig]);

  // Common button classes for reuse
  const getButtonClasses = (isActive: boolean) => `text-xs p-2 rounded-lg border transition-all ${
      isActive 
        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-500' 
        : theme === 'light'
          ? 'border-gray-300 hover:border-gray-400 bg-white text-gray-700'
          : 'border-slate-600 hover:border-slate-500 bg-slate-700 text-gray-300 hover:bg-slate-600'
    }`;

  const getLargeButtonClasses = (isActive: boolean) => `flex-1 px-4 py-2 rounded-lg border transition-all ${
      isActive 
        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-medium dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-500' 
        : theme === 'light'
          ? 'border-gray-300 hover:border-gray-400 bg-white text-gray-700'
          : 'border-slate-600 hover:border-slate-500 bg-slate-700 text-gray-300 hover:bg-slate-600'
    }`;

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
      {/* Hat */}
      <div>
        <label className={`text-sm font-medium block mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Hat / Headwear
        </label>
        <div className="grid grid-cols-3 gap-1">
          {HAT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateConfig('hat', option.value)}
              className={getButtonClasses(avatarConfig.hat === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hair Style */}
      <div>
        <label className={`text-sm font-medium block mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Hair Style
        </label>
        <div className="grid grid-cols-3 gap-1">
          {HAIR_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateConfig('hair', option.value)}
              className={getButtonClasses(avatarConfig.hair === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Hair Color */}
      <div>
        <label className={`text-sm font-medium block mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Hair Color
        </label>
        <div className="grid grid-cols-4 gap-1">
          {HAIR_COLOR_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateConfig('hairColor', option.value)}
              className={getButtonClasses(avatarConfig.hairColor === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Eyes */}
      <div>
        <label className={`text-sm font-medium block mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Eyes
        </label>
        <div className="grid grid-cols-3 gap-1">
          {EYE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateConfig('eyes', option.value)}
              className={getButtonClasses(avatarConfig.eyes === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Eyebrows */}
      <div>
        <label className={`text-sm font-medium block mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Eyebrows
        </label>
        <div className="grid grid-cols-3 gap-1">
          {EYEBROW_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateConfig('eyebrows', option.value)}
              className={getButtonClasses(avatarConfig.eyebrows === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mouth */}
      <div>
        <label className={`text-sm font-medium block mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Mouth
        </label>
        <div className="grid grid-cols-3 gap-1">
          {MOUTH_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateConfig('mouth', option.value)}
              className={getButtonClasses(avatarConfig.mouth === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lip Color */}
      <div>
        <label className={`text-sm font-medium block mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Lip Color
        </label>
        <div className="grid grid-cols-3 gap-1">
          {LIP_COLOR_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateConfig('lipColor', option.value)}
              className={getButtonClasses(avatarConfig.lipColor === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clothing */}
      <div>
        <label className={`text-sm font-medium block mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Clothing
        </label>
        <div className="grid grid-cols-3 gap-1">
          {CLOTHING_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateConfig('clothing', option.value)}
              className={getButtonClasses(avatarConfig.clothing === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clothing Color */}
      <div>
        <label className={`text-sm font-medium block mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Clothing Color
        </label>
        <div className="grid grid-cols-3 gap-1">
          {CLOTHING_COLOR_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateConfig('clothingColor', option.value)}
              className={getButtonClasses(avatarConfig.clothingColor === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clothing Graphic */}
      <div>
        <label className={`text-sm font-medium block mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Clothing Graphic
        </label>
        <div className="grid grid-cols-3 gap-1">
          {GRAPHIC_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateConfig('graphic', option.value)}
              className={getButtonClasses(avatarConfig.graphic === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accessories */}
      <div>
        <label className={`text-sm font-medium block mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Accessories
        </label>
        <div className="grid grid-cols-2 gap-1">
          {ACCESSORY_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateConfig('accessory', option.value)}
              className={getButtonClasses(avatarConfig.accessory === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Facial Hair */}
      <div>
        <label className={`text-sm font-medium block mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Facial Hair
        </label>
        <div className="grid grid-cols-2 gap-1">
          {FACIAL_HAIR_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateConfig('facialHair', option.value)}
              className={getButtonClasses(avatarConfig.facialHair === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Skin Tone */}
      <div>
        <label className={`text-sm font-medium block mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Skin Tone
        </label>
        <div className="grid grid-cols-3 gap-1">
          {SKIN_TONE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateConfig('skinTone', option.value)}
              className={getButtonClasses(avatarConfig.skinTone === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lashes */}
      <div>
        <label className={`text-sm font-medium block mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Lashes
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => updateConfig('lashes', true)}
            className={getLargeButtonClasses(avatarConfig.lashes === true)}
          >
            With Lashes
          </button>
          <button
            onClick={() => updateConfig('lashes', false)}
            className={getLargeButtonClasses(avatarConfig.lashes === false)}
          >
            Without Lashes
          </button>
        </div>
      </div>

      {/* Body Type */}
      <div>
        <label className={`text-sm font-medium block mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
          Body Type
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => {
              updateConfig('body', 'breasts');
            }}
            className={getLargeButtonClasses(avatarConfig.body === 'breasts')}
          >
            Female
          </button>
          <button
            onClick={() => {
              updateConfig('body', 'chest');
            }}
            className={getLargeButtonClasses(avatarConfig.body === 'chest')}
          >
            Male
          </button>
        </div>
      </div>
    </div>
  );
}
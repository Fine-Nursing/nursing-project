const queryKeys = {
  compensation: {
    all: ['compensation'] as const,
    cards: (params?: any) => ['compensation', 'cards', params] as const,
    byLevel: (level: string, params?: any) =>
      ['compensation', 'cards', level, params] as const,
  },

  user: {
    all: ['user'] as const,
    profile: (id: string) => ['user', 'profile', id] as const,
    settings: () => ['user', 'settings'] as const,
  },

  dashboard: {
    all: ['dashboard'] as const,
    stats: (period?: string) => ['dashboard', 'stats', period] as const,
    charts: () => ['dashboard', 'charts'] as const,
  },
} as const;

export default queryKeys;

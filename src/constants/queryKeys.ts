const queryKeys = {
  compensation: {
    all: ['compensation'] as const,
    cards: (params?: any) => ['compensation', 'cards', params] as const,
    byLevel: (level: string, params?: any) =>
      ['compensation', 'cards', level, params] as const,
  },
  specialty: {
    all: ['specialty'] as const,
    averageCompensation: (params?: {
      states?: string[];
      experienceGroups?: string[];
      search?: string;
      limit?: number;
      sortBy?: string;
      sortOrder?: string;
    }) => ['specialty', 'averageCompensation', params] as const,
    list: (search?: string) => ['specialty', 'list', search] as const,
  },
  location: {
    all: ['location'] as const,
    states: () => ['location', 'states'] as const,
  },
  user: {
    all: ['user'] as const,
    profile: (id: string) => ['user', 'profile', id] as const,
    me: () => ['user', 'me'] as const,
    compensation: () => ['user', 'compensation'] as const,
    settings: () => ['user', 'settings'] as const,
  },
  dashboard: {
    all: ['dashboard'] as const,
    stats: (period?: string) => ['dashboard', 'stats', period] as const,
    charts: () => ['dashboard', 'charts'] as const,
  },
  nursing: {
    all: ['nursing'] as const,
    table: (params?: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: string;
      states?: string[];
      cities?: string[];
      specialties?: string[];
      experienceGroups?: string[];
      shiftTypes?: string[];
      minCompensation?: number;
      maxCompensation?: number;
    }) => ['nursing', 'table', params] as const,
  },
} as const;

export default queryKeys;

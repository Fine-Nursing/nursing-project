export interface StateInfo {
  code: string;
  name: string;
}

export type RegionName = 'Northeast' | 'South' | 'Midwest' | 'West';

export interface RegionStates {
  Northeast: StateInfo[];
  South: StateInfo[];
  Midwest: StateInfo[];
  West: StateInfo[];
}

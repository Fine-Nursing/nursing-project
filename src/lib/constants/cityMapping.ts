// 미국 주요 도시의 복잡한 주소 매핑
export const CITY_MAPPINGS = {
  // NYC Boroughs
  NY: {
    boroughs: ['Queens', 'Brooklyn', 'Manhattan', 'Bronx', 'Staten Island'],
    mapping: (borough: string) => `New York City - ${borough}`
  },
  
  // LA Neighborhoods  
  CA: {
    losAngeles: ['Hollywood', 'Beverly Hills', 'Santa Monica', 'Pasadena', 'Glendale'],
    sanFrancisco: ['Mission District', 'SOMA', 'Financial District'],
    // Beverly Hills, Santa Monica는 독립 도시지만 LA Metro의 일부
    handleLA: (area: string) => {
      if (['Hollywood', 'Venice', 'Westwood'].includes(area)) {
        return 'Los Angeles';
      }
      return area; // Beverly Hills는 그대로 유지
    }
  },
  
  // DC Metro Area
  DC: {
    metro: ['Bethesda', 'Silver Spring', 'Arlington', 'Alexandria'],
    // DC 자체는 주가 아니므로 특별 처리
    handleDC: (city: string, state: string) => {
      if (!state || state === 'DC') {
        return 'Washington, DC';
      }
      return city;
    }
  },
  
  // Las Vegas Area
  NV: {
    lasVegasArea: ['Paradise', 'Henderson', 'Spring Valley', 'Summerlin'],
    handleVegas: (city: string) => {
      if (['Paradise', 'Spring Valley'].includes(city)) {
        return 'Las Vegas';  // Strip 지역은 Las Vegas로 통합
      }
      return city;
    }
  },
  
  // Chicago Neighborhoods
  IL: {
    chicagoAreas: ['Lincoln Park', 'Hyde Park', 'Loop', 'River North'],
    handleChicago(area: string, hasChicago: boolean) {
      if (hasChicago && this.chicagoAreas.includes(area)) {
        return 'Chicago';
      }
      return area;
    }
  },
  
  // Boston Metro
  MA: {
    bostonMetro: ['Cambridge', 'Somerville', 'Brookline', 'Newton'],
    // Cambridge는 독립 도시이므로 그대로 유지
    handleBoston: (city: string) => city
  },
  
  // Miami-Dade
  FL: {
    miamiDade: ['Coral Gables', 'Hialeah', 'Miami Beach', 'Aventura'],
    handleMiami: (city: string) => 
      // Miami Beach는 독립 도시지만 Miami Metro의 일부
       city
    
  }
};

// 도시명 정규화 함수
export function normalizeCity(
  city: string, 
  state: string, 
  neighborhood?: string,
  county?: string
): string {
  // 빈 값 처리
  if (!city && !neighborhood && !county) {
    return '';
  }
  
  // NYC 처리
  if (state === 'NY' && CITY_MAPPINGS.NY.boroughs.includes(city || neighborhood || '')) {
    return CITY_MAPPINGS.NY.mapping(city || neighborhood || '');
  }
  
  // LA 처리
  if (state === 'CA' && neighborhood) {
    const laResult = CITY_MAPPINGS.CA.handleLA(neighborhood);
    if (laResult !== neighborhood) {
      return laResult;
    }
  }
  
  // Las Vegas 처리
  if (state === 'NV') {
    return CITY_MAPPINGS.NV.handleVegas(city || '');
  }
  
  // DC 처리
  if (state === 'DC' || !state && city === 'Washington') {
    return 'Washington, DC';
  }
  
  // County에서 도시명 추출 (백업)
  if (!city && county) {
    // "Los Angeles County" → "Los Angeles"
    // "Miami-Dade County" → "Miami"
    city = county.replace(' County', '').split('-')[0];
  }
  
  return city || neighborhood || '';
}
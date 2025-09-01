import { useQuery } from '@tanstack/react-query';
import { apiClient } from 'src/lib/axios';

interface SpecialtyWithId {
  id: string;
  name: string;
}

interface SubSpecialty {
  name: string;
}

export const useSpecialties = () => {
  // 모든 specialties 조회 (with ID)
  const getAllSpecialties = useQuery<{ specialties: SpecialtyWithId[] }>({
    queryKey: ['specialties', 'all'],
    queryFn: async () => {
      const response = await apiClient.get('/api/specialties/all');
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1시간 캐싱
  });

  // 특정 specialty의 sub-specialties 조회
  const getSubSpecialties = (specialtyId: string | null) => useQuery<{ subSpecialties: SubSpecialty[] }>({
      queryKey: ['specialties', specialtyId, 'sub-specialties'],
      queryFn: async () => {
        if (!specialtyId) throw new Error('Specialty ID is required');
        const response = await apiClient.get(
          `/api/specialties/${specialtyId}/sub-specialties`
        );
        return response.data;
      },
      enabled: !!specialtyId,
      staleTime: 1000 * 60 * 30, // 30분 캐싱
    });

  return {
    getAllSpecialties,
    getSubSpecialties,
  };
};
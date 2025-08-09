import { useQuery } from '@tanstack/react-query';

interface SpecialtyListResponse {
  specialties: string[];
}

export const useSpecialties = (search?: string) => useQuery<SpecialtyListResponse>({
    queryKey: ['specialties', search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) {
        params.append('search', search);
      }
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BE_URL}/api/specialties/list?${params}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch specialties');
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: true,
  });
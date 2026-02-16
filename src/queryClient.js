import { QueryClient } from '@tanstack/react-query';

/**
 * Enterprise-grade React Query configuration
 * Optimized for Education Malaysia platform
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes before considering it stale
      staleTime: 5 * 60 * 1000,
      
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      
      // Don't refetch on window focus (reduces unnecessary API calls)
      refetchOnWindowFocus: false,
      
      // Retry failed requests once
      retry: 1,
      
      // Don't retry on mount
      refetchOnMount: true,
      
      // Network mode - always fetch when online
      networkMode: 'online',
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      
      // Network mode for mutations
      networkMode: 'online',
    },
  },
});

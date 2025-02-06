import { useState, useEffect, useCallback, useRef } from 'react';
import { usersAPI } from '../api/users';
import debounce from 'lodash/debounce';

// Define the User interface if not already imported
interface User {
  id: number;
  username?: string;
  firstname?: string;
  lastname?: string;
  email: string;
  profilePictureUrl?: string;
}

interface CacheItem<T> {
  data: T[];
  timestamp: number;
}

interface SearchCache {
  [key: string]: CacheItem<User>;
}

interface UseSearchOptions {
  debounceMs?: number;
  cacheTimeout?: number;
  minChars?: number;
}

export const useSearchUsers = (options: UseSearchOptions = {}) => {
  const {
    debounceMs = 300,
    cacheTimeout = 5 * 60 * 1000, // 5 minutes
    minChars = 2
  } = options;

  // Properly type the state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [results, setResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Type the cache ref
  const cache = useRef<SearchCache>({});

  const isCacheValid = useCallback((key: string) => {
    const item = cache.current[key];
    if (!item) return false;
    
    const now = Date.now();
    return now - item.timestamp < cacheTimeout;
  }, [cacheTimeout]);

  const debouncedSearch = useCallback(
    debounce(async (term: string) => {
      if (term.length < minChars) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        if (isCacheValid(term)) {
          setResults(cache.current[term].data);
          setIsLoading(false);
          return;
        }

        const response = await usersAPI.searchUsers(term);
        
        cache.current[term] = {
          data: response.content,
          timestamp: Date.now()
        };

        setResults(response.content);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Search failed'));
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs),
    [debounceMs, minChars, isCacheValid]
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const clearCache = useCallback(() => {
    cache.current = {};
  }, []);

  const updateSearch = useCallback((term: string) => {
    setSearchTerm(term);
    debouncedSearch(term);
  }, [debouncedSearch]);

  return {
    searchTerm,
    results,
    isLoading,
    error,
    updateSearch,
    clearCache
  };
};
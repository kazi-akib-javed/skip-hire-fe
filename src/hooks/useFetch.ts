import { useState, useEffect, useRef } from 'react';

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
  cacheTime?: number;
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const cache = new Map<string, { data: any; timestamp: number }>();

const defaultOptions: Required<Omit<FetchOptions, 'body'>> = {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  cacheTime: 5 * 60 * 1000,
};

const useFetch = <T>(url: string, options: FetchOptions = {}): FetchState<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const optionsRef = useRef(options);

  // Update options ref when options change
  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    const fetchData = async () => {
      // Check cache first
      const cachedData = cache.get(url);
      const now = Date.now();
      const cacheTime = optionsRef.current.cacheTime ?? defaultOptions.cacheTime;
      
      if (cachedData && (now - cachedData.timestamp) < cacheTime) {
        setData(cachedData.data);
        setLoading(false);
        return;
      }

      // Cancel previous request if it exists
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController for this request
      abortControllerRef.current = new AbortController();

      try {
        setLoading(true);
        const response = await fetch(url, {
          ...defaultOptions,
          ...optionsRef.current,
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        cache.set(url, {
          data: result,
          timestamp: now,
        });

        setData(result);
        setError(null);
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          setError(error.message);
          setData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [url]);

  return { data, loading, error };
};

export default useFetch; 
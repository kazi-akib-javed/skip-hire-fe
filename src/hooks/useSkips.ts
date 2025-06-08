import { useMemo } from "react";
import useFetch from "./useFetch";

interface Skip {
  id: number;
  size: number;
  hire_period_days: number;
  transport_cost: number;
  per_tonne_cost: number;
  price_before_vat: number;
  vat: number;
  postcode: string;
  area: string;
  forbidden: boolean;
  created_at: Date;
  updated_at: Date;
  allowed_on_road: boolean;
  allows_heavy_waste: boolean;
}

interface ProcessedSkip {
  id: number;
  size: number;
  allowed_on_road: boolean;
  hirePeriod: string;
  totalPrice: string;
}

interface UseSkipsResult {
  skips: ProcessedSkip[];
  loading: boolean;
  error: string | null;
}

const SKIPS_API_URL =
  "https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft";

const useSkips = (): UseSkipsResult => {
  const { data, loading, error } = useFetch<Skip[]>(SKIPS_API_URL);

  const processedSkips = useMemo(() => {
    if (!data) return [];

    return data.map((skip: Skip) => {
      const vatAmount = (skip.price_before_vat * skip.vat) / 100;
      const totalPrice = skip.price_before_vat + vatAmount;
      return {
        id: skip.id,
        size: skip.size,
        allowed_on_road: skip.allowed_on_road,
        hirePeriod: `Duration: ${skip.hire_period_days} Days`,
        totalPrice: `£${Math.ceil(totalPrice)}`,
      };
    });
  }, [data]);

  return {
    skips: processedSkips,
    loading,
    error,
  };
};

export default useSkips;

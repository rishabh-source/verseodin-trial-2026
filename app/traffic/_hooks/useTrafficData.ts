import { useState, useEffect } from "react";
import type { AiVisit } from "@/lib/types";
import { aggregateVisits, type AggregatedData } from "../_lib/aggregate";

export function useTrafficData() {
  const [data, setData] = useState<AggregatedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/visits.json");
      if (!response.ok) {
        throw new Error("Failed to fetch traffic data");
      }
      const visits: AiVisit[] = await response.json();
      
      const start = performance.now();
      const aggregated = aggregateVisits(visits);
      const end = performance.now();
      console.log(`Aggregation took ${end - start} ms`);
      
      setData(aggregated);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, isLoading, error, retry: fetchData };
}

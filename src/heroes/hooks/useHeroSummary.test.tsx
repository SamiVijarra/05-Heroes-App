import type { PropsWithChildren } from "react";

import { describe, expect, test, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useHeroSummary } from "./useHeroSummary";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import type { SummaryInformationResponse } from "../types/summary-information.response";
import { getSummaryAction } from "../actions/get-summary.action";


vi.mock("../actions/get-summary.action", () => ({
  getSummaryAction: vi.fn(),
    
}));

const mockGetSummaryAction = vi.mocked(getSummaryAction);

const tanStackCustomProvider = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  ) 
}

describe("useHeroSummary", () => {
  test('should return the initial state (isLoading)', () => {
    const { result } = renderHook(() => useHeroSummary(), {
      wrapper: tanStackCustomProvider(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  test('should return success state with data when API call succeeds', async () => {

    const mockSummaryData = {
      totalHeroes: 25,
      strongestHero: {
        id: '1',
        name: 'Clark Kent',
        slug: 'clark-kent',
        alias: 'Superman',
      },
      smartestHero: {
        id: '2',
        name: 'Bruce Wayne',
        slug: 'bruce-wayne',
        alias: 'Batman',
      },
      heroCount: 18,
      villainCount: 7
    } as SummaryInformationResponse;
    

    mockGetSummaryAction.mockResolvedValue(mockSummaryData);

    const { result } = renderHook(() => useHeroSummary(), {
      wrapper: tanStackCustomProvider(),
    });


    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      
    });


    expect(result.current.isError).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(mockGetSummaryAction).toHaveBeenCalled();
  });


  test('should return error state when API call fails', async () => {
    const mockError = new Error('Failed to fetch summary data');

    mockGetSummaryAction.mockRejectedValue(mockError);

    const { result } = renderHook(() => useHeroSummary(), {
      wrapper: tanStackCustomProvider(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error).toBeDefined();
    expect(result.current.isLoading).toBe(false);
    expect(mockGetSummaryAction).toHaveBeenCalled();
    expect(result.current.error?.message).toBe('Failed to fetch summary data');

  });
});
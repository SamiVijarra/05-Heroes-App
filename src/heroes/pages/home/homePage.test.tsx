
import { fireEvent, render, screen } from '@testing-library/react';

import { beforeEach, describe, expect, test, vi } from 'vitest'
import { HomePage } from './homePage';

import { MemoryRouter } from 'react-router';
import { usePaginatedHero } from '@/heroes/hooks/usePaginatedHero';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FavoriteHeroProvider } from '@/heroes/contex/FavoriteHeroContext';

vi.mock('@/heroes/hooks/usePaginatedHero');


const mockUsePaginatedHero = vi.mocked(usePaginatedHero);

mockUsePaginatedHero.mockReturnValue({
  data: [],
  isLoading: false,
  isError: false,
  isSuccess: true,
} as unknown as ReturnType<typeof usePaginatedHero>);

const queryClient = new QueryClient();


const renderHomePage = (initialEntries: string[] = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <FavoriteHeroProvider>
        <QueryClientProvider client={queryClient}>
          <HomePage />
        </QueryClientProvider>
      </FavoriteHeroProvider>
    </MemoryRouter>
  );
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  test('should render the HomePage with default values', () => {
    const { container } = renderHomePage();
    expect(container).toMatchSnapshot();
  });
  test('should call usePaginatedHero with default values', () => {
    renderHomePage();
    expect(mockUsePaginatedHero).toHaveBeenCalledWith(1, 6, 'all');
  });
  test('should call usePaginatedHero custom query params', () => {
    renderHomePage(['/heroes?page=2&limit=12&category=superhero']);
    expect(mockUsePaginatedHero).toHaveBeenCalledWith(2, 12, 'superhero');
  });
  test('should called usePaginatedHero with default page and same limit on tab clicked', () => {
    renderHomePage(['/?tab=favorites&page=2&limit=10']);

    const [, , , villainsTab] = screen.getAllByRole('tab');

    fireEvent.click(villainsTab);

    expect(mockUsePaginatedHero).toHaveBeenLastCalledWith(1, 10, 'villain');

  });
});
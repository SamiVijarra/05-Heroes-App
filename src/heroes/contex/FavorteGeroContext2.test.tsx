import { use } from "react";

import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { FavoriteHeroContext, FavoriteHeroProvider } from "./FavoriteHeroContext";
import type { Hero } from "../types/hero.interface";

const mockHero = {
  id: '1',
  name: 'Batman'
} as Hero;

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
};

Object.defineProperty(window, 'localStorage', { 
  value: localStorageMock
});

const TestComponent = () => {
  const { favorites, favoriteCount, isFavorite, toggleFavorite } = use(FavoriteHeroContext);
  return (
    <div>
      <div data-testid="favorites-count">{favoriteCount}</div>
      <div data-testid="favorite-list">
        {favorites.map((hero) => (
          <div key={hero.id} data-testid={`hero-${hero.id}`}>
            {hero.name}
          </div>
        ))}
      </div>
      <button data-testid="toggle-favorite"
        onClick={() => toggleFavorite(mockHero)}>
        Toggle Favorite
      </button>
      <div data-testid="is-favorite">
        {isFavorite(mockHero).toString()}
      </div>
    </div>);
};


const renderContextTest = () => {
  render(
    <FavoriteHeroProvider>
      <TestComponent />
    </FavoriteHeroProvider>
  );
};

describe("FavoriteHeroContext", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should initialize with default values', () => {
    renderContextTest();

    screen.debug();

    expect(screen.getByTestId('favorites-count').textContent).toBe('0');
    expect(screen.getByTestId('favorite-list').children.length).toBe(0);
  });

  test('should add a hero to favorites when toggleFavorite is called whit new Hero', () => {
    renderContextTest();
    const toggleButton = screen.getByTestId('toggle-favorite');  
    fireEvent.click(toggleButton); 
    expect(screen.getByTestId('favorites-count').textContent).toBe('1');
    expect(screen.getByTestId('is-favorite').textContent).toBe('true');
    expect(screen.getByTestId('hero-1').textContent).toBe('Batman');
    expect(localStorageMock.setItem).toHaveBeenCalled();
    expect(localStorageMock.setItem).toHaveBeenCalledWith('favorite', '[{"id":"1","name":"Batman"}]');
    
  });
  test('should removed hero from favorites when toggleFavorite is called', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([mockHero]));

    renderContextTest();
    expect(screen.getByTestId('favorites-count').textContent).toBe('1');
    expect(screen.getByTestId('is-favorite').textContent).toBe('true');
    expect(screen.getByTestId('hero-1').textContent).toBe('Batman');

    const toggleButton = screen.getByTestId('toggle-favorite');
    fireEvent.click(toggleButton);

    expect(screen.getByTestId('favorites-count').textContent).toBe('0');
    expect(screen.getByTestId('is-favorite').textContent).toBe('false');
    expect(screen.queryByTestId('hero-1')).toBeNull();;

    expect(localStorageMock.setItem).toHaveBeenCalled();
    expect(localStorageMock.setItem).toHaveBeenCalledWith('favorite', '[]');
  });
});
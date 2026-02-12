
import { describe, expect, test, vi } from "vitest";
import { appRouter } from "./app.router";
import { createMemoryRouter, Outlet, RouterProvider, useParams } from "react-router";
import { render, screen } from "@testing-library/react";

vi.mock('@/heroes/pages/home/homePage', () => ({
  HomePage: () => <div data-testid="HomePage">HomePage</div>
}));

vi.mock('@/heroes/layouts/HeroesLayout', () => ({
  HeroesLayout: () => <div data-testid="HeroesLayout">
    <Outlet/>
  </div>
}));

vi.mock('@/heroes/pages/hero/HeroPage', () => ({
  HeroPage: () => {
    const { idSlug = '' } = useParams();
    return (
      <div data-testid="HeroPage">
        HeroPage= {idSlug}
      </div>
    );
  }
}));

vi.mock('@/heroes/pages/search/SearchPage', () => ({
  default: () => <div data-testid="SearchPage"></div>
}));

describe('appRouter', () => {
  test('should be configured as expected', () => {
    expect(appRouter.routes).toMatchSnapshot();
  });

  test('should render home page on root path', () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ['/'],
    });
    render(<RouterProvider router={router} />);

    screen.debug();
    expect(screen.getByTestId('HeroesLayout')).toBeDefined();
    expect(screen.getByTestId('HomePage')).toBeDefined();
  });
  test('should render hero page at /hero/:idSlug path', () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ['/heroes/superman'],
    });
    render(<RouterProvider router={router} />);

    expect(screen.getByTestId('HeroPage').innerHTML).toContain('superman');
  });

  test('should render search page at /search path', async () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ['/search'],
    });
    render(<RouterProvider router={router} />);

    expect(await screen.findByTestId('SearchPage')).toBeDefined();
  });

  test('should redirect to home page for unknown routes', () => {
    const router = createMemoryRouter(appRouter.routes, {
      initialEntries: ['/unknown-route'],
    });
    render(<RouterProvider router={router} />);

    expect(screen.getByTestId('HomePage')).toBeDefined();
  });
});
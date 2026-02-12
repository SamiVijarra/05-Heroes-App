
import { MemoryRouter } from "react-router";
import { describe, expect, test, vi } from "vitest";
import { CustomPagination } from "./CustomPagination";
import { fireEvent, render, screen } from "@testing-library/react";
import type { PropsWithChildren } from "react";


vi.mock('../ui/button', () => ({
  Button: ({ children, ...props }: PropsWithChildren) => (
    <button {...props}>
      {children}
    </button>
  )
}));


const renderWithRouter = (
  component: React.ReactElement,
  initialEntries?: string[],
) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  );
};

describe('CustomPagination', () => {
  test('should render component with default values', () => {
    renderWithRouter(<CustomPagination totalPages={5} />);

    expect(screen.getByText('Previous')).toBeDefined();
    expect(screen.getByText('Next')).toBeDefined();
    expect(screen.getByText('1')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
    expect(screen.getByText('3')).toBeDefined();
    expect(screen.getByText('4')).toBeDefined();
    expect(screen.getByText('5')).toBeDefined();
  });
  test('should disable Previous button when page is 1', () => {
    renderWithRouter(<CustomPagination totalPages={5} />);

    const previousButton = screen.getByText('Previous');
    expect(previousButton.getAttributeNames()).toContain('disabled');

  });
  test('should disable Next button when we are in the last page', () => {
    renderWithRouter(<CustomPagination totalPages={5} />, ['/?page=5']);

    const nextButton = screen.getByText('Next');

    expect(nextButton.getAttributeNames()).toContain('disabled');

  });
  test('should disable button 3 when we are in page 3', () => {
    renderWithRouter(<CustomPagination totalPages={5} />, ['/?page=3']);

    const button2 = screen.getByText('2');
    const button3 = screen.getByText('3');
    
    
    expect(button2.getAttribute('variant')).toBe('outline');
    expect(button3.getAttribute('variant')).toBe('default');

  });
  test('shpuld change page when click on number button', () => {
    renderWithRouter(<CustomPagination totalPages={5} />, ['/?page=4']);

    const button3 = screen.getByText('3');
    const button4 = screen.getByText('4');

    expect(button3.getAttribute('variant')).toBe('outline');
    expect(button4.getAttribute('variant')).toBe('default');

    fireEvent.click(button3);
    expect(button3.getAttribute('variant')).toBe('default');
    expect(button4.getAttribute('variant')).toBe('outline');
    //button4.click();
    //expect(window.location.search).toBe('?page=4');
  });
});
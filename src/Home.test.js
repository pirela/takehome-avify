import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { Home } from './Home';
import { Bar } from './components/Bar';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('./components/Bar', () => ({
  Bar: jest.fn(() => <div>Bar Chart</div>),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({
      data: {
        from: '2022-01-01T00:00:00Z',
        to: '2022-01-02T00:00:00Z',
        generationmix: [
          { fuel: 'coal', perc: 20 },
          { fuel: 'gas', perc: 30 },
          { fuel: 'nuclear', perc: 50 },
        ],
      },
    }),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

test('renders Home component', async () => {
  const mockData = {
    data: {
      from: '2022-01-01T00:00:00Z',
      to: '2022-01-02T00:00:00Z',
      generationmix: [
        { fuel: 'coal', perc: 20 },
        { fuel: 'gas', perc: 30 },
        { fuel: 'nuclear', perc: 50 },
      ],
    },
  };

  useQuery.mockReturnValue({
    data: mockData,
    isLoading: false,
  });

  render(<Home />);

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

  expect(screen.getByText('UK Energy Mix')).toBeInTheDocument();
  expect(screen.getByText(/Periodo de data consulta desde/)).toBeInTheDocument();
  expect(screen.getByText('Bar Chart')).toBeInTheDocument();
});
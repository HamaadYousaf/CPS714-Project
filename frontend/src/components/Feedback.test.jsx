import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import FeedbackDashboard from './Feedback';

// Mock fetch globally
global.fetch = jest.fn();

describe('FeedbackDashboard', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial state correctly', () => {
    render(<FeedbackDashboard />);
    
    expect(screen.getByText(/Your Points/i)).toBeInTheDocument();
    expect(screen.getByText(/Generate Feedback Summary/i)).toBeInTheDocument();
    expect(screen.getByText(/Earn more points by providing feedback!/i)).toBeInTheDocument();
  });

  it('displays loading state while fetching points', async () => {
    // Mock the fetch response
    global.fetch.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<FeedbackDashboard />);

    // Check if loading indicator is present
    expect(screen.getByTestId('points-loading')).toBeInTheDocument();
  });

  it('displays points when fetch is successful', async () => {
    // Mock successful points fetch
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ points_balance: 100 }])
      })
    );

    render(<FeedbackDashboard />);

    // Wait for points to be displayed
    await waitFor(() => {
      expect(screen.getByText('100 points')).toBeInTheDocument();
    });
  });

  it('handles points fetch error gracefully', async () => {
    // Mock fetch error
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('API Error'))
    );

    // Spy on console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<FeedbackDashboard />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
      expect(screen.getByText('- points')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('handles summary generation button click', async () => {
    // Mock successful summary fetch
    global.fetch.mockImplementationOnce(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true, summary: 'Test summary' })
      })
    );

    render(<FeedbackDashboard />);

    // Click the generate summary button
    const summaryButton = screen.getByText(/Generate Feedback Summary/i);
    fireEvent.click(summaryButton);

    // Check loading state
    expect(screen.getByText(/Generating Summary.../i)).toBeInTheDocument();

    // Wait for summary to be displayed
    await waitFor(() => {
      expect(screen.getByText('Test summary')).toBeInTheDocument();
    });
  });

  it('handles summary fetch error gracefully', async () => {
    // Mock fetch error for summary
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Summary API Error'))
    );

    // Spy on console.error
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<FeedbackDashboard />);

    // Click the generate summary button
    const summaryButton = screen.getByText(/Generate Feedback Summary/i);
    fireEvent.click(summaryButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('uses provided userId prop correctly', async () => {
    const testUserId = 2;
    
    render(<FeedbackDashboard userId={testUserId} />);

    // Verify the fetch call uses the correct userId
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(`user_id=eq.${testUserId}`),
      expect.any(Object)
    );
  });
});
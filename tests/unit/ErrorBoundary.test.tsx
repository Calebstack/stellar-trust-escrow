import React from 'react'
import { render, screen, fireEvent } from '@testing-library/reacti'
import ErrorBoundary from '@/components/ErrorBoundary'
import * as Sentry from '@sentry/nextjs'

jest.mock('@sentry/nextjs', () => ({
  captureException: jest.fn(),
  showReportDialog: jest.fn(),
}))

let consoleErrorSpy: jest.SpyInstance | undefined

beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
})

afterEach(() => {
  consoleErrorSpy?.mockRestore()
})

const ThrowingComponent = () => {
  throw new Error('Test boom error')
}

const StableComponent = () => <div>Stable content</div>

describe('ErrorBoundary', () => {
  it('renders fallback when a child throws', () => {
    render(<ErrorBoundary context="test"><ThrowingComponent /></ErrorBoundary>)
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Test boom error')).toBeInTheDocument()
  })

  it('calls Sentry.captureException with structured tags', () => {
    render(<ErrorBoundary context="test-detail"><ThrowingComponent /></ErrorBoundary>)
    expect(Sentry.captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        tags: expect.objectContaining({}),
        extra: expect.objectContaining({ componentStack: expect.any(String) }),
      })
    )
  })

  it('restores UI after retry if child no longer throws', () => {
    const { rerender } = render(
      <ErrorBoundary context="test"><ThrowingComponent /></ErrorBoundary>
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()

    rerender(
      <ErrorBoundary context="test"><StableComponent /></ErrorBoundary>
    )
    fireEvent.click(screen.getByText('Try again'))
    expect(screen.getByText('Stable content')).toBeInTheDocument()
  })

  it('does not show error message in production', () => {
    const oldEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    try {
      render(<ErrorBoundary context="test"><ThrowingComponent /></ErrorBoundary>)
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.queryByText('Test boom error')).not.toBeInTheDocument()
    } finally {
      process.env.NODE_ENV = oldEnv
    }
  })
})

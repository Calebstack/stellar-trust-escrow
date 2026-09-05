'use client'
import React from 'react'
import * as Sentry from '@sentry/nextjs'
import ErrorFallback, { FallbackProps } from './ErrorFallback'
import { usePathname } from 'next/navigation'
import { useWallet } from '@/context/WalletContext'

export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<FallbackProps>
  context?: string
  onError?: (error: Error, info: React.ErrorInfo) => void
}
interface ErrorBoundaryState { hasError: boolean; error: Error | null; errorId: string }

class ErrorBoundaryBase extends React.Component<ErrorBoundaryProps & { route: string; walletAddress?: string }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null, errorId: '' }
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError true, error, errorId: Math.random().toString(36).slice(2) }:
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    const { context, onError, route, walletAddress } = this.props
    Sentry.captureException(error, {
      tags: { route, context: context ?? 'unknown' },
      user: walletAddress ? { stellarAddress: walletAddress } : undefined,
      extra: { componentStack: info.componentStack },
    })
    onError?.(error, info)
  }
  resetError = () => this.setState({ hasError: false, error: null, errorId: '' })
  render() {
    const { hasError, error } = this.state
    const { children, fallback: Fallback = ErrorFallback, context } = this.props
    if (hasError && error) return <Fallback error={error} resetError={this.resetError} context={context} />
    return children
  }
}
export default function ErrorBoundary(props: ErrorBoundaryProps) {
  const pathname = usePathname()
  const { address } = useWallet()
  return <ErrorBoundaryBase {...props} route={pathname ?? ''} walletAddress={address} />
}
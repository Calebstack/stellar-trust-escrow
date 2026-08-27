import ErrorBoundary from '@/components/ErrorBoundary'

export default function EscrowDetailPage() {
  return (
    <ErrorBoundary context="escrow-detail">
      <div>Escrow Detail Page</div>
    </ErrorBoundary>
  )
}
import ErrorBoundary from '@/components/ErrorBoundary'

export default function NewEscrowPage() {
  return (
    <ErrorBoundary context="escrow-create">
      <div>New Escrow Page</div>
    </ErrorBoundary>
  )
}

import ErrorBoundary from '@/components/ErrorBoundary'

export default function AdminDashboardPage() {
  return (
    <ErrorBoundary context="admin-dashboard">
      <div>Admin Dashboard Page</div>
    </ErrorBoundary>
  )
}
import { Link } from 'react-router-dom'
import { PageCard, Skeleton } from '../components/ui'

export function LoadingPage() {
  return (
    <div className="center-page">
      <PageCard>
        <h2>Loading</h2>
        <Skeleton className="skeleton-lg" />
        <Skeleton />
        <Skeleton />
      </PageCard>
    </div>
  )
}

export function ErrorPage() {
  return (
    <div className="center-page">
      <PageCard>
        <h2>Something went wrong</h2>
        <p>Please retry. If this keeps happening, contact support.</p>
        <Link to="/home" className="link-btn">
          Back Home
        </Link>
      </PageCard>
    </div>
  )
}

export function NotFoundPage() {
  return (
    <div className="center-page">
      <PageCard>
        <h2>Page not found</h2>
        <p>The page you requested does not exist.</p>
        <Link to="/home" className="link-btn">
          Go Home
        </Link>
      </PageCard>
    </div>
  )
}

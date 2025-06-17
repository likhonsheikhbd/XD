import { CodingAssistant } from '@/components/coding-assistant'
import { ErrorBoundary } from '@/components/error-boundary'

export default function Home() {
  return (
    <ErrorBoundary>
      <main className="h-screen overflow-hidden">
        <CodingAssistant />
      </main>
    </ErrorBoundary>
  )
}
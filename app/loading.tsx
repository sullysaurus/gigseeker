export default function Loading() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="border-brutalist p-8 shadow-brutalist max-w-md w-full">
        <div className="space-y-4">
          <div className="h-12 bg-gray-100 animate-pulse"></div>
          <div className="h-12 bg-gray-100 animate-pulse"></div>
          <div className="h-12 bg-gray-100 animate-pulse"></div>
        </div>
      </div>
    </main>
  )
}

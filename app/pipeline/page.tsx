export default function PipelinePage() {
  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-4xl font-black">MY PIPELINE</h1>
          <div className="flex gap-4 items-center">
            <div className="border-brutalist px-4 py-2">
              <span className="font-bold">CREDITS:</span>{' '}
              <span className="font-mono text-2xl">10</span>
            </div>
            <button className="border-brutalist bg-black text-white px-6 py-2 font-bold hover:bg-white hover:text-black transition-colors">
              + ADD VENUE
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {['DISCOVERED', 'READY', 'SENT', 'OPENED', 'RESPONDED', 'BOOKED'].map(
            (column) => (
              <div key={column} className="border-brutalist p-4">
                <h2 className="font-black mb-4">{column}</h2>
                <div className="text-center text-gray-400 py-8">
                  <p className="text-sm">No venues yet</p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </main>
  )
}

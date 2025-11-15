export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="border-brutalist p-8 shadow-brutalist max-w-md w-full">
        <h1 className="text-4xl font-black mb-6">SIGN UP</h1>
        <p className="mb-6">Get 10 free credits to start booking gigs.</p>
        <form className="space-y-4">
          <div>
            <label className="block font-bold mb-2">EMAIL</label>
            <input
              type="email"
              className="w-full border-brutalist p-3 font-mono"
              placeholder="your@email.com"
            />
          </div>
          <button
            type="submit"
            className="w-full border-brutalist bg-black text-white py-4 font-bold hover:bg-white hover:text-black transition-colors"
          >
            SEND MAGIC LINK
          </button>
        </form>
        <p className="mt-4 text-sm">
          Have an account?{' '}
          <a href="/sign-in" className="underline font-bold">
            Sign in
          </a>
        </p>
      </div>
    </main>
  )
}

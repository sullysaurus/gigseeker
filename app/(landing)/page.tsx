import Link from "next/link";
import Image from "next/image";
import {
  Users,
  ArrowRight,
  Heart,
} from "lucide-react";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { StructuredData } from "@/components/seo/structured-data";
import { createOrganizationSchema, createWebSiteSchema } from "@/lib/seo/metadata";
import { MusicianCard } from "@/components/musicians/musician-card";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const supabase = await getSupabaseServerClient();

  // Check if user is authenticated
  const session = supabase
    ? (await supabase.auth.getSession()).data.session
    : null;
  const isAuthenticated = !!session;

  // Helper function to get link - redirect to sign-up if not authenticated
  const getLink = (href: string) => isAuthenticated ? href : "/sign-up";

  // Default to empty arrays and null counts if no supabase client
  let recentDrummers = null;
  let drummerCount = null;

  if (supabase) {
    // Fetch recent drummers (6 most recent)
    const drummersResult = await supabase
      .from("profiles")
      .select("username, display_name, bio, experience_level, genres, seeking, location_city, location_state, location_country, avatar_url, youtube_url, updated_at, is_quick_responder, last_seen_at, desert_island_record, user_type")
      .eq("user_type", "drummer")
      .eq("is_profile_visible", true)
      .order("updated_at", { ascending: false })
      .limit(6);
    recentDrummers = drummersResult.data;

    // Get total counts
    const drummerCountResult = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("user_type", "drummer")
      .eq("is_profile_visible", true);
    drummerCount = drummerCountResult.count;
  }

  return (
    <>
      <StructuredData data={[createOrganizationSchema(), createWebSiteSchema()]} />

      <main className="min-h-screen bg-brutal-white">
        {/* Hero Section */}
        <section className="border-b-4 border-brutal-black bg-brutal-purple text-white">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: Text */}
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase leading-tight mb-6">
                  FIND
                  <br />
                  <span className="text-brutal-orange">DRUMMERS</span>
                </h1>
                <p className="text-xl sm:text-2xl font-bold text-white/90 mb-8">
                  Search drummer profiles. Save favorites. Build your network.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 mb-8 max-w-xs">
                  <div className="bg-white/10 border-2 border-white p-6">
                    <div className="text-4xl font-black text-white">{drummerCount || "0"}</div>
                    <div className="text-sm font-bold text-white/80 uppercase">Active Drummers</div>
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/sign-up"
                    className="bg-brutal-orange text-brutal-black px-8 py-4 text-lg font-black uppercase border-4 border-brutal-black hover:translate-x-1 hover:translate-y-1 transition-transform shadow-[8px_8px_0px_hsl(var(--brutal-black))] text-center"
                  >
                    JOIN FREE
                  </Link>
                  <Link
                    href="/sign-in"
                    className="bg-brutal-white text-brutal-black px-8 py-4 text-lg font-black uppercase border-4 border-brutal-black hover:translate-x-1 hover:translate-y-1 transition-transform shadow-[8px_8px_0px_hsl(var(--brutal-black))] text-center"
                  >
                    SIGN IN
                  </Link>
                </div>
              </div>

              {/* Right: Animated Logo */}
              <div className="relative aspect-square border-4 border-brutal-black shadow-[12px_12px_0px_hsl(var(--brutal-black))] bg-white flex items-center justify-center">
                <div className="relative w-[78%] h-[78%]">
                  <Image
                    src="/logo.gif"
                    alt="DrumSeeker animated logo"
                    fill
                    className="object-contain"
                    priority
                    unoptimized
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="border-b-4 border-brutal-black py-12 bg-brutal-lime">
          <div className="container max-w-5xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-brutal-black text-center mb-12">
              SUPER SIMPLE
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Feature 1: Find Drummers */}
              <Link
                href={getLink("/drummers")}
                className="bg-brutal-cyan border-4 border-brutal-black p-8 hover:translate-x-1 hover:translate-y-1 transition-transform shadow-[4px_4px_0px_hsl(var(--brutal-black))] group"
              >
                <div className="h-16 w-16 border-2 border-brutal-black bg-white flex items-center justify-center mb-6 mx-auto">
                  <Users className="h-8 w-8 text-brutal-black" />
                </div>
                <h3 className="text-2xl font-black uppercase mb-3 text-center">SEARCH DRUMMERS</h3>
                <p className="text-sm font-bold text-brutal-black/80 mb-6 text-center">
                  Find drummers by location, genre, and experience level
                </p>
                <div className="flex items-center justify-center text-sm font-bold text-brutal-purple group-hover:translate-x-1 transition-transform">
                  Start Searching <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </Link>

              {/* Feature 2: Favorites */}
              <div className="bg-brutal-pink border-4 border-brutal-black p-8 shadow-[4px_4px_0px_hsl(var(--brutal-black))]">
                <div className="h-16 w-16 border-2 border-brutal-black bg-white flex items-center justify-center mb-6 mx-auto">
                  <Heart className="h-8 w-8 text-brutal-black" />
                </div>
                <h3 className="text-2xl font-black uppercase mb-3 text-center">SAVE FAVORITES</h3>
                <p className="text-sm font-bold text-brutal-black/80 text-center">
                  Bookmark drummers you want to remember and contact later
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Drummers */}
        {recentDrummers && recentDrummers.length > 0 && (
          <section className="border-b-4 border-brutal-black py-12 bg-brutal-white">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl sm:text-4xl font-black uppercase text-brutal-black">
                  ACTIVE DRUMMERS
                </h2>
                <Link
                  href={getLink("/drummers")}
                  className="text-sm font-bold text-brutal-purple uppercase hover:underline flex items-center gap-2"
                >
                  VIEW ALL
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentDrummers.map((drummer) => (
                  <MusicianCard
                    key={drummer.username}
                    profile={drummer}
                    isAuthenticated={isAuthenticated}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Final CTA */}
        <section className="py-16 bg-brutal-purple text-white">
          <div className="container max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-4xl sm:text-5xl font-black uppercase mb-6">
              CREATE YOUR PROFILE
            </h2>
            <p className="text-xl font-bold text-white/90 mb-8">
              Join {drummerCount || "hundreds of"} drummers already on DrumSeeker
            </p>
            <Link
              href="/sign-up"
              className="inline-block bg-brutal-orange text-brutal-black px-12 py-5 text-xl font-black uppercase border-4 border-brutal-black hover:translate-x-1 hover:translate-y-1 transition-transform shadow-[12px_12px_0px_hsl(var(--brutal-black))]"
            >
              JOIN FREE NOW
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

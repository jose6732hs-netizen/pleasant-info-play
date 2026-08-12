import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getActiveArtists, Artist, getPages } from "@/lib/cms.functions";
import { cn } from "@/lib/utils";
import { ArtistsPageConfig } from "@/components/admin/ArtistsPageEditor";

export const Route = createFileRoute("/artistas/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData({
        queryKey: ["active-artists"],
        queryFn: () => getActiveArtists(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["pages"],
        queryFn: () => getPages(),
      }),
    ]);
  },
  component: ArtistsList,
});

function ArtistsList() {
  const { data: artists } = useSuspenseQuery({
    queryKey: ["active-artists"],
    queryFn: () => getActiveArtists(),
  });

  const { data: pages } = useSuspenseQuery({
    queryKey: ["pages"],
    queryFn: () => getPages(),
  });

  const config: ArtistsPageConfig = pages?.find(p => p.id === 'artistas')?.config || {
    title: "NOSSOS TALENTOS",
    subtitle: "Representamos artistas que transcendem fronteiras.",
    columnsDesktop: 3,
    columnsTablet: 2,
    showGenre: true,
    showCity: true,
    showViewButton: true,
    showBookingButton: true,
    showFeaturedFirst: true,
    cardStyle: 'glass',
    background: 'black'
  };

  const featuredArtists = artists?.filter(a => a.featured) || [];
  const regularArtists = artists?.filter(a => !a.featured) || [];

  return (
    <div className={cn(
      "min-h-screen pt-32 pb-24",
      config.background === 'graphite' ? "bg-neutral-900" : "bg-black"
    )}>
      <div className="container mx-auto px-6 space-y-24">
        {/* Header Section */}
        <header className="space-y-6 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: config.title }} />
          <p className="text-neutral-400 text-lg md:text-xl font-medium max-w-2xl prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: config.subtitle }} />
        </header>

        {/* Featured Section */}
        {featuredArtists.length > 0 && (
          <section className="space-y-12">
            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Destaques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} featured />
              ))}
            </div>
          </section>
        )}

        {/* Regular Casting */}
        <section className="space-y-12">
          <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30">Casting Completo</h2>
          {regularArtists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {regularArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            featuredArtists.length === 0 && (
              <div className="py-24 text-center border border-dashed border-white/10 rounded-sm">
                <p className="text-neutral-600 text-[10px] font-bold uppercase tracking-widest">Nenhum artista cadastrado no momento.</p>
              </div>
            )
          )}
        </section>
      </div>
    </div>
  );
}

function ArtistCard({ artist, featured = false }: { artist: Artist, featured?: boolean }) {
  return (
    <Link 
      to="/artistas/$slug" 
      params={{ slug: artist.slug }}
      className={cn(
        "group relative block overflow-hidden bg-neutral-900 border border-white/5",
        featured ? "aspect-[16/9] md:aspect-auto md:h-[600px]" : "aspect-[3/4]"
      )}
    >
      <img 
        src={artist.photo_url || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop"} 
        alt={artist.name}
        className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
      
      {/* Content */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end gap-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <div className="space-y-1">
          <span className="text-[9px] font-black uppercase tracking-widest text-white/50">{artist.genre}</span>
          <h3 className={cn(
            "font-black tracking-tighter uppercase leading-none",
            featured ? "text-4xl md:text-6xl" : "text-3xl"
          )}>
            {artist.name}
          </h3>
          <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">{artist.city}, {artist.state}</p>
        </div>
        
        {/* Hover elements */}
        <div className="pt-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          <span className="bg-white text-black px-6 py-3 text-[9px] font-black uppercase tracking-widest">VER ARTISTA</span>
          <span className="text-[9px] font-black uppercase tracking-widest border border-white/20 px-6 py-3 hover:bg-white hover:text-black transition">CONTRATAR</span>
        </div>
      </div>
    </Link>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getArtistBySlug } from "@/lib/cms.functions";
import { ArtistProfile } from "@/components/ArtistProfile";

export const Route = createFileRoute("/artistas/$slug")({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["artist-profile", params.slug],
      queryFn: () => getArtistBySlug({ data: params.slug }),
    });
  },
  component: ArtistDetail,
});

function ArtistDetail() {
  const { slug } = Route.useParams();
  const { data: profile } = useSuspenseQuery({
    queryKey: ["artist-profile", slug],
    queryFn: () => getArtistBySlug({ data: slug }),
  });

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter">Artista não encontrado</h1>
          <a href="/" className="text-xs uppercase tracking-widest text-neutral-500 hover:text-white transition">Voltar para o início</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Cinematic Header for Individual Page */}
      <header className="fixed w-full p-6 flex justify-between items-center z-[60] mix-blend-difference pointer-events-none">
        <a href="/" className="text-2xl font-black tracking-tighter pointer-events-auto">064</a>
        <button className="bg-white text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-neutral-200 transition pointer-events-auto">
          CONTRATAR
        </button>
      </header>
      
      <main>
        <ArtistProfile 
          artist={profile.artist} 
          videos={profile.videos} 
          gallery={profile.gallery} 
        />
      </main>
    </div>
  );
}

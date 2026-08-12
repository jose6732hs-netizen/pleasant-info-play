import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowDown, Instagram, Mail, Phone, Users, Calendar, Award, Star, Youtube, Facebook } from "lucide-react";
import { getSiteContent, getActiveArtists } from "@/lib/cms.functions";
import { useState, useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { IntroAnimation } from "@/components/IntroAnimation";
import { BookingModal } from "@/components/BookingModal";
import logoAsset from "@/assets/logo-completa.png.asset.json";
import { captureClick } from "@/lib/analytics-client";
import { useTracking } from "@/hooks/use-tracking";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData({
        queryKey: ["site-content"],
        queryFn: () => getSiteContent(),
      }),
      context.queryClient.ensureQueryData({
        queryKey: ["active-artists"],
        queryFn: () => getActiveArtists(),
      }),
    ]);
  },
  component: Index,
});

function Index() {
  useTracking();
  const { data: contentData } = useSuspenseQuery({
    queryKey: ["site-content"],
    queryFn: () => getSiteContent(),
  });

  const { data: artists } = useSuspenseQuery({
    queryKey: ["active-artists"],
    queryFn: () => getActiveArtists(),
  });

  const [showIntro, setShowIntro] = useState(true);
  
  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedArtistId, setSelectedArtistId] = useState<string | undefined>(undefined);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openBooking = (artistId?: string) => {
    setSelectedArtistId(artistId);
    setIsBookingModalOpen(true);
    captureClick("Abrir Modal de Booking", "booking-modal-trigger", { artistId });
  };

  const renderSection = (section: any) => {
    const { content, styles } = section;
    const isVisible = styles?.isVisible !== false;

    if (!isVisible) return null;

    const sectionStyle = {
      paddingTop: `${styles?.paddingTop ?? 80}px`,
      paddingBottom: `${styles?.paddingBottom ?? 80}px`,
      backgroundColor: styles?.backgroundType === 'color' 
        ? (styles.backgroundColor === 'graphite' ? '#1a1a1a' : styles.backgroundColor === 'white' ? '#ffffff' : '#000000')
        : undefined,
      backgroundImage: styles?.backgroundType === 'image' && styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: styles?.sectionHeight === 'viewport' ? '100vh' : 
                 styles?.sectionHeight === 'large' ? '80vh' :
                 styles?.sectionHeight === 'medium' ? '60vh' :
                 styles?.sectionHeight === 'small' ? '40vh' : 'auto',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      position: 'relative' as const,
    };

    const containerClass = cn(
      "container mx-auto px-6 relative z-10",
      styles?.contentWidth === 'wide' ? "max-w-7xl" : 
      styles?.contentWidth === 'full' ? "max-w-none" : "max-w-5xl",
      styles?.alignment === 'center' ? "text-center" :
      styles?.alignment === 'right' ? "text-right" : "text-left"
    );

    const overlay = styles?.backgroundOverlay && (
      <div 
        className="absolute inset-0 bg-black pointer-events-none z-0" 
        style={{ opacity: (styles.overlayOpacity ?? 40) / 100 }} 
      />
    );

    switch (section.section_name) {
      case 'hero':
        return (
          <section key="hero" id="inicio" style={sectionStyle}>
            <div className="absolute inset-0 z-0">
              {content.video_url ? (
                content.video_url.includes('youtube') || content.video_url.includes('vimeo') ? (
                  <iframe
                    src={content.video_url.includes('youtube') ? `https://www.youtube.com/embed/${content.video_url.split('v=')[1]}?autoplay=1&mute=1&loop=1&controls=0` : content.video_url}
                    className="w-full h-full object-cover opacity-30 pointer-events-none"
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                  />
                ) : (
                  <video 
                    src={content.video_url} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className="w-full h-full object-cover opacity-30"
                  />
                )
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/60 via-neutral-950/20 to-neutral-950"></div>
              )}
            </div>
            {overlay}
            <div className={containerClass}>
              <div className="space-y-6">
                <div className="flex justify-center mb-8">
                  <img src={logoAsset.url} alt="064 TALENTS" className="w-full max-w-[500px] h-auto object-contain" />
                </div>
                <div className="text-lg md:text-xl font-light uppercase tracking-[0.3em] text-neutral-300 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content.subtitle || "Artist Booking & Entertainment" }} />
                <div className="text-md font-bold uppercase tracking-widest pt-4 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content.description || "Representando talentos. Criando conexões." }} />

                <div className="flex gap-4 justify-center pt-8">
                  <button onClick={() => openBooking()} className="border border-white/20 hover:bg-white hover:text-black px-8 py-3 rounded-full uppercase text-xs font-bold tracking-widest transition">
                    Contrate um artista
                  </button>
                  <button className="bg-white text-black px-8 py-3 rounded-full uppercase text-xs font-bold tracking-widest hover:bg-neutral-200 transition">
                    Conheça a 064
                  </button>
                </div>
                {content.complementary && (
                  <div className="text-xs uppercase tracking-[0.4em] text-neutral-500 pt-8 opacity-50 prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content.complementary }} />
                )}
              </div>
            </div>
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
              <ArrowDown className="w-6 h-6 text-white/50" />
            </div>
          </section>
        );
      case 'about':
        return (
          <section key="about" id="sobre" style={sectionStyle}>
            {overlay}
            <div className={containerClass}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
                <div className="space-y-8">
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tighter leading-tight uppercase prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content.title || "MAIS DO QUE BOOKING." }} />
                  <div className="text-neutral-400 leading-relaxed text-lg prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content.text || "A 064 TALENTS é uma empresa de Artist Booking & Entertainment..." }} />
                  <div className="text-2xl font-bold uppercase italic tracking-wider text-white prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content.highlight || "DO GOIÁS PRO MUNDO." }} />
                </div>
                <div className="aspect-[4/5] bg-neutral-800 rounded-sm overflow-hidden shadow-2xl group">
                   <img 
                    src={content.image_url || "https://images.unsplash.com/photo-1547478011-8a30602558a3?q=80&w=1500&auto=format&fit=crop"} 
                    alt="Stage" 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-700" 
                  />
                </div>
              </div>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  const navConfig = (contentData as any)?.find((p: any) => p.id === 'global_nav')?.config;
  const designConfig = (contentData as any)?.find((p: any) => p.id === 'global_design')?.config;
  
  const designStyles = useMemo(() => {
    if (!designConfig) return {};
    const { colors, typography, buttons, cards } = designConfig;
    return {
      '--primary': colors.primary,
      '--secondary': colors.secondary,
      '--background': colors.background,
      '--text': colors.text,
      '--text-secondary': colors.textSecondary,
      '--accent': colors.accent,
      '--font-title': typography.titleFont,
      '--font-text': typography.textFont,
      '--base-size': `${typography.baseSize}px`,
      '--title-weight': typography.titleWeight,
      '--letter-spacing': typography.letterSpacing,
      '--btn-radius': `${buttons.radius}px`,
      '--btn-height': `${buttons.height}px`,
      '--btn-padding': `0 ${buttons.padding}px`,
      '--card-radius': `${cards.radius}px`,
      '--card-border': cards.border ? '1px solid rgba(255,255,255,0.1)' : 'none',
      '--card-shadow': cards.shadow ? '0 10px 30px -10px rgba(0,0,0,0.5)' : 'none',
    } as React.CSSProperties;
  }, [designConfig]);
  const menu = navConfig?.menu || {
    logo: logoAsset.url,
    links: [
      { id: '1', label: 'INÍCIO', url: '#inicio', active: true },
      { id: '2', label: 'ARTISTAS', url: '#artistas', active: true },
      { id: '3', label: 'SERVIÇOS', url: '#servicos', active: true },
      { id: '4', label: 'SOBRE', url: '#sobre', active: true },
      { id: '5', label: 'CONTATO', url: '#contato', active: true },
    ],
    showBookingButton: true,
    bookingButtonText: 'CONTRATAR',
    bookingButtonUrl: '#contratar'
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-white selection:text-black" style={designStyles as any}>
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}

      {/* Header */}
      <header className={`fixed w-full p-3 md:p-4 flex justify-between items-center z-50 backdrop-blur-md bg-neutral-950/80 border-b border-white/5 transition-all duration-500 ${scrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="flex items-center">
          <img src={menu.logo} alt="064 TALENTS" className="h-8 md:h-10 w-auto object-contain" />
        </div>
        <nav className="hidden md:flex gap-8 text-xs font-semibold uppercase tracking-widest text-neutral-400">
          {menu.links.filter((l: any) => l.active).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)).map((link: any) => (
            <a key={link.id} href={link.url} className="hover:text-white transition" onClick={() => captureClick(window.location.pathname, `Nav: ${link.label}`, `nav-${link.id}`)}>
              {link.label}
            </a>
          ))}
        </nav>
        {menu.showBookingButton && (
          <button onClick={() => openBooking()} className="bg-white text-black px-6 py-2 rounded-full text-xs font-bold uppercase hover:bg-neutral-200 transition">
            {menu.bookingButtonText}
          </button>
        )}
      </header>

      <main>
        {contentData?.map((section: any) => renderSection(section))}

        {/* Artists Section */}
        <section id="artistas" className="py-24 px-6 md:px-20 bg-neutral-950">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Talentos</h2>
              <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">Conheça o casting oficial 064 Talents.</p>
            </div>

            {artists?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {artists.map((artist: any) => (
                  <Link 
                    to={`/artistas/${artist.slug || artist.id}` as any} 
                    key={artist.id} 
                    className="group relative aspect-[3/4] overflow-hidden bg-neutral-900 rounded-sm block"
                    onClick={() => captureClick(`Ver Artista: ${artist.name}`, "artist-card-click", { artistId: artist.id })}
                  >
                    <img 
                      src={artist.photo_url || "https://images.unsplash.com/photo-1547478011-8a30602558a3?q=80&w=1500&auto=format&fit=crop"} 
                      alt={artist.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                    <div className="absolute bottom-0 left-0 p-8 w-full space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">{artist.genre}</div>
                      <h3 className="text-3xl font-black tracking-tighter uppercase">{artist.name}</h3>
                      <div className="flex gap-4 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        <button className="bg-white text-black px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-neutral-200">
                          Ver Artista
                        </button>
                        <button 
                          onClick={(e) => { e.preventDefault(); openBooking(artist.id); }}
                          className="border border-white/20 text-white px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-white hover:text-black"
                        >
                          Solicitar Data
                        </button>
                      </div>
                    </div>
                    </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 border border-dashed border-white/5 rounded-sm">
                <p className="text-neutral-600 text-xs uppercase tracking-widest">Nenhum artista cadastrado no momento.</p>
              </div>
            )}
          </div>
        </section>

        {/* Services Section */}
        <section id="servicos" className="py-24 px-6 md:px-20 bg-neutral-950">
           <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-16 text-center uppercase">
                O TALENTO É DO ARTISTA.<br />
                <span className="text-neutral-600">A CONEXÃO É NOSSA.</span>
              </h2>
              <div className="grid md:grid-cols-4 gap-6">
                 {[
                   { title: "Booking Artístico", icon: Calendar },
                   { title: "Representação", icon: Users },
                   { title: "Gestão", icon: Award },
                   { title: "Negociação", icon: Star },
                   { title: "Produção", icon: Users },
                   { title: "Curadoria", icon: Star },
                   { title: "Eventos", icon: Calendar },
                   { title: "Parcerias", icon: Award }
                 ].map((service, i) => (
                   <div key={i} className="p-8 border border-white/5 bg-neutral-900/50 hover:bg-neutral-800/50 transition cursor-default">
                      <service.icon className="w-8 h-8 text-white mb-6 opacity-50" />
                      <h3 className="font-bold tracking-tight mb-2 text-neutral-200 uppercase">{service.title}</h3>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Intermediação profissional entre artista e contratante, garantindo segurança e resultados.
                      </p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* Footer */}
        {(() => {
          const footer = navConfig?.footer || {
            logo: logoAsset.url,
            description: 'Representando talentos. Criando conexões. Do Goiás pro mundo.',
            blocks: [
              { id: 'social', active: true },
              { id: 'contact', active: true },
              { id: 'copyright', active: true }
            ],
            social: { instagram: '#', youtube: '#' },
            contact: { email: 'contato@064talents.com.br', phone: '+55 62 9999-9999' },
            copyright: '© 2026 064 TALENTS. TODOS OS DIREITOS RESERVADOS.'
          };

          return (
            <footer id="contato" className="py-24 border-t border-white/5 bg-neutral-950 text-center">
                <div className="flex justify-center mb-8">
                    <img src={footer.logo} alt="064 TALENTS" className="h-24 w-auto object-contain opacity-80" />
                </div>
                <p className="text-xs text-neutral-500 uppercase tracking-[0.2em] mb-12 max-w-xl mx-auto px-6">{footer.description}</p>
                
                <div className="flex flex-col md:flex-row justify-center gap-12 mb-16 px-6">
                    {footer.blocks?.find((b: any) => b.id === 'social')?.active && (
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Social</h4>
                        <div className="flex justify-center gap-6">
                            {footer.social.instagram && <a href={footer.social.instagram} className="text-neutral-500 hover:text-white transition"><Instagram className="w-5 h-5" /></a>}
                            {footer.social.youtube && <a href={footer.social.youtube} className="text-neutral-500 hover:text-white transition"><Youtube className="w-5 h-5" /></a>}
                            {footer.social.facebook && <a href={footer.social.facebook} className="text-neutral-500 hover:text-white transition"><Facebook className="w-5 h-5" /></a>}
                        </div>
                      </div>
                    )}

                    {footer.blocks?.find((b: any) => b.id === 'contact')?.active && (
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Contato</h4>
                        <div className="space-y-2 text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                            <div className="flex items-center justify-center gap-2"><Mail className="w-3 h-3" /> {footer.contact.email}</div>
                            <div className="flex items-center justify-center gap-2"><Phone className="w-3 h-3" /> {footer.contact.phone}</div>
                        </div>
                      </div>
                    )}
                </div>

                <p className="text-[10px] text-neutral-700 uppercase tracking-[0.4em] font-medium border-t border-white/5 pt-12 mx-auto max-w-xs">{footer.copyright}</p>
            </footer>
          );
        })()}
      </main>
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        initialArtistId={selectedArtistId}
      />
    </div>
  );
}
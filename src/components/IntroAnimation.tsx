import { useEffect, useState } from "react";
import logo064 from "@/assets/logo-064.png.asset.json";
import talentsText from "@/assets/talents-text.png.asset.json";

export function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  const [stage, setStage] = useState(0); // 0: Start, 1: Logo 064, 2: Talents, 3: Pulse, 4: Transition
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Stage 1: Logo 064 starts at 0.10s
    const t1 = setTimeout(() => setStage(1), 100);
    
    // Stage 2: Talents starts at 1.30s
    const t2 = setTimeout(() => setStage(2), 1300);
    
    // Stage 3: Pulse starts at 2.50s
    const t3 = setTimeout(() => setStage(3), 2500);
    
    // Stage 4: Transition starts at 3.10s
    const t4 = setTimeout(() => {
      setStage(4);
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 800); // Duration of Stage 4 transition
    }, 3100);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  const handleSkip = () => {
    setIsVisible(false);
    onComplete();
  };

  return (
    <div 
      className={`fixed inset-0 z-[999] bg-black flex items-center justify-center transition-opacity duration-700 ease-in-out ${stage === 4 ? 'opacity-0' : 'opacity-100'}`}
      style={{ pointerEvents: stage === 4 ? 'none' : 'auto' }}
    >
      <div 
        className={`relative flex flex-col items-center justify-center transition-all duration-[450ms] ease-in-out ${stage === 3 ? 'scale-[1.035] brightness-125' : 'scale-100'}`}
        style={{ 
          transform: stage === 4 ? 'scale(1.08)' : undefined,
          opacity: stage === 4 ? 0 : 1,
          willChange: 'transform, opacity'
        }}
      >
        {/* IMAGEM 1: Logo 064 */}
        <div 
          className="transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ 
            opacity: stage >= 1 ? 1 : 0,
            transform: stage >= 1 ? 'translateY(0) scale(1)' : 'translateY(120px) scale(0.96)',
            willChange: 'transform, opacity'
          }}
        >
          <img 
            src={logo064.url} 
            alt="064 Logo" 
            className="w-[280px] md:w-[450px] h-auto object-contain"
          />
        </div>

        {/* IMAGEM 2: TALENTS Text */}
        <div 
          className="transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] -mt-4 md:-mt-8"
          style={{ 
            opacity: stage >= 2 ? 1 : 0,
            transform: stage >= 2 ? 'translateY(0) scale(1)' : 'translateY(120px) scale(0.96)',
            willChange: 'transform, opacity'
          }}
        >
          <img 
            src={talentsText.url} 
            alt="Talents" 
            className="w-[280px] md:w-[450px] h-auto object-contain"
          />
        </div>
      </div>

      <button 
        onClick={handleSkip}
        className="absolute bottom-8 right-8 text-neutral-500 hover:text-white text-[10px] uppercase font-bold tracking-[0.3em] transition-colors"
      >
        Pular Intro
      </button>
    </div>
  );
}

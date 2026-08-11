import { useEffect, useState } from "react";
import crownAsset from "@/assets/logo-crown.png.asset.json";
import digit0 from "@/assets/digit-0.png.asset.json";
import digit6 from "@/assets/digit-6.png.asset.json";
import digit4 from "@/assets/digit-4.png.asset.json";
import talentsText from "@/assets/talents-text.png.asset.json";

export function IntroAnimation({ onComplete }: { onComplete: () => void }) {
  // Stages: 
  // 0: Start
  // 1: Coroa (Crown)
  // 2: Digit 0
  // 3: Digit 6
  // 4: Digit 4
  // 5: Talents
  // 6: Pulse
  // 7: Transition to site
  const [stage, setStage] = useState(0); 
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 0.1s: Coroa
    const t1 = setTimeout(() => setStage(1), 100);
    
    // 1.1s: Digit 0 (1s after crown)
    const t2 = setTimeout(() => setStage(2), 1100);
    
    // 1.6s: Digit 6
    const t3 = setTimeout(() => setStage(3), 1600);
    
    // 2.1s: Digit 4
    const t4 = setTimeout(() => setStage(4), 2100);

    // 2.7s: Talents (after digits)
    const t5 = setTimeout(() => setStage(5), 2700);
    
    // 3.8s: Pulse
    const t6 = setTimeout(() => setStage(6), 3800);
    
    // 4.4s: Start Transition
    const t7 = setTimeout(() => {
      setStage(7);
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 800);
    }, 4400);

    return () => {
      [t1, t2, t3, t4, t5, t6, t7].forEach(clearTimeout);
    };
  }, [onComplete]);

  if (!isVisible) return null;

  const handleSkip = () => {
    setIsVisible(false);
    onComplete();
  };

  const animationBaseClass = "transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)]";
  const hiddenStyle = { opacity: 0, transform: 'translateY(40px) scale(0.98)' };
  const visibleStyle = { opacity: 1, transform: 'translateY(0) scale(1)' };

  return (
    <div 
      className={`fixed inset-0 z-[999] bg-black flex items-center justify-center transition-opacity duration-700 ease-in-out ${stage === 7 ? 'opacity-0' : 'opacity-100'}`}
      style={{ pointerEvents: stage === 7 ? 'none' : 'auto' }}
    >
      <div 
        className={`relative flex flex-col items-center justify-center transition-all duration-[450ms] ease-in-out ${stage === 6 ? 'scale-[1.035] brightness-125' : 'scale-100'}`}
        style={{ 
          transform: stage === 7 ? 'scale(1.08)' : undefined,
          opacity: stage === 7 ? 0 : 1,
          willChange: 'transform, opacity'
        }}
      >
        {/* CONTAINER DA LOGO COMPLETA */}
        <div className="flex flex-col items-center gap-1 md:gap-2">
          
          {/* COROA (Sempre no topo após aparecer) */}
          <div 
            className={animationBaseClass}
            style={stage >= 1 ? visibleStyle : hiddenStyle}
          >
            <img 
              src={crownAsset.url} 
              alt="Crown" 
              className="w-[200px] md:w-[400px] h-auto object-contain"
            />
          </div>

          {/* ÁREA DOS NÚMEROS (Abaixo da coroa) */}
          <div className="relative w-[180px] h-[80px] md:w-[360px] md:h-[160px] flex items-center justify-center -mt-4 md:-mt-8">
            <div 
              className={`absolute inset-0 flex items-center justify-center ${animationBaseClass}`}
              style={stage === 2 ? visibleStyle : hiddenStyle}
            >
              <img src={digit0.url} alt="0" className="h-full w-auto object-contain" />
            </div>
            <div 
              className={`absolute inset-0 flex items-center justify-center ${animationBaseClass}`}
              style={stage === 3 ? visibleStyle : hiddenStyle}
            >
              <img src={digit6.url} alt="6" className="h-full w-auto object-contain" />
            </div>
            <div 
              className={`absolute inset-0 flex items-center justify-center ${animationBaseClass}`}
              style={stage >= 4 ? visibleStyle : hiddenStyle}
            >
              <img src={digit4.url} alt="4" className="h-full w-auto object-contain" />
            </div>
          </div>

          {/* TALENTS (Abaixo dos números) */}
          <div 
            className={`${animationBaseClass} -mt-2 md:-mt-4`}
            style={stage >= 5 ? visibleStyle : hiddenStyle}
          >
            <img 
              src={talentsText.url} 
              alt="Talents" 
              className="w-[200px] md:w-[400px] h-auto object-contain"
            />
          </div>

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

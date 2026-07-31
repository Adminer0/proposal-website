import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

type Pose = 'standing' | 'walking' | 'kneeling' | 'sitting' | 'sad' | 'happy' | 'surprised';

interface MaleCharacterProps {
  pose: Pose;
  className?: string;
}

const MaleCharacter: React.FC<MaleCharacterProps> = ({ pose, className = '' }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Idle breathing / sway animation
  useEffect(() => {
    if (!svgRef.current) return;
    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    // Breathing: slight body scale
    tl.to(svgRef.current.querySelector('.body-group'), {
      scaleY: 1.008,
      transformOrigin: 'center bottom',
      duration: 1.8,
      ease: 'sine.inOut',
    }, 0);

    // Gentle head tilt
    tl.to(svgRef.current.querySelector('.head-group'), {
      rotation: 1.2,
      transformOrigin: 'center bottom',
      duration: 2.2,
      ease: 'sine.inOut',
    }, 0);

    // Subtle arm sway
    tl.to(svgRef.current.querySelector('.arm-left'), {
      rotation: -2,
      transformOrigin: 'top center',
      duration: 2,
      ease: 'sine.inOut',
    }, 0);
    tl.to(svgRef.current.querySelector('.arm-right'), {
      rotation: 2,
      transformOrigin: 'top center',
      duration: 2,
      ease: 'sine.inOut',
    }, 0);

    // Happy bounce
    if (pose === 'happy') {
      gsap.to(svgRef.current.querySelector('.body-group'), {
        y: -4,
        duration: 0.4,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }

    return () => { tl.kill(); gsap.killTweensOf('.body-group'); };
  }, [pose]);

  // Pose-based transforms
  const getPoseTransforms = () => {
    switch (pose) {
      case 'walking':
        return { legLeft: 'rotate(-20 100 240)', legRight: 'rotate(20 100 240)', armLeft: 'rotate(20 65 150)', armRight: 'rotate(-20 135 150)', bodyY: 0 };
      case 'kneeling':
        return { legLeft: 'rotate(-80 100 240)', legRight: 'rotate(-10 100 240)', armLeft: 'rotate(-10 65 150)', armRight: 'rotate(10 135 150)', bodyY: 20 };
      case 'sitting':
        return { legLeft: 'rotate(-90 100 240)', legRight: 'rotate(-90 100 240)', armLeft: 'rotate(0 65 150)', armRight: 'rotate(0 135 150)', bodyY: 15 };
      case 'sad':
        return { legLeft: 'rotate(-5 100 240)', legRight: 'rotate(5 100 240)', armLeft: 'rotate(15 65 150)', armRight: 'rotate(-15 135 150)', bodyY: 5 };
      case 'happy':
        return { legLeft: 'rotate(-5 100 240)', legRight: 'rotate(5 100 240)', armLeft: 'rotate(-40 65 150)', armRight: 'rotate(40 135 150)', bodyY: 0 };
      case 'surprised':
        return { legLeft: 'rotate(-3 100 240)', legRight: 'rotate(3 100 240)', armLeft: 'rotate(-30 65 150)', armRight: 'rotate(30 135 150)', bodyY: -3 };
      default: // standing
        return { legLeft: '', legRight: '', armLeft: '', armRight: '', bodyY: 0 };
    }
  };

  const pt = getPoseTransforms();

  // Eye expression per pose
  const renderEyes = () => {
    if (pose === 'sad') {
      return (
        <>
          {/* Sad eyes - droopy */}
          <ellipse cx="82" cy="98" rx="7" ry="5" fill="#3D2B1F" />
          <ellipse cx="118" cy="98" rx="7" ry="5" fill="#3D2B1F" />
          <ellipse cx="83" cy="97" rx="2.5" ry="2" fill="#FFF" />
          <ellipse cx="119" cy="97" rx="2.5" ry="2" fill="#FFF" />
          {/* Sad eyebrows */}
          <line x1="72" y1="87" x2="90" y2="90" stroke="#3D2B1F" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="128" y1="87" x2="110" y2="90" stroke="#3D2B1F" strokeWidth="2.5" strokeLinecap="round" />
        </>
      );
    }
    if (pose === 'happy') {
      return (
        <>
          {/* Happy closed eyes - arcs */}
          <path d="M74 98 Q82 90 90 98" stroke="#3D2B1F" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <path d="M110 98 Q118 90 126 98" stroke="#3D2B1F" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        </>
      );
    }
    if (pose === 'surprised') {
      return (
        <>
          {/* Big round surprised eyes */}
          <circle cx="82" cy="98" r="9" fill="#FFF" stroke="#3D2B1F" strokeWidth="1.5" />
          <circle cx="118" cy="98" r="9" fill="#FFF" stroke="#3D2B1F" strokeWidth="1.5" />
          <circle cx="83" cy="97" r="5" fill="#3D2B1F" />
          <circle cx="119" cy="97" r="5" fill="#3D2B1F" />
          <circle cx="84.5" cy="95.5" r="2" fill="#FFF" />
          <circle cx="120.5" cy="95.5" r="2" fill="#FFF" />
          {/* Raised eyebrows */}
          <line x1="72" y1="82" x2="92" y2="84" stroke="#3D2B1F" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="128" y1="82" x2="108" y2="84" stroke="#3D2B1F" strokeWidth="2.5" strokeLinecap="round" />
        </>
      );
    }
    // Default / standing / walking / kneeling / sitting
    return (
      <>
        <ellipse cx="82" cy="98" rx="7.5" ry="8" fill="#FFF" stroke="#3D2B1F" strokeWidth="1.2" />
        <ellipse cx="118" cy="98" rx="7.5" ry="8" fill="#FFF" stroke="#3D2B1F" strokeWidth="1.2" />
        <circle cx="83" cy="97" r="5" fill="#3D2B1F" />
        <circle cx="119" cy="97" r="5" fill="#3D2B1F" />
        <circle cx="84.5" cy="95.5" r="2" fill="#FFF" />
        <circle cx="120.5" cy="95.5" r="2" fill="#FFF" />
      </>
    );
  };

  // Mouth per pose
  const renderMouth = () => {
    if (pose === 'sad') return <path d="M90 118 Q100 112 110 118" stroke="#3D2B1F" strokeWidth="2" fill="none" strokeLinecap="round" />;
    if (pose === 'happy') return <path d="M88 114 Q100 126 112 114" stroke="#3D2B1F" strokeWidth="2" fill="#FF8B8B" strokeLinecap="round" />;
    if (pose === 'surprised') return <ellipse cx="100" cy="118" rx="5" ry="7" fill="#3D2B1F" />;
    return <path d="M90 115 Q100 122 110 115" stroke="#3D2B1F" strokeWidth="2" fill="none" strokeLinecap="round" />;
  };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 320"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ overflow: 'visible' }}
    >
      <defs>
        <radialGradient id="m-skin" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFE4D6" />
          <stop offset="100%" stopColor="#FFD5C2" />
        </radialGradient>
        <radialGradient id="m-hair" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#5C4033" />
          <stop offset="100%" stopColor="#3E2723" />
        </radialGradient>
      </defs>

      {/* Legs */}
      <g>
        <rect x="82" y="240" width="14" height="55" rx="7" fill="#2C2C54" transform={pt.legLeft} />
        <rect x="104" y="240" width="14" height="55" rx="7" fill="#2C2C54" transform={pt.legRight} />
        {/* Shoes */}
        <ellipse cx="82" cy="298" rx="12" ry="6" fill="#FF6B6B" transform={pt.legLeft} />
        <ellipse cx="118" cy="298" rx="12" ry="6" fill="#FF6B6B" transform={pt.legRight} />
      </g>

      {/* Body group with translateY for kneeling/sitting */}
      <g className="body-group" transform={`translate(0, ${pt.bodyY})`}>
        {/* Body / Shirt */}
        <rect x="68" y="145" width="64" height="100" rx="18" fill="#7EC8E3" />
        {/* Shirt collar detail */}
        <path d="M85 148 L100 162 L115 148" stroke="#5BAED1" strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* Shirt pocket */}
        <rect x="78" y="175" width="12" height="10" rx="3" fill="#5BAED1" opacity="0.5" />

        {/* Arms */}
        <g className="arm-left">
          <rect x="48" y="150" width="16" height="60" rx="8" fill="#7EC8E3" transform={pt.armLeft} />
          {/* Hand */}
          <circle cx="56" cy="212" r="8" fill="url(#m-skin)" transform={pt.armLeft} />
        </g>
        <g className="arm-right">
          <rect x="136" y="150" width="16" height="60" rx="8" fill="#7EC8E3" transform={pt.armRight} />
          <circle cx="144" cy="212" r="8" fill="url(#m-skin)" transform={pt.armRight} />
        </g>

        {/* Neck */}
        <rect x="92" y="130" width="16" height="20" rx="6" fill="url(#m-skin)" />
      </g>

      {/* Head group */}
      <g className="head-group">
        {/* Hair back layer */}
        <ellipse cx="100" cy="80" rx="42" ry="40" fill="url(#m-hair)" />

        {/* Face */}
        <ellipse cx="100" cy="90" rx="35" ry="36" fill="url(#m-skin)" />

        {/* Hair front / bangs */}
        <path d="M60 72 Q68 42 100 38 Q132 42 140 72 Q135 58 120 52 Q105 48 90 52 Q75 58 60 72Z" fill="url(#m-hair)" />
        {/* Hair tuft */}
        <path d="M95 38 Q100 22 108 38" fill="url(#m-hair)" />
        <path d="M88 42 Q92 28 100 36" fill="#5C4033" />

        {/* Side hair strands */}
        <path d="M62 78 Q55 90 58 108" stroke="#3E2723" strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M138 78 Q145 90 142 108" stroke="#3E2723" strokeWidth="5" fill="none" strokeLinecap="round" />

        {/* Ears */}
        <ellipse cx="64" cy="95" rx="6" ry="8" fill="url(#m-skin)" />
        <ellipse cx="136" cy="95" rx="6" ry="8" fill="url(#m-skin)" />

        {/* Eyes */}
        {renderEyes()}

        {/* Eyebrows (for non-sad, non-surprised) */}
        {pose !== 'sad' && pose !== 'surprised' && (
          <>
            <line x1="72" y1="86" x2="90" y2="85" stroke="#3D2B1F" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="110" y1="85" x2="128" y2="86" stroke="#3D2B1F" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {/* Nose */}
        <ellipse cx="100" cy="108" rx="3" ry="2.5" fill="#F5C0A8" />

        {/* Mouth */}
        {renderMouth()}

        {/* Blush */}
        <ellipse cx="72" cy="110" rx="8" ry="5" fill="#FFB5B5" opacity="0.4" />
        <ellipse cx="128" cy="110" rx="8" ry="5" fill="#FFB5B5" opacity="0.4" />
      </g>
    </svg>
  );
};

export default MaleCharacter;

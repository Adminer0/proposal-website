import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

type Pose = 'standing' | 'walking' | 'kneeling' | 'sitting' | 'sad' | 'happy' | 'surprised';

interface FemaleCharacterProps {
  pose: Pose;
  className?: string;
}

const FemaleCharacter: React.FC<FemaleCharacterProps> = ({ pose, className = '' }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    tl.to(svgRef.current.querySelector('.body-group'), {
      scaleY: 1.01, transformOrigin: 'center bottom', duration: 2, ease: 'sine.inOut',
    }, 0);
    tl.to(svgRef.current.querySelector('.head-group'), {
      rotation: 1.5, transformOrigin: 'center bottom', duration: 2.5, ease: 'sine.inOut',
    }, 0);
    tl.to(svgRef.current.querySelector('.arm-left'), {
      rotation: -2.5, transformOrigin: 'top center', duration: 2.2, ease: 'sine.inOut',
    }, 0);
    tl.to(svgRef.current.querySelector('.arm-right'), {
      rotation: 2.5, transformOrigin: 'top center', duration: 2.2, ease: 'sine.inOut',
    }, 0);
    tl.to(svgRef.current.querySelector('.hair-flow'), {
      rotation: 1.5, transformOrigin: 'top center', duration: 2.8, ease: 'sine.inOut',
    }, 0);

    if (pose === 'happy') {
      gsap.to(svgRef.current.querySelector('.body-group'), {
        y: -5, duration: 0.35, repeat: -1, yoyo: true, ease: 'power1.inOut',
      });
    }
    return () => { tl.kill(); gsap.killTweensOf('.body-group'); };
  }, [pose]);

  const getPoseTransforms = () => {
    switch (pose) {
      case 'walking':
        return { legLeft: 'rotate(-20 92 255)', legRight: 'rotate(20 108 255)', armLeft: 'rotate(20 60 160)', armRight: 'rotate(-20 140 160)', bodyY: 0 };
      case 'kneeling':
        return { legLeft: 'rotate(-80 92 255)', legRight: 'rotate(-10 108 255)', armLeft: 'rotate(-10 60 160)', armRight: 'rotate(10 140 160)', bodyY: 20 };
      case 'sitting':
        return { legLeft: 'rotate(-90 92 255)', legRight: 'rotate(-90 108 255)', armLeft: 'rotate(5 60 160)', armRight: 'rotate(-5 140 160)', bodyY: 15 };
      case 'sad':
        return { legLeft: 'rotate(-5 92 255)', legRight: 'rotate(5 108 255)', armLeft: 'rotate(15 60 160)', armRight: 'rotate(-15 140 160)', bodyY: 5 };
      case 'happy':
        return { legLeft: 'rotate(-5 92 255)', legRight: 'rotate(5 108 255)', armLeft: 'rotate(-45 60 160)', armRight: 'rotate(45 140 160)', bodyY: 0 };
      case 'surprised':
        return { legLeft: 'rotate(-3 92 255)', legRight: 'rotate(3 108 255)', armLeft: 'rotate(-30 60 160)', armRight: 'rotate(30 140 160)', bodyY: -3 };
      default:
        return { legLeft: '', legRight: '', armLeft: '', armRight: '', bodyY: 0 };
    }
  };

  const pt = getPoseTransforms();

  const renderEyes = () => {
    if (pose === 'sad') {
      return (
        <>
          <ellipse cx="84" cy="100" rx="8" ry="6" fill="#FFF" stroke="#3D2B1F" strokeWidth="1.2" />
          <ellipse cx="116" cy="100" rx="8" ry="6" fill="#FFF" stroke="#3D2B1F" strokeWidth="1.2" />
          <ellipse cx="85" cy="101" rx="5" ry="4.5" fill="#3D2B1F" />
          <ellipse cx="117" cy="101" rx="5" ry="4.5" fill="#3D2B1F" />
          <circle cx="86.5" cy="99.5" r="2" fill="#FFF" />
          <circle cx="118.5" cy="99.5" r="2" fill="#FFF" />
          <path d="M88 106 Q89 112 87 114 Q85 112 86 106Z" fill="#7EC8E3" opacity="0.6" />
          <line x1="73" y1="88" x2="91" y2="91" stroke="#3D2B1F" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="127" y1="88" x2="109" y2="91" stroke="#3D2B1F" strokeWidth="2.2" strokeLinecap="round" />
        </>
      );
    }
    if (pose === 'happy') {
      return (
        <>
          <path d="M74 100 Q84 90 94 100" stroke="#3D2B1F" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <path d="M106 100 Q116 90 126 100" stroke="#3D2B1F" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <circle cx="78" cy="94" r="1.5" fill="#FFD700" opacity="0.7" />
          <circle cx="122" cy="94" r="1.5" fill="#FFD700" opacity="0.7" />
        </>
      );
    }
    if (pose === 'surprised') {
      return (
        <>
          <circle cx="84" cy="100" r="10" fill="#FFF" stroke="#3D2B1F" strokeWidth="1.5" />
          <circle cx="116" cy="100" r="10" fill="#FFF" stroke="#3D2B1F" strokeWidth="1.5" />
          <circle cx="85" cy="99" r="6" fill="#3D2B1F" />
          <circle cx="117" cy="99" r="6" fill="#3D2B1F" />
          <circle cx="87" cy="97" r="2.5" fill="#FFF" />
          <circle cx="119" cy="97" r="2.5" fill="#FFF" />
          <line x1="73" y1="83" x2="93" y2="85" stroke="#3D2B1F" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="127" y1="83" x2="107" y2="85" stroke="#3D2B1F" strokeWidth="2.2" strokeLinecap="round" />
        </>
      );
    }
    return (
      <>
        <ellipse cx="84" cy="100" rx="9" ry="10" fill="#FFF" stroke="#3D2B1F" strokeWidth="1.2" />
        <ellipse cx="116" cy="100" rx="9" ry="10" fill="#FFF" stroke="#3D2B1F" strokeWidth="1.2" />
        <circle cx="85" cy="99" r="6" fill="#3D2B1F" />
        <circle cx="117" cy="99" r="6" fill="#3D2B1F" />
        <circle cx="87" cy="97" r="2.5" fill="#FFF" />
        <circle cx="119" cy="97" r="2.5" fill="#FFF" />
        <circle cx="83" cy="101" r="1.2" fill="#FFF" />
        <circle cx="115" cy="101" r="1.2" fill="#FFF" />
        <path d="M74 94 Q76 91 78 94" stroke="#3D2B1F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M122 94 Q124 91 126 94" stroke="#3D2B1F" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </>
    );
  };

  const renderMouth = () => {
    if (pose === 'sad') return <path d="M92 120 Q100 114 108 120" stroke="#3D2B1F" strokeWidth="1.8" fill="none" strokeLinecap="round" />;
    if (pose === 'happy') return <path d="M88 116 Q100 128 112 116" stroke="#3D2B1F" strokeWidth="2" fill="#FF8B9A" strokeLinecap="round" />;
    if (pose === 'surprised') return <ellipse cx="100" cy="120" rx="5" ry="7" fill="#3D2B1F" />;
    return <path d="M91 117 Q100 124 109 117" stroke="#3D2B1F" strokeWidth="1.8" fill="none" strokeLinecap="round" />;
  };

  return (
    <svg ref={svgRef} viewBox="0 0 200 320" xmlns="http://www.w3.org/2000/svg" className={className} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="f-skin" cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#FFE4D6" />
          <stop offset="100%" stopColor="#FFD5C2" />
        </radialGradient>
        <radialGradient id="f-hair" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#2C1810" />
          <stop offset="100%" stopColor="#1A0F0A" />
        </radialGradient>
        <linearGradient id="f-dress" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFB5C2" />
          <stop offset="100%" stopColor="#FF8FA3" />
        </linearGradient>
        <linearGradient id="f-dress-sh" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF9DB5" />
          <stop offset="100%" stopColor="#FF7A95" />
        </linearGradient>
      </defs>

      {/* Legs */}
      <g>
        <rect x="84" y="255" width="12" height="45" rx="6" fill="url(#f-skin)" transform={pt.legLeft} />
        <rect x="104" y="255" width="12" height="45" rx="6" fill="url(#f-skin)" transform={pt.legRight} />
        <rect x="82" y="280" width="16" height="12" rx="4" fill="#FFF" transform={pt.legLeft} />
        <rect x="102" y="280" width="16" height="12" rx="4" fill="#FFF" transform={pt.legRight} />
        <ellipse cx="90" cy="298" rx="13" ry="6" fill="#FF6B8A" transform={pt.legLeft} />
        <ellipse cx="110" cy="298" rx="13" ry="6" fill="#FF6B8A" transform={pt.legRight} />
      </g>

      {/* Body group */}
      <g className="body-group" transform={`translate(0, ${pt.bodyY})`}>
        {/* Dress */}
        <path d="M70 155 Q68 145 80 140 L120 140 Q132 145 130 155 L138 255 Q138 262 130 262 L70 262 Q62 262 62 255Z" fill="url(#f-dress)" />
        <path d="M85 155 L80 255" stroke="url(#f-dress-sh)" strokeWidth="3" opacity="0.4" strokeLinecap="round" />
        <path d="M115 155 L120 255" stroke="url(#f-dress-sh)" strokeWidth="3" opacity="0.4" strokeLinecap="round" />
        {/* Collar ribbon */}
        <circle cx="100" cy="142" r="6" fill="#FF8FA3" />
        <path d="M94 142 L88 150 L94 146Z" fill="#FF8FA3" />
        <path d="M106 142 L112 150 L106 146Z" fill="#FF8FA3" />
        <rect x="75" y="175" width="50" height="5" rx="2.5" fill="#FF6B8A" opacity="0.6" />

        {/* Arms */}
        <g className="arm-left">
          <rect x="46" y="148" width="14" height="55" rx="7" fill="url(#f-skin)" transform={pt.armLeft} />
          <ellipse cx="53" cy="155" rx="10" ry="8" fill="#FFB5C2" transform={pt.armLeft} />
          <circle cx="53" cy="205" r="7" fill="url(#f-skin)" transform={pt.armLeft} />
        </g>
        <g className="arm-right">
          <rect x="140" y="148" width="14" height="55" rx="7" fill="url(#f-skin)" transform={pt.armRight} />
          <ellipse cx="147" cy="155" rx="10" ry="8" fill="#FFB5C2" transform={pt.armRight} />
          <circle cx="147" cy="205" r="7" fill="url(#f-skin)" transform={pt.armRight} />
        </g>

        {/* Neck */}
        <rect x="92" y="128" width="16" height="18" rx="6" fill="url(#f-skin)" />
        <rect x="90" y="132" width="20" height="4" rx="2" fill="#FF6B8A" opacity="0.7" />
      </g>

      {/* Head group */}
      <g className="head-group">
        {/* Hair back - flowing */}
        <g className="hair-flow">
          <ellipse cx="100" cy="80" rx="44" ry="42" fill="url(#f-hair)" />
          <path d="M58 80 Q52 120 56 170 Q58 180 64 175 Q60 130 62 90Z" fill="url(#f-hair)" />
          <path d="M142 80 Q148 120 144 170 Q142 180 136 175 Q140 130 138 90Z" fill="url(#f-hair)" />
          <path d="M80 78 Q85 130 82 165 Q80 172 88 168 Q88 125 86 80Z" fill="#1A0F0A" />
          <path d="M114 78 Q115 130 118 165 Q120 172 112 168 Q112 125 114 80Z" fill="#1A0F0A" />
        </g>

        {/* Face */}
        <ellipse cx="100" cy="90" rx="36" ry="37" fill="url(#f-skin)" />

        {/* Bangs */}
        <path d="M58 72 Q62 38 100 34 Q138 38 142 72 Q138 55 125 48 Q112 42 100 44 Q88 42 75 48 Q62 55 58 72Z" fill="url(#f-hair)" />
        <path d="M70 68 Q75 50 85 48" stroke="#2C1810" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M82 65 Q88 46 98 42" stroke="#1A0F0A" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M102 42 Q112 46 118 65" stroke="#2C1810" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M115 48 Q125 50 130 68" stroke="#1A0F0A" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Hair flower clip */}
        <circle cx="68" cy="68" r="6" fill="#FF8FA3" />
        <circle cx="68" cy="68" r="3" fill="#FFD700" />
        <circle cx="64" cy="65" r="2.5" fill="#FFB5C2" />
        <circle cx="72" cy="65" r="2.5" fill="#FFB5C2" />
        <circle cx="65" cy="71" r="2.5" fill="#FFB5C2" />
        <circle cx="71" cy="71" r="2.5" fill="#FFB5C2" />

        {/* Ears + earrings */}
        <ellipse cx="63" cy="95" rx="5" ry="7" fill="url(#f-skin)" />
        <ellipse cx="137" cy="95" rx="5" ry="7" fill="url(#f-skin)" />
        <circle cx="63" cy="104" r="3" fill="#FFD700" />
        <circle cx="137" cy="104" r="3" fill="#FFD700" />

        {/* Eyes */}
        {renderEyes()}

        {/* Eyebrows */}
        {pose !== 'sad' && pose !== 'surprised' && pose !== 'happy' && (
          <>
            <path d="M73 87 Q84 84 93 87" stroke="#3D2B1F" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M107 87 Q116 84 127 87" stroke="#3D2B1F" strokeWidth="2" fill="none" strokeLinecap="round" />
          </>
        )}

        {/* Nose, mouth, blush */}
        <ellipse cx="100" cy="110" rx="2.5" ry="2" fill="#F5C0A8" />
        {renderMouth()}
        <ellipse cx="73" cy="112" rx="9" ry="5.5" fill="#FFB5B5" opacity="0.45" />
        <ellipse cx="127" cy="112" rx="9" ry="5.5" fill="#FFB5B5" opacity="0.45" />
      </g>
    </svg>
  );
};

export default FemaleCharacter;

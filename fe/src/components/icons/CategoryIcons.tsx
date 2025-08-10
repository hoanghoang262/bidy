import React from 'react';

interface IconProps {
  className?: string;
}

// Laboratory Equipment - Flask with bubbles and gradient
export const LaboratoryIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="lab-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff6b35" />
        <stop offset="100%" stopColor="#ff8e3c" />
      </linearGradient>
      <linearGradient id="bubble-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ecdc4" />
        <stop offset="100%" stopColor="#44a08d" />
      </linearGradient>
    </defs>
    {/* Flask base */}
    <path d="M20 45 L32 25 L32 10 L30 10 L30 8 L34 8 L34 10 L32 10 L32 25 L44 45 L44 52 C44 55 41 58 38 58 L26 58 C23 58 20 55 20 52 L20 45 Z" fill="url(#lab-gradient)" />
    {/* Flask neck */}
    <rect x="30" y="8" width="4" height="17" fill="url(#lab-gradient)" />
    {/* Liquid */}
    <path d="M22 48 L32 30 L32 25 L32 30 L42 48 L42 52 C42 53 41 54 40 54 L24 54 C23 54 22 53 22 52 L22 48 Z" fill="#4ecdc4" opacity="0.8" />
    {/* Bubbles */}
    <circle cx="28" cy="40" r="2" fill="url(#bubble-gradient)" opacity="0.7" />
    <circle cx="35" cy="35" r="1.5" fill="url(#bubble-gradient)" opacity="0.6" />
    <circle cx="32" cy="45" r="1" fill="url(#bubble-gradient)" opacity="0.8" />
    <circle cx="26" cy="50" r="1" fill="url(#bubble-gradient)" opacity="0.5" />
  </svg>
);

// Measurement Tools - Ruler with colorful measurements
export const MeasurementIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="ruler-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>
    {/* Ruler base */}
    <rect x="10" y="25" width="44" height="14" rx="2" fill="url(#ruler-gradient)" />
    {/* Measurement marks */}
    <rect x="15" y="27" width="1" height="10" fill="#ffffff" />
    <rect x="20" y="29" width="1" height="6" fill="#ffffff" />
    <rect x="25" y="27" width="1" height="10" fill="#ffffff" />
    <rect x="30" y="29" width="1" height="6" fill="#ffffff" />
    <rect x="35" y="27" width="1" height="10" fill="#ffffff" />
    <rect x="40" y="29" width="1" height="6" fill="#ffffff" />
    <rect x="45" y="27" width="1" height="10" fill="#ffffff" />
    <rect x="50" y="29" width="1" height="6" fill="#ffffff" />
    {/* Numbers */}
    <circle cx="25" cy="32" r="3" fill="#ff6b6b" opacity="0.8" />
    <circle cx="35" cy="32" r="3" fill="#4ecdc4" opacity="0.8" />
    <circle cx="45" cy="32" r="3" fill="#ffe66d" opacity="0.8" />
  </svg>
);

// Industrial Equipment - Gear with gradient
export const IndustrialIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="gear-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f093fb" />
        <stop offset="100%" stopColor="#f5576c" />
      </linearGradient>
      <linearGradient id="center-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4facfe" />
        <stop offset="100%" stopColor="#00f2fe" />
      </linearGradient>
    </defs>
    {/* Outer gear */}
    <path d="M32 8 L36 12 L40 8 L44 12 L48 8 L52 12 L56 16 L52 20 L56 24 L52 28 L56 32 L52 36 L56 40 L52 44 L56 48 L52 52 L48 56 L44 52 L40 56 L36 52 L32 56 L28 52 L24 56 L20 52 L16 48 L20 44 L16 40 L20 36 L16 32 L20 28 L16 24 L20 20 L16 16 L20 12 L24 8 L28 12 L32 8 Z" fill="url(#gear-gradient)" />
    {/* Inner circle */}
    <circle cx="32" cy="32" r="12" fill="url(#center-gradient)" />
    {/* Center hole */}
    <circle cx="32" cy="32" r="6" fill="#ffffff" />
    {/* Smaller gear overlay */}
    <circle cx="45" cy="20" r="8" fill="url(#gear-gradient)" opacity="0.7" />
    <circle cx="45" cy="20" r="4" fill="url(#center-gradient)" opacity="0.8" />
    <circle cx="45" cy="20" r="2" fill="#ffffff" />
  </svg>
);

// Home Appliances - House with appliances
export const HomeApplianceIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="house-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffecd2" />
        <stop offset="100%" stopColor="#fcb69f" />
      </linearGradient>
      <linearGradient id="appliance-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a8edea" />
        <stop offset="100%" stopColor="#fed6e3" />
      </linearGradient>
    </defs>
    {/* House outline */}
    <path d="M32 12 L50 25 L50 52 L14 52 L14 25 L32 12 Z" fill="url(#house-gradient)" />
    {/* Roof */}
    <path d="M32 8 L54 24 L50 28 L32 16 L14 28 L10 24 L32 8 Z" fill="#ff6b6b" />
    {/* Window */}
    <rect x="20" y="30" width="8" height="8" rx="2" fill="#4ecdc4" />
    {/* Door */}
    <rect x="36" y="38" width="8" height="14" rx="1" fill="#ffe66d" />
    {/* Appliance icons */}
    <rect x="40" y="25" width="6" height="6" rx="1" fill="url(#appliance-gradient)" />
    <circle cx="43" cy="28" r="1" fill="#ff6b6b" />
    <rect x="25" y="42" width="4" height="4" rx="1" fill="url(#appliance-gradient)" />
  </svg>
);

// Real Estate - Building with gradient
export const RealEstateIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="building-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
      <linearGradient id="window-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffecd2" />
        <stop offset="100%" stopColor="#fcb69f" />
      </linearGradient>
    </defs>
    {/* Main building */}
    <rect x="20" y="15" width="24" height="40" fill="url(#building-gradient)" />
    {/* Side building */}
    <rect x="44" y="25" width="12" height="30" fill="url(#building-gradient)" opacity="0.8" />
    {/* Windows */}
    <rect x="24" y="20" width="3" height="3" fill="url(#window-gradient)" />
    <rect x="29" y="20" width="3" height="3" fill="url(#window-gradient)" />
    <rect x="34" y="20" width="3" height="3" fill="url(#window-gradient)" />
    <rect x="24" y="26" width="3" height="3" fill="url(#window-gradient)" />
    <rect x="29" y="26" width="3" height="3" fill="url(#window-gradient)" />
    <rect x="34" y="26" width="3" height="3" fill="url(#window-gradient)" />
    <rect x="24" y="32" width="3" height="3" fill="url(#window-gradient)" />
    <rect x="29" y="32" width="3" height="3" fill="url(#window-gradient)" />
    <rect x="34" y="32" width="3" height="3" fill="url(#window-gradient)" />
    <rect x="47" y="30" width="2" height="2" fill="url(#window-gradient)" />
    <rect x="51" y="30" width="2" height="2" fill="url(#window-gradient)" />
    <rect x="47" y="35" width="2" height="2" fill="url(#window-gradient)" />
    <rect x="51" y="35" width="2" height="2" fill="url(#window-gradient)" />
    {/* Entrance */}
    <rect x="30" y="45" width="4" height="10" fill="#4ecdc4" />
    <circle cx="32" cy="48" r="0.5" fill="#ffffff" />
  </svg>
);

// Electronics - Circuit board with components
export const ElectronicsIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="board-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4facfe" />
        <stop offset="100%" stopColor="#00f2fe" />
      </linearGradient>
      <linearGradient id="component-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f093fb" />
        <stop offset="100%" stopColor="#f5576c" />
      </linearGradient>
    </defs>
    {/* Circuit board base */}
    <rect x="12" y="16" width="40" height="32" rx="4" fill="url(#board-gradient)" />
    {/* Circuit traces */}
    <path d="M16 24 L48 24" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
    <path d="M16 32 L48 32" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
    <path d="M16 40 L48 40" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
    <path d="M24 20 L24 44" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
    <path d="M40 20 L40 44" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
    {/* Components */}
    <rect x="18" y="22" width="4" height="4" rx="1" fill="url(#component-gradient)" />
    <rect x="26" y="22" width="4" height="4" rx="1" fill="#ffe66d" />
    <rect x="34" y="22" width="4" height="4" rx="1" fill="#ff6b6b" />
    <rect x="42" y="22" width="4" height="4" rx="1" fill="#4ecdc4" />
    <circle cx="20" cy="32" r="2" fill="url(#component-gradient)" />
    <circle cx="32" cy="32" r="3" fill="#ffe66d" />
    <circle cx="44" cy="32" r="2" fill="#4ecdc4" />
    <rect x="26" y="38" width="12" height="4" rx="2" fill="url(#component-gradient)" />
    {/* LED indicators */}
    <circle cx="20" cy="42" r="1" fill="#ff6b6b" />
    <circle cx="24" cy="42" r="1" fill="#4ecdc4" />
    <circle cx="40" cy="42" r="1" fill="#ffe66d" />
    <circle cx="44" cy="42" r="1" fill="#ff6b6b" />
  </svg>
);

// Other Products - Shopping bag with items
export const OtherProductsIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="bag-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a8edea" />
        <stop offset="100%" stopColor="#fed6e3" />
      </linearGradient>
      <linearGradient id="item-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
    </defs>
    {/* Shopping bag */}
    <path d="M20 22 L44 22 L46 54 L18 54 L20 22 Z" fill="url(#bag-gradient)" />
    {/* Bag handles */}
    <path d="M24 22 C24 18 28 14 32 14 C36 14 40 18 40 22" stroke="url(#item-gradient)" strokeWidth="2" fill="none" />
    {/* Items peeking out */}
    <rect x="28" y="18" width="3" height="8" rx="1" fill="#ff6b6b" />
    <rect x="33" y="16" width="3" height="10" rx="1" fill="#ffe66d" />
    <circle cx="26" cy="30" r="2" fill="#4ecdc4" />
    <circle cx="38" cy="35" r="2.5" fill="url(#item-gradient)" />
    <rect x="30" y="40" width="4" height="4" rx="1" fill="#ff6b6b" />
    {/* Sparkles */}
    <circle cx="22" cy="26" r="1" fill="#ffe66d" opacity="0.8" />
    <circle cx="42" cy="28" r="0.8" fill="#4ecdc4" opacity="0.7" />
    <circle cx="24" cy="45" r="0.6" fill="#ff6b6b" opacity="0.6" />
    <circle cx="40" cy="48" r="0.8" fill="#ffe66d" opacity="0.8" />
  </svg>
);

// All Categories - Grid with colorful squares
export const AllCategoriesIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="grid1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff6b6b" />
        <stop offset="100%" stopColor="#ff8e3c" />
      </linearGradient>
      <linearGradient id="grid2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4ecdc4" />
        <stop offset="100%" stopColor="#44a08d" />
      </linearGradient>
      <linearGradient id="grid3" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667eea" />
        <stop offset="100%" stopColor="#764ba2" />
      </linearGradient>
      <linearGradient id="grid4" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f093fb" />
        <stop offset="100%" stopColor="#f5576c" />
      </linearGradient>
    </defs>
    {/* Grid squares */}
    <rect x="14" y="14" width="12" height="12" rx="3" fill="url(#grid1)" />
    <rect x="38" y="14" width="12" height="12" rx="3" fill="url(#grid2)" />
    <rect x="14" y="38" width="12" height="12" rx="3" fill="url(#grid3)" />
    <rect x="38" y="38" width="12" height="12" rx="3" fill="url(#grid4)" />
    {/* Center connecting element */}
    <circle cx="32" cy="32" r="4" fill="#ffe66d" />
    <circle cx="32" cy="32" r="2" fill="#ffffff" />
    {/* Small connecting dots */}
    <circle cx="26" cy="20" r="1.5" fill="#ffe66d" opacity="0.7" />
    <circle cx="38" cy="20" r="1.5" fill="#ffe66d" opacity="0.7" />
    <circle cx="26" cy="44" r="1.5" fill="#ffe66d" opacity="0.7" />
    <circle cx="38" cy="44" r="1.5" fill="#ffe66d" opacity="0.7" />
    <circle cx="20" cy="26" r="1.5" fill="#ffe66d" opacity="0.7" />
    <circle cx="20" cy="38" r="1.5" fill="#ffe66d" opacity="0.7" />
    <circle cx="44" cy="26" r="1.5" fill="#ffe66d" opacity="0.7" />
    <circle cx="44" cy="38" r="1.5" fill="#ffe66d" opacity="0.7" />
  </svg>
);

// Vehicles - Car with gradient
export const VehiclesIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="car-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FA709A" />
        <stop offset="100%" stopColor="#FEE140" />
      </linearGradient>
      <linearGradient id="wheel-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#30cfd0" />
        <stop offset="100%" stopColor="#330867" />
      </linearGradient>
    </defs>
    {/* Car body */}
    <path d="M12 32 L14 26 L20 22 L44 22 L50 26 L52 32 L52 42 L48 44 L16 44 L12 42 L12 32 Z" fill="url(#car-gradient)" />
    {/* Windows */}
    <path d="M18 28 L22 24 L42 24 L46 28 L44 32 L20 32 L18 28 Z" fill="#4FBBF7" opacity="0.8" />
    {/* Windshield divider */}
    <line x1="32" y1="24" x2="32" y2="32" stroke="#333" strokeWidth="1" />
    {/* Wheels */}
    <circle cx="20" cy="44" r="5" fill="url(#wheel-gradient)" />
    <circle cx="44" cy="44" r="5" fill="url(#wheel-gradient)" />
    <circle cx="20" cy="44" r="2" fill="#333" />
    <circle cx="44" cy="44" r="2" fill="#333" />
    {/* Headlights */}
    <ellipse cx="14" cy="34" rx="2" ry="3" fill="#FFE66D" opacity="0.9" />
    <ellipse cx="50" cy="34" rx="2" ry="3" fill="#FFE66D" opacity="0.9" />
    {/* Details */}
    <rect x="24" y="36" width="4" height="2" rx="1" fill="#333" opacity="0.3" />
    <rect x="36" y="36" width="4" height="2" rx="1" fill="#333" opacity="0.3" />
  </svg>
);

// Fashion - T-shirt with gradient
export const FashionIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="shirt-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF9A9E" />
        <stop offset="100%" stopColor="#FECFEF" />
      </linearGradient>
      <linearGradient id="collar-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A18CD1" />
        <stop offset="100%" stopColor="#FBC2EB" />
      </linearGradient>
    </defs>
    {/* T-shirt body */}
    <path d="M24 20 L24 16 L28 14 L36 14 L40 16 L40 20 L48 24 L48 30 L44 28 L44 48 L20 48 L20 28 L16 30 L16 24 L24 20 Z" fill="url(#shirt-gradient)" />
    {/* Collar */}
    <path d="M28 14 L32 18 L32 20 L28 16 L28 14 Z" fill="url(#collar-gradient)" />
    <path d="M36 14 L36 16 L32 20 L32 18 L36 14 Z" fill="url(#collar-gradient)" />
    {/* Design on shirt */}
    <circle cx="32" cy="32" r="6" fill="#FFE66D" opacity="0.7" />
    <path d="M29 32 L31 34 L35 30" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
    {/* Pocket */}
    <rect x="38" y="24" width="4" height="4" rx="1" fill="#fff" opacity="0.5" />
  </svg>
);

// Sports - Soccer ball with gradient
export const SportsIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="ball-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4FACFE" />
        <stop offset="100%" stopColor="#00F2FE" />
      </linearGradient>
      <linearGradient id="pattern-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FA709A" />
        <stop offset="100%" stopColor="#FEE140" />
      </linearGradient>
    </defs>
    {/* Ball outline */}
    <circle cx="32" cy="32" r="18" fill="url(#ball-gradient)" />
    {/* Pentagon pattern */}
    <path d="M32 18 L38 22 L36 29 L28 29 L26 22 L32 18 Z" fill="#333" />
    <path d="M20 28 L24 26 L26 32 L22 34 L18 32 L20 28 Z" fill="#333" />
    <path d="M44 28 L46 32 L42 34 L38 32 L40 26 L44 28 Z" fill="#333" />
    <path d="M26 40 L28 36 L36 36 L38 40 L32 44 L26 40 Z" fill="#333" />
    {/* Highlight */}
    <ellipse cx="28" cy="26" rx="4" ry="3" fill="#fff" opacity="0.4" transform="rotate(-30 28 26)" />
    {/* Motion lines */}
    <path d="M48 28 L52 26" stroke="url(#pattern-gradient)" strokeWidth="2" strokeLinecap="round" />
    <path d="M48 32 L52 32" stroke="url(#pattern-gradient)" strokeWidth="2" strokeLinecap="round" />
    <path d="M48 36 L52 38" stroke="url(#pattern-gradient)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// Pets - Cat face with gradient
export const PetsIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="pet-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBAB7E" />
        <stop offset="100%" stopColor="#F7CE68" />
      </linearGradient>
      <linearGradient id="nose-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B9D" />
        <stop offset="100%" stopColor="#C44569" />
      </linearGradient>
    </defs>
    {/* Head */}
    <ellipse cx="32" cy="36" rx="16" ry="14" fill="url(#pet-gradient)" />
    {/* Ears */}
    <path d="M18 24 L16 14 L22 20 L18 24 Z" fill="url(#pet-gradient)" />
    <path d="M46 24 L48 14 L42 20 L46 24 Z" fill="url(#pet-gradient)" />
    <path d="M18 18 L19 16 L21 19 L18 18 Z" fill="#FF6B9D" opacity="0.6" />
    <path d="M46 18 L45 16 L43 19 L46 18 Z" fill="#FF6B9D" opacity="0.6" />
    {/* Eyes */}
    <ellipse cx="26" cy="34" rx="2" ry="4" fill="#333" />
    <ellipse cx="38" cy="34" rx="2" ry="4" fill="#333" />
    <circle cx="27" cy="33" r="1" fill="#fff" />
    <circle cx="39" cy="33" r="1" fill="#fff" />
    {/* Nose */}
    <path d="M32 38 L30 40 L32 42 L34 40 L32 38 Z" fill="url(#nose-gradient)" />
    {/* Mouth */}
    <path d="M32 42 C28 44 28 44 26 42" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M32 42 C36 44 36 44 38 42" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Whiskers */}
    <line x1="14" y1="36" x2="20" y2="35" stroke="#333" strokeWidth="1" opacity="0.6" />
    <line x1="14" y1="40" x2="20" y2="39" stroke="#333" strokeWidth="1" opacity="0.6" />
    <line x1="44" y1="35" x2="50" y2="36" stroke="#333" strokeWidth="1" opacity="0.6" />
    <line x1="44" y1="39" x2="50" y2="40" stroke="#333" strokeWidth="1" opacity="0.6" />
  </svg>
);

// Food & Beverage - Coffee cup with steam
export const FoodBeverageIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="cup-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F2994A" />
        <stop offset="100%" stopColor="#F2C94C" />
      </linearGradient>
      <linearGradient id="coffee-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B4513" />
        <stop offset="100%" stopColor="#D2691E" />
      </linearGradient>
    </defs>
    {/* Cup */}
    <path d="M18 26 L20 46 L24 50 L40 50 L44 46 L46 26 L18 26 Z" fill="url(#cup-gradient)" />
    {/* Handle */}
    <path d="M46 32 C52 32 52 40 46 40" stroke="url(#cup-gradient)" strokeWidth="4" fill="none" strokeLinecap="round" />
    {/* Coffee */}
    <ellipse cx="32" cy="28" rx="13" ry="2" fill="url(#coffee-gradient)" />
    <path d="M20 30 L22 44 L42 44 L44 30" fill="url(#coffee-gradient)" opacity="0.9" />
    {/* Steam */}
    <path d="M26 22 C26 20 26 18 28 16 C30 14 30 12 28 10" stroke="#fff" strokeWidth="2" fill="none" opacity="0.7" strokeLinecap="round" />
    <path d="M32 22 C32 20 32 18 34 16 C36 14 36 12 34 10" stroke="#fff" strokeWidth="2" fill="none" opacity="0.7" strokeLinecap="round" />
    <path d="M38 22 C38 20 38 18 40 16 C42 14 42 12 40 10" stroke="#fff" strokeWidth="2" fill="none" opacity="0.7" strokeLinecap="round" />
    {/* Saucer */}
    <ellipse cx="32" cy="52" rx="18" ry="3" fill="url(#cup-gradient)" opacity="0.6" />
  </svg>
);

// Books & Education - Open book with gradient
export const BooksEducationIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="book-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#667EEA" />
        <stop offset="100%" stopColor="#764BA2" />
      </linearGradient>
      <linearGradient id="page-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFECD2" />
        <stop offset="100%" stopColor="#FCB69F" />
      </linearGradient>
    </defs>
    {/* Book cover */}
    <path d="M12 16 L32 20 L52 16 L52 44 L32 48 L12 44 L12 16 Z" fill="url(#book-gradient)" />
    {/* Book spine */}
    <rect x="30" y="20" width="4" height="28" fill="#333" opacity="0.3" />
    {/* Left pages */}
    <path d="M14 18 L30 22 L30 46 L14 42 L14 18 Z" fill="url(#page-gradient)" />
    {/* Right pages */}
    <path d="M34 22 L50 18 L50 42 L34 46 L34 22 Z" fill="url(#page-gradient)" />
    {/* Text lines */}
    <line x1="16" y1="24" x2="26" y2="26" stroke="#333" strokeWidth="1" opacity="0.4" />
    <line x1="16" y1="28" x2="26" y2="30" stroke="#333" strokeWidth="1" opacity="0.4" />
    <line x1="16" y1="32" x2="26" y2="34" stroke="#333" strokeWidth="1" opacity="0.4" />
    <line x1="38" y1="26" x2="48" y2="24" stroke="#333" strokeWidth="1" opacity="0.4" />
    <line x1="38" y1="30" x2="48" y2="28" stroke="#333" strokeWidth="1" opacity="0.4" />
    <line x1="38" y1="34" x2="48" y2="32" stroke="#333" strokeWidth="1" opacity="0.4" />
    {/* Bookmark */}
    <rect x="44" y="14" width="3" height="12" fill="#FF6B6B" />
  </svg>
);

// Beauty & Health - Heart with sparkles
export const BeautyHealthIcon: React.FC<IconProps> = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 64 64" className={className} fill="none">
    <defs>
      <linearGradient id="heart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B9D" />
        <stop offset="100%" stopColor="#FFC0CB" />
      </linearGradient>
      <linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE66D" />
        <stop offset="100%" stopColor="#FFA500" />
      </linearGradient>
    </defs>
    {/* Heart shape */}
    <path d="M32 48 C12 36 8 24 16 18 C20 14 26 14 32 20 C38 14 44 14 48 18 C56 24 52 36 32 48 Z" fill="url(#heart-gradient)" />
    {/* Highlight */}
    <ellipse cx="24" cy="24" rx="4" ry="3" fill="#fff" opacity="0.5" transform="rotate(-30 24 24)" />
    {/* Sparkles */}
    <g>
      <circle cx="16" cy="32" r="1.5" fill="url(#sparkle-gradient)" />
      <path d="M16 30 L16 34 M14 32 L18 32" stroke="url(#sparkle-gradient)" strokeWidth="0.5" />
    </g>
    <g>
      <circle cx="48" cy="28" r="1.5" fill="url(#sparkle-gradient)" />
      <path d="M48 26 L48 30 M46 28 L50 28" stroke="url(#sparkle-gradient)" strokeWidth="0.5" />
    </g>
    <g>
      <circle cx="22" cy="40" r="1" fill="url(#sparkle-gradient)" />
      <path d="M22 39 L22 41 M21 40 L23 40" stroke="url(#sparkle-gradient)" strokeWidth="0.5" />
    </g>
    <g>
      <circle cx="42" cy="38" r="1" fill="url(#sparkle-gradient)" />
      <path d="M42 37 L42 39 M41 38 L43 38" stroke="url(#sparkle-gradient)" strokeWidth="0.5" />
    </g>
    {/* Plus sign for health */}
    <rect x="30" y="26" width="4" height="12" fill="#fff" opacity="0.8" />
    <rect x="26" y="30" width="12" height="4" fill="#fff" opacity="0.8" />
  </svg>
);
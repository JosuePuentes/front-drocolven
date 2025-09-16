import { useState } from 'react'

function HolographicIcon({ 
  icon: Icon, 
  size = 64, 
  color = "text-primary", 
  className = "",
  animate = true 
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className={`relative ${animate ? 'hologram-3d' : ''} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: size,
        height: size,
        animationPlayState: isHovered ? 'paused' : 'running'
      }}
    >
      {/* Base icon */}
      <div className={`w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center hologram-glow ${isHovered ? 'medical-pulse' : ''}`}>
        <Icon className={`h-8 w-8 ${color}`} />
      </div>
      
      {/* Holographic layers */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10 rounded-2xl flex items-center justify-center"
        style={{
          transform: 'translateZ(10px)',
          opacity: 0.7
        }}
      >
        <Icon className={`h-8 w-8 ${color} opacity-50`} />
      </div>
      
      <div 
        className="absolute inset-0 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-2xl flex items-center justify-center"
        style={{
          transform: 'translateZ(20px)',
          opacity: 0.4
        }}
      >
        <Icon className={`h-8 w-8 ${color} opacity-30`} />
      </div>
      
      {/* Scanner effect */}
      {isHovered && (
        <div className="absolute inset-0 medical-scanner rounded-2xl" />
      )}
    </div>
  )
}

export default HolographicIcon


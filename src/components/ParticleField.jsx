import { useEffect, useState } from 'react'

function ParticleField({ density = 20 }) {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const newParticles = Array.from({ length: density }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDelay: Math.random() * 6,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2
    }))
    setParticles(newParticles)
  }, [density])

  return (
    <div className="particle-field">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.animationDelay}s`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity
          }}
        />
      ))}
    </div>
  )
}

export default ParticleField


import { useState } from 'react'
import './App.css'

interface CaseData {
  x: number
  y: number
  width: number
  height: number
  rotation: number
  color: string
  imageUrl?: string
}

function App() {
  const [selectedCase, setSelectedCase] = useState<{ caseNumber: number; data: CaseData } | null>(null)
  // Importer toutes les images numérotées
  const importImages = () => {
    const images: { [key: number]: string } = {}
    // Images de 1 à 27 (tous avec "Image" majuscule)
    for (let i = 1; i <= 27; i++) {
      try {
        const imageName = `Image ${i}.png`
        images[i] = new URL(`./assets/${imageName}`, import.meta.url).href
      } catch (e) {
        console.warn(`Image ${i} not found`)
      }
    }
    return images
  }

  const images = importImages()
  
  // Importer l'image de transition
  const transitionA = new URL('./assets/Transition A.png', import.meta.url).href

  // Couleurs variées pour les cases
  const colors = [
    '#f4e4c1', '#e8a87c', '#c38d9e', '#6b5b95', '#d64161',
    '#41b3a3', '#ff6b6b', '#4ecdc4', '#feca57', '#ee5a6f',
    '#f9ca24', '#6ab04c', '#4834d4', '#eb4d4b', '#95afc0'
  ]

  // Créer trois lignes courbes
  const generateSpiralPath = (): CaseData[] => {
    const cases: CaseData[] = []
    const baseSize = 50
    
    // Ligne 1: Cases 1-11 (de gauche à droite, ligne courbe en haut)
    for (let i = 0; i < 11; i++) {
      const progress = i / 10 // 0 à 1
      const x = 100 + progress * 800 // De x=100 à x=900
      const curveHeight = Math.sin(progress * Math.PI) * 50 // Courbe vers le haut
      const y = 120 - curveHeight
      
      const rotation = Math.atan2(
        (Math.sin((progress + 0.01) * Math.PI) * 60 - curveHeight),
        80
      ) * (180 / Math.PI)
      
      const color = colors[i % colors.length]
      const imageNumber = (i % 27) + 1
      const imageUrl = images[imageNumber]
      
      cases.push({ 
        x, 
        y, 
        width: baseSize, 
        height: baseSize * 0.8, 
        rotation, 
        color, 
        imageUrl 
      })
    }
    
    // Ligne 2: Cases 12-24 (de droite à gauche, ligne courbe au milieu)
    for (let i = 0; i < 13; i++) {
      const caseIndex = 11 + i
      const progress = i / 12 // 0 à 1
      const x = 900 - progress * 800 // De x=900 à x=100 (droite à gauche)
      const curveHeight = Math.sin(progress * Math.PI) * 50 // Courbe vers le bas
      const y = 170 + curveHeight
      
      const rotation = Math.atan2(
        (Math.sin((progress + 0.01) * Math.PI) * 60 - curveHeight),
        -80
      ) * (180 / Math.PI)
      
      const color = colors[caseIndex % colors.length]
      const imageNumber = (caseIndex % 27) + 1
      const imageUrl = images[imageNumber]
      
      cases.push({ 
        x, 
        y, 
        width: baseSize, 
        height: baseSize * 0.8, 
        rotation, 
        color, 
        imageUrl 
      })
    }
    
    // Ligne 3: Cases 25-39 (de gauche à droite, ligne courbe en bas)
    for (let i = 0; i < 15; i++) {
      const caseIndex = 24 + i
      const progress = i / 14 // 0 à 1
      const x = 100 + progress * 800 // De x=100 à x=900
      const curveHeight = Math.sin(progress * Math.PI) * 50 // Courbe vers le haut
      const y = 340 - curveHeight
      
      const rotation = Math.atan2(
        (Math.sin((progress + 0.01) * Math.PI) * 60 - curveHeight),
        80
      ) * (180 / Math.PI)
      
      const color = colors[caseIndex % colors.length]
      const imageNumber = (caseIndex % 27) + 1
      const imageUrl = images[imageNumber]
      
      cases.push({ 
        x, 
        y, 
        width: baseSize, 
        height: baseSize * 0.8, 
        rotation, 
        color, 
        imageUrl 
      })
    }
    
    // Ligne 4: Cases 40-43 (de droite à gauche, ligne courbe tout en bas)
    for (let i = 0; i < 4; i++) {
      const caseIndex = 39 + i
      const progress = i / 3 // 0 à 1
      const x = 900 - progress * 800 // De x=900 à x=100 (droite à gauche)
      const curveHeight = Math.sin(progress * Math.PI) * 40 // Courbe moins prononcée
      const y = 420 + curveHeight
      
      const rotation = Math.atan2(
        (Math.sin((progress + 0.01) * Math.PI) * 40 - curveHeight),
        -266.67
      ) * (180 / Math.PI)
      
      const color = colors[caseIndex % colors.length]
      const imageNumber = (caseIndex % 27) + 1
      const imageUrl = images[imageNumber]
      
      cases.push({ 
        x, 
        y, 
        width: baseSize, 
        height: baseSize * 0.8, 
        rotation, 
        color, 
        imageUrl 
      })
    }
    
    return cases
  }

  const cases = generateSpiralPath()

  return (
    <div className="app">
      <h1 className="game-title">Sans hésiter</h1>
      <div className="board-container">
        <svg
          viewBox="0 0 1000 650"
          className="game-board"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Fond du plateau */}
          <rect
            x="0"
            y="0"
            width="1000"
            height="650"
            fill="#2c3e50"
            rx="20"
          />
          
          {/* Décoration - cercle central */}
          <circle
            cx="500"
            cy="350"
            r="120"
            fill="#34495e"
            opacity="0.5"
          />
          <text
            x="500"
            y="340"
            className="center-text"
          >
            
             
          </text>
          <text
            x="500"
            y="380"
            className="center-number"
          >
            Sans hésiter
          </text>
          
          {/* Générer toutes les cases avec leur chemin */}
          {cases.map((caseData, index) => {
            const caseNumber = index + 1
            return (
              <g key={index}>
                {/* Ligne de connexion vers la case suivante */}
                {index < 42 && (
                  <line
                    x1={caseData.x}
                    y1={caseData.y}
                    x2={cases[index + 1].x}
                    y2={cases[index + 1].y}
                    stroke="#7f8c8d"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                    opacity="0.5"
                  />
                )}
                
                {/* Case */}
                <g transform={`translate(${caseData.x}, ${caseData.y}) rotate(${caseData.rotation})`}>
                  {caseData.imageUrl && (
                    <image
                      href={caseData.imageUrl}
                      x="-35"
                      y="-35"
                      width="70"
                      height="70"
                      transform={`rotate(${-caseData.rotation})`}
                      preserveAspectRatio="xMidYMid meet"
                      onClick={() => setSelectedCase({ caseNumber, data: caseData })}
                      style={{ cursor: 'pointer' }}
                      className="case-image"
                    />
                  )}
                  <text
                    x="0"
                    y="45"
                    className="case-number"
                    transform={`rotate(${-caseData.rotation})`}
                  >
                    {caseNumber}
                  </text>
                </g>
              </g>
            )
          })}
          
          {/* Image de transition entre case 11 et 12 */}
          <image
            href={transitionA}
            x="920"
            y="110"
            width="80"
            height="80"
            preserveAspectRatio="xMidYMid meet"
            className="transition-image"
          />
        </svg>
      </div>

      {/* Modal pour afficher l'image en grand */}
      {selectedCase && (
        <div className="modal-overlay" onClick={() => setSelectedCase(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedCase(null)}>
              ✕
            </button>
            <h2>Case {selectedCase.caseNumber}</h2>
            {selectedCase.data.imageUrl && (
              <div className="modal-image-container">
                <img 
                  src={selectedCase.data.imageUrl} 
                  alt={`Case ${selectedCase.caseNumber}`}
                  className="modal-image"
                />
              </div>
            )}
            <div className="modal-details">
              <div className="detail-item">
                <span className="detail-label">Numéro:</span>
                <span className="detail-value">{selectedCase.caseNumber}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Couleur:</span>
                <span className="detail-value">
                  <span className="color-preview" style={{ backgroundColor: selectedCase.data.color }}></span>
                  {selectedCase.data.color}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Position:</span>
                <span className="detail-value">x: {Math.round(selectedCase.data.x)}, y: {Math.round(selectedCase.data.y)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Rotation:</span>
                <span className="detail-value">{Math.round(selectedCase.data.rotation)}°</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

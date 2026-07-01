import { useState, type MouseEvent } from 'react'

export function FavoriteHeart({
  filled,
  onToggle,
}: {
  filled: boolean
  onToggle: () => void
}) {
  const [animating, setAnimating] = useState(false)

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    setAnimating(true)
    onToggle()
    window.setTimeout(() => setAnimating(false), 420)
  }

  return (
    <button
      type="button"
      className="favorite-heart-btn"
      aria-label={filled ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={filled}
      onClick={handleClick}
    >
      <span className={`favorite-heart ${filled ? 'is-filled' : ''} ${animating ? 'is-animating' : ''}`}>
        <span className="favorite-heart-glyph" aria-hidden="true">
          ♥
        </span>
      </span>
    </button>
  )
}

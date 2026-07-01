export type FavoriteTrainer = {
  name: string
  specialty: string
  image: string
}

import { featuredTrainer } from './trainers'

const FAVORITES_KEY = 'doorstep-yoga-favorites'

const DEFAULT_FAVORITES: FavoriteTrainer[] = [
  {
    name: 'Ishita Kapur',
    specialty: 'Vinyasa & Hatha Expert',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDxOvBeCOKeWkQTX2rCUclEBML5LAxRI5BNNW4L4GyK5a-HiSRg01dVukkQyBwzqwCdKcRda9ArpjlEmuJ1LwcB_hkTSyc8yeReVCs5Z4in1AsNgPq0iNvjKWrtnIr273zrdAAXxWr170QSaMo5Siw_bl9xUd6ojuJ4JIrvDUqQXkHbcAsr2K1km8HHGCsy3HGAHIogHR-5lK45Neq1HMU3EkQtXs0jBGOrKvpkI8LXlybxxZvMhHuKVpo6ySIfVYBJC2DLm69j6Kw',
  },
  {
    name: 'Sanya Verma',
    specialty: 'Mindfulness & Breathwork',
    image:
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80',
  },
]

export const profileFavoriteTrainer: FavoriteTrainer = {
  name: featuredTrainer.name,
  specialty: featuredTrainer.specialty,
  image: featuredTrainer.image,
}

function readFavorites() {
  const raw = localStorage.getItem(FAVORITES_KEY)
  if (!raw) return [...DEFAULT_FAVORITES]

  try {
    const parsed = JSON.parse(raw) as FavoriteTrainer[]
    return Array.isArray(parsed) ? parsed : [...DEFAULT_FAVORITES]
  } catch {
    return [...DEFAULT_FAVORITES]
  }
}

export function getFavorites() {
  return readFavorites()
}

export function isFavorite(name: string) {
  return readFavorites().some((trainer) => trainer.name === name)
}

export function saveFavorites(trainers: FavoriteTrainer[]) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(trainers))
}

export function toggleFavorite(trainer: FavoriteTrainer): 'added' | 'removed' {
  const favorites = readFavorites()
  const existingIndex = favorites.findIndex((item) => item.name === trainer.name)

  if (existingIndex >= 0) {
    favorites.splice(existingIndex, 1)
    saveFavorites(favorites)
    return 'removed'
  }

  favorites.push(trainer)
  saveFavorites(favorites)
  return 'added'
}

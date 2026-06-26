import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type PropsWithChildren,
  type Dispatch,
} from 'react'
import { addresses, bookingHistory, currentUser, notifications } from '../data/mockData'
import type { Booking, BookingDraft, TrainerFilters } from '../types'

type AppState = {
  isAuthenticated: boolean
  phone: string
  otpVerified: boolean
  userName: string
  favorites: string[]
  recentlyViewed: string[]
  filters: TrainerFilters
  draft: BookingDraft
  bookings: Booking[]
  addresses: typeof addresses
  notifications: typeof notifications
}

type AppAction =
  | { type: 'LOGIN_PHONE'; payload: string }
  | { type: 'VERIFY_OTP' }
  | { type: 'LOGOUT' }
  | { type: 'SET_FILTERS'; payload: Partial<TrainerFilters> }
  | { type: 'RESET_FILTERS' }
  | { type: 'SELECT_SERVICE'; payload: string }
  | { type: 'SELECT_TRAINER'; payload: string }
  | { type: 'SELECT_ADDRESS'; payload: string }
  | { type: 'SELECT_DATE'; payload: string }
  | { type: 'SELECT_TIME'; payload: string }
  | { type: 'SET_DURATION'; payload: 60 | 90 }
  | { type: 'SET_RECURRING'; payload: boolean }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'ADD_RECENTLY_VIEWED'; payload: string }
  | { type: 'SET_PAYMENT_STATUS'; payload: BookingDraft['paymentStatus'] }
  | { type: 'CONFIRM_BOOKING' }
  | { type: 'CANCEL_BOOKING'; payload: string }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }

const defaultFilters: TrainerFilters = {
  gender: 'Any',
  style: 'All',
  availableToday: true,
  minExperience: 1,
}

const initialState: AppState = {
  isAuthenticated: false,
  phone: '',
  otpVerified: false,
  userName: currentUser.name,
  favorites: ['maya'],
  recentlyViewed: [],
  filters: defaultFilters,
  draft: {
    serviceId: null,
    trainerId: null,
    addressId: addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? null,
    date: null,
    time: null,
    duration: 60,
    recurring: false,
    paymentStatus: 'idle',
  },
  bookings: bookingHistory,
  addresses,
  notifications,
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN_PHONE':
      return { ...state, phone: action.payload }
    case 'VERIFY_OTP':
      return { ...state, otpVerified: true, isAuthenticated: true }
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, otpVerified: false, phone: '' }
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } }
    case 'RESET_FILTERS':
      return { ...state, filters: defaultFilters }
    case 'SELECT_SERVICE':
      return { ...state, draft: { ...state.draft, serviceId: action.payload } }
    case 'SELECT_TRAINER':
      return { ...state, draft: { ...state.draft, trainerId: action.payload } }
    case 'SELECT_ADDRESS':
      return { ...state, draft: { ...state.draft, addressId: action.payload } }
    case 'SELECT_DATE':
      return { ...state, draft: { ...state.draft, date: action.payload } }
    case 'SELECT_TIME':
      return { ...state, draft: { ...state.draft, time: action.payload } }
    case 'SET_DURATION':
      return { ...state, draft: { ...state.draft, duration: action.payload } }
    case 'SET_RECURRING':
      return { ...state, draft: { ...state.draft, recurring: action.payload } }
    case 'TOGGLE_FAVORITE': {
      const exists = state.favorites.includes(action.payload)
      return {
        ...state,
        favorites: exists
          ? state.favorites.filter((id) => id !== action.payload)
          : [...state.favorites, action.payload],
      }
    }
    case 'ADD_RECENTLY_VIEWED':
      return {
        ...state,
        recentlyViewed: [
          action.payload,
          ...state.recentlyViewed.filter((id) => id !== action.payload),
        ].slice(0, 5),
      }
    case 'SET_PAYMENT_STATUS':
      return { ...state, draft: { ...state.draft, paymentStatus: action.payload } }
    case 'CONFIRM_BOOKING': {
      if (
        !state.draft.serviceId ||
        !state.draft.trainerId ||
        !state.draft.addressId ||
        !state.draft.date ||
        !state.draft.time
      ) {
        return state
      }
      const amount = state.draft.duration === 90 ? 1700 : 1100
      const booking: Booking = {
        id: `b-${Date.now()}`,
        trainerId: state.draft.trainerId,
        serviceId: state.draft.serviceId,
        addressId: state.draft.addressId,
        date: state.draft.date,
        time: state.draft.time,
        duration: state.draft.duration,
        amount,
        status: 'upcoming',
      }
      return {
        ...state,
        bookings: [booking, ...state.bookings],
      }
    }
    case 'CANCEL_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map((booking) =>
          booking.id === action.payload
            ? { ...booking, status: 'cancelled' }
            : booking,
        ),
      }
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((item) =>
          item.id === action.payload ? { ...item, read: true } : item,
        ),
      }
    default:
      return state
  }
}

type ContextType = {
  state: AppState
  dispatch: Dispatch<AppAction>
}

const AppStateContext = createContext<ContextType | null>(null)

export function AppStateProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch])
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider')
  }
  return context
}

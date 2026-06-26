import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { services, trainers } from '../data/mockData'
import { useAppState } from '../context/AppStateContext'
import { EmptyState, PageCard, PrimaryButton, SecondaryButton } from '../components/ui'
import { formatCurrency } from '../utils/format'
import { figmaAssets } from '../data/figmaAssets'

export function HomePage() {
  const { state } = useAppState()
  const topTrainers = trainers.slice(0, 3)
  return (
    <div className="page-grid">
      <PageCard className="hero-card home-hero-card">
        <div
          className="home-hero"
          style={{ backgroundImage: `url(${figmaAssets.homeHero})` }}
        >
          <div className="overlay">
            <h2>50% off your first 1-on-1 session</h2>
            <p>Experience personalized wellness with expert practitioners.</p>
          </div>
        </div>
      </PageCard>
      <PageCard>
        <div className="row-space">
          <h3>Top Mentors</h3>
          <Link to="/trainers">View all</Link>
        </div>
        <div className="mentor-scroll">
          {topTrainers.map((trainer) => (
            <article key={trainer.id} className="mentor-card">
              <img
                src={
                  trainer.id === 'maya'
                    ? figmaAssets.mentor1
                    : trainer.id === 'vikram'
                      ? figmaAssets.mentor2
                      : figmaAssets.mentor3
                }
                alt={trainer.name}
              />
              <div className="mentor-meta">
                <strong>{trainer.name}</strong>
                <small>{trainer.specializations[0]}</small>
              </div>
            </article>
          ))}
        </div>
        <div className="actions-row">
          <Link to="/services" className="link-btn">
            Continue Journey
          </Link>
        </div>
      </PageCard>
      <PageCard>
        <h3>Recently Viewed</h3>
        {state.recentlyViewed.length === 0 ? (
          <EmptyState
            title="No recent profiles"
            body="Trainers you open will appear here for quick access."
          />
        ) : (
          <div className="chip-wrap">
            {state.recentlyViewed.map((id) => {
              const trainer = trainers.find((item) => item.id === id)
              return trainer ? <span key={id} className="chip">{trainer.name}</span> : null
            })}
          </div>
        )}
      </PageCard>
    </div>
  )
}

export function ServicesPage() {
  const { state, dispatch } = useAppState()
  const navigate = useNavigate()
  return (
    <div className="page-grid">
      <PageCard>
        <h2>Select Service</h2>
        <p>Choose a practice style to personalize your booking.</p>
        <div className="service-grid">
          {services.map((service) => (
            <button
              key={service.id}
              type="button"
              className={state.draft.serviceId === service.id ? 'service-card active' : 'service-card'}
              onClick={() => dispatch({ type: 'SELECT_SERVICE', payload: service.id })}
            >
              <span>{service.icon}</span>
              <strong>{service.name}</strong>
              <small>{service.description}</small>
            </button>
          ))}
        </div>
        <PrimaryButton
          onClick={() => navigate('/trainers')}
          disabled={!state.draft.serviceId}
        >
          Continue to Trainers
        </PrimaryButton>
      </PageCard>
    </div>
  )
}

export function TrainersPage() {
  const { state, dispatch } = useAppState()
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    return trainers.filter((trainer) => {
      if (query && !trainer.name.toLowerCase().includes(query.toLowerCase())) {
        return false
      }
      if (state.filters.gender !== 'Any' && trainer.gender !== state.filters.gender) {
        return false
      }
      if (state.filters.style !== 'All' && trainer.style !== state.filters.style) {
        return false
      }
      if (trainer.experienceYears < state.filters.minExperience) {
        return false
      }
      return true
    })
  }, [query, state.filters])

  return (
    <div className="page-grid">
      <PageCard>
        <div className="row-space">
          <h2>Available Trainers</h2>
          <Link to="/preferences">Filters</Link>
        </div>
        <input
          className="search-input"
          placeholder="Search trainer"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="stack">
          {filtered.length === 0 ? (
            <EmptyState
              title="No trainers found"
              body="Try another style, remove filters, or search a different name."
            />
          ) : (
            filtered.map((trainer) => (
              <article key={trainer.id} className="trainer-card">
                <div>
                  <h3>{trainer.name}</h3>
                  <p>
                    {trainer.specializations.join(' · ')} · {trainer.rating}★
                  </p>
                  <small>{trainer.experienceYears} years experience</small>
                </div>
                <div className="stack-sm">
                  <strong>{formatCurrency(trainer.pricePerSession)}</strong>
                  <div className="actions-row">
                    <SecondaryButton
                      type="button"
                      onClick={() => dispatch({ type: 'TOGGLE_FAVORITE', payload: trainer.id })}
                    >
                      {state.favorites.includes(trainer.id) ? 'Unsave' : 'Save'}
                    </SecondaryButton>
                    <Link to={`/trainer/${trainer.id}`} className="link-btn">
                      Book
                    </Link>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </PageCard>
    </div>
  )
}

export function PreferencesPage() {
  const { state, dispatch } = useAppState()
  const navigate = useNavigate()
  return (
    <div className="page-grid">
      <PageCard>
        <h2>Your Preferences</h2>
        <p>Refine trainer suggestions by style, gender, and experience.</p>
        <div className="stack">
          <div className="chip-wrap">
            {(['Any', 'Female', 'Male'] as const).map((gender) => (
              <button
                key={gender}
                type="button"
                className={state.filters.gender === gender ? 'chip active' : 'chip'}
                onClick={() => dispatch({ type: 'SET_FILTERS', payload: { gender } })}
              >
                {gender}
              </button>
            ))}
          </div>
          <div className="chip-wrap">
            {(['All', 'Hatha', 'Vinyasa', 'Power', 'Yin'] as const).map((style) => (
              <button
                key={style}
                type="button"
                className={state.filters.style === style ? 'chip active' : 'chip'}
                onClick={() => dispatch({ type: 'SET_FILTERS', payload: { style } })}
              >
                {style}
              </button>
            ))}
          </div>
          <label className="field">
            <span>Minimum Experience: {state.filters.minExperience} years</span>
            <input
              type="range"
              min={1}
              max={15}
              value={state.filters.minExperience}
              onChange={(event) =>
                dispatch({
                  type: 'SET_FILTERS',
                  payload: { minExperience: Number(event.target.value) },
                })
              }
            />
          </label>
        </div>
        <div className="actions-row">
          <PrimaryButton onClick={() => navigate('/trainers')}>Apply</PrimaryButton>
          <SecondaryButton onClick={() => dispatch({ type: 'RESET_FILTERS' })}>
            Reset
          </SecondaryButton>
        </div>
      </PageCard>
    </div>
  )
}

export function TrainerDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { dispatch } = useAppState()
  const trainer = trainers.find((item) => item.id === id)
  if (!trainer) {
    return (
      <div className="page-grid">
        <PageCard>
          <EmptyState title="Trainer not found" body="Please return to listing and retry." />
        </PageCard>
      </div>
    )
  }
  useEffect(() => {
    dispatch({ type: 'ADD_RECENTLY_VIEWED', payload: trainer.id })
  }, [dispatch, trainer.id])
  return (
    <div className="page-grid">
      <PageCard>
        <h2>{trainer.name}</h2>
        <p>
          {trainer.experienceYears} years · {trainer.rating}★ ({trainer.sessions}+ sessions)
        </p>
        <div className="chip-wrap">
          {trainer.specializations.map((specialization) => (
            <span key={specialization} className="chip">
              {specialization}
            </span>
          ))}
        </div>
        <h3>Available Slots</h3>
        <div className="chip-wrap">
          {trainer.availability.map((slot) => (
            <span key={slot} className="chip">
              {slot}
            </span>
          ))}
        </div>
        <div className="actions-row">
          <PrimaryButton
            onClick={() => {
              dispatch({ type: 'SELECT_TRAINER', payload: trainer.id })
              navigate('/address')
            }}
          >
            Continue
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate('/trainers')}>Back to List</SecondaryButton>
        </div>
      </PageCard>
    </div>
  )
}

import type { ButtonHTMLAttributes, InputHTMLAttributes, PropsWithChildren } from 'react'

export function PrimaryButton({
  children,
  className = '',
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button className={`btn btn-primary ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}

export function SecondaryButton({
  children,
  className = '',
  ...props
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button className={`btn btn-secondary ${className}`.trim()} {...props}>
      {children}
    </button>
  )
}

export function InputField({
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input {...props} />
      {error ? <small className="error-text">{error}</small> : null}
    </label>
  )
}

export function PageCard({
  children,
  className = '',
}: PropsWithChildren<{ className?: string }>) {
  return <section className={`page-card ${className}`.trim()}>{children}</section>
}

export function EmptyState({
  title,
  body,
}: {
  title: string
  body: string
}) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p>{body}</p>
    </div>
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`skeleton ${className}`.trim()} />
}

export function FigmaScreen({
  file,
  label,
}: {
  file: string
  label: string
}) {
  return (
    <div className="figma-screen">
      <img src={`/stitch-screens/${encodeURIComponent(file)}`} alt={label} />
    </div>
  )
}

import React, { useId } from 'react'

function Icon({ name }) {
  switch (name) {
    case 'activity':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 13h4l3-8l4 16l3-8h4v-2h-5l-2 5.2L10 3L7 11H3v2Z" fill="currentColor" />
        </svg>
      )
    case 'clock':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 7.5V12l3.5 2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'check':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2Z" fill="currentColor" />
        </svg>
      )
    default:
      return null
  }
}

/* =========================
   Progress Bar (Replaces Sparkline)
========================= */
function ProgressBar({ percent, tone }) {
  const bgColor = tone === 'orange' ? '#fb923c' : tone === 'blue' ? '#60a5fa' : tone === 'green' ? '#4ade80' : '#a78bfa';
  
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
      <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, height: '100%', backgroundColor: bgColor, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  )
}

/* =========================
   SINGLE CARD
========================= */
function KpiCard({ title, value = 0, delta = 0, icon, tone, percent = 0 }) {
  return (
    <article className={`ft-kpi ft-kpi--${tone}`} role="group" aria-label={title}>
      <div className="ft-kpiGlow" aria-hidden="true" />

      <header className="ft-kpiHeader">
        <span className="ft-kpiTitle">{title}</span>
        <span className={`ft-kpiIconBadge ft-kpiIconBadge--${tone}`} aria-hidden="true">
          <Icon name={icon} />
        </span>
      </header>

      <div className="ft-kpiValue">{value}</div>

      <footer className="ft-kpiFooter">
        <span className={`ft-kpiDelta ${typeof delta === 'string' && delta.includes('-') ? 'ft-kpiDelta--neg' : 'ft-kpiDelta--pos'}`}>
          {delta}
        </span>

        <div className="ft-kpiSpark">
          <ProgressBar percent={percent} tone={tone} />
        </div>
      </footer>
    </article>
  )
}

/* =========================
   MAIN COMPONENT
========================= */
export default function KpiCards({ stats = {} }) {
  const total = stats.total || 0;
  const pendingPct = total ? (stats.pending / total) * 100 : 0;
  const inProgressPct = total ? (stats.inProgress / total) * 100 : 0;
  const completedPct = total ? (stats.completed / total) * 100 : 0;

  const cards = [
    {
      title: 'Pending',
      value: stats.pending || 0,
      delta: `${stats.pending || 0} tasks`,
      icon: 'clock',
      tone: 'orange',
      percent: pendingPct,
    },
    {
      title: 'In Progress',
      value: stats.inProgress || 0,
      delta: `${stats.inProgress || 0} tasks`,
      icon: 'activity',
      tone: 'blue',
      percent: inProgressPct,
    },
    {
      title: 'Completed',
      value: stats.completed || 0,
      delta: `${stats.percent || 0}% done`,
      icon: 'check',
      tone: 'green',
      percent: completedPct,
    },
  ]

  return (
    <section className="ft-kpis" aria-label="Key metrics">
      {cards.map((c) => (
        <KpiCard key={c.title} {...c} />
      ))}
    </section>
  )
}
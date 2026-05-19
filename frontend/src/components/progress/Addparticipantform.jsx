import React, { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import "../../pages/ProgressPage.css";
console.log("CSS imported");
const initial = {
  userName: '',
  projectName: '',
  taskName: '',
  status: 'Pending',
}

export default function Addparticipantform({ open, onClose, onSave }) {
  const [form, setForm] = useState(initial)
  const [error, setError] = useState('')
  const titleId = useId()
  const errorId = useId()
  const closeRef = useRef(null)

  useEffect(() => {
    if (!open) return

    setForm(initial)
    setError('')

    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const t = setTimeout(() => closeRef.current?.focus(), 0)

    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }

    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = prev
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  function update(field, value) {
    setError('')
    setForm((s) => ({ ...s, [field]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    const userName = form.userName.trim()
    const projectName = form.projectName.trim()
    const taskName = form.taskName.trim()

    if (!userName || !projectName || !taskName) {
      setError('All fields are required')
      return
    }

    onSave?.({
      userName,
      projectName,
      taskName,
      status: form.status,
    })

    setForm(initial)
    setError('')
    onClose?.()
  }

  if (!open) return null

  return createPortal(
    <div className="add-user-overlay" onClick={onClose}>
      <div
        className="add-user-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="add-user-modal__header">
          <h2 id={titleId} className="add-user-modal__title">Add user</h2>

          <button type="button" ref={closeRef} onClick={onClose} className="add-user-modal__close">
            ×
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="add-user-modal__body">
            {error && <p id={errorId} style={{ color: '#f87171', fontSize: '0.9rem', margin: 0 }}>{error}</p>}

            <div className="add-user-field">
              <label>User name</label>
              <input
                placeholder="name"
                value={form.userName}
                onChange={(e) => update('userName', e.target.value)}
                required
              />
            </div>

            <div className="add-user-field">
              <label>Project name</label>
              <input
                placeholder="project name"
                value={form.projectName}
                onChange={(e) => update('projectName', e.target.value)}
                required
              />
            </div>

            <div className="add-user-field">
              <label>Task number</label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 1"
                value={form.taskName}
                onChange={(e) => update('taskName', e.target.value)}
                required
              />
            </div>

            <div className="add-user-field">
              <label>Task status</label>
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                required
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <footer className="add-user-modal__footer">
            <button type="button" onClick={onClose} className="add-user-btn-cancel">
              Cancel
            </button>

            <button type="submit" className="add-user-btn-save">
              Save participant
            </button>
          </footer>
        </form>
      </div>
    </div>,
    document.body
  )
}
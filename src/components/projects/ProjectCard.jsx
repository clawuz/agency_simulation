import { useLang } from '../../contexts/LanguageContext'

export default function ProjectCard({ project, onAccept, onBilling }) {
  const { lang, t } = useLang()

  return (
    <div style={{ background: '#252526', border: '1px solid #3e3e42', borderRadius: 8, padding: 16, marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <strong>{project.client}</strong>
        <span style={{ color: '#aaa', fontSize: 12 }}>{project.typeLabel?.[lang] ?? project.typeLabel?.tr}</span>
      </div>
      <div style={{ fontSize: 13, color: '#ccc', marginBottom: 8 }}>
        <span>💰 ₺{project.budget?.toLocaleString('tr-TR')}</span>
        <span style={{ marginLeft: 16 }}>⏱ {project.durationDays} gün</span>
        <span style={{ marginLeft: 16 }}>💳 {project.billing?.name}</span>
      </div>
      {project.status === 'in_progress' && (
        <div>
          <div style={{ background: '#3c3c3c', borderRadius: 4, height: 6, marginBottom: 8 }}>
            <div style={{ background: '#667EEA', borderRadius: 4, height: 6, width: `${Math.round(project.progress)}%` }} />
          </div>
          <span style={{ fontSize: 12, color: '#aaa' }}>{Math.round(project.progress)}%</span>
        </div>
      )}
      {project.status === 'available' && onAccept && (
        <button
          onClick={() => onAccept(project.id)}
          style={{ padding: '6px 14px', background: '#667EEA', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}
        >
          {t('btn_accept')}
        </button>
      )}
      {project.status === 'completed_unbilled' && onBilling && (
        <button
          onClick={() => onBilling(project.id)}
          style={{ padding: '6px 14px', background: '#4CAF50', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}
        >
          {t('btn_billing')}
        </button>
      )}
      {project.award && (
        <div style={{ marginTop: 8, fontSize: 13 }}>
          {project.award.icon} {project.award.label?.[lang] ?? project.award.label?.tr}
        </div>
      )}
    </div>
  )
}

import { useLang } from '../../contexts/LanguageContext'

export default function EmployeeCard({ employee, onFire }) {
  const { t } = useLang()
  return (
    <div style={{ background: '#252526', border: '1px solid #3e3e42', borderRadius: 8, padding: 14, marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <strong style={{ fontSize: 14 }}>{employee.name}</strong>
          <div style={{ color: '#aaa', fontSize: 12, marginTop: 2 }}>{employee.jobTitle} · {employee.department}</div>
          <div style={{ color: '#ccc', fontSize: 12, marginTop: 4 }}>
            💰 ₺{employee.salary?.toLocaleString('tr-TR')}/ay · ⚡ Lv.{employee.level}
          </div>
        </div>
        <button
          onClick={() => onFire(employee.id)}
          style={{ padding: '4px 10px', background: '#c0392b', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}
        >
          {t('btn_fire')}
        </button>
      </div>
    </div>
  )
}

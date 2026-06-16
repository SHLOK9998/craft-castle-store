export function EmptyState({ icon = 'inventory_2', title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="material-symbols-outlined text-cf-outline mb-4" style={{ fontSize: 48 }}>{icon}</span>
      <h3 className="text-lg font-semibold text-cf-on-surface mb-1">{title}</h3>
      {message && <p className="text-cf-outline text-sm mb-4">{message}</p>}
      {action}
    </div>
  )
}

import { useState, useEffect } from 'react'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { adminGetCategories, createCategory, updateCategory, deleteCategory } from '../../api/categories'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { Icon } from '../../components/shared/Icon'
import toast from 'react-hot-toast'

function CategoryModal({ cat, onClose, onSave }) {
  const [form, setForm] = useState({ name: cat?.name || '', description: cat?.description || '', sort_order: cat?.sort_order ?? 0, is_active: cat?.is_active ?? true })
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (cat) {
        await updateCategory(cat.id, form)
        toast.success('Category updated')
      } else {
        await createCategory(form)
        toast.success('Category created')
      }
      onSave()
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save')
    } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-modal p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-ca-on-surface">{cat ? 'Edit Category' : 'New Category'}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><Icon name="close" /></button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} required placeholder="e.g. Thread Rakhi"
              className="w-full border border-ca-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-ca-primary" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={2}
              className="w-full border border-ca-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-ca-primary resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Sort Order</label>
              <input value={form.sort_order} onChange={e => setForm(f => ({...f, sort_order: parseInt(e.target.value) || 0}))} type="number" min="0"
                className="w-full border border-ca-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-ca-primary" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({...f, is_active: e.target.checked}))} className="accent-ca-primary" />
                Active
              </label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 bg-ca-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-ca-primary-c transition-colors disabled:opacity-60">
              {saving ? <LoadingSpinner size="sm" /> : null}
              {saving ? 'Saving…' : 'Save Category'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 border border-ca-border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'new' | category object

  const load = () => {
    setLoading(true)
    adminGetCategories()
      .then(r => { setCategories(r.data.categories || []); setLoading(false) })
      .catch(() => setLoading(false))
  }
  useEffect(load, [])

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"? Products in this category will be uncategorized.`)) return
    try {
      await deleteCategory(id)
      toast.success('Deleted')
      load()
    } catch { toast.error('Failed to delete') }
  }

  return (
    <AdminLayout title="Categories">
      {modal !== null && (
        <CategoryModal
          cat={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load() }}
        />
      )}

      <div className="flex justify-end mb-4">
        <button onClick={() => setModal('new')} className="flex items-center gap-2 bg-ca-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-ca-primary-c transition-colors">
          <Icon name="add" size={16} /> New Category
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><LoadingSpinner /></div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No categories yet. Add one!</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ca-bg border-b border-ca-border">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide hidden sm:table-cell">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Sort</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ca-border">
              {categories.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-ca-on-surface">{c.name}</td>
                  <td className="px-4 py-3 text-gray-400 font-mono text-xs hidden sm:table-cell">{c.slug}</td>
                  <td className="px-4 py-3 text-gray-500">{c.sort_order}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setModal(c)} className="p-1.5 rounded-lg hover:bg-gray-100 text-ca-primary"><Icon name="edit" size={16} /></button>
                      <button onClick={() => handleDelete(c.id, c.name)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Icon name="delete" size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}

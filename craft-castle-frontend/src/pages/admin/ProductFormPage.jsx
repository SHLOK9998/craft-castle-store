import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AdminLayout } from '../../components/admin/AdminLayout'
import { getProduct, createProduct, updateProduct } from '../../api/products'
import { adminGetCategories } from '../../api/categories'
import { uploadMedia, deleteMedia, setPrimaryMedia } from '../../api/media'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { Icon } from '../../components/shared/Icon'
import toast from 'react-hot-toast'

export function ProductFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const fileRef = useRef()

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState([])
  const [media, setMedia] = useState([])
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    name: '', description: '', price: '', discounted_price: '',
    stock_quantity: '0', category_id: '', is_featured: false, is_active: true,
    whatsapp_message: '',
  })

  useEffect(() => {
    adminGetCategories().then(r => setCategories(r.data.categories || []))
    if (isEdit) {
      getProduct(id).then(r => {
        const p = r.data
        setForm({
          name: p.name || '', description: p.description || '',
          price: p.price || '', discounted_price: p.discounted_price || '',
          stock_quantity: p.stock_quantity ?? 0, category_id: p.category_id || '',
          is_featured: p.is_featured || false, is_active: p.is_active ?? true,
          whatsapp_message: p.whatsapp_message || '',
        })
        setMedia(p.media || [])
        setLoading(false)
      }).catch(() => setLoading(false))
    }
  }, [id, isEdit])

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: form.name, description: form.description,
        price: parseFloat(form.price),
        discounted_price: form.discounted_price ? parseFloat(form.discounted_price) : null,
        stock_quantity: parseInt(form.stock_quantity),
        category_id: parseInt(form.category_id),
        is_featured: form.is_featured, is_active: form.is_active,
        whatsapp_message: form.whatsapp_message || null,
      }
      if (isEdit) {
        await updateProduct(id, payload)
        toast.success('Product updated!')
      } else {
        const r = await createProduct(payload)
        toast.success('Product created!')
        navigate(`/admin/products/${r.data.id}/edit`)
        return
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save')
    } finally { setSaving(false) }
  }

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setUploading(true)
    for (let i = 0; i < files.length; i++) {
      try {
        const isPrimary = media.length === 0 && i === 0
        const r = await uploadMedia(id, files[i], isPrimary, media.length + i)
        setMedia(m => [...m, r.data])
        toast.success(`Uploaded ${files[i].name}`)
      } catch { toast.error(`Failed to upload ${files[i].name}`) }
    }
    setUploading(false)
    e.target.value = ''
  }

  const handleDeleteMedia = async (mediaId) => {
    if (!confirm('Delete this image?')) return
    try {
      await deleteMedia(mediaId)
      setMedia(m => m.filter(x => x.id !== mediaId))
      toast.success('Image deleted')
    } catch { toast.error('Failed to delete') }
  }

  const handleSetPrimary = async (mediaId) => {
    try {
      await setPrimaryMedia(mediaId)
      setMedia(m => m.map(x => ({ ...x, is_primary: x.id === mediaId })))
      toast.success('Set as primary image')
    } catch { toast.error('Failed') }
  }

  if (loading) return <AdminLayout title="Loading…"><div className="flex justify-center py-20"><LoadingSpinner /></div></AdminLayout>

  return (
    <AdminLayout title={isEdit ? 'Edit Product' : 'Add New Product'}>
      <div className="max-w-3xl">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => navigate('/admin/products')}
          className="mb-5 flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-ca-primary dark:text-[#ffb4a9]/85 dark:hover:text-[#ffb4a9] transition-colors group focus:outline-none"
          title="Back to products"
        >
          <Icon name="arrow_back" size={16} className="transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Products</span>
        </button>

        <form onSubmit={handleSave} className="space-y-6">

          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-card p-6 space-y-4">
            <h2 className="font-semibold text-ca-on-surface">Product Details</h2>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Product Name *</label>
              <input value={form.name} onChange={set('name')} required placeholder="e.g. Gold Thread Rakhi Set"
                className="w-full border border-ca-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-ca-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Description *</label>
              <textarea value={form.description} onChange={set('description')} required rows={3} placeholder="Describe the rakhi…"
                className="w-full border border-ca-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-ca-primary resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Price (₹) *</label>
                <input value={form.price} onChange={set('price')} type="number" min="1" step="0.01" required placeholder="150"
                  className="w-full border border-ca-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-ca-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Discounted Price (₹)</label>
                <input value={form.discounted_price} onChange={set('discounted_price')} type="number" min="1" step="0.01" placeholder="120"
                  className="w-full border border-ca-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-ca-primary" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Stock Quantity *</label>
                <input value={form.stock_quantity} onChange={set('stock_quantity')} type="number" min="0" required
                  className="w-full border border-ca-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-ca-primary" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Category *</label>
                <select value={form.category_id} onChange={set('category_id')} required
                  className="w-full border border-ca-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-ca-primary">
                  <option value="">Select category...</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Custom WhatsApp Message (optional)</label>
              <textarea value={form.whatsapp_message} onChange={set('whatsapp_message')} rows={2}
                placeholder="Leave blank for auto-generated message"
                className="w-full border border-ca-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-ca-primary resize-none" />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.is_featured} onChange={set('is_featured')} className="accent-ca-primary" />
                <span>Featured product</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={set('is_active')} className="accent-ca-primary" />
                <span>Active (visible to customers)</span>
              </label>
            </div>
          </div>

          {/* Media Upload — only after product is created */}
          {isEdit && (
            <div className="bg-white rounded-2xl shadow-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-ca-on-surface">Images & Videos</h2>
                <button type="button" onClick={() => fileRef.current.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 text-sm bg-ca-primary text-white px-3 py-1.5 rounded-lg hover:bg-ca-primary-c transition-colors disabled:opacity-50">
                  {uploading ? <LoadingSpinner size="sm" /> : <Icon name="upload" size={16} />}
                  {uploading ? 'Uploading…' : 'Upload'}
                </button>
                <input ref={fileRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleUpload} />
              </div>

              {media.length === 0 ? (
                <div className="border-2 border-dashed border-ca-border rounded-xl p-8 text-center cursor-pointer hover:border-ca-primary/40 transition-colors" onClick={() => fileRef.current.click()}>
                  <Icon name="add_photo_alternate" size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Click to upload images or videos</p>
                  <p className="text-xs text-gray-300 mt-1">JPG, PNG, WebP up to 5MB · MP4 up to 50MB</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {media.map(m => (
                    <div key={m.id} className="relative group aspect-square rounded-lg overflow-hidden border border-ca-border bg-ca-bg">
                      {m.media_type === 'video'
                        ? <div className="w-full h-full flex items-center justify-center bg-gray-100"><Icon name="play_circle" size={32} className="text-gray-400" /></div>
                        : <img src={m.media_url} alt="" className="w-full h-full object-cover" />
                      }
                      {m.is_primary && (
                        <span className="absolute top-1 left-1 bg-ca-primary text-white text-xs px-1.5 py-0.5 rounded-full">Primary</span>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        {!m.is_primary && m.media_type === 'image' && (
                          <button type="button" onClick={() => handleSetPrimary(m.id)} className="bg-white text-ca-primary p-1 rounded-full text-xs" title="Set as primary">
                            <Icon name="star" size={14} />
                          </button>
                        )}
                        <button type="button" onClick={() => handleDeleteMedia(m.id)} className="bg-white text-red-500 p-1 rounded-full" title="Delete">
                          <Icon name="delete" size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!isEdit && (
            <p className="text-xs text-gray-400 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-2">
              💡 Save the product first, then come back to upload images.
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button type="submit" disabled={saving}
              className="flex items-center gap-2 bg-ca-primary text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-ca-primary-c transition-colors disabled:opacity-60">
              {saving ? <LoadingSpinner size="sm" /> : <Icon name="save" size={16} />}
              {saving ? 'Saving…' : (isEdit ? 'Save Changes' : 'Create Product')}
            </button>
            <button type="button" onClick={() => navigate('/admin/products')}
              className="px-6 py-2.5 rounded-lg border border-ca-border text-sm font-semibold hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

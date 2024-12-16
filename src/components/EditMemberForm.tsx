import { useState, useRef, useEffect } from 'react'
import { Upload, X } from 'lucide-react'
import { Member } from '../types/Member'
import ImageCropper from './ImageCropper'

interface EditMemberFormProps {
  member: Member
  onSubmit: (memberData: Member) => void
  onClose: () => void
}

const EditMemberForm = ({ member, onSubmit, onClose }: EditMemberFormProps) => {
  const [formData, setFormData] = useState<Member>(member)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string>(member.image)
  const [showCropper, setShowCropper] = useState(false)
  const [originalImage, setOriginalImage] = useState<string>('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const imageUrl = reader.result as string
        setOriginalImage(imageUrl)
        setShowCropper(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = (croppedImage: string) => {
    setFormData({ ...formData, image: croppedImage })
    setPreviewImage(croppedImage)
    setShowCropper(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  const handleJoinDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const joinDate = new Date(e.target.value)
    const endDate = new Date(joinDate)
    endDate.setFullYear(endDate.getFullYear() + 1)
    
    setFormData({
      ...formData,
      joinDate: e.target.value,
      endDate: endDate.toISOString().split('T')[0]
    })
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const modal = document.getElementById('edit-modal')
      if (modal && !modal.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div id="edit-modal" className="bg-gray-900 p-6 rounded-lg w-full max-w-2xl mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">تعديل بيانات العضو</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="flex flex-col items-center mb-4">
            <div 
              className="w-32 h-32 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center mb-2 overflow-hidden cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
              style={{
                backgroundImage: `url(${previewImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {!previewImage && (
                <div className="text-white/70 hover:text-white flex flex-col items-center">
                  <Upload className="w-8 h-8 mb-2" />
                  <span className="text-sm">اختر صورة</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm text-white/70 hover:text-white"
            >
              تغيير الصورة
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2">الاسم</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-white mb-2">رقم الهاتف</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-white mb-2">نوع العضوية</label>
              <select
                value={formData.membershipType}
                onChange={(e) => setFormData({ ...formData, membershipType: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
              >
                <option value="عضوية ذهبية">عضوية ذهبية</option>
                <option value="عضوية فضية">عضوية فضية</option>
                <option value="عضوية برونزية">عضوية برونزية</option>
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">تاريخ الاشتراك</label>
              <input
                type="date"
                required
                value={formData.joinDate}
                onChange={handleJoinDateChange}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
              />
            </div>

            <div>
              <label className="block text-white mb-2">تاريخ انتهاء العضوية</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              حفظ التغييرات
            </button>
          </div>
        </form>
      </div>

      {showCropper && (
        <ImageCropper
          imageSrc={originalImage}
          onCropComplete={handleCropComplete}
          onCancel={() => setShowCropper(false)}
        />
      )}
    </div>
  )
}

export default EditMemberForm

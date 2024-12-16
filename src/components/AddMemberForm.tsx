import { useState, useRef } from 'react'
import { UserPlus, Upload } from 'lucide-react'
import ImageCropper from './ImageCropper'

interface AddMemberFormProps {
  onSubmit: (memberData: {
    name: string
    phone: string
    membershipType: string
    joinDate: string
    endDate: string
    image: string
  }) => void
}

const AddMemberForm = ({ onSubmit }: AddMemberFormProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    membershipType: 'عضوية فضية',
    joinDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    image: ''
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewImage, setPreviewImage] = useState<string>('')
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
    if (!formData.image) {
      alert('الرجاء اختيار صورة للعضو')
      return
    }
    onSubmit(formData)
    setFormData({
      name: '',
      phone: '',
      membershipType: 'عضوية فضية',
      joinDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      image: ''
    })
    setPreviewImage('')
    setIsOpen(false)
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

  return (
    <div className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 rounded-lg glass text-white flex items-center justify-center gap-2 hover:bg-white/20 transition-all duration-300"
      >
        <UserPlus className="w-5 h-5" />
        <span>إضافة عضو جديد</span>
      </button>

      {isOpen && (
        <form onSubmit={handleSubmit} className="mt-4 p-6 rounded-lg glass">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Upload Section */}
            <div className="md:col-span-2 flex flex-col items-center mb-4">
              <div 
                className="w-32 h-32 rounded-full border-2 border-dashed border-white/30 flex items-center justify-center mb-2 overflow-hidden"
                style={{
                  backgroundImage: previewImage ? `url(${previewImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!previewImage && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-white/70 hover:text-white flex flex-col items-center"
                  >
                    <Upload className="w-8 h-8 mb-2" />
                    <span className="text-sm">اختر صورة</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {previewImage && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-white/70 hover:text-white"
                >
                  تغيير الصورة
                </button>
              )}
            </div>

            <div>
              <label className="block text-white mb-2">الاسم</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-white/40"
                placeholder="أدخل اسم العضو"
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
                placeholder="05xxxxxxxx"
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

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              إضافة العضو
            </button>
          </div>
        </form>
      )}

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

export default AddMemberForm

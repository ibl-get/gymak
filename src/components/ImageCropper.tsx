import { useState, useRef } from 'react'
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

interface ImageCropperProps {
  imageSrc: string
  onCropComplete: (croppedImage: string) => void
  onCancel: () => void
  circularCrop?: boolean
  aspectRatio?: number
}

const ImageCropper = ({ 
  imageSrc, 
  onCropComplete, 
  onCancel,
  circularCrop = true,
  aspectRatio = 1
}: ImageCropperProps) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0,
    aspect: aspectRatio
  })
  
  const imgRef = useRef<HTMLImageElement>(null)

  const getCroppedImg = async (image: HTMLImageElement, crop: PixelCrop) => {
    const canvas = document.createElement('canvas')
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width
    canvas.height = crop.height
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('No 2d context')
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    )

    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty')
          return
        }
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => {
          resolve(reader.result as string)
        }
      }, 'image/jpeg')
    })
  }

  const handleCropComplete = async () => {
    if (!imgRef.current) return

    try {
      const croppedImage = await getCroppedImg(imgRef.current, crop as PixelCrop)
      onCropComplete(croppedImage)
    } catch (err) {
      console.error('Error cropping image:', err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900 p-6 rounded-lg max-w-2xl w-full mx-4">
        <h3 className="text-xl font-bold text-white mb-4">اقتصاص الصورة</h3>
        <div className="max-h-[60vh] overflow-auto mb-4">
          <ReactCrop
            crop={crop}
            onChange={c => setCrop(c)}
            aspect={aspectRatio}
            circularCrop={circularCrop}
          >
            <img ref={imgRef} src={imageSrc} alt="للاقتصاص" />
          </ReactCrop>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            إلغاء
          </button>
          <button
            onClick={handleCropComplete}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            تم
          </button>
        </div>
      </div>
    </div>
  )
}

export default ImageCropper

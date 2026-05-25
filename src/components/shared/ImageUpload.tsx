import { useRef } from 'react'
import { cn } from '../../lib/cn'
import { API_BASE } from '../../constants/endpoints'

function resolveUrl(url: string | null | undefined) {
  if (!url) return url
  return url.startsWith('/') ? `${API_BASE}${url}` : url
}

const MAX_BYTES = 5 * 1024 * 1024
const ACCEPT = 'image/jpeg,image/png'

interface ImageUploadProps {
  currentUrl: string | null | undefined
  onUpload: (file: File) => void
  onDelete: () => void
  disabled?: boolean
  isUploading?: boolean
  isDeleting?: boolean
  size?: 'sm' | 'md'
}

export function ImageUpload({
  currentUrl,
  onUpload,
  onDelete,
  disabled,
  isUploading,
  isDeleting,
  size = 'md',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const busy = isUploading || isDeleting
  const resolvedUrl = resolveUrl(currentUrl)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (file.size > MAX_BYTES) {
      alert('파일 크기는 5MB 이하여야 해요.')
      return
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('JPEG 또는 PNG 파일만 업로드할 수 있어요.')
      return
    }
    onUpload(file)
  }

  const boxSize = size === 'sm' ? 'size-16' : 'size-24'

  return (
    <div className={cn('relative shrink-0', boxSize)}>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || busy}
      />

      {/* Image preview / placeholder */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || busy}
        className={cn(
          'flex h-full w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-surface-alt transition-opacity',
          !disabled && !busy && 'hover:brightness-90',
          (disabled || busy) && 'cursor-default opacity-60'
        )}
      >
        {isUploading ? (
          <span className="text-[9px] font-bold text-ink-40">업로드 중</span>
        ) : resolvedUrl ? (
          <img
            src={resolvedUrl}
            alt=""
            className="h-full w-full object-cover"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        ) : (
          <span className="text-[9px] font-bold text-ink-40">사진 추가</span>
        )}
      </button>

      {/* Delete button */}
      {resolvedUrl && !disabled && (
        <button
          type="button"
          onClick={onDelete}
          disabled={busy}
          className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-alert text-white shadow disabled:opacity-50"
          style={{ fontSize: 9, lineHeight: 1 }}
        >
          ✕
        </button>
      )}
    </div>
  )
}

interface Props {
  size?: 'sm' | 'md' | 'lg'
  label?: string
}

export default function LoadingSpinner({ size = 'md', label }: Props) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' }

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`${sizes[size]} border-3 border-gray-200 border-t-maroon-800 rounded-full animate-spin`}
        style={{ borderWidth: 3 }}
      />
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  )
}

export function Flag({ code, className = 'h-5 w-auto' }) {
  if (!code) return null
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt=""
      className={className}
    />
  )
}

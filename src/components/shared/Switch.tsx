export function Switch({ on, onClick }: { on: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-6.5 w-10.5 items-center rounded-full p-0.5 ${
        on ? 'justify-end bg-pop' : 'justify-start bg-[#D3DBDE]'
      }`}
    >
      <div className="size-5.5 rounded-full bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]" />
    </button>
  )
}

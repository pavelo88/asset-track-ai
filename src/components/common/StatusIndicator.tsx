import { useEffect } from 'react'
import { Wifi, WifiOff } from 'lucide-react'
import { useInspectionStore } from '@/store/inspectionStore'

export function StatusIndicator() {
  const { isOnline, setOnlineStatus } = useInspectionStore()

  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true)
    const handleOffline = () => setOnlineStatus(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [setOnlineStatus])

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
      isOnline 
        ? 'bg-ee-emerald-100 text-ee-emerald-700' 
        : 'bg-ee-amber-100 text-ee-amber-700'
    }`}>
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span>Sincronizado</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span>Sin conexión</span>
        </>
      )}
    </div>
  )
}

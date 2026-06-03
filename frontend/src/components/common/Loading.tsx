import { Loader2 } from 'lucide-react'

interface LoadingProps {
  text?: string
}

export function Loading({ text = '加载中...' }: LoadingProps) {
  return (
    <div className="flex h-[200px] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </div>
    </div>
  )
}
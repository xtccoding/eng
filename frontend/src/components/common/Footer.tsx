export function Footer() {
  return (
    <footer className="ios-nav py-4">
      <div className="container flex flex-col items-center justify-between gap-2 md:h-12 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-xs">E</span>
          </div>
          <span className="ios-caption font-medium">EngFlow</span>
        </div>
        <p className="ios-caption text-muted-foreground">
          通过打字练习提升英语技能
        </p>
      </div>
    </footer>
  )
}
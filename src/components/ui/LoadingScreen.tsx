export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 flex items-center justify-center">
      <div className="text-center">
        {/* Logo */}
        <div className="w-16 h-16 mx-auto mb-6 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/30">
          <span className="text-2xl">⚡</span>
        </div>
        
        {/* Brand */}
        <h1 className="text-2xl font-bold text-white mb-2">FastStore ERP</h1>
        <p className="text-white/80 text-sm mb-8">Do'kon Boshqaruv Tizimi</p>
        
        {/* Loading Animation */}
        <div className="flex items-center justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-white rounded-full animate-bounce"
              style={{ 
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.8s'
              }}
            />
          ))}
        </div>
        
        {/* Loading Text */}
        <p className="text-white/60 text-xs mt-4">Yuklanmoqda...</p>
      </div>
    </div>
  )
}
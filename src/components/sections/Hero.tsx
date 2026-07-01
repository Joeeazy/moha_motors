import { Link } from 'react-router-dom'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type Variants,
} from 'framer-motion'

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const stats = [
  { value: '500+', label: 'Cars Listed' },
  { value: '15+', label: 'Years Experience' },
  { value: '50+', label: 'Car Brands' },
  { value: '1000+', label: 'Happy Clients' },
]

export default function Hero() {
  const reduce = useReducedMotion()

  // Mouse-driven parallax depth
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 20 })
  const sy = useSpring(my, { stiffness: 60, damping: 20 })

  // Background drifts opposite to content for a layered 3D feel
  const bgX = useTransform(sx, [-0.5, 0.5], [20, -20])
  const bgY = useTransform(sy, [-0.5, 0.5], [16, -16])
  const contentRotateX = useTransform(sy, [-0.5, 0.5], [4, -4])
  const contentRotateY = useTransform(sx, [-0.5, 0.5], [-4, 4])

  const handleMouse = (e: React.MouseEvent<HTMLElement>) => {
    if (reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const resetMouse = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <section
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950"
      style={{ perspective: 1200 }}
    >
      {/* Parallax background image */}
      <motion.div
        className="absolute inset-[-6%] bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          x: bgX,
          y: bgY,
          backgroundImage:
            'url(https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1920&q=85)',
        }}
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-maroon-950/90 via-maroon-900/80 to-gray-950/95" />

      {/* Floating ambient orbs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-maroon-600/30 blur-3xl animate-float-slow animate-pulse-glow" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 w-80 h-80 sm:w-[28rem] sm:h-[28rem] rounded-full bg-maroon-500/20 blur-3xl animate-float-slower" />

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 text-center py-20"
        style={{
          rotateX: reduce ? 0 : contentRotateX,
          rotateY: reduce ? 0 : contentRotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.p
          variants={item}
          className="text-maroon-300 text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] sm:tracking-[0.25em] mb-4 sm:mb-5"
        >
          Nairobi's Premier Car Dealership
        </motion.p>

        <motion.h1
          variants={item}
          className="text-white text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight mb-5 sm:mb-6"
          style={{ fontFamily: 'var(--font-display)', transform: 'translateZ(40px)' }}
        >
          Find Your
          <span className="block bg-gradient-to-r from-maroon-300 via-maroon-200 to-white bg-clip-text text-transparent">
            Dream Car
          </span>
          in Kenya
        </motion.h1>

        <motion.p
          variants={item}
          className="text-gray-300 text-base sm:text-xl max-w-xl sm:max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0"
        >
          From sleek sedans to rugged 4x4s — Moha Motors brings you Kenya's finest
          selection of quality vehicles at transparent prices.
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0"
        >
          <Link
            to="/inventory"
            className="group relative overflow-hidden px-7 sm:px-8 py-3.5 sm:py-4 bg-maroon-700 hover:bg-maroon-800 text-white font-semibold rounded-xl text-sm sm:text-base shadow-lg shadow-maroon-900/50 hover:shadow-xl hover:shadow-maroon-900/60 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            <span className="relative z-10">Browse Inventory</span>
            {/* Shine sweep on hover */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          </Link>
          <a
            href="#about"
            className="px-7 sm:px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm sm:text-base border border-white/20 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
          >
            Learn More
          </a>
        </motion.div>

        {/* Quick stats */}
        <motion.div
          variants={item}
          className="mt-14 sm:mt-20 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-xs sm:max-w-3xl mx-auto"
        >
          {stats.map(({ value, label }) => (
            <motion.div
              key={label}
              whileHover={reduce ? undefined : { y: -4, scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="text-center"
            >
              <p
                className="text-2xl sm:text-3xl font-bold text-white"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {value}
              </p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-white/40 hidden sm:flex"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={reduce ? undefined : { y: [0, 8, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-white/60 to-transparent"
        />
      </motion.div>
    </section>
  )
}

import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DataCardProps {
  title: string;
  value: string;
  trend: string;
  status: 'optimal' | 'stable' | 'warning';
  index: number;
}

export function DataCard({ title, value, trend, status, index }: DataCardProps) {
  const statusColors = {
    optimal: 'from-gray-600 to-gray-700',
    stable: 'from-gray-500 to-gray-600',
    warning: 'from-gray-700 to-gray-800',
  };

  const statusGlow = {
    optimal: 'shadow-[0_0_20px_rgba(120,120,120,0.3)]',
    stable: 'shadow-[0_0_20px_rgba(100,100,100,0.3)]',
    warning: 'shadow-[0_0_20px_rgba(140,140,140,0.3)]',
  };

  const getTrendIcon = () => {
    if (trend.includes('+')) return TrendingUp;
    if (trend.includes('-')) return TrendingDown;
    return Minus;
  };

  const TrendIcon = getTrendIcon();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="h-full relative group"
    >
      <div className={`h-full rounded-2xl border-2 border-gray-400/40 bg-gradient-to-br from-gray-200/40 via-gray-300/40 to-gray-200/40 backdrop-blur-lg p-6 ${statusGlow[status]} transition-all duration-300 group-hover:border-gray-500/60 relative overflow-hidden`}>
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle at center, rgba(150,150,150,0.15) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: 'easeInOut',
          }}
        />

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gray-500/50" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gray-500/50" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gray-500/50" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gray-500/50" />

        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${statusColors[status]})`,
                }}
                animate={{
                  opacity: [1, 0.5, 1],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
              />
              <span className="text-gray-600 text-sm uppercase tracking-wider">
                {title}
              </span>
            </div>
          </div>

          {/* Value */}
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              className={`text-4xl font-bold bg-gradient-to-r ${statusColors[status]} bg-clip-text text-transparent`}
              animate={{
                opacity: [1, 0.9, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
                delay: index * 0.1,
              }}
            >
              {value}
            </motion.div>
          </div>

          {/* Trend */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-400/30">
            <div className="flex items-center gap-2">
              <TrendIcon className={`w-4 h-4 ${trend.includes('+') ? 'text-gray-700' : trend.includes('-') ? 'text-gray-500' : 'text-gray-600'}`} />
              <span className="text-sm text-gray-700">{trend}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${statusColors[status]} bg-opacity-10 text-gray-700 uppercase tracking-wider`}>
              {status}
            </span>
          </div>

          {/* Animated progress bar */}
          <div className="mt-3 h-1 bg-gray-400/20 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${statusColors[status]}`}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: 1.5,
                delay: index * 0.1,
                ease: 'easeOut',
              }}
            />
          </div>
        </div>

        {/* Scan line effect */}
        <motion.div
          className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-gray-500/50 to-transparent"
          animate={{
            top: ['0%', '100%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            delay: index * 0.2,
            ease: 'linear',
          }}
        />
      </div>

      {/* Outer glow on hover */}
      <motion.div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${statusColors[status]} opacity-0 group-hover:opacity-20 blur-xl -z-10 transition-opacity duration-300`}
      />
    </motion.div>
  );
}
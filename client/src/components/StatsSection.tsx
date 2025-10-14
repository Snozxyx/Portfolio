import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

export const StatsSection = () => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  const stats = [
    { label: "Projects Completed", value: 12, suffix: "+" },
    { label: "GitHub Repositories", value: 30, suffix: "+" },
    { label: "Discord Bots", value: 8, suffix: "+" },
    { label: "Stream Hours", value: 500, suffix: "+" },
  ];

  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-6">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="text-center"
              data-testid={`stat-${index}`}
            >
              <div className="text-4xl md:text-5xl font-serif font-bold text-primary mb-2">
                {inView && (
                  <CountUp
                    end={stat.value}
                    duration={2.5}
                    suffix={stat.suffix}
                  />
                )}
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-sans">
                {stat.label}
              </div>
              <div className="w-16 h-0.5 bg-[#ff6b35] mx-auto mt-3"></div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

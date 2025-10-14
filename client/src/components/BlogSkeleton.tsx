import { motion } from 'framer-motion';

export const BlogPostSkeleton = () => {
  return (
    <div className="bg-card border border-card-border rounded-xl p-8 mb-8">
      <div className="animate-pulse space-y-6">
        {/* Title skeleton */}
        <div className="h-10 bg-muted/20 rounded w-3/4" />
        
        {/* Meta info skeleton */}
        <div className="flex gap-4">
          <div className="h-4 bg-muted/20 rounded w-24" />
          <div className="h-4 bg-muted/20 rounded w-24" />
          <div className="h-4 bg-muted/20 rounded w-32" />
        </div>
        
        {/* Tags skeleton */}
        <div className="flex gap-2">
          <div className="h-6 bg-muted/20 rounded-full w-20" />
          <div className="h-6 bg-muted/20 rounded-full w-24" />
          <div className="h-6 bg-muted/20 rounded-full w-16" />
        </div>
        
        {/* Cover image skeleton */}
        <div className="h-64 bg-muted/20 rounded-lg" />
        
        {/* Content skeleton */}
        <div className="space-y-3">
          <div className="h-4 bg-muted/20 rounded w-full" />
          <div className="h-4 bg-muted/20 rounded w-full" />
          <div className="h-4 bg-muted/20 rounded w-5/6" />
          <div className="h-4 bg-muted/20 rounded w-full" />
          <div className="h-4 bg-muted/20 rounded w-4/5" />
        </div>
      </div>
    </div>
  );
};

export const BlogListSkeleton = () => {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card border border-card-border rounded-xl p-6"
        >
          <div className="animate-pulse space-y-4">
            <div className="flex justify-between">
              <div className="h-7 bg-muted/20 rounded w-2/3" />
              <div className="h-7 bg-muted/20 rounded w-16" />
            </div>
            <div className="h-4 bg-muted/20 rounded w-full" />
            <div className="h-4 bg-muted/20 rounded w-5/6" />
            <div className="flex gap-2">
              <div className="h-5 bg-muted/20 rounded-full w-16" />
              <div className="h-5 bg-muted/20 rounded-full w-20" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Briefcase, GraduationCap, Calendar, Star, Edit } from 'lucide-react';

interface ProfileData {
  name: string;
  title: string;
  email?: string;
  phone?: string;
  location?: string;
  department?: string;
  education?: string;
  experience?: string;
  imageUrl?: string;
  rating?: number;
  badges?: string[];
}

interface AnimatedProfileCardProps {
  profile: ProfileData;
  variant?: 'default' | 'compact' | 'detailed';
  onEdit?: () => void;
  className?: string;
}

export default function AnimatedProfileCard({
  profile,
  variant = 'default',
  onEdit,
  className = '',
}: AnimatedProfileCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const shimmerVariants = {
    initial: { x: '-100%' },
    animate: {
      x: '100%',
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: 'linear' as const,
      },
    },
  };

  return (
    <motion.div
      className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      whileHover={{ y: -4 }}
      style={{ perspective: 1000 }}
    >
      {/* Edit button */}
      {onEdit && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onEdit}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full shadow-md"
        >
          <Edit className="w-4 h-4 text-gray-600" />
        </motion.button>
      )}

      {/* Flip card container */}
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative"
      >
        {/* Front side */}
        <div style={{ backfaceVisibility: 'hidden' }}>
          <div className="p-6">
            {/* Profile header */}
            <div className="flex items-start gap-4 mb-6">
              {/* Avatar with shimmer */}
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                {imageLoading && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    variants={shimmerVariants}
                    initial="initial"
                    animate="animate"
                  />
                )}
                {profile.imageUrl ? (
                  <img
                    src={profile.imageUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                    onLoad={() => setImageLoading(false)}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-400 to-accent-400">
                    <User className="w-12 h-12 text-white" />
                  </div>
                )}
                
                {/* Status indicator */}
                <motion.div
                  className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>

              {/* Name and title */}
              <div className="flex-1">
                <motion.h3
                  variants={itemVariants}
                  className="text-xl font-bold text-gray-900"
                >
                  {profile.name}
                </motion.h3>
                <motion.p
                  variants={itemVariants}
                  className="text-gray-600"
                >
                  {profile.title}
                </motion.p>
                
                {/* Rating */}
                {profile.rating && (
                  <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-1 mt-2"
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={`star-${i}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            i < profile.rating! 
                              ? 'text-yellow-400 fill-yellow-400' 
                              : 'text-gray-300'
                          }`}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>

            {/* Info grid - 모든 정보 표시 */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {profile.email && (
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </motion.div>
              )}
              
              {profile.phone && (
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <Phone className="w-4 h-4" />
                  <span>{profile.phone}</span>
                </motion.div>
              )}
              
              {profile.location && (
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </motion.div>
              )}
              
              {profile.department && (
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <Briefcase className="w-4 h-4" />
                  <span>{profile.department}</span>
                </motion.div>
              )}
              
              {profile.education && (
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>{profile.education}</span>
                </motion.div>
              )}
              
              {profile.experience && (
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{profile.experience}</span>
                </motion.div>
              )}
            </motion.div>

            {/* Badges */}
            {profile.badges && profile.badges.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-2 mt-4"
              >
                {profile.badges.map((badge, i) => (
                  <motion.span
                    key={`badge-${badge}`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.6 + i * 0.1,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.1 }}
                    className="px-3 py-1 bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 text-xs font-medium rounded-full"
                  >
                    {badge}
                  </motion.span>
                ))}
              </motion.div>
            )}

          </div>
        </div>

        {/* Back side (for detailed variant) */}
        {variant === 'detailed' && (
          <div
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <div className="p-6 h-full flex flex-col">
              <h4 className="text-lg font-bold mb-4">Additional Information</h4>
              
              <div className="space-y-4 flex-1">
                {profile.education && (
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>Education</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">{profile.education}</p>
                  </div>
                )}
                
                {profile.experience && (
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>Experience</span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">{profile.experience}</p>
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full py-2 bg-gray-100 text-gray-700 rounded-lg font-medium"
              >
                Back to Profile
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
export { AnimatedProfileCard };

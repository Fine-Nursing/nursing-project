'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface AnimatedAccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  variant?: 'default' | 'bordered' | 'filled';
  className?: string;
  onToggle?: (id: string, isOpen: boolean) => void;
}

export function AnimatedAccordion({
  items,
  allowMultiple = false,
  defaultOpen = [],
  variant = 'default',
  className = '',
  onToggle,
}: AnimatedAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    const isCurrentlyOpen = openItems.has(id);

    if (isCurrentlyOpen) {
      newOpenItems.delete(id);
    } else {
      if (!allowMultiple) {
        newOpenItems.clear();
      }
      newOpenItems.add(id);
    }

    setOpenItems(newOpenItems);
    onToggle?.(id, !isCurrentlyOpen);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'bordered':
        return 'border border-gray-200 rounded-lg';
      case 'filled':
        return 'bg-gray-50 rounded-lg';
      default:
        return '';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={`space-y-2 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        const isDisabled = item.disabled;

        return (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className={`overflow-hidden ${getVariantStyles()}`}
          >
            {/* Header */}
            <motion.button
              onClick={() => !isDisabled && toggleItem(item.id)}
              disabled={isDisabled}
              whileHover={!isDisabled ? { backgroundColor: 'rgba(0,0,0,0.02)' } : {}}
              whileTap={!isDisabled ? { scale: 0.98 } : {}}
              className={`
                w-full flex items-center justify-between p-4 text-left
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${variant === 'bordered' ? 'border-b border-gray-200' : ''}
                ${variant === 'filled' ? 'bg-gray-100' : ''}
              `}
            >
              <div className="flex items-center gap-3">
                {item.icon && (
                  <motion.div
                    animate={isOpen ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.icon}
                  </motion.div>
                )}
                <span className="font-medium text-gray-900">{item.title}</span>
              </div>

              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </motion.div>
            </motion.button>

            {/* Content */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: { duration: 0.3, ease: 'easeInOut' },
                    opacity: { duration: 0.2, delay: 0.1 },
                  }}
                  className="overflow-hidden"
                >
                  <motion.div
                    initial={{ y: -10 }}
                    animate={{ y: 0 }}
                    exit={{ y: -10 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                    className="p-4 text-gray-700"
                  >
                    {item.content}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// Nested Accordion Component
interface NestedAccordionItem extends AccordionItem {
  children?: NestedAccordionItem[];
}

interface AnimatedNestedAccordionProps extends Omit<AnimatedAccordionProps, 'items'> {
  items: NestedAccordionItem[];
  level?: number;
}

export function AnimatedNestedAccordion({
  items,
  level = 0,
  ...props
}: AnimatedNestedAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(props.defaultOpen));

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    const isCurrentlyOpen = openItems.has(id);

    if (isCurrentlyOpen) {
      newOpenItems.delete(id);
    } else {
      if (!props.allowMultiple) {
        newOpenItems.clear();
      }
      newOpenItems.add(id);
    }

    setOpenItems(newOpenItems);
    props.onToggle?.(id, !isCurrentlyOpen);
  };

  return (
    <div className={`${level > 0 ? 'ml-6 mt-2' : ''}`}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        const hasChildren = item.children && item.children.length > 0;

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: level * 0.1 }}
            className="border-l-2 border-gray-200"
          >
            {/* Header */}
            <motion.button
              onClick={() => toggleItem(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50"
            >
              {hasChildren ? (
                <motion.div
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-4 h-4 text-gray-500" />
                </motion.div>
              ) : (
                <div className="w-4 h-4" />
              )}
              
              {item.icon && (
                <div className="text-gray-500">{item.icon}</div>
              )}
              
              <span className="font-medium text-gray-900">{item.title}</span>
            </motion.button>

            {/* Content */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {item.content && (
                    <div className="p-3 ml-7 text-gray-700">
                      {item.content}
                    </div>
                  )}
                  
                  {hasChildren && (
                    <AnimatedNestedAccordion
                      {...props}
                      items={item.children!}
                      level={level + 1}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
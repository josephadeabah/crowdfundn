// Drawer.tsx
'use client';
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX } from 'react-icons/fi';

type Position = 'right' | 'left' | 'top' | 'bottom';

interface AnimatedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: Position;
  width?: string;
  height?: string;
  backgroundColor?: string;
  zIndex?: string;
  children: React.ReactNode;
  duration?: number;
}

const AnimatedDrawer: React.FC<AnimatedDrawerProps> = ({
  isOpen,
  onClose,
  position = 'right',
  width = '400px',
  height = '100%',
  backgroundColor = 'bg-white',
  zIndex = 'z-50',
  children,
  duration = 300,
}) => {
  const [mounted, setMounted] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (overlayRef.current === e.target) onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const getPositionClasses = () => {
    const positions = {
      right: {
        base: 'right-0 h-full',
        enter: 'translate-x-full',
        enterFrom: 'translate-x-0',
        leave: 'translate-x-0',
        leaveTo: 'translate-x-full',
      },
      left: {
        base: 'left-0 h-full',
        enter: '-translate-x-full',
        enterFrom: 'translate-x-0',
        leave: 'translate-x-0',
        leaveTo: '-translate-x-full',
      },
      top: {
        base: 'top-0 w-full',
        enter: '-translate-y-full',
        enterFrom: 'translate-y-0',
        leave: 'translate-y-0',
        leaveTo: '-translate-y-full',
      },
      bottom: {
        base: 'bottom-0 w-full',
        enter: 'translate-y-full',
        enterFrom: 'translate-y-0',
        leave: 'translate-y-0',
        leaveTo: 'translate-y-full',
      },
    };

    return positions[position];
  };

  const positionClasses = getPositionClasses();
  const dimensionStyle = {
    width: ['left', 'right'].includes(position) ? width : '100%',
    height: ['top', 'bottom'].includes(position) ? height : '100%',
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className={`fixed inset-0 ${zIndex} ${isOpen ? 'visible' : 'invisible'}`}
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        ref={overlayRef}
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${isOpen ? 'opacity-50' : 'opacity-0'}`}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`
          fixed ${positionClasses.base} ${backgroundColor}
          transform transition-transform duration-${duration} ease-in-out
          shadow-2xl overflow-hidden rounded-t-lg
          ${isOpen ? positionClasses.enterFrom : positionClasses.leaveTo}
        `}
        style={dimensionStyle}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          aria-label="Close drawer"
        >
          <FiX className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="h-full overflow-y-auto p-2 md:p-6 pt-16">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default AnimatedDrawer;

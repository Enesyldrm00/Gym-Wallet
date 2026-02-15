import React, { useState, useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

/**
 * Toast Notification Component
 * Displays success messages with auto-dismiss and manual close
 */
const Toast = ({ message, onClose, duration = 5000 }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Auto-dismiss after duration
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            setIsVisible(false);
            onClose();
        }, 300); // Match animation duration
    };

    if (!isVisible) return null;

    return (
        <div
            className={`fixed top-4 right-4 z-50 flex items-center space-x-3 bg-gradient-to-r from-gym-green to-emerald-500 text-white px-6 py-4 rounded-lg shadow-2xl neon-glow transition-all duration-300 ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
                }`}
        >
            {/* Success Icon */}
            <CheckCircle className="w-6 h-6 flex-shrink-0" />

            {/* Message */}
            <p className="font-medium text-sm max-w-xs">{message}</p>

            {/* Close Button */}
            <button
                onClick={handleClose}
                className="ml-4 p-1 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close notification"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Toast;

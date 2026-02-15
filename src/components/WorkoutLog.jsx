import React, { useState, useEffect } from 'react';
import { Camera, Upload, Trash2, Calendar, Image as ImageIcon } from 'lucide-react';

const WorkoutLog = () => {
    const [workoutLogs, setWorkoutLogs] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [workoutNote, setWorkoutNote] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Load logs from localStorage on mount
    useEffect(() => {
        const storedLogs = localStorage.getItem('gymfuel_workout_logs');
        if (storedLogs) {
            try {
                const parsed = JSON.parse(storedLogs);
                setWorkoutLogs(parsed);
            } catch (err) {
                console.error('Error parsing workout logs:', err);
                setWorkoutLogs([]);
            }
        }
    }, []);

    // Save logs to localStorage whenever they change
    useEffect(() => {
        if (workoutLogs.length > 0) {
            localStorage.setItem('gymfuel_workout_logs', JSON.stringify(workoutLogs));
        }
    }, [workoutLogs]);

    // Handle image upload
    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        // Use FileReader to convert to base64
        const reader = new FileReader();

        reader.onloadstart = () => {
            setIsUploading(true);
        };

        reader.onload = (event) => {
            const base64String = event.target.result;
            setImageBase64(base64String);
            setImagePreview(base64String);
            setIsUploading(false);
        };

        reader.onerror = () => {
            alert('Error reading file');
            setIsUploading(false);
        };

        reader.readAsDataURL(file);
    };

    // Post workout update
    const handlePostUpdate = () => {
        if (!imageBase64 && !workoutNote.trim()) {
            alert('Please add a photo or note');
            return;
        }

        const newLog = {
            id: Date.now().toString(),
            image: imageBase64,
            note: workoutNote.trim(),
            timestamp: new Date().toISOString(),
        };

        // Add to beginning of array (newest first)
        setWorkoutLogs([newLog, ...workoutLogs]);

        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('workoutLogsUpdated'));

        // Reset form
        setImagePreview(null);
        setImageBase64(null);
        setWorkoutNote('');

        // Reset file input
        const fileInput = document.getElementById('workout-image-upload');
        if (fileInput) fileInput.value = '';
    };

    // Delete log
    const handleDelete = (id) => {
        const confirmed = confirm('Delete this workout log?');
        if (confirmed) {
            const updatedLogs = workoutLogs.filter(log => log.id !== id);
            setWorkoutLogs(updatedLogs);

            // Update localStorage
            if (updatedLogs.length === 0) {
                localStorage.removeItem('gymfuel_workout_logs');
            } else {
                localStorage.setItem('gymfuel_workout_logs', JSON.stringify(updatedLogs));
            }

            // Dispatch custom event to notify other components
            window.dispatchEvent(new CustomEvent('workoutLogsUpdated'));
        }
    };

    // Clear preview
    const handleClearPreview = () => {
        setImagePreview(null);
        setImageBase64(null);
        const fileInput = document.getElementById('workout-image-upload');
        if (fileInput) fileInput.value = '';
    };

    // Format date
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="glass-effect rounded-xl p-6">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-6">
                <Camera className="text-gym-green w-6 h-6 neon-glow" />
                <h2 className="text-xl font-bold text-white">Workout Log</h2>
            </div>

            {/* Upload Section */}
            <div className="space-y-4 mb-6">
                {/* Image Upload Area */}
                <div>
                    <label
                        htmlFor="workout-image-upload"
                        className="block w-full cursor-pointer"
                    >
                        <div className={`
                            border-2 border-dashed rounded-lg p-6
                            transition-all duration-300
                            ${imagePreview
                                ? 'border-gym-green bg-gym-green/5'
                                : 'border-gym-green/30 bg-gym-dark hover:border-gym-green/60'
                            }
                        `}>
                            {imagePreview ? (
                                // Preview Mode
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Workout preview"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleClearPreview();
                                        }}
                                        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                // Upload Prompt
                                <div className="text-center">
                                    {isUploading ? (
                                        <div className="flex flex-col items-center">
                                            <Upload className="w-12 h-12 text-gym-green animate-pulse mb-2" />
                                            <p className="text-gray-400">Uploading...</p>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-12 h-12 text-gym-green mx-auto mb-2" />
                                            <p className="text-gray-300 mb-1">
                                                Click to upload workout photo
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                PNG, JPG up to 5MB
                                            </p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </label>
                    <input
                        id="workout-image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                </div>

                {/* Workout Note */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                        Workout Note
                    </label>
                    <textarea
                        value={workoutNote}
                        onChange={(e) => setWorkoutNote(e.target.value)}
                        placeholder="Hit a new PR on Squats! 💪"
                        className="w-full bg-gym-dark border border-gym-green/30 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:border-gym-green transition-colors resize-none"
                        rows={3}
                        maxLength={200}
                    />
                    <div className="text-xs text-gray-500 mt-1 text-right">
                        {workoutNote.length}/200
                    </div>
                </div>

                {/* Post Button */}
                <button
                    onClick={handlePostUpdate}
                    disabled={!imageBase64 && !workoutNote.trim()}
                    className="w-full bg-gym-green hover:bg-gym-green/80 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 neon-glow-button"
                >
                    Post Update 🔥
                </button>
            </div>

            {/* Previous Sessions Gallery */}
            {workoutLogs.length > 0 && (
                <div className="border-t border-gym-green/20 pt-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                        <Calendar className="w-5 h-5 text-gym-green mr-2" />
                        Previous Sessions ({workoutLogs.length})
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {workoutLogs.map((log) => (
                            <div
                                key={log.id}
                                className="bg-gym-dark rounded-lg p-4 border border-gym-green/20 hover:border-gym-green/50 transition-all duration-300"
                            >
                                {/* Image */}
                                {log.image ? (
                                    <img
                                        src={log.image}
                                        alt="Workout"
                                        className="w-full h-32 object-cover rounded-lg mb-3"
                                    />
                                ) : (
                                    <div className="w-full h-32 bg-gym-green/10 rounded-lg mb-3 flex items-center justify-center">
                                        <ImageIcon className="w-8 h-8 text-gray-600" />
                                    </div>
                                )}

                                {/* Note */}
                                {log.note && (
                                    <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                                        {log.note}
                                    </p>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-gray-500">
                                        {formatDate(log.timestamp)}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(log.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                        title="Delete log"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {workoutLogs.length === 0 && (
                <div className="border-t border-gym-green/20 pt-6 text-center">
                    <div className="text-gray-500">
                        <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No workout logs yet</p>
                        <p className="text-xs">Post your first gym session!</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkoutLog;

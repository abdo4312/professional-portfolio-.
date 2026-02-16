import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '../../services/utils';
import { uploadImage } from '../../services/api';
import { showError, showSuccess } from '../../services/toast';

interface ImageUploadProps {
    value?: string;
    onChange: (value: string) => void;
    label?: string;
    placeholder?: string;
    error?: string;
    className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    label,
    placeholder = 'Enter image URL or click to upload',
    error,
    className
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(value || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return;
        }

        setIsUploading(true);

        try {
            // Upload to server
            const url = await uploadImage(file);
            setPreview(url);
            onChange(url);
            showSuccess('Image uploaded successfully');
        } catch (err) {
            console.error('Error processing image:', err);
            showError('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleClear = () => {
        setPreview(null);
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setPreview(url || null);
        onChange(url);
    };

    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                </label>
            )}

            <div className="space-y-3">
                {/* URL Input */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={value || ''}
                        onChange={handleUrlChange}
                        placeholder={placeholder}
                        className="flex-1 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="image-upload"
                    />
                    <label
                        htmlFor="image-upload"
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl cursor-pointer transition-colors flex items-center gap-2"
                    >
                        <Upload size={18} />
                    </label>
                </div>

                {/* Preview */}
                {preview && (
                    <div className="relative aspect-video w-full max-w-md rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={() => setPreview(null)}
                        />
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Loader2 className="animate-spin text-white" size={32} />
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!preview && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-video w-full max-w-md border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                    >
                        <ImageIcon size={40} className="text-slate-400 mb-2" />
                        <p className="text-sm text-slate-500">
                            Click to upload an image
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                            PNG, JPG, GIF up to 5MB
                        </p>
                    </div>
                )}

                {error && (
                    <p className="text-xs text-red-500">{error}</p>
                )}
            </div>
        </div>
    );
};

export default ImageUpload;

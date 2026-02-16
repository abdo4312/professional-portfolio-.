import React, { useRef, useState } from 'react';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { cn } from '../../services/utils';
import { uploadImages } from '../../services/api';

interface MultiImageUploadProps {
    value?: string[];
    onChange: (value: string[]) => void;
    label?: string;
    error?: string;
    className?: string;
}

const GalleryImage = ({ url, index, onRemove }: { url: string; index: number; onRemove: () => void }) => {
    const [hasError, setHasError] = useState(false);

    if (hasError) return null;

    return (
        <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
            <img
                src={url}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover"
                onError={() => setHasError(true)}
            />
            <button
                type="button"
                onClick={onRemove}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <X size={16} />
            </button>
        </div>
    );
};

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
    value = [],
    onChange,
    label,
    error,
    className
}) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Validate file types and sizes
        const validFiles = files.filter(file => 
            file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
        );

        if (validFiles.length === 0) {
            setUploadError('Please select valid image files (max 5MB each).');
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            const urls = await uploadImages(validFiles);
            onChange([...value, ...urls]);
        } catch (err: any) {
            console.error('Error uploading images:', err);
            setUploadError(err.message || 'Failed to upload images. Please try again.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeImage = (index: number) => {
        const newValue = [...value];
        newValue.splice(index, 1);
        onChange(newValue);
    };

    return (
        <div className={cn("space-y-2", className)}>
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                </label>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {value.map((url, index) => (
                    <GalleryImage 
                        key={`${url}-${index}`} 
                        url={url} 
                        index={index} 
                        onRemove={() => removeImage(index)} 
                    />
                ))}

                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                        "aspect-video border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors relative",
                        isUploading && "pointer-events-none opacity-50"
                    )}
                >
                    {isUploading ? (
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                    ) : (
                        <>
                            <ImageIcon size={32} className="text-slate-400 mb-2" />
                            <span className="text-xs text-slate-500">Add Images</span>
                        </>
                    )}
                    
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
            </div>

            {uploadError && (
                <p className="text-xs text-red-500 mt-1">{uploadError}</p>
            )}

            {error && (
                <p className="text-xs text-red-500">{error}</p>
            )}
        </div>
    );
};

export default MultiImageUpload;

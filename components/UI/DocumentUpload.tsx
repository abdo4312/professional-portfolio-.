import React, { useRef, useState } from 'react';
import { X, FileText, Loader2, File, FileSpreadsheet, FileCode } from 'lucide-react';
import { cn } from '../../services/utils';
import { uploadDocuments } from '../../services/api';

interface DocumentUploadProps {
    value?: string[];
    onChange: (value: string[]) => void;
    label?: string;
    error?: string;
    className?: string;
}

const getFileIcon = (url: string) => {
    if (url.endsWith('.pdf')) return <FileText className="text-red-500" size={24} />;
    if (url.match(/\.(xls|xlsx|csv)$/)) return <FileSpreadsheet className="text-green-500" size={24} />;
    if (url.match(/\.(doc|docx)$/)) return <FileText className="text-blue-500" size={24} />;
    return <File className="text-slate-500" size={24} />;
};

const getFileName = (url: string) => {
    try {
        const parts = url.split('/');
        const fileName = parts[parts.length - 1];
        // Remove timestamp prefix if present (e.g., 123456789-filename.pdf)
        return fileName.replace(/^\d+-/, '');
    } catch (e) {
        return 'Document';
    }
};

const DocumentItem = ({ url, index, onRemove }: { url: string; index: number; onRemove: () => void }) => {
    return (
        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg group hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex-shrink-0">
                    {getFileIcon(url)}
                </div>
                <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate hover:text-blue-600 dark:hover:text-blue-400"
                >
                    {getFileName(url)}
                </a>
            </div>
            <button
                type="button"
                onClick={onRemove}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    );
};

const DocumentUpload: React.FC<DocumentUploadProps> = ({
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
        const validTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
            'text/csv'
        ];
        
        const validFiles = files.filter(file => {
            // Check extension as backup for mime type
            const ext = file.name.split('.').pop()?.toLowerCase();
            const validExt = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv'].includes(ext || '');
            return (validTypes.includes(file.type) || validExt) && file.size <= 10 * 1024 * 1024; // 10MB limit
        });

        if (validFiles.length === 0) {
            setUploadError('Please select valid documents (PDF, Word, Excel) max 10MB each.');
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            const urls = await uploadDocuments(validFiles);
            onChange([...value, ...urls]);
        } catch (err: any) {
            console.error('Error uploading documents:', err);
            setUploadError(err.message || 'Failed to upload documents. Please try again.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeDocument = (index: number) => {
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

            <div className="space-y-2">
                {value.map((url, index) => (
                    <DocumentItem 
                        key={`${url}-${index}`} 
                        url={url} 
                        index={index} 
                        onRemove={() => removeDocument(index)} 
                    />
                ))}
            </div>

            <div className="relative">
                <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                    className="hidden"
                    id="document-upload"
                    disabled={isUploading}
                />
                <label
                    htmlFor="document-upload"
                    className={cn(
                        "flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
                        isUploading 
                            ? "border-slate-300 bg-slate-50 cursor-not-allowed" 
                            : "border-slate-300 hover:border-blue-500 hover:bg-blue-50 dark:border-slate-700 dark:hover:bg-slate-800"
                    )}
                >
                    {isUploading ? (
                        <div className="flex items-center gap-2 text-slate-500">
                            <Loader2 className="animate-spin" size={20} />
                            <span>Uploading...</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <FileText size={20} />
                            <span>Click to upload PDF, Word, Excel</span>
                        </div>
                    )}
                </label>
            </div>

            {uploadError && (
                <p className="text-sm text-red-500 mt-1">{uploadError}</p>
            )}
            
            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
};

export default DocumentUpload;

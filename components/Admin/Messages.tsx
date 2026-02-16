import React, { useEffect, useState } from 'react';
import { fetchContacts, updateContactStatus, deleteContact, ContactMessage } from '../../services/api';
import { useLanguage } from '../../services/LanguageContext';
import { showSuccess, showError } from '../../services/toast';
import { Mail, MailOpen, Trash2, Calendar, User, MessageSquare, Search, Filter } from 'lucide-react';
import { cn } from '../../services/utils';

const Messages: React.FC = () => {
    const { language } = useLanguage();
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            setLoading(true);
            const data = await fetchContacts();
            setMessages(data);
        } catch (error) {
            console.error('Error loading messages', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleRead = async (msg: ContactMessage) => {
        try {
            await updateContactStatus(msg.id, !msg.isRead);
            setMessages(messages.map(m => m.id === msg.id ? { ...m, isRead: !m.isRead } : m));
            if (selectedMessage?.id === msg.id) {
                setSelectedMessage({ ...selectedMessage, isRead: !selectedMessage.isRead });
            }
        } catch (error) {
            console.error('Error updating status', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm(language === 'en' ? 'Delete this message?' : 'حذف هذه الرسالة؟')) {
            try {
                await deleteContact(id);
                setMessages(messages.filter(m => m.id !== id));
                if (selectedMessage?.id === id) setSelectedMessage(null);
                showSuccess(language === 'en' ? 'Message deleted successfully' : 'تم حذف الرسالة بنجاح');
            } catch (error) {
                console.error('Error deleting message', error);
                showError(language === 'en' ? 'Failed to delete message' : 'فشل حذف الرسالة');
            }
        }
    };

    const filteredMessages = messages.filter(msg => {
        const matchesSearch = msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            msg.subject?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'unread' && !msg.isRead) ||
            (filter === 'read' && msg.isRead);
        return matchesSearch && matchesFilter;
    });

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(language === 'en' ? 'en-US' : 'ar-EG', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <div className="flex flex-col h-[calc(100vh-160px)] animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                    {language === 'en' ? 'Incomming Messages' : 'الرسائل الواردة'}
                </h2>
                <div className="flex gap-2">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as any)}
                        className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">{language === 'en' ? 'All Messages' : 'جميع الرسائل'}</option>
                        <option value="unread">{language === 'en' ? 'Unread' : 'غير مقروءة'}</option>
                        <option value="read">{language === 'en' ? 'Read' : 'مقروءة'}</option>
                    </select>
                </div>
            </div>

            <div className="flex flex-1 gap-6 min-h-0">
                {/* Sidebar List */}
                <div className="w-full md:w-1/3 flex flex-col gap-4 min-h-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder={language === 'en' ? 'Search inbox...' : 'بحث في البريد...'}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="p-4 space-y-2 border-b border-slate-50 dark:border-slate-800/50 animate-pulse">
                                    <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-800 rounded" />
                                    <div className="h-3 w-3/4 bg-slate-100 dark:bg-slate-800 rounded" />
                                </div>
                            ))
                        ) : filteredMessages.length === 0 ? (
                            <div className="p-10 text-center text-slate-400">
                                {language === 'en' ? 'Inbox is empty' : 'صندوق الوارد فارغ'}
                            </div>
                        ) : filteredMessages.map((msg) => (
                            <div
                                key={msg.id}
                                onClick={() => setSelectedMessage(msg)}
                                className={cn(
                                    "p-4 border-b border-slate-50 dark:border-slate-800/50 cursor-pointer transition-all hover:bg-slate-50 dark:hover:bg-slate-800/50 relative",
                                    selectedMessage?.id === msg.id && "bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-l-blue-500",
                                    !msg.isRead && "font-bold"
                                )}
                            >
                                {!msg.isRead && (
                                    <div className="absolute top-4 right-4 w-2 h-2 bg-blue-500 rounded-full" />
                                )}
                                <div className="flex justify-between items-start mb-1 overflow-hidden">
                                    <h4 className="text-sm truncate pr-4">{msg.name}</h4>
                                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{formatDate(msg.createdAt)}</span>
                                </div>
                                <p className="text-xs text-slate-500 truncate mb-1">{msg.subject || 'No Subject'}</p>
                                <p className="text-[11px] text-slate-400 line-clamp-1">{msg.message}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Message Content */}
                <div className="hidden md:flex flex-1 flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden min-h-0 shadow-sm">
                    {selectedMessage ? (
                        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* Header */}
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/20">
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{selectedMessage.subject || 'No Subject'}</h3>
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <span className="flex items-center gap-1"><User size={14} /> {selectedMessage.name}</span>
                                        <span className="flex items-center gap-1"><Mail size={14} /> {selectedMessage.email}</span>
                                        <span className="flex items-center gap-1"><Calendar size={14} /> {formatDate(selectedMessage.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleToggleRead(selectedMessage)}
                                        className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-all"
                                        title={selectedMessage.isRead ? 'Mark as unread' : 'Mark as read'}
                                    >
                                        {selectedMessage.isRead ? <Mail size={20} /> : <MailOpen size={20} />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(selectedMessage.id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-slate-900">
                                <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {selectedMessage.message}
                                </div>
                            </div>

                            {/* Action */}
                            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                                <a
                                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || ''}`}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                                >
                                    <MessageSquare size={18} />
                                    {language === 'en' ? 'Reply via Email' : 'الرد عبر البريد'}
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-4 opacity-50">
                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                <Mail size={32} />
                            </div>
                            <p>{language === 'en' ? 'Select a message to read' : 'اختر رسالة لقراءتها'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;

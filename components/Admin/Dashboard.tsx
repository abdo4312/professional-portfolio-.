import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProjects, fetchContacts, deleteProject } from '../../services/api';
import Button from '../UI/Button';
import { useLanguage } from '../../services/LanguageContext';

const Dashboard: React.FC = () => {
  const { language, t } = useLanguage();
  const [projects, setProjects] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [p, c] = await Promise.all([fetchProjects(), fetchContacts()]);
      setProjects(p);
      setContacts(c);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const dashboardContent = {
    overview: { en: 'Overview', ar: 'نظرة عامة' },
    projectCount: { en: 'Total Projects', ar: 'إجمالي المشاريع' },
    messageCount: { en: 'Recent Messages', ar: 'الرسائل الأخيرة' },
    manageProjects: { en: 'Manage Projects', ar: 'إدارة المشاريع' },
    recentInbox: { en: 'Recent Inbox', ar: 'صندوق الوارد الأخير' },
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {dashboardContent.projectCount[language]}
          </div>
          <div className="text-3xl font-bold mt-1 text-blue-600">
            {projects.length}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {dashboardContent.messageCount[language]}
          </div>
          <div className="text-3xl font-bold mt-1 text-emerald-600">
            {contacts.length}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Projects View */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">{dashboardContent.manageProjects[language]}</h2>
            <Button size="sm" onClick={() => navigate('/admin/projects')}>View All</Button>
          </div>
          <div className="space-y-3">
            {projects.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <span className="font-medium">{p.title}</span>
                <span className="text-xs text-slate-500">{p.category || 'Portfolio'}</span>
              </div>
            ))}
            {projects.length === 0 && !loading && (
              <p className="text-slate-500 text-center py-4">No projects found.</p>
            )}
          </div>
        </div>

        {/* Quick Inbox View */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">{dashboardContent.recentInbox[language]}</h2>
            <Button size="sm" onClick={() => navigate('/admin/messages')}>View All</Button>
          </div>
          <div className="space-y-4">
            {contacts.slice(0, 3).map(c => (
              <div key={c.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-xl">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-sm">{c.name}</span>
                  <span className="text-xs text-slate-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">{c.message}</p>
              </div>
            ))}
            {contacts.length === 0 && !loading && (
              <p className="text-slate-500 text-center py-4">Inbox is empty.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
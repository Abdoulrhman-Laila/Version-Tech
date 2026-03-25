import React, { useState, useEffect } from 'react';
import { EnvelopeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { contactAPI, handleApiError } from '../../services/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

const tableWrapClass =
  'overflow-hidden rounded-2xl border border-primary-200/80 bg-white/90 shadow-lg shadow-primary-900/5 ring-1 ring-primary-300/25 dark:border-primary-700/40 dark:bg-primary-900/40 dark:ring-primary-500/15';

const btnIconClass =
  'inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40';

const statusPillClass =
  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold';

const AdminContacts = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await contactAPI.getAll();
      setMessages(response.data.data);
    } catch (error) {
      toast.error(handleApiError(error).message);
    } finally {
      setLoading(false);
    }
  };

  // تحديث حالة الرسالة (مقروء / جديد)
  const handleMarkAsRead = async (id) => {
    try {
      await contactAPI.update(id, { status: 'read' });
      toast.success('تم تحديث الحالة إلى مقروء');
      fetchMessages();
    } catch (error) {
      toast.error(handleApiError(error).message);
    }
  };

  // حذف الرسالة
  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    try {
      await contactAPI.delete(id);
      toast.success('تم حذف الرسالة');
      setMessages(messages.filter((msg) => msg._id !== id));
    } catch (error) {
      toast.error(handleApiError(error).message);
    }
  };

  return (
    <div className="fade-in space-y-6">
      <div className="card hover-lift p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-gradient/15 text-primary-700 ring-2 ring-primary-500/20 dark:bg-primary-600/25 dark:text-primary-200 dark:ring-primary-400/25">
              <EnvelopeIcon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="gradient-text text-2xl font-bold tracking-tight sm:text-3xl">
                إدارة الرسائل
              </h1>
              <p className="mt-0.5 text-sm text-primary-700/85 dark:text-primary-200/85">
                متابعة الرسائل وتحديث حالتها
              </p>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card flex min-h-[220px] items-center justify-center shadow-soft">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className={tableWrapClass}>
            <table className="w-full min-w-[800px] border-collapse text-start">
              <thead>
                <tr className="bg-primary-gradient text-primary-50 shadow-soft">
                  <th className="px-4 py-3.5 text-sm font-semibold tracking-wide">الاسم</th>
                  <th className="px-4 py-3.5 text-sm font-semibold tracking-wide">البريد الإلكتروني</th>
                  <th className="px-4 py-3.5 text-sm font-semibold tracking-wide">الموضوع</th>
                  <th className="px-4 py-3.5 text-sm font-semibold tracking-wide">تاريخ الاستلام</th>
                  <th className="px-4 py-3.5 text-sm font-semibold tracking-wide">الحالة</th>
                  <th className="px-4 py-3.5 text-sm font-semibold tracking-wide">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-200/70 dark:divide-primary-700/45">
                {messages.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-12 text-center">
                      <span className="inline-flex items-center gap-2 rounded-xl border border-dashed border-primary-300/80 bg-primary-50/80 px-4 py-3 dark:border-primary-600/50 dark:bg-primary-800/40">
                        <EnvelopeIcon className="h-5 w-5 text-primary-500 dark:text-primary-300" />
                        لا توجد رسائل حالياً
                      </span>
                    </td>
                  </tr>
                ) : (
                  messages.map((msg) => {
                    const isRead = msg.status === 'read';
                    return (
                      <tr
                        key={msg._id}
                        className="transition-colors hover:bg-primary-50/90 dark:hover:bg-primary-800/35"
                      >
                        <td className="p-4 align-top">
                          <span className="block text-sm font-medium text-primary-900 dark:text-primary-50">
                            {msg.name || 'لا يوجد'}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-primary-800/95 dark:text-primary-100/90">
                          {msg.email || 'لا يوجد'}
                        </td>
                        <td className="p-4 text-sm text-primary-800/95 dark:text-primary-100/90">
                          {msg.subject || 'لا يوجد'}
                        </td>
                        <td className="p-4 text-sm text-primary-800/95 dark:text-primary-100/90">
                          {msg.createdAt
                            ? new Date(msg.createdAt).toLocaleDateString('ar-EG')
                            : '—'}
                        </td>
                        <td className="p-4">
                          <span
                            className={`${statusPillClass} ${
                              isRead
                                ? 'border-primary-300/70 bg-primary-100/80 text-primary-900 dark:border-primary-600/50 dark:bg-primary-800/50 dark:text-primary-100'
                                : 'border-emerald-300/70 bg-emerald-50 text-emerald-700 dark:border-emerald-500/35 dark:bg-emerald-950/35 dark:text-emerald-300'
                            }`}
                          >
                            {isRead ? 'مقروء' : 'جديد'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleMarkAsRead(msg._id)}
                              disabled={isRead}
                              className={`${btnIconClass} ${
                                isRead
                                  ? 'cursor-not-allowed opacity-50'
                                  : 'border-primary-200/90 bg-primary-50 text-primary-800 hover:border-primary-300 hover:bg-primary-100 dark:border-primary-600/50 dark:bg-primary-800/40 dark:text-primary-100 dark:hover:bg-primary-700/50'
                              }`}
                              title={isRead ? 'مقروء بالفعل' : 'تعيين كمقروء'}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(msg._id)}
                              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-400/55 bg-red-50/90 px-3 py-1.5 text-sm font-semibold text-red-800 transition hover:bg-red-100 dark:border-red-500/45 dark:bg-red-950/35 dark:text-red-200 dark:hover:bg-red-950/55"
                              title="حذف الرسالة"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;

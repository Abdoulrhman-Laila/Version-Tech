import React, { useState, useEffect } from 'react';
import { EnvelopeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { contactAPI, handleApiError } from '../../services/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

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
    <div>
      <h1 className="text-2xl font-bold flex items-center space-x-2 rtl:space-x-reverse mb-4 text-primary-600">
        <EnvelopeIcon className="h-6 w-6" />
        إدارة الرسائل
      </h1>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border border-primary-300 rounded-md">
            <thead className="bg-primary-300 text-primary-900">
              <tr>
                <th className="p-2 text-left">الاسم</th>
                <th className="p-2 text-left">البريد الإلكتروني</th>
                <th className="p-2 text-left">الموضوع</th>
                <th className="p-2 text-left">تاريخ الاستلام</th>
                <th className="p-2 text-left">الحالة</th>
                <th className="p-2 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {messages.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-primary-600">
                    لا توجد رسائل حالياً
                  </td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg._id} className="border-t border-primary-300">
                    <td className="p-2">{msg.name}</td>
                    <td className="p-2">{msg.email}</td>
                    <td className="p-2">{msg.subject}</td>
                    <td className="p-2">
                      {new Date(msg.createdAt).toLocaleDateString('ar-EG')}
                    </td>
                    <td className="p-2">
                      {msg.status === 'read' ? 'مقروء' : 'جديد'}
                    </td>
                    <td className="p-2 flex space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => handleMarkAsRead(msg._id)}
                        className="text-primary-500 hover:text-primary-700"
                        title="تعيين كمقروء"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="text-primary-500 hover:text-primary-700"
                        title="حذف الرسالة"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;

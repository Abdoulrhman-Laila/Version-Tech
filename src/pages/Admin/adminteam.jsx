import React, { useState, useEffect } from 'react';
import { UserGroupIcon, PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { teamAPI, handleApiError } from '../../services/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

/** `primary` scale + index.css (`gradient-text`, `fade-in`, `hover-lift`) */
const inputClass =
  'w-full rounded-xl border border-primary-200/90 bg-primary-50 px-3 py-2.5 text-primary-900 shadow-sm transition-all duration-300 placeholder:text-primary-500/45 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 dark:border-primary-600/50 dark:bg-primary-900/45 dark:text-primary-50 dark:placeholder:text-primary-300/50';

const labelClass = 'mb-1.5 block text-sm font-semibold text-primary-800 dark:text-primary-100/95';

const errorTextClass = 'mt-1 text-sm font-medium text-primary-700 dark:text-primary-300';

const tableWrapClass =
  'overflow-hidden rounded-2xl border border-primary-200/80 bg-white/90 shadow-lg shadow-primary-900/5 ring-1 ring-primary-300/25 dark:border-primary-600/40 dark:bg-primary-900/40 dark:ring-primary-500/15';

const skillPillClass =
  'inline-flex items-center gap-1 rounded-full border border-primary-300/60 bg-primary-100/80 px-2.5 py-0.5 text-xs font-medium text-primary-900 dark:border-primary-600/50 dark:bg-primary-800/50 dark:text-primary-100';

const btnIcon =
  'inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-1.5 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/40';

const schema = yup.object().shape({
  name_ar: yup.string().min(2).max(50).required('الاسم العربي مطلوب'),
  name_en: yup.string().min(2).max(50).required('الاسم الإنجليزي مطلوب'),
  email: yup.string().email().required('البريد مطلوب'),
  password: yup.string().min(6).notRequired(),
  role: yup.string().oneOf(['مدير', 'مطور', 'مصمم', 'مطور خلفي']).required('اختر الدور'),
  bio_ar: yup.string().min(10).max(500).required('السيرة بالعربية مطلوبة'),
  bio_en: yup.string().min(10).max(500).required('السيرة بالإنجليزية مطلوبة'),
  skills: yup.array().of(yup.string()).min(0),
  image: yup.string().url().notRequired(),
  social: yup.object().shape({
    github: yup.string().url().notRequired(),
    linkedin: yup.string().url().notRequired(),
    twitter: yup.string().url().notRequired(),
    dribbble: yup.string().url().notRequired(),
    behance: yup.string().url().notRequired(),
  }),
});

const roleMap = { fullstack: 'مدير', frontend: 'مطور', backend: 'مطور خلفي', ui: 'مصمم' };
const roleReverseMap = { مدير: 'fullstack', مطور: 'frontend', 'مطور خلفي': 'backend', مصمم: 'ui' };

const AdminTeam = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name_ar: '',
      name_en: '',
      email: '',
      password: '',
      role: '',
      bio_ar: '',
      bio_en: '',
      skills: [],
      image: '',
      social: {
        github: '',
        linkedin: '',
        twitter: '',
        dribbble: '',
        behance: '',
      },
    },
  });

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await teamAPI.getAll();
      setMembers(response.data.data);
    } catch (error) {
      toast.error(handleApiError(error).message);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingMember(null);
    reset({
      name_ar: '',
      name_en: '',
      email: '',
      password: '',
      role: '',
      bio_ar: '',
      bio_en: '',
      skills: [],
      image: '',
      social: { github: '', linkedin: '', twitter: '', dribbble: '', behance: '' },
    });
    setModalOpen(true);
  };

  const openEditModal = (member) => {
    setEditingMember(member);
    reset({
      name_ar: member.name?.ar || '',
      name_en: member.name?.en || '',
      email: member.email || '',
      role: roleMap[member.role] || '',
      bio_ar: member.bio?.ar || '',
      bio_en: member.bio?.en || '',
      skills: member.skills || [],
      image: member.image || '',
      social: {
        github: member.social?.github || '',
        linkedin: member.social?.linkedin || '',
        twitter: member.social?.twitter || '',
        dribbble: member.social?.dribbble || '',
        behance: member.social?.behance || '',
      },
    });
    setModalOpen(true);
  };

  const addSkill = () => {
    const current = getValues('skills') || [];
    const newSkill = prompt('أدخل مهارة:');
    if (newSkill && !current.includes(newSkill)) {
      setValue('skills', [...current, newSkill]);
    }
  };

  const removeSkill = (skill) => {
    setValue(
      'skills',
      getValues('skills').filter((s) => s !== skill)
    );
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const filteredSocial = {};
      Object.entries(data.social || {}).forEach(([key, value]) => {
        if (value && value.trim() !== '') filteredSocial[key] = value;
      });

      const payload = {
        name: { ar: data.name_ar, en: data.name_en },
        bio: { ar: data.bio_ar, en: data.bio_en },
        email: data.email,
        role: roleReverseMap[data.role],
        skills: data.skills || [],
        image: data.image || '',
        social: filteredSocial,
        isActive: true,
      };

      if (!editingMember && data.password) payload.password = data.password;

      if (editingMember) {
        await teamAPI.update(editingMember._id, payload);
      } else {
        await teamAPI.create(payload);
      }

      toast.success(editingMember ? 'تم تعديل العضو بنجاح' : 'تم إضافة العضو بنجاح');
      fetchTeamMembers();
      setModalOpen(false);
    } catch (error) {
      const message = error.response?.data?.message || handleApiError(error).message;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا العضو؟')) return;
    try {
      setLoading(true);
      await teamAPI.delete(id);
      toast.success('تم حذف العضو بنجاح');
      fetchTeamMembers();
    } catch (error) {
      toast.error(handleApiError(error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-500/15 text-primary-600 ring-1 ring-primary-500/25 dark:bg-primary-500/20 dark:text-primary-300 dark:ring-primary-300/35">
            <UserGroupIcon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="gradient-text text-2xl font-bold tracking-tight sm:text-3xl">
              إدارة الفريق
            </h1>
            <p className="mt-0.5 text-sm text-primary-700/85 dark:text-primary-200/85">
              إضافة وتعديل وحذف أعضاء الفريق
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="hover-lift inline-flex items-center justify-center gap-2 self-start rounded-xl bg-primary-gradient px-4 py-2.5 text-sm font-semibold text-primary-50 shadow-lg shadow-primary-700/25 ring-2 ring-primary-500/25 transition-all duration-300 hover:shadow-xl dark:ring-primary-300/30"
        >
          <PlusIcon className="h-5 w-5 shrink-0" />
          إضافة عضو
        </button>
      </div>

      {loading && !modalOpen ? (
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-primary-200/70 bg-primary-50/50 dark:border-primary-600/40 dark:bg-primary-900/30">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className={tableWrapClass}>
            <table className="w-full min-w-[900px] border-collapse text-start">
              <thead>
                <tr className="bg-primary-gradient text-primary-50 shadow-inner shadow-primary-900/20">
                  <th className="px-4 py-3.5 text-sm font-semibold tracking-wide">الاسم</th>
                  <th className="px-4 py-3.5 text-sm font-semibold tracking-wide">البريد الإلكتروني</th>
                  <th className="px-4 py-3.5 text-sm font-semibold tracking-wide">الدور</th>
                  <th className="px-4 py-3.5 text-sm font-semibold tracking-wide">المهارات</th>
                  <th className="px-4 py-3.5 text-sm font-semibold tracking-wide">الصورة</th>
                  <th className="px-4 py-3.5 text-sm font-semibold tracking-wide">الروابط الاجتماعية</th>
                  <th className="px-4 py-3.5 text-sm font-semibold tracking-wide">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-200/70 dark:divide-primary-700/45">
                {members.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-sm text-primary-700/80 dark:text-primary-200/80"
                    >
                      <span className="inline-flex items-center gap-2 rounded-xl border border-dashed border-primary-300/80 bg-primary-50/60 px-4 py-3 dark:border-primary-600/50 dark:bg-primary-800/30">
                        <UserGroupIcon className="h-5 w-5 text-primary-500 dark:text-primary-300" />
                        لا يوجد أعضاء بعد — اضغط «إضافة عضو»
                      </span>
                    </td>
                  </tr>
                ) : (
                  members.map((member) => (
                    <tr
                      key={member._id}
                      className="transition-colors hover:bg-primary-50/90 dark:hover:bg-primary-800/35"
                    >
                      <td className="p-4 align-top">
                        <span className="block font-medium text-primary-900 dark:text-primary-50">
                          {member.name?.ar || 'لا يوجد'}
                        </span>
                        <span className="mt-0.5 block text-sm text-primary-600/90 dark:text-primary-300/85">
                          {member.name?.en || 'لا يوجد'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-primary-800/95 dark:text-primary-100/90">
                        {member.email ? (
                          <a
                            href={`mailto:${member.email}`}
                            className="underline decoration-primary-300/50 underline-offset-2 transition hover:text-primary-600 dark:hover:text-primary-300"
                          >
                            {member.email}
                          </a>
                        ) : (
                          'لا يوجد'
                        )}
                      </td>
                      <td className="whitespace-nowrap p-4 text-sm font-medium text-primary-800 dark:text-primary-100">
                        {roleMap[member.role] || 'لا يوجد'}
                      </td>
                      <td className="p-4">
                        <div className="flex max-w-[220px] flex-wrap gap-1.5">
                          {member.skills?.length > 0 ? (
                            member.skills.map((skill, i) => (
                              <span key={i} className={skillPillClass}>
                                {skill}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-primary-500/80 dark:text-primary-300/70">
                              لا توجد مهارات
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {member.image ? (
                          <img
                            src={member.image}
                            alt={member.name?.ar || 'صورة'}
                            className="h-11 w-11 rounded-full object-cover ring-2 ring-primary-200 dark:ring-primary-600/60"
                          />
                        ) : (
                          <span className="text-sm text-primary-500/80 dark:text-primary-300/70">
                            لا توجد صورة
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex max-w-[200px] flex-wrap gap-2">
                          {member.social && Object.keys(member.social).length > 0 ? (
                            Object.entries(member.social).map(([key, value]) => (
                              <a
                                key={key}
                                href={value}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm font-medium text-primary-600 underline decoration-primary-300/50 underline-offset-2 transition hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200"
                              >
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                              </a>
                            ))
                          ) : (
                            <span className="text-sm text-primary-500/80 dark:text-primary-300/70">
                              لا توجد روابط
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(member)}
                            className={`${btnIcon} border-primary-200/90 bg-primary-50 text-primary-800 hover:border-primary-300 hover:bg-primary-100 dark:border-primary-600/50 dark:bg-primary-800/40 dark:text-primary-100 dark:hover:bg-primary-700/50`}
                          >
                            <PencilIcon className="h-4 w-4" />
                            تعديل
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(member._id)}
                            className={`${btnIcon} border-primary-600/35 text-primary-800 hover:border-primary-700 hover:bg-primary-700 hover:text-primary-50 dark:border-primary-500/45 dark:text-primary-200 dark:hover:bg-primary-600`}
                          >
                            <TrashIcon className="h-4 w-4" />
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-primary-900/55 p-4 backdrop-blur-[2px] dark:bg-primary-900/65">
          <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-primary-200/80 bg-white/95 p-6 shadow-2xl shadow-primary-900/15 ring-1 ring-primary-300/30 dark:border-primary-600/45 dark:bg-primary-900/90 dark:ring-primary-500/20 sm:p-8">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute left-3 top-3 rounded-xl border border-primary-200/80 bg-primary-50 p-2 text-primary-700 transition hover:bg-primary-100 dark:border-primary-600/50 dark:bg-primary-800/60 dark:text-primary-100 dark:hover:bg-primary-700/50 rtl:left-auto rtl:right-3"
              aria-label="إغلاق"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>

            <h2 className="mb-6 pr-10 text-xl font-bold text-primary-900 dark:text-primary-50 rtl:pr-0 rtl:pl-10">
              <span className="gradient-text">
                {editingMember ? 'تعديل العضو' : 'إضافة عضو جديد'}
              </span>
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="flex flex-wrap gap-4">
                <div className="min-w-[200px] flex-1">
                  <label className={labelClass}>الاسم بالعربية</label>
                  <input {...register('name_ar')} className={inputClass} />
                  <p className={errorTextClass}>{errors.name_ar?.message}</p>
                </div>
                <div className="min-w-[200px] flex-1">
                  <label className={labelClass}>الاسم بالإنجليزية</label>
                  <input {...register('name_en')} className={inputClass} />
                  <p className={errorTextClass}>{errors.name_en?.message}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="min-w-[200px] flex-1">
                  <label className={labelClass}>البريد الإلكتروني</label>
                  <input type="email" {...register('email')} className={inputClass} />
                  <p className={errorTextClass}>{errors.email?.message}</p>
                </div>
                {!editingMember && (
                  <div className="min-w-[200px] flex-1">
                    <label className={labelClass}>كلمة المرور</label>
                    <input type="password" {...register('password')} className={inputClass} />
                    <p className={errorTextClass}>{errors.password?.message}</p>
                  </div>
                )}
                <div className="min-w-[200px] flex-1">
                  <label className={labelClass}>الدور</label>
                  <select {...register('role')} className={inputClass}>
                    <option value="">اختر الدور</option>
                    <option value="مدير">مدير</option>
                    <option value="مطور">مطور</option>
                    <option value="مطور خلفي">مطور خلفي</option>
                    <option value="مصمم">مصمم</option>
                  </select>
                  <p className={errorTextClass}>{errors.role?.message}</p>
                </div>
              </div>

              <div>
                <label className={labelClass}>رابط الصورة</label>
                <input type="text" {...register('image')} className={inputClass} />
                <p className={errorTextClass}>{errors.image?.message}</p>
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="min-w-[200px] flex-1">
                  <label className={labelClass}>السيرة بالعربية</label>
                  <textarea {...register('bio_ar')} className={`${inputClass} resize-y`} rows={3} />
                  <p className={errorTextClass}>{errors.bio_ar?.message}</p>
                </div>
                <div className="min-w-[200px] flex-1">
                  <label className={labelClass}>السيرة بالإنجليزية</label>
                  <textarea {...register('bio_en')} className={`${inputClass} resize-y`} rows={3} />
                  <p className={errorTextClass}>{errors.bio_en?.message}</p>
                </div>
              </div>

              <div className="rounded-xl border border-primary-200/70 bg-primary-50/50 p-4 dark:border-primary-600/40 dark:bg-primary-900/30">
                <label className={labelClass}>المهارات</label>
                <div className="mb-3 flex flex-wrap gap-2">
                  {getValues('skills')?.length > 0 ? (
                    getValues('skills').map((skill, i) => (
                      <span key={i} className={`${skillPillClass} pl-1`}>
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="rounded-md px-1.5 text-primary-700 transition hover:bg-primary-200/80 dark:text-primary-200 dark:hover:bg-primary-700/60"
                          aria-label={`حذف ${skill}`}
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-primary-500/80 dark:text-primary-300/70">
                      لا توجد مهارات
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={addSkill}
                  className="rounded-xl border border-primary-300/80 bg-white px-3 py-1.5 text-sm font-semibold text-primary-800 shadow-sm transition hover:bg-primary-100 dark:border-primary-600/50 dark:bg-primary-800/50 dark:text-primary-100 dark:hover:bg-primary-700/50"
                >
                  + أضف مهارة
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {['github', 'linkedin', 'twitter', 'dribbble', 'behance'].map((platform) => (
                  <div key={platform}>
                    <label className={labelClass}>{platform}</label>
                    <input type="text" {...register(`social.${platform}`)} className={inputClass} />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="hover-lift w-full rounded-xl bg-primary-gradient py-3 font-semibold text-primary-50 shadow-lg shadow-primary-700/25 ring-2 ring-primary-500/20 transition-all duration-300 hover:shadow-xl disabled:opacity-50 dark:ring-primary-300/30"
              >
                {editingMember ? 'تحديث العضو' : 'إضافة العضو'}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading && modalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-primary-900/40 backdrop-blur-[1px]">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default AdminTeam;

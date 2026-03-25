import React, { useState, useEffect } from "react";
import {
  FolderIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { projectsAPI, handleApiError } from "../../services/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const labelClass =
  "mb-1.5 block text-sm font-semibold text-primary-800 dark:text-primary-100/95";
const errorTextClass = "mt-1 text-sm font-medium text-primary-700 dark:text-primary-300";
const tableWrapClass = "card overflow-hidden shadow-soft";
const techPillClass =
  "inline-flex items-center gap-1 rounded-full border border-primary-300/60 bg-primary-100/80 px-2.5 py-0.5 text-xs font-medium text-primary-900 dark:border-primary-600/50 dark:bg-primary-800/50 dark:text-primary-100";

const schema = yup.object().shape({
  title_ar: yup.string().required("العنوان بالعربية مطلوب"),
  title_en: yup.string().required("العنوان بالإنجليزية مطلوب"),
  description_ar: yup.string().required("الوصف بالعربية مطلوب"),
  description_en: yup.string().required("الوصف بالإنجليزية مطلوب"),
  category: yup.string().required("التصنيف مطلوب"),
  duration: yup.string().notRequired(),
  status: yup.string().oneOf(["completed", "in-progress", "pending"]).required("حالة المشروع مطلوبة"),
  featured: yup.boolean().notRequired(),
  order: yup.number().notRequired(),
  isPublic: yup.boolean().notRequired(),
  images: yup.array().of(
    yup.object().shape({
      url: yup.string().url().notRequired(),
      alt_ar: yup.string().notRequired(),
      alt_en: yup.string().notRequired(),
      isPrimary: yup.boolean().notRequired(),
    })
  ).notRequired(),
  links: yup.object().shape({
    live: yup.string().url().notRequired(),
    github: yup.string().url().notRequired(),
  }),
  client: yup.object().shape({
    name: yup.string().notRequired(),
    website: yup.string().url().notRequired(),
  }),
  technologies: yup.array().of(yup.string()).notRequired(),
});

const statusLabelMap = {
  pending: "Pending",
  "in-progress": "In Progress",
  completed: "Completed",
};

const statusClassMap = {
  pending:
    "border border-amber-300/70 bg-amber-50 text-amber-700 dark:border-amber-500/35 dark:bg-amber-950/35 dark:text-amber-300",
  "in-progress":
    "border border-blue-300/70 bg-blue-50 text-blue-700 dark:border-blue-500/35 dark:bg-blue-950/35 dark:text-blue-300",
  completed:
    "border border-emerald-300/70 bg-emerald-50 text-emerald-700 dark:border-emerald-500/35 dark:bg-emerald-950/35 dark:text-emerald-300",
};

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

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
      title_ar: "",
      title_en: "",
      description_ar: "",
      description_en: "",
      category: "",
      duration: "",
      status: "pending",
      featured: false,
      order: 1,
      isPublic: true,
      images: [{ url: "", alt_ar: "", alt_en: "", isPrimary: true }],
      links: { live: "", github: "" },
      client: { name: "", website: "" },
      technologies: [],
    },
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getAll();
      setProjects(response.data.data || []);
    } catch (error) {
      toast.error(handleApiError(error).message);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingProject(null);
    reset();
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    reset({
      title_ar: project.title?.ar || "",
      title_en: project.title?.en || "",
      description_ar: project.description?.ar || "",
      description_en: project.description?.en || "",
      category: project.category || "",
      duration: project.duration || "",
      status: project.status || "pending",
      featured: project.featured || false,
      order: project.order || 1,
      isPublic: project.isPublic || true,
      images: project.images?.length > 0 ? project.images : [{ url: "", alt_ar: "", alt_en: "", isPrimary: true }],
      links: project.links || { live: "", github: "" },
      client: project.client || { name: "", website: "" },
      technologies: project.technologies || [],
    });
    setModalOpen(true);
  };

  const addTechnology = () => {
    const current = getValues("technologies") || [];
    const newTech = prompt("أدخل تقنية جديدة:");
    if (newTech && !current.includes(newTech)) {
      setValue("technologies", [...current, newTech]);
    }
  };

  const removeTechnology = (tech) => {
    setValue(
      "technologies",
      getValues("technologies").filter((t) => t !== tech)
    );
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        title: { ar: data.title_ar, en: data.title_en },
        description: { ar: data.description_ar, en: data.description_en },
        category: data.category,
        duration: data.duration || null,
        status: data.status,
        featured: data.featured || false,
        order: data.order || 1,
        isPublic: data.isPublic ?? true,
        images: data.images?.map((img) => ({
          url: img.url || null,
          alt: img.alt_ar || null,
          isPrimary: img.isPrimary ?? true,
        })),
        links: {
          live: data.links.live || null,
          github: data.links.github || null,
        },
        client: {
          name: data.client.name || null,
          website: data.client.website || null,
        },
        technologies: data.technologies || [],
      };

      if (editingProject) {
        await projectsAPI.update(editingProject._id, payload);
        toast.success("تم تعديل المشروع");
      } else {
        await projectsAPI.create(payload);
        toast.success("تم إضافة المشروع");
      }

      fetchProjects();
      setModalOpen(false);
      setEditingProject(null);
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "فشل في العملية");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا المشروع؟")) return;
    try {
      setLoading(true);
      await projectsAPI.delete(id);
      toast.success("تم حذف المشروع");
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || "فشل في الحذف");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="fade-in space-y-8">
      <div className="card hover-lift p-5 shadow-soft sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-gradient/15 text-primary-700 ring-2 ring-primary-500/20 dark:bg-primary-600/25 dark:text-primary-200 dark:ring-primary-400/25">
              <FolderIcon className="h-7 w-7" />
            </div>
            <div>
              <h1 className="gradient-text text-2xl font-bold tracking-tight sm:text-3xl">
                إدارة المشاريع
              </h1>
              <p className="mt-0.5 text-sm text-primary-700/85 dark:text-primary-200/85">
                إضافة وتعديل وحذف مشاريع الشركة
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="btn-gradient hover-lift inline-flex items-center justify-center gap-2 self-start shadow-medium ring-2 ring-primary-500/25 dark:ring-primary-400/20"
          >
            <PlusIcon className="h-5 w-5 shrink-0" />
            إضافة مشروع
          </button>
        </div>
      </div>

      {loading && !modalOpen ? (
        <div className="card flex min-h-[220px] items-center justify-center shadow-soft">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className={tableWrapClass}>
            <table className="w-full min-w-[950px] border-collapse text-start">
              <thead>
                <tr className="bg-primary-gradient text-primary-50 shadow-soft">
                  <th className="px-4 py-3.5 text-sm font-semibold tracking-wide">العنوان</th>
                  <th className="px-4 py-3.5 text-sm font-semibold tracking-wide">التصنيف</th>
                  <th className="px-4 py-3.5 text-sm font-semibold tracking-wide">العميل</th>
                  <th className="px-4 py-3.5 text-sm font-semibold tracking-wide">الصورة</th>
                  <th className="px-4 py-3.5 text-sm font-semibold tracking-wide">الروابط</th>
                  <th className="px-4 py-3.5 text-sm font-semibold tracking-wide">الحالة</th>
                  <th className="px-4 py-3.5 text-sm font-semibold tracking-wide">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary-200/70 dark:divide-primary-700/45">
                {projects.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-12 text-center text-sm text-primary-700/80 dark:text-primary-200/80"
                    >
                      <span className="inline-flex items-center gap-2 rounded-xl border border-dashed border-primary-300/80 bg-primary-50/80 px-4 py-3 dark:border-primary-600/50 dark:bg-primary-800/40">
                        <FolderIcon className="h-5 w-5 text-primary-500 dark:text-primary-300" />
                        لا توجد مشاريع بعد — اضغط «إضافة مشروع»
                      </span>
                    </td>
                  </tr>
                ) : (
                  projects.map((proj) => (
                    <tr
                      key={proj._id}
                      className="transition-colors hover:bg-primary-50/90 dark:hover:bg-primary-800/35"
                    >
                      <td className="p-4 align-top">
                        <span className="block font-medium text-primary-900 dark:text-primary-50">
                          {proj.title?.ar || "لا يوجد"}
                        </span>
                        <span className="mt-0.5 block text-sm text-primary-600/90 dark:text-primary-300/85">
                          {proj.title?.en || "No title"}
                        </span>
                      </td>
                      <td className="p-4 text-sm font-medium text-primary-800 dark:text-primary-100">
                        {proj.category || "لا يوجد"}
                      </td>
                      <td className="p-4 align-top">
                        <span className="block text-primary-800/95 dark:text-primary-100/90">
                          {proj.client?.name || "لا يوجد"}
                        </span>
                        {proj.client?.website ? (
                          <a
                            href={proj.client.website}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-0.5 block text-sm text-primary-600 underline decoration-primary-300/50 underline-offset-2 transition hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200"
                          >
                            {proj.client.website}
                          </a>
                        ) : (
                          <span className="mt-0.5 block text-sm text-primary-500/80 dark:text-primary-300/70">
                            لا يوجد موقع
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {proj.images?.[0]?.url ? (
                          <img
                            src={proj.images[0].url}
                            alt={proj.images[0].alt || "لا يوجد"}
                            className="h-11 w-11 rounded-lg object-cover ring-2 ring-primary-200 dark:ring-primary-600/60"
                          />
                        ) : (
                          <span className="text-sm text-primary-500/80 dark:text-primary-300/70">
                            لا توجد صورة
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm">
                        <div className="flex max-w-[240px] flex-col gap-1.5">
                          {proj.links?.live ? (
                            <a
                              href={proj.links.live}
                              target="_blank"
                              rel="noreferrer"
                              className="font-medium text-primary-600 underline decoration-primary-300/50 underline-offset-2 transition hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200"
                            >
                              Live
                            </a>
                          ) : (
                            <span className="text-primary-500/80 dark:text-primary-300/70">Live: لا يوجد</span>
                          )}
                          {proj.links?.github ? (
                            <a
                              href={proj.links.github}
                              target="_blank"
                              rel="noreferrer"
                              className="font-medium text-primary-600 underline decoration-primary-300/50 underline-offset-2 transition hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200"
                            >
                              GitHub
                            </a>
                          ) : (
                            <span className="text-primary-500/80 dark:text-primary-300/70">GitHub: لا يوجد</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            statusClassMap[proj.status] || statusClassMap.pending
                          }`}
                        >
                          {statusLabelMap[proj.status] || "Pending"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(proj)}
                            className="btn-outline btn-sm inline-flex items-center gap-1.5"
                          >
                            <PencilIcon className="h-4 w-4" />
                            تعديل
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(proj._id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-400/55 bg-red-50/90 px-3 py-1.5 text-sm font-semibold text-red-800 transition hover:bg-red-100 dark:border-red-500/45 dark:bg-red-950/35 dark:text-red-200 dark:hover:bg-red-950/55"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-900/50 p-4 backdrop-blur-sm dark:bg-primary-900/70">
          <div className="glass relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl p-6 shadow-medium ring-1 ring-primary-500/15 dark:ring-primary-400/20 sm:p-8">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="btn-ghost absolute left-3 top-3 rounded-xl border border-primary-200/80 p-2 rtl:left-auto rtl:right-3 dark:border-primary-600/50"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h2 className="mb-5 pr-10 text-xl font-bold rtl:pr-0 rtl:pl-10">
              <span className="gradient-text">
                {editingProject ? "تعديل المشروع" : "إضافة مشروع جديد"}
              </span>
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1">
                  <label className={labelClass}>العنوان بالعربية</label>
                  <input {...register("title_ar")} className="form-input" />
                  <p className={errorTextClass}>{errors.title_ar?.message}</p>
                </div>
                <div className="flex-1">
                  <label className={labelClass}>العنوان بالإنجليزية</label>
                  <input {...register("title_en")} className="form-input" />
                  <p className={errorTextClass}>{errors.title_en?.message}</p>
                </div>
              </div>

              <div>
                <label className={labelClass}>التصنيف</label>
                <select {...register("category")} className="form-input">
                  <option value="">اختر التصنيف</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="corporate">Corporate</option>
                  <option value="website">Website</option>
                </select>
                <p className={errorTextClass}>{errors.category?.message}</p>
              </div>

              <div>
                <label className={labelClass}>حالة المشروع</label>
                <select {...register("status")} className="form-input">
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <p className={errorTextClass}>{errors.status?.message}</p>
              </div>

              <div className="flex gap-4 flex-wrap">
                <div className="flex-1">
                  <label className={labelClass}>اسم العميل</label>
                  <input {...register("client.name")} className="form-input" />
                </div>
                <div className="flex-1">
                  <label className={labelClass}>موقع العميل</label>
                  <input {...register("client.website")} className="form-input" />
                </div>
              </div>

              <div className="flex gap-4 flex-wrap">
                <div className="flex-1">
                  <label className={labelClass}>رابط المشروع</label>
                  <input {...register("links.live")} className="form-input" />
                </div>
                <div className="flex-1">
                  <label className={labelClass}>GitHub</label>
                  <input {...register("links.github")} className="form-input" />
                </div>
              </div>

              <div>
                <label className={labelClass}>رابط الصورة</label>
                <input {...register("images.0.url")} className="form-input" />
              </div>

              <div className="flex gap-4 flex-wrap">
                <div className="flex-1">
                  <label className={labelClass}>الوصف بالعربية</label>
                  <textarea
                    {...register("description_ar")}
                    className="form-input min-h-[88px] resize-y"
                    rows={3}
                  />
                  <p className={errorTextClass}>{errors.description_ar?.message}</p>
                </div>
                <div className="flex-1">
                  <label className={labelClass}>الوصف بالإنجليزية</label>
                  <textarea
                    {...register("description_en")}
                    className="form-input min-h-[88px] resize-y"
                    rows={3}
                  />
                  <p className={errorTextClass}>{errors.description_en?.message}</p>
                </div>
              </div>

              <div className="card p-4 shadow-soft">
                <label className={labelClass}>التقنيات</label>
                <div className="mb-3 flex flex-wrap gap-2">
                  {getValues("technologies")?.length > 0 ? (
                    getValues("technologies").map((tech, i) => (
                      <span key={i} className={`${techPillClass} pl-1`}>
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="rounded-md px-1.5 text-primary-700 transition hover:bg-primary-200/80 dark:text-primary-200 dark:hover:bg-primary-700/60"
                        >
                          ×
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-primary-500/80 dark:text-primary-300/70">
                      لا توجد تقنيات
                    </span>
                  )}
                </div>
                <button type="button" onClick={addTechnology} className="btn-outline btn-sm">
                  + أضف تقنية
                </button>
              </div>

              <button
                type="submit"
                className="btn-gradient hover-lift w-full py-3 shadow-medium disabled:pointer-events-none disabled:opacity-50"
              >
                {editingProject ? "تحديث المشروع" : "إضافة المشروع"}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading && modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-primary-900/45 backdrop-blur-sm">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default AdminProjects;

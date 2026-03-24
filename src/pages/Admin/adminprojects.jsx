import React, { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { projectsAPI, handleApiError } from "../../services/api";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// ✅ التحقق
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

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const { register, handleSubmit, reset, setValue, getValues, formState: { errors } } = useForm({
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
    setValue("technologies", getValues("technologies").filter(t => t !== tech));
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
        isPublic: data.isPublic || true,
        images: data.images?.map(img => ({
          url: img.url || null,
          alt: img.alt_ar || null,
          isPrimary: img.isPrimary || true,
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
    await projectsAPI.delete(id); // هذا سيحذف المشروع فعليًا بعد تعديل backend
    toast.success("تم حذف المشروع");
    fetchProjects(); // تحديث الجدول بعد الحذف
  } catch (err) {
    toast.error(err.response?.data?.message || "فشل في الحذف");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold flex items-center mb-6 text-primary-600">
        <PlusIcon className="h-6 w-6 ml-2" /> إدارة المشاريع
      </h1>

      <button onClick={openAddModal} className="mb-6 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md flex items-center shadow-md">
        <PlusIcon className="h-5 w-5 mr-1" /> إضافة مشروع
      </button>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full border border-primary-300 rounded-lg shadow-sm text-left">
            <thead className="bg-primary-300 text-primary-900">
              <tr>
                <th className="p-3">العنوان</th>
                <th className="p-3">التصنيف</th>
                <th className="p-3">العميل</th>
                <th className="p-3">الصورة</th>
                <th className="p-3">الروابط</th>
                <th className="p-3">الحالة</th>
                <th className="p-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(proj => (
                <tr key={proj._id} className="border-t border-primary-300 hover:bg-primary-100 transition">
                  <td className="p-3 flex flex-col">
                    <span className="font-medium">{proj.title?.ar || "لا يوجد"}</span>
                    <span className="text-sm text-gray-500">{proj.title?.en || "No title"}</span>
                  </td>
                  <td className="p-3">{proj.category || "لا يوجد"}</td>
                  <td className="p-3 flex flex-col">
                    <span>{proj.client?.name || "لا يوجد"}</span>
                    <span className="text-sm text-blue-600">{proj.client?.website || "لا يوجد"}</span>
                  </td>
                  <td className="p-3">
                    {proj.images?.[0]?.url ? (
                      <img src={proj.images[0].url} alt={proj.images[0].alt || "لا يوجد"} className="h-10 w-10 rounded-md" />
                    ) : <span className="text-gray-400">لا توجد صورة</span>}
                  </td>
                  <td className="p-3 flex flex-col">
                    <span>Live: {proj.links?.live || "لا يوجد"}</span>
                    <span>GitHub: {proj.links?.github || "لا يوجد"}</span>
                  </td>
                  <td className="p-3">{proj.status || "pending"}</td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => openEditModal(proj)} className="bg-primary-500 hover:bg-primary-600 text-white px-2 py-1 rounded-md flex items-center gap-1">
                      <PencilIcon className="h-4 w-4" /> تعديل
                    </button>
                    <button onClick={() => handleDelete(proj._id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md flex items-center gap-1">
                      <TrashIcon className="h-4 w-4" /> حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl w-full max-w-5xl shadow-lg relative overflow-y-auto max-h-[90vh]">
            <button onClick={() => setModalOpen(false)} className="absolute top-3 right-3 text-primary-500 hover:text-primary-700">
              <XMarkIcon className="h-6 w-6" />
            </button>

            <h2 className="text-xl font-bold mb-5 text-primary-600">
              {editingProject ? "تعديل المشروع" : "إضافة مشروع جديد"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* العنوان */}
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">العنوان بالعربية</label>
                  <input {...register("title_ar")} className="w-full border p-2 rounded-md" />
                  <p className="text-red-500 text-sm">{errors.title_ar?.message}</p>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">العنوان بالإنجليزية</label>
                  <input {...register("title_en")} className="w-full border p-2 rounded-md" />
                  <p className="text-red-500 text-sm">{errors.title_en?.message}</p>
                </div>
              </div>

              {/* التصنيف */}
              <div>
                <label className="block text-sm font-medium mb-1">التصنيف</label>
                <select {...register("category")} className="w-full border p-2 rounded-md">
                  <option value="">اختر التصنيف</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="corporate">Corporate</option>
                  <option value="website">Website</option>
                </select>
                <p className="text-red-500 text-sm">{errors.category?.message}</p>
              </div>

              {/* الحالة */}
              <div>
                <label className="block text-sm font-medium mb-1">حالة المشروع</label>
                <select {...register("status")} className="w-full border p-2 rounded-md">
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
                <p className="text-red-500 text-sm">{errors.status?.message}</p>
              </div>

              {/* العميل */}
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">اسم العميل</label>
                  <input {...register("client.name")} className="w-full border p-2 rounded-md" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">موقع العميل</label>
                  <input {...register("client.website")} className="w-full border p-2 rounded-md" />
                </div>
              </div>

              {/* روابط المشروع */}
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">رابط المشروع</label>
                  <input {...register("links.live")} className="w-full border p-2 rounded-md" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">GitHub</label>
                  <input {...register("links.github")} className="w-full border p-2 rounded-md" />
                </div>
              </div>

              {/* الصورة */}
              <div>
                <label className="block text-sm font-medium mb-1">رابط الصورة</label>
                <input {...register("images.0.url")} className="w-full border p-2 rounded-md" />
              </div>

              {/* الوصف */}
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">الوصف بالعربية</label>
                  <textarea {...register("description_ar")} className="w-full border p-2 rounded-md" rows={3} />
                  <p className="text-red-500 text-sm">{errors.description_ar?.message}</p>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">الوصف بالإنجليزية</label>
                  <textarea {...register("description_en")} className="w-full border p-2 rounded-md" rows={3} />
                  <p className="text-red-500 text-sm">{errors.description_en?.message}</p>
                </div>
              </div>

              {/* التقنيات */}
              <div>
                <label className="block text-sm font-medium mb-1">التقنيات</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {getValues("technologies")?.length > 0 ? (
                    getValues("technologies").map((tech, i) => (
                      <span key={i} className="bg-primary-300 px-2 py-1 rounded flex items-center gap-1">
                        {tech}
                        <button type="button" onClick={() => removeTechnology(tech)} className="text-xs text-red-600 hover:underline">x</button>
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">لا توجد تقنيات</span>
                  )}
                </div>
                <button type="button" onClick={addTechnology} className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded-md">
                  + أضف تقنية
                </button>
              </div>

              <button type="submit" className="w-full bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-md font-medium shadow-md">
                {editingProject ? "تحديث المشروع" : "إضافة المشروع"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;

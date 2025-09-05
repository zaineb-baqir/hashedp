"use client";

import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function OrgPage() {
  const router = useRouter();

  const [newSectionName, setNewSectionName] = useState("");
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [newDepartmentSection, setNewDepartmentSection] = useState<number | null>(null);

  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);

  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [editingSectionName, setEditingSectionName] = useState("");

  const [editingDepartmentId, setEditingDepartmentId] = useState<number | null>(null);
  const [editingDepartmentName, setEditingDepartmentName] = useState("");

  const utils = trpc.useUtils();

  // البيانات
  const { data: sections } = trpc.org.getSections.useQuery();
  const { data: departments } = trpc.org.getDepartmentsBySection.useQuery(selectedSection || 0, {
    enabled: !!selectedSection,
  });
  const { data: employees } = trpc.org.getEmployeesByDepartment.useQuery(selectedDepartment || 0, {
    enabled: !!selectedDepartment,
  });

  // Mutations
  const addSection = trpc.org.addSections.useMutation({
    onSuccess: () => {
      utils.org.getSections.invalidate();
      setNewSectionName("");
    },
  });

  const addDepartment = trpc.org.addDepartment.useMutation({
    onSuccess: () => {
      if (newDepartmentSection) {
        utils.org.getDepartmentsBySection.invalidate();
        setNewDepartmentName("");
        setNewDepartmentSection(null);
      }
    },
  });

  const updateSection = trpc.org.updateSection.useMutation({
    onSuccess: () => {
      utils.org.getSections.invalidate();
      setEditingSectionId(null);
      setEditingSectionName("");
    },
  });

  const updateDepartment = trpc.org.updateDepartment.useMutation({
    onSuccess: () => {
      if (selectedSection) utils.org.getDepartmentsBySection.invalidate();
      setEditingDepartmentId(null);
      setEditingDepartmentName("");
    },
  });

  // ✅ حذف القسم (Section) إذا فارغ تمامًا
  const deleteSection = trpc.org.deleteSection.useMutation({
    onSuccess: () => utils.org.getSections.invalidate(),
    onError: (err) => alert(err.message),
  });

  // ✅ حذف الشعبة (Department) إذا فارغة
  const deleteDepartment = trpc.org.deleteDepartment.useMutation({
    onSuccess: () => {
      if (selectedSection) utils.org.getDepartmentsBySection.invalidate(selectedSection);
    },
    onError: (err) => alert(err.message),
  });

  const handleSectionSave = (id: number) => {
    updateSection.mutate({ id, name: editingSectionName });
  };

  const handleDepartmentSave = (id: number) => {
    updateDepartment.mutate({ id, name: editingDepartmentName });
  };

  return (
    <div className="p-6 space-y-6">
      {/* إضافة قسم */}
      <div className="flex gap-2">
        <Input
          placeholder="اسم القسم الجديد"
          value={newSectionName}
          onChange={(e) => setNewSectionName(e.target.value)}
        />
        <Button onClick={() => addSection.mutate({ name: newSectionName })}>
          ➕ إضافة قسم
        </Button>
      </div>

      {/* إضافة شعبة */}
      <div className="flex gap-2 mt-4">
        <Input
          placeholder="اسم الشعبة الجديدة"
          value={newDepartmentName}
          onChange={(e) => setNewDepartmentName(e.target.value)}
        />
        <select
          value={newDepartmentSection || ""}
          onChange={(e) => setNewDepartmentSection(Number(e.target.value))}
          className="border rounded p-2"
        >
          <option value="">اختر القسم</option>
          {sections?.map((sect) => (
            <option key={sect.id} value={sect.id}>
              {sect.name}
            </option>
          ))}
        </select>
        <Button
          onClick={() =>
            newDepartmentSection &&
            addDepartment.mutate({
              name: newDepartmentName,
              sectionId: newDepartmentSection,
            })
          }
        >
          ➕ إضافة شعبة
        </Button>
      </div>

      <Button
        onClick={() => router.push("/employee-form")}
        className="bg-blue-500 text-white"
      >
        ➕ إضافة موظف
      </Button>

      {/* الأقسام */}
      <div>
        <h2 className="font-semibold">الأقسام</h2>
        <div className="flex gap-2 flex-wrap">
          {sections?.map((sect) =>
            editingSectionId === sect.id ? (
              <div key={sect.id} className="flex gap-2">
                <Input
                  value={editingSectionName}
                  onChange={(e) => setEditingSectionName(e.target.value)}
                />
                <Button onClick={() => handleSectionSave(sect.id)}>حفظ</Button>
                <Button onClick={() => setEditingSectionId(null)}>إلغاء</Button>
              </div>
            ) : (
              <div key={sect.id} className="flex items-center gap-1">
                <Button
                  onClick={() => setSelectedSection(sect.id)}
                  className="flex items-center gap-1"
                >
                  {sect.name}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingSectionId(sect.id);
                      setEditingSectionName(sect.name);
                    }}
                    className="text-sm text-yellow-500 cursor-pointer"
                  >
                    ✏️
                  </span>
                </Button>

                {/* زر حذف القسم */}
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm("هل أنت متأكد من حذف هذا القسم؟")) {
                      deleteSection.mutate({ id: sect.id });
                    }
                  }}
                >
                  🗑️
                </Button>
              </div>
            )
          )}
        </div>
      </div>

      {/* الشعب */}
      {departments && (
        <div>
          <h2 className="font-semibold">الشعب</h2>
          <div className="flex gap-2 flex-wrap">
            {departments.map((dept) =>
              editingDepartmentId === dept.id ? (
                <div key={dept.id} className="flex gap-2">
                  <Input
                    value={editingDepartmentName}
                    onChange={(e) => setEditingDepartmentName(e.target.value)}
                  />
                  <Button onClick={() => handleDepartmentSave(dept.id)}>حفظ</Button>
                  <Button onClick={() => setEditingDepartmentId(null)}>إلغاء</Button>
                </div>
              ) : (
                <div key={dept.id} className="flex items-center gap-1">
                  <Button
                    onClick={() => setSelectedDepartment(dept.id)}
                    className="flex items-center gap-1"
                  >
                    {dept.name}
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingDepartmentId(dept.id);
                        setEditingDepartmentName(dept.name);
                      }}
                      className="text-sm text-yellow-500 cursor-pointer"
                    >
                      ✏️
                    </span>
                  </Button>

                  {/* زر حذف الشعبة */}
                  <Button
                    variant="destructive"
                    onClick={() => {
                      if (confirm("هل أنت متأكد من حذف هذه الشعبة؟")) {
                        deleteDepartment.mutate({ id: dept.id });
                      }
                    }}
                  >
                    🗑️
                  </Button>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* الموظفين */}
      {employees && (
        <div>
          <h2 className="font-semibold">الموظفين</h2>
          <div className="flex gap-2 flex-wrap">
            {employees.map((emp) => (
              <Button key={emp.id}>{emp.name}</Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

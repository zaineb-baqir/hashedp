"use client";

import { useState, useEffect } from "react";
import { trpc } from "../../utils/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EmployeeFormPage() {
  const [firstName, setFirstName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [grandName, setGrandName] = useState("");

  const [fullName, setFullName] = useState("");

  const [selectedSection, setSelectedSection] = useState<number | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [day, setDay] = useState("الأحد");
  const [startShift, setStartShift] = useState("08:00");
  const [endShift, setEndShift] = useState("14:00");

  const [workingDays, setWorkingDays] = useState<
    { day: string; startShift: string; endShift: string }[]
  >([]);

  const { data: sections } = trpc.org.getSections.useQuery();
  const { data: departments } = trpc.org.getDepartmentsBySection.useQuery(selectedSection || 0, {
    enabled: !!selectedSection,
  });

  const addEmployee = trpc.employee.create.useMutation();

  useEffect(() => {
    setFullName(`${firstName} ${fatherName} ${grandName}`);
  }, [firstName, fatherName, grandName]);

  const addWorkingDay = () => {
    if (!day || !startShift || !endShift) return;
    setWorkingDays(prev => [...prev, { day, startShift, endShift }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !selectedSection || !selectedDepartment) return;

     addEmployee.mutate({
    name: fullName,  
    privilege: "employee", 
    section: sections?.find(s => s.id === selectedSection)?.name || "",
    department: departments?.find(d => d.id === selectedDepartment)?.name || "",
    workingDays,
  });
  };

  const weekDays = ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">إدخال بيانات الموظف</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* الاسم الثلاثي */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label>الاسم</Label>
            <Input value={firstName} onChange={e => setFirstName(e.target.value)} />
          </div>
          <div>
            <Label>اسم الأب</Label>
            <Input value={fatherName} onChange={e => setFatherName(e.target.value)} />
          </div>
          <div>
            <Label>اسم الجد</Label>
            <Input value={grandName} onChange={e => setGrandName(e.target.value)} />
          </div>
        </div>

        {/* الأقسام */}
        <div>
          <Label>القسم</Label>
          <select
            value={selectedSection || ""}
            onChange={(e) => {
              setSelectedSection(Number(e.target.value));
              setSelectedDepartment(null); // إعادة ضبط الشعبة عند تغيير القسم
            }}
            className="border rounded p-2 w-full"
          >
            <option value="">اختر القسم</option>
            {sections?.map((sect) => (
              <option key={sect.id} value={sect.id}>{sect.name}</option>
            ))}
          </select>
        </div>

        {/* الشعب */}
        <div>
          <Label>الشعبة</Label>
          <select
            value={selectedDepartment || ""}
            onChange={(e) => setSelectedDepartment(Number(e.target.value))}
            className="border rounded p-2 w-full"
          >
            <option value="">اختر الشعبة</option>
            {departments?.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>

        <hr className="my-4" />
        <h3 className="font-semibold">أيام العمل</h3>

        {/* اليوم */}
        <div>
          <Label>اليوم</Label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="border rounded p-2 w-full"
          >
            {weekDays.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* بداية ونهاية الشفت */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>بداية الشفت</Label>
            <Input type="time" value={startShift} onChange={e => setStartShift(e.target.value)} />
          </div>
          <div>
            <Label>نهاية الشفت</Label>
            <Input type="time" value={endShift} onChange={e => setEndShift(e.target.value)} />
          </div>
        </div>

        <Button type="button" onClick={addWorkingDay} className="w-full">أضف يوم</Button>

        {workingDays.length > 0 && (
          <div className="mt-4">
            <h4 className="font-semibold">الأيام المضافة:</h4>
            {workingDays.map((wd, idx) => (
              <div key={idx}>{wd.day}: {wd.startShift} - {wd.endShift}</div>
            ))}
          </div>
        )}

        <Button type="submit" className="w-full mt-4" disabled={addEmployee.status === "pending"}>
          {addEmployee.status === "pending" ? "جاري الحفظ..." : "حفظ الموظف"}
        </Button>

        {addEmployee.status === "success" && (
          <p className="text-green-600 mt-2">✅ تم حفظ الموظف بنجاح</p>
        )}
        {addEmployee.status === "error" && (
          <p className="text-red-600 mt-2">❌ حدث خطأ أثناء الحفظ</p>
        )}

      </form>
    </div>
  );
}

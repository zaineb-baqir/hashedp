"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const { data, refetch } = trpc.org.search.useQuery(query, { enabled: false });

  const { data: employeesByDay } = trpc.org.getEmployeesByDay.useQuery(
    selectedDay!,
    { enabled: !!selectedDay }
  );

  const handleSearch = () => {
    if (query.trim()) {
      setSelectedDay(null); 
      refetch();
    }};
  
    return (
    <div className="p-6 space-y-6">
      {/* مربع البحث */}
      <div className="flex gap-2">
        <Input
          placeholder="🔍 ابحث عن قسم أو شعبة أو موظف..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleSearch}>بحث</Button>
      </div>
       {data && !selectedDay && (
        <div className="space-y-6">
          {/* الأيام */}
          {data.days.length > 0 && (
            <div>
              <h2 className="font-semibold">الأيام</h2>
              <div className="flex gap-2 flex-wrap">
                {data.days.map((day) => (
                  <Button
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                  >
                    {day.day}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* باقي النتائج: أقسام، شعب، موظفين */}
          {/* ... */}
        </div>
      )}

      {/* الموظفين حسب يوم محدد */}
      {selectedDay && employeesByDay && (
        <div>
          <h2 className="font-semibold">
            الموظفين في يوم {selectedDay}
          </h2>
          <div className="flex gap-2 flex-wrap">
            {employeesByDay.map((emp) => (
              <Button
                key={emp.id}
                onClick={() => router.push(`/employee-profile/${emp.id}`)}
              >
                {emp.fullName} ({emp.startshift} - {emp.endshift})
              </Button>
            ))}
          </div>
          <Button variant="outline" onClick={() => setSelectedDay(null)}>
            ⬅ رجوع للبحث
          </Button>
        </div>
      )}
      {/* النتائج */}
      {data && (
        <div className="space-y-6">
          {/* الأقسام (Sections) */}
          {data.sections.length > 0 && (
            <div>
              <h2 className="font-semibold">الأقسام</h2>
              <div className="flex gap-2 flex-wrap">
                {data.sections.map((sect) => (
                  <Button key={sect.id}>{sect.name}</Button>
                ))}
              </div>
            </div>
          )}

          {/* الشعب (Departments) */}
          {data.departments.length > 0 && (
            <div>
              <h2 className="font-semibold">الشعب</h2>
              <div className="flex gap-2 flex-wrap">
                {data.departments.map((dept) => (
                  <Button key={dept.id}>{dept.name}</Button>
                ))}
              </div>
            </div>
          )}

          {/* الموظفين (Employees) */}
          {data.employees.length > 0 && (
            <div>
              <h2 className="font-semibold">الموظفين</h2>
              <div className="flex gap-2 flex-wrap">
                {data.employees.map((emp) => (
                  <Button
                    key={emp.id}
                    onClick={() => router.push(`/employee-profile/${emp.id}`)}
                  >
                    {emp.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
       <Button onClick={() => router.push("/employee-form")}>
        إضافة بيانات موظف
      </Button>
      <Button onClick={() => router.push("/employees-list")}>
        قائمة الموظفين
      </Button>
      <Button onClick={() => router.push("/vacation/new")}>
        Vacation
      </Button>
     <Button onClick={() => router.push("/organization")}>
        section/department
      </Button>
       <Button onClick={() => router.push("/time-allowence")}>
        Time Allowance
      </Button>
      <Button onClick={() => router.push("/transfer")}>
        🔀 النقل
      </Button>
      <Button onClick={() => router.push("/system-info")}>
        معلومات النظام
      </Button>

    </div>
    
  );
}

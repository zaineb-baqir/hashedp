// app/vacation/new/page.tsx
"use client";

import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";

export default function VacationForm() {
  const router = useRouter();
  const mutation = trpc.vacation.create.useMutation();

  const [form, setForm] = useState({
    employeeName: "",
    dateStart: "",
    dateEnd: "",
    type: "",
    reason: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync({
        employeeName: form.employeeName,
        dateStart: form.dateStart,
        dateEnd: form.dateEnd,
        type: form.type,
        reason: form.reason,
      });
      router.push("/dashboard");
    }  catch (err: unknown) {
  if (err instanceof Error) {
    alert(err.message);
  } else {
    alert("حدث خطأ غير متوقع");
  }
}
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">إضافة إجازة</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>اسم الموظف</Label>
          <Input
            name="employeeName"
            value={form.employeeName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>تاريخ البداية</Label>
          <Input
            type="date"
            name="dateStart"
            value={form.dateStart}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>تاريخ النهاية</Label>
          <Input
            type="date"
            name="dateEnd"
            value={form.dateEnd}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label>نوع الإجازة</Label>
          <Input
            name="type"
            value={form.type}
            onChange={handleChange}
            placeholder="annual / sick"
          />
        </div>
        <div>
          <Label>السبب</Label>
          <Textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
          />
        </div>
        <Button type="submit" disabled={mutation.status==="pending"}>
          {mutation.status==="pending" ? "جاري الحفظ..." : "حفظ"}
        </Button>
      </form>
    </div>
  );
}

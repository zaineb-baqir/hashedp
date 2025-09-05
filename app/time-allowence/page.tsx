"use client";

import { useState } from "react";
import { trpc } from "../../utils/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function TimeAllowancePage() {
  const [employeeName, setEmployeeName] = useState("");
  const [type, setType] = useState("");
  const [reason, setReason] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const utils = trpc.useUtils();

  const createAllowance = trpc.timeallowence.create.useMutation({
    onSuccess: () => {
      alert("تمت إضافة الزمنية بنجاح ✅");
      utils.timeallowence.getAll.invalidate(); // تحديث القائمة
      setEmployeeName("");
      setType("");
      setReason("");
      setStartTime("");
      setEndTime("");
    },
    onError: (err) => {
      alert(`خطأ: ${err.message}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAllowance.mutate({
      employeeName,
      type,
      reason,
      startTime,
      endTime,
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow">
      <h1 className="text-xl font-bold mb-4">إضافة Time Allowance</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* اسم الموظف */}
        <div>
          <Label>اسم الموظف</Label>
          <Input
            value={employeeName}
            onChange={(e) => setEmployeeName(e.target.value)}
            placeholder="أدخل اسم الموظف"
            required
          />
        </div>

        {/* نوع الزمنية */}
        <div>
          <Label>نوع الزمنية</Label>
          <Input
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="مثال: إذن طبي"
            required
          />
        </div>

        {/* السبب */}
        <div>
          <Label>السبب</Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="أدخل السبب (اختياري)"
          />
        </div>

        {/* بداية الوقت */}
        <div>
          <Label>بداية الوقت</Label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        {/* نهاية الوقت */}
        <div>
          <Label>نهاية الوقت</Label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        {/* زر الإرسال */}
        <Button type="submit" className="w-full" disabled={createAllowance.isPending}>
          {createAllowance.isPending ? "جاري الحفظ..." : "حفظ"}
        </Button>
      </form>
    </div>
  );
}

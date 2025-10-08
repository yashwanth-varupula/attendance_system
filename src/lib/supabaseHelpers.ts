import { supabase } from "../supabase/client";

// 1. Get student by roll number
export const getStudentByRoll = async (roll: string) => {
  const { data, error } = await supabase
    .from("students")
    .select("*")
    .eq("roll_number", roll)
    .single();
  if (error) throw error;
  return data;
};

// 2. Get attendance by student ID
export const getAttendanceByStudentId = async (studentId: string) => {
  const { data, error } = await supabase
    .from("attendance_records")
    .select("*, faculty(name)")
    .eq("student_id", studentId)
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
};

// 3. Mark attendance
export const markAttendanceByStudentId = async (
  studentId: string,
  facultyId: string,
  subject: string,
  status: "present" | "absent"
) => {
  const { error } = await supabase.from("attendance_records").insert([
    {
      student_id: studentId,
      faculty_id: facultyId,
      subject,
      date: new Date().toISOString().split("T")[0],
      status,
    },
  ]);
  if (error) throw error;
  return true;
};

// 4. Ensure faculty exists
export const ensureFacultyForUser = async (userId: string, name?: string) => {
  const { data, error } = await supabase
    .from("faculty")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (data) return data;

  const { data: created, error: createError } = await supabase
    .from("faculty")
    .insert({
      user_id: userId,
      name: name || "Faculty",
      employee_id: `EMP_${userId.slice(0, 6)}`,
    })
    .select()
    .single();

  if (createError) throw createError;
  return created;
};

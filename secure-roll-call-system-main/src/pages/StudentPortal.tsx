import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Header from "../components/Header";
import {
  ArrowLeft,
  Search,
  User,
  TrendingUp,
  RotateCcw,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import TimetableView from "@/components/TimetableView";
import AttendanceHistory from "@/components/AttendanceHistory";

interface Student {
  id: string;
  roll_number: string;
  name: string;
  section: string;
}

export default function StudentPage() {
  const [rollNumber, setRollNumber] = useState("");
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [loading, setLoading] = useState(false);
  const [overallAttendancePercentage, setOverallAttendancePercentage] =
    useState(0);
  const [totalClassesCount, setTotalClassesCount] = useState(0);
  const [totalPresentCount, setTotalPresentCount] = useState(0);
  const [showSearchForm, setShowSearchForm] = useState(true);
  const { toast } = useToast();

  const fetchOverallAttendance = async (studentId: string) => {
    try {
      const { data: allRecords, error } = await supabase
        .from("attendance_records")
        .select("*")
        .eq("student_id", studentId);

      if (error) {
        console.error("Overall attendance error:", error);
        return;
      }

      if (allRecords && allRecords.length > 0) {
        const presentCount = allRecords.filter(
          (record: any) => record.status === "present"
        ).length;
        const percentage = (presentCount / allRecords.length) * 100;
        setOverallAttendancePercentage(Math.round(percentage * 100) / 100);
        setTotalClassesCount(allRecords.length);
        setTotalPresentCount(presentCount);
      } else {
        setOverallAttendancePercentage(0);
        setTotalClassesCount(0);
        setTotalPresentCount(0);
      }
    } catch (error) {
      console.error("Fetch overall attendance error:", error);
    }
  };

  const searchStudent = async () => {
    if (!rollNumber.trim()) {
      toast({
        title: "Required Field",
        description: "Please enter your roll number to continue",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: student, error: studentError } = await supabase
        .from("students")
        .select("*")
        .eq("roll_number", rollNumber.toUpperCase())
        .single();

      if (studentError) {
        if (studentError.code === "PGRST116") {
          toast({
            title: "Student Not Found",
            description:
              "No student record found with this roll number. Please verify and try again.",
            variant: "destructive",
          });
        } else {
          throw studentError;
        }
        return;
      }

      if (!student) {
        toast({
          title: "Student Not Found",
          description:
            "No student record found with this roll number. Please verify and try again.",
          variant: "destructive",
        });
        return;
      }

      setStudentData(student);
      setShowSearchForm(false);
      await fetchOverallAttendance(student.id);

      toast({
        title: "Welcome Back! 👋",
        description: `Academic records loaded for ${student.section} section`,
      });
    } catch (error: any) {
      console.error("Search error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to load student data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setShowSearchForm(true);
    setStudentData(null);
    setRollNumber("");
    setOverallAttendancePercentage(0);
    setTotalClassesCount(0);
    setTotalPresentCount(0);
  };

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 85)
      return {
        status: "Excellent",
        color: "bg-emerald-100 text-emerald-800",
        emoji: "🌟",
      };
    if (percentage >= 75)
      return {
        status: "Good",
        color: "bg-amber-100 text-amber-800",
        emoji: "👍",
      };
    return {
      status: "Needs Improvement",
      color: "bg-red-100 text-red-800",
      emoji: "⚠️",
    };
  };

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Search Section */}
        {showSearchForm && (
          <div className="min-h-[70vh] flex items-center justify-center">
            <div className="text-center max-w-md mx-auto">
              <div className="mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                  Access Your Academic Records
                </h2>
                <p className="text-lg text-slate-600">
                  Enter your roll number to view attendance and academic
                  information
                </p>
              </div>

              <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl border border-slate-200/60 shadow-xl">
                <div className="space-y-6">
                  <div>
                    <Label
                      htmlFor="roll-number"
                      className="text-sm font-medium text-slate-700 block mb-3"
                    >
                      Roll Number
                    </Label>
                    <Input
                      id="roll-number"
                      placeholder="e.g., 24NH1A0501"
                      value={rollNumber}
                      onChange={(e) => setRollNumber(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && searchStudent()}
                      className="h-12 text-center text-lg font-mono border-slate-300 focus:border-blue-500 focus:ring-blue-500/20"
                    />
                  </div>
                  <Button
                    onClick={searchStudent}
                    disabled={loading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-lg transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    {loading ? "Searching..." : "Access Records"}
                  </Button>
                </div>
              </div>
            </div>
          
          </div>
          
        )}

        {/* Student Dashboard */}
      
        {studentData && !showSearchForm && (
          <div className="space-y-8 animate-fade-in">
           {/* Back Button */}
<div className="flex justify-start">
  <Button
    variant="outline"
    className="flex items-center space-x-2"
    onClick={resetSearch}
  >
    <ArrowLeft className="h-4 w-4 mr-2" />
    Back
  </Button>
</div>

            {/* Student Profile Header */}
            <section className="bg-[#202c45] text-white p-8 rounded-2xl shadow-xl">
              


              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <User className="h-10 w-10 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">
                    {studentData.name}
                  </h2>
                  <p className="text-blue-100 font-mono text-xl mb-3">
                    {studentData.roll_number}
                  </p>
                  <Badge className="bg-white/20 text-white border-0 hover:bg-white/30 text-base px-4 py-1 backdrop-blur-sm">
                    Section {studentData.section}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold mb-2 text-white">
                    {overallAttendancePercentage}%
                  </div>
                  <p className="text-blue-200 text-sm mb-2">
                    Overall Attendance
                  </p>
                  <Badge
                    className={`${
                      getAttendanceStatus(overallAttendancePercentage).color
                    } border-0 text-sm`}
                  >
                    {getAttendanceStatus(overallAttendancePercentage).emoji}{" "}
                    {getAttendanceStatus(overallAttendancePercentage).status}
                  </Badge>
                </div>
              </div>
            </section>

            {/* Quick Stats */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#202c45] p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white mb-1">
                      Total Classes
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {totalClassesCount}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-[#202c45] p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white mb-1">
                      Classes Attended
                    </p>
                    <p className="text-3xl font-bold text-emerald-600">
                      {totalPresentCount}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Timetable Section */}
            <section className="bg-[#202c45] rounded-2xl border border-gray-200 shadow-sm p-8 hover:shadow-md transition-all duration-300">
              <TimetableView section={studentData.section} />
            </section>

            {/* Attendance History Section */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 hover:shadow-md transition-all duration-300">
              <AttendanceHistory studentId={studentData.id} />
            </section>
          </div>
        )}
      </main>
    </>
  );
}


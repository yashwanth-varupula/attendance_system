import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { LogOut, Users, Calendar, CheckCircle, XCircle, Clock, User, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Header from "/src/components/Header";



// Type definitions for our data
interface Student {
  id: string;
  roll_number: string;
  name: string;
  section: string;
}

interface Faculty {
  id: string;
  user_id: string;
  name: string;
  employee_id: string;
}

interface TimetableEntry {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  subject: string;
  section: string;
  faculty_name: string;
}

// Real timetable data based on your college documents
const realTimetableData: TimetableEntry[] = [
  // CSE-A Monday
  { id: "1", day_of_week: 1, start_time: "09:10", end_time: "10:00", subject: "UHV", section: "CSE-A", faculty_name: "Mrs.S.N.V.SUSMITHA" },
  { id: "2", day_of_week: 1, start_time: "11:05", end_time: "11:55", subject: "ADSA LAB", section: "CSE-A", faculty_name: "Mr.L.N.V.RAO" },
  { id: "21", day_of_week: 1, start_time: "13:30", end_time: "14:20", subject: "OOPS", section: "CSE-A", faculty_name: "Mrs.K.LAKSHMI PRASUNA" },
  { id: "22", day_of_week: 1, start_time: "14:20", end_time: "15:10", subject: "TECH", section: "CSE-A", faculty_name: "Multiple Faculty" },
  { id: "23", day_of_week: 1, start_time: "15:10", end_time: "16:20", subject: "DM", section: "CSE-A", faculty_name: "Mr.T.ROHINI KUMAR" },

  // CSE-A Tuesday
  { id: "3", day_of_week: 2, start_time: "09:10", end_time: "10:00", subject: "OOPS", section: "CSE-A", faculty_name: "Mrs.K.LAKSHMI PRASUNA" },
  { id: "4", day_of_week: 2, start_time: "10:00", end_time: "10:50", subject: "ADS", section: "CSE-A", faculty_name: "Mr.L.N.V.RAO" },
  { id: "5", day_of_week: 2, start_time: "11:05", end_time: "11:55", subject: "DM", section: "CSE-A", faculty_name: "Mr.T.ROHINI KUMAR" },
  { id: "6", day_of_week: 2, start_time: "11:55", end_time: "12:45", subject: "DLC", section: "CSE-A", faculty_name: "Mr.T.ROHINI KUMAR" },
  { id: "24", day_of_week: 2, start_time: "13:30", end_time: "14:20", subject: "UHV", section: "CSE-A", faculty_name: "Mrs.S.N.V.SUSMITHA" },
  { id: "25", day_of_week: 2, start_time: "14:20", end_time: "15:10", subject: "VER", section: "CSE-A", faculty_name: "Mrs.U.HARINI" },
  { id: "26", day_of_week: 2, start_time: "15:10", end_time: "16:20", subject: "ADS", section: "CSE-A", faculty_name: "Mr.L.N.V.RAO" },

  // CSE-A Wednesday
  { id: "7", day_of_week: 3, start_time: "09:10", end_time: "10:00", subject: "ADS", section: "CSE-A", faculty_name: "Mr.L.N.V.RAO" },
  { id: "8", day_of_week: 3, start_time: "10:00", end_time: "10:50", subject: "UHV", section: "CSE-A", faculty_name: "Mrs.S.N.V.SUSMITHA" },
  { id: "9", day_of_week: 3, start_time: "11:05", end_time: "11:55", subject: "ES", section: "CSE-A", faculty_name: "Mrs.K.RAJAMANI" },
  { id: "10", day_of_week: 3, start_time: "11:55", end_time: "12:45", subject: "OOPS", section: "CSE-A", faculty_name: "Mrs.K.LAKSHMI PRASUNA" },
  { id: "27", day_of_week: 3, start_time: "13:30", end_time: "14:20", subject: "DLC", section: "CSE-A", faculty_name: "Mr.T.ROHINI KUMAR" },
  { id: "28", day_of_week: 3, start_time: "14:20", end_time: "15:10", subject: "DM", section: "CSE-A", faculty_name: "Mr.T.ROHINI KUMAR" },
  { id: "29", day_of_week: 3, start_time: "15:10", end_time: "16:20", subject: "OOPS", section: "CSE-A", faculty_name: "Mrs.K.LAKSHMI PRASUNA" },

  // CSE-A Thursday
  { id: "11", day_of_week: 4, start_time: "09:10", end_time: "10:00", subject: "DM", section: "CSE-A", faculty_name: "Mr.T.ROHINI KUMAR" },
  { id: "12", day_of_week: 4, start_time: "10:00", end_time: "12:45", subject: "PYTHON LAB", section: "CSE-A", faculty_name: "Mr.G.H.NARENDRA" },
  { id: "30", day_of_week: 4, start_time: "13:30", end_time: "16:20", subject: "OOPS LAB", section: "CSE-A", faculty_name: "Mrs.K.LAKSHMI PRASUNA" },

  // CSE-A Friday
  { id: "13", day_of_week: 5, start_time: "09:10", end_time: "10:00", subject: "DLC", section: "CSE-A", faculty_name: "Mr.T.ROHINI KUMAR" },
  { id: "14", day_of_week: 5, start_time: "10:00", end_time: "10:50", subject: "ADS", section: "CSE-A", faculty_name: "Mr.L.N.V.RAO" },
  { id: "15", day_of_week: 5, start_time: "11:05", end_time: "11:55", subject: "DM", section: "CSE-A", faculty_name: "Mr.T.ROHINI KUMAR" },
  { id: "16", day_of_week: 5, start_time: "11:55", end_time: "12:45", subject: "UHV", section: "CSE-A", faculty_name: "Mrs.S.N.V.SUSMITHA" },
  { id: "31", day_of_week: 5, start_time: "13:30", end_time: "14:20", subject: "APT", section: "CSE-A", faculty_name: "Mr.P.NAGA SRINIVASA RAO" },
  { id: "32", day_of_week: 5, start_time: "14:20", end_time: "15:10", subject: "HRSS", section: "CSE-A", faculty_name: "Mr.N.DHANUNJAYA RAO" },
  { id: "33", day_of_week: 5, start_time: "15:10", end_time: "16:20", subject: "DLC", section: "CSE-A", faculty_name: "Mr.T.ROHINI KUMAR" },

  // CSE-A Saturday
  { id: "17", day_of_week: 6, start_time: "09:10", end_time: "10:00", subject: "ADS", section: "CSE-A", faculty_name: "Mr.L.N.V.RAO" },
  { id: "18", day_of_week: 6, start_time: "10:00", end_time: "10:50", subject: "DLC", section: "CSE-A", faculty_name: "Mr.T.ROHINI KUMAR" },
  { id: "19", day_of_week: 6, start_time: "11:05", end_time: "11:55", subject: "UHV", section: "CSE-A", faculty_name: "Mrs.S.N.V.SUSMITHA" },
  { id: "20", day_of_week: 6, start_time: "11:55", end_time: "12:45", subject: "OOPS", section: "CSE-A", faculty_name: "Mrs.K.LAKSHMI PRASUNA" },
  { id: "34", day_of_week: 6, start_time: "13:30", end_time: "16:20", subject: "CLUBS", section: "CSE-A", faculty_name: "Multiple Faculty" },

  // CSE-B Monday
  { id: "b1", day_of_week: 1, start_time: "09:10", end_time: "10:00", subject: "OOPS", section: "CSE-B", faculty_name: "Mrs.K.LAKSHMI PRASUNA " },
  { id: "b2", day_of_week: 1, start_time: "10:00", end_time: "10:50", subject: "UHV", section: "CSE-B", faculty_name: "Mr.M.NARENDRA" },
  { id: "b3", day_of_week: 1, start_time: "11:05", end_time: "11:55", subject: "OOPS", section: "CSE-B", faculty_name: "Mrs.K.LAKSHMI PRASUNA" },
  { id: "b4", day_of_week: 1, start_time: "11:55", end_time: "12:45", subject: "DLC", section: "CSE-B", faculty_name: "Mr.T.ROHINI KUMAR" },
  { id: "b21", day_of_week: 1, start_time: "13:30", end_time: "14:20", subject: "ADS", section: "CSE-B", faculty_name: "Mr.L.N.V.RAO" },
  { id: "b22", day_of_week: 1, start_time: "14:20", end_time: "15:10", subject: "VER", section: "CSE-B", faculty_name: "Mrs.U.HARINI" },
  { id: "b23", day_of_week: 1, start_time: "15:10", end_time: "16:20", subject: "DM", section: "CSE-B", faculty_name: "Mr.T.ROHINI KUMAR" },

  // CSE-B Tuesday
  { id: "b5", day_of_week: 2, start_time: "09:10", end_time: "10:00", subject: "DLC", section: "CSE-B", faculty_name: "Mr.T.ROHINI KUMAR" },
  { id: "b6", day_of_week: 2, start_time: "10:00", end_time: "12:45", subject: "PYTHON LAB", section: "CSE-B", faculty_name: "Mr.G.H.NARENDRA" },
  { id: "b24", day_of_week: 2, start_time: "13:30", end_time: "14:20", subject: "UHV", section: "CSE-B", faculty_name: "Mr.M.NARENDRA" },
  { id: "b25", day_of_week: 2, start_time: "14:20", end_time: "15:10", subject: "TECH", section: "CSE-B", faculty_name: "Multiple Faculty" },
  { id: "b26", day_of_week: 2, start_time: "15:10", end_time: "16:20", subject: "OOPS", section: "CSE-B", faculty_name: "Mrs.K.LAKSHMI PRASUNA" },

  // CSE-B Wednesday
  { id: "b7", day_of_week: 3, start_time: "09:10", end_time: "10:00", subject: "DM", section: "CSE-B", faculty_name: "Mr.T.ROHINI KUMAR" },
  { id: "b8", day_of_week: 3, start_time: "10:00", end_time: "10:50", subject: "OOPS", section: "CSE-B", faculty_name: "Mrs.K.LAKSHMI PRASUNA" },
  { id: "b9", day_of_week: 3, start_time: "11:05", end_time: "11:55", subject: "ADS", section: "CSE-B", faculty_name: "Mr.L.N.V.RAO" },
  { id: "b10", day_of_week: 3, start_time: "11:55", end_time: "12:45", subject: "DLC", section: "CSE-B", faculty_name: "Mr.T.ROHINI KUMAR" },
  { id: "b27", day_of_week: 3, start_time: "13:30", end_time: "16:20", subject: "ADSA LAB", section: "CSE-B", faculty_name: "Mr.L.N.V.RAO" },

  // CSE-B Thursday
  { id: "b11", day_of_week: 4, start_time: "09:10", end_time: "10:00", subject: "ADS", section: "CSE-B", faculty_name: "Mr.L.N.V.RAO" },
  { id: "b12", day_of_week: 4, start_time: "10:00", end_time: "10:50", subject: "DM", section: "CSE-B", faculty_name: "Mr.T.ROHINI KUMAR" },
  { id: "b13", day_of_week: 4, start_time: "11:05", end_time: "11:55", subject: "UHV", section: "CSE-B", faculty_name: "Mr.M.NARENDRA" },
  { id: "b14", day_of_week: 4, start_time: "11:55", end_time: "12:45", subject: "OOPS", section: "CSE-B", faculty_name: "Mrs.K.LAKSHMI PRASUNA" },
  { id: "b28", day_of_week: 4, start_time: "13:30", end_time: "14:20", subject: "ES", section: "CSE-B", faculty_name: "Mrs.K.RAJAMANI" },
  { id: "b29", day_of_week: 4, start_time: "14:20", end_time: "15:10", subject: "UHV", section: "CSE-B", faculty_name: "Mrs.S.N.V.SUSMITHA" },
  { id: "b30", day_of_week: 4, start_time: "15:10", end_time: "16:20", subject: "DLC", section: "CSE-B", faculty_name: "Mr.T.ROHINI KUMAR" },

  // CSE-B Friday
  { id: "b15", day_of_week: 5, start_time: "09:10", end_time: "10:00", subject: "DM", section: "CSE-B", faculty_name: "Mr.T.ROHINI KUMAR" },
  { id: "b16", day_of_week: 5, start_time: "10:00", end_time: "12:45", subject: "OOPS LAB", section: "CSE-B", faculty_name: "Mrs.K.LAKSHMI PRASUNA" },
  { id: "b31", day_of_week: 5, start_time: "13:30", end_time: "14:20", subject: "HRSS", section: "CSE-B", faculty_name: "Mr.N.DHANUNJAYA RAO" },
  { id: "b32", day_of_week: 5, start_time: "14:20", end_time: "15:10", subject: "APT", section: "CSE-B", faculty_name: "Mr.P.NAGA SRINIVASA RAO" },
  { id: "b33", day_of_week: 5, start_time: "15:10", end_time: "16:20", subject: "ADS", section: "CSE-B", faculty_name: "Mr.L.N.V.RAO" },

  // CSE-B Saturday
  { id: "b17", day_of_week: 6, start_time: "09:10", end_time: "10:00", subject: "UHV", section: "CSE-B", faculty_name: "Mr.M.NARENDRA" },
  { id: "b18", day_of_week: 6, start_time: "10:00", end_time: "10:50", subject: "DM", section: "CSE-B", faculty_name: "Mr.T.ROHINI KUMAR" },
  { id: "b19", day_of_week: 6, start_time: "11:05", end_time: "11:55", subject: "ADS", section: "CSE-B", faculty_name: "Mr.L.N.V.RAO" },
  { id: "b20", day_of_week: 6, start_time: "11:55", end_time: "12:45", subject: "DLC", section: "CSE-B", faculty_name: "Mr.T.ROHINI KUMAR" },
  { id: "b34", day_of_week: 6, start_time: "13:30", end_time: "16:20", subject: "CLUBS", section: "CSE-B", faculty_name: "Multiple Faculty" }
];

const FacultyDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTimetable, setSelectedTimetable] = useState<string>("");
  const [students, setStudents] = useState<Student[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    loadStudents();
  }, []);

  useEffect(() => {
    if (selectedSection && selectedDate) {
      loadTimetable();
    }
  }, [selectedSection, selectedDate]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }
      setUser(session.user);
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/auth');
    }
  };

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('roll_number');
      
      if (error) {
        console.error('Error loading students:', error);
        return;
      }
      setStudents(data || []);
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadTimetable = async () => {
    try {
      const selectedDay = new Date(selectedDate).getDay();
      const dayTimetable = realTimetableData.filter(
        entry => entry.day_of_week === selectedDay && entry.section === selectedSection
      );
      setTimetable(dayTimetable);
      
      // Auto-select first class if available
      if (dayTimetable.length > 0 && !selectedTimetable) {
        setSelectedTimetable(dayTimetable[0].id);
      }
    } catch (error) {
      console.error('Error loading timetable:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const filteredStudents = students.filter(student => 
    selectedSection ? student.section === selectedSection : true
  );

  const handleAttendanceChange = (studentId: string, status: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const submitAttendance = async () => {
    if (!selectedSection || !selectedTimetable) {
      toast({
        title: "Missing Information",
        description: "Please select section and class before submitting",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data: facultyData, error: facultyError } = await supabase
        .from('faculty')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      let currentFacultyData = facultyData;

      if (facultyError && facultyError.code === 'PGRST116') {
        const { data: newFaculty, error: createError } = await supabase
          .from('faculty')
          .insert({
            user_id: user?.id,
            name: user?.user_metadata?.name || user?.email,
            employee_id: user?.user_metadata?.employee_id || 'EMP_' + user?.id.substring(0, 8)
          })
          .select()
          .single();

        if (createError) {
          throw createError;
        }
        currentFacultyData = newFaculty;
      } else if (facultyError) {
        throw facultyError;
      }

      if (!currentFacultyData) {
        throw new Error('Unable to get or create faculty record');
      }

      const selectedTimetableEntry = timetable.find(t => t.id === selectedTimetable);
      
      // First, delete existing attendance records for this date, faculty, and subject
      const { error: deleteError } = await supabase
        .from('attendance_records')
        .delete()
        .eq('faculty_id', currentFacultyData.id)
        .eq('date', selectedDate)
        .eq('subject', selectedTimetableEntry?.subject || 'Unknown Subject');

      if (deleteError) {
        console.error('Error deleting existing records:', deleteError);
      }

      // Then insert new attendance records
      const attendanceRecords = filteredStudents.map(student => ({
        student_id: student.id,
        faculty_id: currentFacultyData.id,
        date: selectedDate,
        status: attendance[student.id] || 'absent',
        subject: selectedTimetableEntry?.subject || 'Unknown Subject'
      }));

      const { error } = await supabase
        .from('attendance_records')
        .insert(attendanceRecords);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Attendance submitted successfully for ${filteredStudents.length} students`,
      });

      setAttendance({});
      setSelectedTimetable("");
    } catch (error: any) {
      console.error('Submit attendance error:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to submit attendance',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAllPresent = () => {
    const newAttendance: Record<string, string> = {};
    filteredStudents.forEach(student => {
      newAttendance[student.id] = 'present';
    });
    setAttendance(newAttendance);
  };

  const markAllAbsent = () => {
    const newAttendance: Record<string, string> = {};
    filteredStudents.forEach(student => {
      newAttendance[student.id] = 'absent';
    });
    setAttendance(newAttendance);
  };

  const getAttendanceStats = () => {
    const totalStudents = filteredStudents.length;
    const presentCount = Object.values(attendance).filter(status => status === 'present').length;
    const absentCount = totalStudents - presentCount;
    return { totalStudents, presentCount, absentCount };
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const stats = getAttendanceStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b"> <div className="w-full"> <img src="/src/images/Autonomous (1).jpg" alt="College Banner" className="w-full h-full object-cover" /> </div> </header>
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <h1 className="text-xl font-semibold text-gray-900">Faculty Dashboard</h1>
              <Badge className="bg-blue-100 text-blue-800 border-0">
                Academic Year 2025-26
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.user_metadata?.name || user?.email}
                </p>
                <p className="text-xs text-gray-500">Faculty Member</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Attendance Control Panel */}
        <div className="bg-[#202c45] rounded-lg shadow-sm border mb-8">
          <div className="px-6 py-4 border-b">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <h2 className="text-lg font-semibold text-white">Attendance Management</h2>
                <p className="text-sm text-white">Select class and mark attendance</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Selection Controls */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Section</label>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE-A">CSE-A</SelectItem>
                    <SelectItem value="CSE-B">CSE-B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Class</label>
                <Select value={selectedTimetable} onValueChange={setSelectedTimetable}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Class" />
                  </SelectTrigger>
                  <SelectContent>
                    {timetable.map((entry) => (
                      <SelectItem key={entry.id} value={entry.id}>
                        {entry.subject} ({formatTime(entry.start_time)} - {formatTime(entry.end_time)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Action</label>
                <Button 
                  onClick={submitAttendance} 
                  disabled={loading || !selectedSection || !selectedTimetable}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? "Submitting..." : "Submit Attendance"}
                </Button>
              </div>
            </div>
            
            {/* Quick Actions */}
            {selectedSection && filteredStudents.length > 0 && (
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={markAllPresent}
                    className="border-green-200 text-green-700 hover:bg-green-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    All Present
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={markAllAbsent}
                    className="border-red-200 text-red-700 hover:bg-red-50"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    All Absent
                  </Button>
                </div>
                {Object.keys(attendance).length > 0 && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium text-green-600">{stats.presentCount} Present</span>
                    <span className="mx-2">•</span>
                    <span className="font-medium text-red-600">{stats.absentCount} Absent</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Student List */}
        {selectedSection && filteredStudents.length > 0 ? (
          <div className="bg-[#202c45] rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {selectedSection} Students
                    </h3>
                    <p className="text-sm text-white">
                      {filteredStudents.length} students enrolled
                    </p>
                  </div>
                </div>
                <Badge variant="outline">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  })}
                </Badge>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-3">
                {filteredStudents.map((student) => (
                  <div 
                    key={student.id} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-600 font-mono">{student.roll_number}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={attendance[student.id] === 'present' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleAttendanceChange(student.id, 'present')}
                        className={
                          attendance[student.id] === 'present'
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'border-green-200 text-green-700 hover:bg-green-50'
                        }
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Present
                      </Button>
                      <Button
                        variant={attendance[student.id] === 'absent' ? 'destructive' : 'outline'}
                        size="sm"
                        onClick={() => handleAttendanceChange(student.id, 'absent')}
                        className={
                          attendance[student.id] === 'absent'
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'border-red-200 text-red-700 hover:bg-red-50'
                        }
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Absent
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : selectedSection ? (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">No students found</p>
              <p className="text-sm text-gray-500 mt-1">
                No students enrolled in section {selectedSection}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-900 font-medium text-lg mb-2">Select Section and Date</p>
              <p className="text-gray-600">
                Choose a section and date to view scheduled classes and take attendance
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;

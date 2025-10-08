import { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, User, ChevronDown, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface TimetableEntry {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  subject: string;
  room_number?: string;
  faculty?: {
    name: string;
  };
}

interface TimetableViewProps {
  section: string;
  onAttendanceRequired?: (timetableId: string, subject: string) => void;
}

// Real timetable data based on your college documents
const realTimetableData: Record<string, TimetableEntry[]> = {
  'CSE-A': [
    // Monday
    { id: "1", day_of_week: 1, start_time: "09:10", end_time: "10:00", subject: "UHV", faculty: { name: "Mrs.S.N.V.SUSMITHA" } },
    { id: "2", day_of_week: 1, start_time: "11:05", end_time: "11:55", subject: "ADSA LAB", faculty: { name: "Mr.L.N.V.RAO" } },
    
    // Tuesday
    { id: "3", day_of_week: 2, start_time: "09:10", end_time: "10:00", subject: "OOPS", faculty: { name: "Mrs.K.LAKSHMI PRASUNA" } },
    { id: "4", day_of_week: 2, start_time: "10:00", end_time: "10:50", subject: "ADS", faculty: { name: "Mr.L.N.V.RAO" } },
    { id: "5", day_of_week: 2, start_time: "11:05", end_time: "11:55", subject: "DM", faculty: { name: "Mrs.H.V.KEERTHI" } },
    { id: "6", day_of_week: 2, start_time: "11:55", end_time: "12:45", subject: "DLC", faculty: { name: "Mr.T.ROHINI KUMAR" } },
    
    // Wednesday
    { id: "7", day_of_week: 3, start_time: "09:10", end_time: "10:00", subject: "ADS", faculty: { name: "Mr.L.N.V.RAO" } },
    { id: "8", day_of_week: 3, start_time: "10:00", end_time: "10:50", subject: "UHV", faculty: { name: "Mrs.S.N.V.SUSMITHA" } },
    { id: "9", day_of_week: 3, start_time: "11:05", end_time: "11:55", subject: "ES", faculty: { name: "Mrs.K.RAJAMANI" } },
    { id: "10", day_of_week: 3, start_time: "11:55", end_time: "12:45", subject: "OOPS", faculty: { name: "Mrs.K.LAKSHMI PRASUNA" } },
    
    // Thursday
    { id: "11", day_of_week: 4, start_time: "09:10", end_time: "10:00", subject: "DM", faculty: { name: "Mr.T.ROHINI KUMAR" } },
    { id: "12", day_of_week: 4, start_time: "10:00", end_time: "12:45", subject: "PYTHON LAB", faculty: { name: "Mr.G.H.NARENDRA" } },
    
    // Friday
    { id: "13", day_of_week: 5, start_time: "09:10", end_time: "10:00", subject: "DLC", faculty: { name: "Mr.T.ROHINI KUMAR" } },
    { id: "14", day_of_week: 5, start_time: "10:00", end_time: "10:50", subject: "ADS", faculty: { name: "Mr.L.N.V.RAO" } },
    { id: "15", day_of_week: 5, start_time: "11:05", end_time: "11:55", subject: "DM", faculty: { name: "Mr.T.ROHINI KUMAR" } },
    { id: "16", day_of_week: 5, start_time: "11:55", end_time: "12:45", subject: "UHV", faculty: { name: "Mrs.S.N.V.SUSMITHA" } },
    
    // Saturday
    { id: "17", day_of_week: 6, start_time: "09:10", end_time: "10:00", subject: "ADS", faculty: { name: "Mr.L.N.V.RAO" } },
    { id: "18", day_of_week: 6, start_time: "10:00", end_time: "10:50", subject: "DLC", faculty: { name: "Mr.T.ROHINI KUMAR" } },
    { id: "19", day_of_week: 6, start_time: "11:05", end_time: "11:55", subject: "UHV", faculty: { name: "Mrs.S.N.V.SUSMITHA" } },
    { id: "20", day_of_week: 6, start_time: "11:55", end_time: "12:45", subject: "OOPS", faculty: { name: "Mrs.K.LAKSHMI PRASUNA" } },
    
    // Lunch break periods
    { id: "21", day_of_week: 1, start_time: "01:30", end_time: "02:20", subject: "OOPS", faculty: { name: "Mrs.K.LAKSHMI PRASUNA" } },
    { id: "22", day_of_week: 1, start_time: "02:20", end_time: "03:10", subject: "TECH", faculty: { name: "Multiple Faculty" } },
    { id: "23", day_of_week: 1, start_time: "03:10", end_time: "04:20", subject: "DM", faculty: { name: "Mr.T.ROHINI KUMAR" } },
    
    { id: "24", day_of_week: 2, start_time: "01:30", end_time: "02:20", subject: "UHV", faculty: { name: "Mrs.S.N.V.SUSMITHA" } },
    { id: "25", day_of_week: 2, start_time: "02:20", end_time: "03:10", subject: "VER", faculty: { name: "Mrs.U.HARINI" } },
    { id: "26", day_of_week: 2, start_time: "03:10", end_time: "04:20", subject: "ADS", faculty: { name: "Mr.L.N.V.RAO" } },
    
    { id: "27", day_of_week: 3, start_time: "01:30", end_time: "02:20", subject: "DLC", faculty: { name: "Mr.T.ROHINI KUMAR" } },
    { id: "28", day_of_week: 3, start_time: "02:20", end_time: "03:10", subject: "DM", faculty: { name: "Mr.T.ROHINI KUMAR" } },
    { id: "29", day_of_week: 3, start_time: "03:10", end_time: "04:20", subject: "OOPS", faculty: { name: "Mrs.K.LAKSHMI PRASUNA" } },
    
    { id: "30", day_of_week: 4, start_time: "01:30", end_time: "04:20", subject: "OOPS LAB", faculty: { name: "Mrs.K.LAKSHMI PRASUNA" } },
    
    { id: "31", day_of_week: 5, start_time: "01:30", end_time: "02:20", subject: "APT", faculty: { name: "Mr.P.NAGA SRINIVASA RAO" } },
    { id: "32", day_of_week: 5, start_time: "02:20", end_time: "03:10", subject: "HRSS", faculty: { name: "Mr.N.DHANUNJAYA RAO" } },
    { id: "33", day_of_week: 5, start_time: "03:10", end_time: "04:20", subject: "DLC", faculty: { name: "Mr.T.ROHINI KUMAR" } },
    
    { id: "34", day_of_week: 6, start_time: "01:30", end_time: "04:20", subject: "CLUBS", faculty: { name: "Multiple Faculty" } }
  ],
  
  'CSE-B': [
    // Monday
    { id: "b1", day_of_week: 1, start_time: "09:10", end_time: "10:00", subject: "OOPS", faculty: { name: "Mrs.K.LAKSHMI PRASUNA" } },
    { id: "b2", day_of_week: 1, start_time: "10:00", end_time: "10:50", subject: "UHV", faculty: { name: "Mr.M.NARENDRA" } },
    { id: "b3", day_of_week: 1, start_time: "11:05", end_time: "11:55", subject: "OOPS", faculty: { name: "Mrs.K.LAKSHMI PRASUNA" } },
    { id: "b4", day_of_week: 1, start_time: "11:55", end_time: "12:45", subject: "DLC", faculty: { name: "Mr.T.ROHINI KUMAR" } },
    { id: "b21", day_of_week: 1, start_time: "01:30", end_time: "02:20", subject: "ADS", faculty: { name: "Mr.L.N.V.RAO" } },
    { id: "b22", day_of_week: 1, start_time: "02:20", end_time: "03:10", subject: "VERBAL", faculty: { name: "Mrs.U.HARINI" } },
    { id: "b23", day_of_week: 1, start_time: "03:10", end_time: "04:20", subject: "DMGT", faculty: { name: "Mrs.G.SIVA PAVANI" } },
    
    // Tuesday
    { id: "b5", day_of_week: 2, start_time: "09:10", end_time: "10:00", subject: "DLC", faculty: { name: "Mr.T.ROHINI KUMAR" } },
    { id: "b6", day_of_week: 2, start_time: "10:00", end_time: "12:45", subject: "PYTHON LAB", faculty: { name: "Mr.G.H.NARENDRA" } },
    { id: "b24", day_of_week: 2, start_time: "01:30", end_time: "02:20", subject: "UHV", faculty: { name: "Mr.M.NARENDRA" } },
    { id: "b25", day_of_week: 2, start_time: "02:20", end_time: "03:10", subject: "TECH", faculty: { name: "Ms. D.JYOTHI CHINMAYEE" } },
    { id: "b26", day_of_week: 2, start_time: "03:10", end_time: "04:20", subject: "OOPS", faculty: { name: "Mrs.K.LAKSHMI PRASUNA" } },
    
    // Wednesday
    { id: "b7", day_of_week: 3, start_time: "09:10", end_time: "10:00", subject: "DMGT", faculty: { name: "Mrs.G.SIVA PAVANI" } },
    { id: "b8", day_of_week: 3, start_time: "10:00", end_time: "10:50", subject: "OOPS", faculty: { name: "Mrs.K.LAKSHMI PRASUNA" } },
    { id: "b9", day_of_week: 3, start_time: "11:05", end_time: "11:55", subject: "ADS", faculty: { name: "Mr.L.N.V.RAO" } },
    { id: "b10", day_of_week: 3, start_time: "11:55", end_time: "12:45", subject: "DLC", faculty: { name: "Mr.T.ROHINI KUMAR" } },
    { id: "b27", day_of_week: 3, start_time: "01:30", end_time: "04:20", subject: "ADSA LAB", faculty: { name: "Mr.L.N.V.RAO" } },
    
    // Thursday
    { id: "b11", day_of_week: 4, start_time: "09:10", end_time: "10:00", subject: "ADS", faculty: { name: "Mr.L.N.V.RAO" } },
    { id: "b12", day_of_week: 4, start_time: "10:00", end_time: "10:50", subject: "DM", faculty: { name: "Mrs.G.SIVA PAVANI" } },
    { id: "b13", day_of_week: 4, start_time: "11:05", end_time: "11:55", subject: "UHV", faculty: { name: "Mr.M.NARENDRA" } },
    { id: "b14", day_of_week: 4, start_time: "11:55", end_time: "12:45", subject: "OOPS", faculty: { name: "Mrs.K.LAKSHMI PRASUNA" } },
    { id: "b28", day_of_week: 4, start_time: "01:30", end_time: "02:20", subject: "ES", faculty: { name: "Dr.T.POTHU RAJU" } },
    { id: "b29", day_of_week: 4, start_time: "02:20", end_time: "03:10", subject: "UHV", faculty: { name: "Mr.M.NARENDRA" } },
    { id: "b30", day_of_week: 4, start_time: "03:10", end_time: "04:20", subject: "DLC", faculty: { name: "Mr.T.ROHINI KUMAR" } },
    
    // Friday
    { id: "b15", day_of_week: 5, start_time: "09:10", end_time: "10:00", subject: "DM", faculty: { name: "Mrs.G.SIVA PAVANI" } },
    { id: "b16", day_of_week: 5, start_time: "10:00", end_time: "12:45", subject: "OOPS LAB", faculty: { name: "Mrs.K.LAKSHMI PRASUNA" } },
    { id: "b31", day_of_week: 5, start_time: "01:30", end_time: "02:20", subject: "HRSS", faculty: { name: "Mr.N.DHANUNJAYA RAO" } },
    { id: "b32", day_of_week: 5, start_time: "02:20", end_time: "03:10", subject: "APT", faculty: { name: "Mr.P.NAGA SRINIVASA RAO" } },
    { id: "b33", day_of_week: 5, start_time: "03:10", end_time: "04:20", subject: "ADS", faculty: { name: "Mr.L.N.V.RAO" } },
    
    // Saturday
    { id: "b17", day_of_week: 6, start_time: "09:10", end_time: "10:00", subject: "UHV", faculty: { name: "Mr.M.NARENDRA" } },
    { id: "b18", day_of_week: 6, start_time: "10:00", end_time: "10:50", subject: "DM", faculty: { name: "Mrs.G.SIVA PAVANI" } },
    { id: "b19", day_of_week: 6, start_time: "11:05", end_time: "11:55", subject: "ADS", faculty: { name: "Mr.L.N.V.RAO" } },
    { id: "b20", day_of_week: 6, start_time: "11:55", end_time: "12:45", subject: "DLC", faculty: { name: "Mr.T.ROHINI KUMAR" } },
    { id: "b34", day_of_week: 6, start_time: "01:30", end_time: "04:20", subject: "CLUBS", faculty: { name: "Multiple Faculty" } }
]
};

const TimetableView = ({ section, onAttendanceRequired }: TimetableViewProps) => {
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [viewMode, setViewMode] = useState<'today' | 'week'>('today');
  const [loading, setLoading] = useState(false);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = new Date().getDay();

  useEffect(() => {
    fetchTimetable();
  }, [section]);

  const fetchTimetable = async () => {
    if (!section) return;
    
    setLoading(true);
    try {
      // Get timetable data based on section
      const sectionKey = section.toUpperCase().includes('A') ? 'CSE-A' : 'CSE-B';
      const sectionData = realTimetableData[sectionKey] || [];
      setTimetable(sectionData);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTodayClasses = () => {
    return timetable.filter(entry => entry.day_of_week === currentDay);
  };

  const getClassesByDay = (dayIndex: number) => {
    return timetable.filter(entry => entry.day_of_week === dayIndex);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour24 = parseInt(hours);
    const hour12 = hour24 > 12 ? hour24 - 12 : hour24 === 0 ? 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const isCurrentClass = (startTime: string, endTime: string) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    const classStart = startHour * 60 + startMin;
    const classEnd = endHour * 60 + endMin;
    
    return currentTime >= classStart && currentTime <= classEnd;
  };

  const ClassCard = ({ entry, isToday = false }: { entry: TimetableEntry; isToday?: boolean }) => {
    const isCurrent = isToday && isCurrentClass(entry.start_time, entry.end_time);
    
    return (
      <div className={`
        group relative p-4 rounded-xl border transition-all duration-300 transform hover:scale-[1.02]
        ${isCurrent 
          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-lg ring-2 ring-blue-100' 
          : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
        }
      `}>
        {isCurrent && (
          <div className="absolute -top-2 -right-2">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full animate-pulse shadow-lg">
              ● Live
            </div>
          </div>
        )}
        
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-lg ${isCurrent ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <BookOpen className={`h-4 w-4 ${isCurrent ? 'text-blue-600' : 'text-gray-600'}`} />
            </div>
            <h4 className="font-semibold text-gray-900">{entry.subject}</h4>
          </div>
          <Badge variant="outline" className="text-xs font-medium">
            {formatTime(entry.start_time)} - {formatTime(entry.end_time)}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <User className="h-3 w-3" />
            <span>{entry.faculty?.name || 'TBA'}</span>
          </div>
          {entry.room_number && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-3 w-3" />
              <span>Room {entry.room_number}</span>
            </div>
          )}
        </div>
        
        {onAttendanceRequired && isToday && (
          <Button
            size="sm"
            className="mt-3 w-full opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            onClick={() => onAttendanceRequired(entry.id, entry.subject)}
          >
            Mark Attendance
          </Button>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-blue-600"></div>
          <p className="text-sm text-gray-500">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Class Schedule</h3>

            <p className="text-sm text-gray-500">CSE Department - Academic Year 2025-26</p>
          </div>
        </div>
        <Select value={viewMode} onValueChange={(value: 'today' | 'week') => setViewMode(value)}>
          <SelectTrigger className="w-36 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">📅 Today</SelectItem>
            <SelectItem value="week">📊 Full Week</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Today View */}
      {viewMode === 'today' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border">
            <Clock className="h-5 w-5 text-blue-600" />
            <div>
              <span className="font-medium text-gray-900">
                {dayNames[currentDay]}, {new Date().toLocaleDateString('en-IN', { 
                  day: '2-digit', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
              <p className="text-sm text-gray-600">Today's schedule</p>
            </div>
          </div>
          
          {getTodayClasses().length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {getTodayClasses().map((entry) => (
                <ClassCard key={entry.id} entry={entry} isToday={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <p className="font-semibold text-gray-900 text-lg mb-2">No classes scheduled for today</p>
              <p className="text-gray-600">Enjoy your free day! 🎉</p>
            </div>
          )}
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="space-y-8">
          {dayNames.slice(1, 7).map((dayName, index) => {
            const dayIndex = index + 1; // Monday = 1, Saturday = 6
            const dayClasses = getClassesByDay(dayIndex);
            if (dayClasses.length === 0) return null;
            
            return (
              <div key={dayIndex} className="space-y-4">
                <div className="flex items-center space-x-3 pb-3 border-b-2 border-gray-100">
                  <div className={`w-3 h-3 rounded-full ${dayIndex === currentDay ? 'bg-blue-500' : 'bg-gray-300'}`} />
                  <h4 className={`font-semibold text-lg ${dayIndex === currentDay ? 'text-blue-600' : 'text-gray-900'}`}>
                    {dayName}
                  </h4>
                  {dayIndex === currentDay && (
                    <Badge className="bg-blue-100 text-blue-800 text-xs font-medium">Today</Badge>
                  )}
                </div>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {dayClasses.map((entry) => (
                    <ClassCard 
                      key={entry.id} 
                      entry={entry} 
                      isToday={dayIndex === currentDay}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TimetableView;

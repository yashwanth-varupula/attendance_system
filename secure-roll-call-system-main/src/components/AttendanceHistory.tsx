
import { useState, useEffect } from "react";
import { Clock, Filter, FileText, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  subject: string;
  faculty?: {
    name: string;
  };
}

interface AttendanceHistoryProps {
  studentId: string;
}

type DateFilter = 'today' | 'week' | 'month' | '3months' | '6months';

const AttendanceHistory = ({ studentId }: AttendanceHistoryProps) => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>('week');
  const [currentPage, setCurrentPage] = useState(0);
  
  const RECORDS_PER_PAGE = 7;

  useEffect(() => {
    fetchAttendanceHistory();
  }, [studentId, dateFilter]);

  useEffect(() => {
    setCurrentPage(0);
  }, [records]);

  const fetchAttendanceHistory = async () => {
    if (!studentId) return;
    
    setLoading(true);
    try {
      let dateCondition;
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          dateCondition = today.toISOString().split('T')[0];
          break;
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          dateCondition = weekAgo.toISOString().split('T')[0];
          break;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          dateCondition = monthAgo.toISOString().split('T')[0];
          break;
        case '3months':
          const threeMonthsAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
          dateCondition = threeMonthsAgo.toISOString().split('T')[0];
          break;
        case '6months':
          const sixMonthsAgo = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000);
          dateCondition = sixMonthsAgo.toISOString().split('T')[0];
          break;
        default:
          dateCondition = null;
      }

      let query = supabase
        .from('attendance_records')
        .select(`
          *,
          faculty(name)
        `)
        .eq('student_id', studentId)
        .order('date', { ascending: false });

      if (dateCondition) {
        if (dateFilter === 'today') {
          query = query.eq('date', dateCondition);
        } else {
          query = query.gte('date', dateCondition);
        }
      }

      const { data, error } = await query;

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching attendance history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
  };

  const getFilterLabel = (filter: DateFilter) => {
    switch (filter) {
      case 'today': return 'Today';
      case 'week': return 'Past Week';
      case 'month': return 'Past Month';
      case '3months': return 'Past 3 Months';
      case '6months': return 'Past 6 Months';
      default: return 'Past Week';
    }
  };

  const getCurrentPageRecords = () => {
    const startIndex = currentPage * RECORDS_PER_PAGE;
    return records.slice(startIndex, startIndex + RECORDS_PER_PAGE);
  };

  const totalPages = Math.ceil(records.length / RECORDS_PER_PAGE);
  const currentRecords = getCurrentPageRecords();

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(totalPages - 1, prev + 1));
  };

  return (
      <div className="bg-[#202c45] p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between  pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Attendance History</h3>
            <p className="text-sm text-white">View your academic attendance records</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={dateFilter} onValueChange={(value: DateFilter) => setDateFilter(value)}>
            <SelectTrigger className="w-48 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="today" className="hover:bg-gray-50">Today</SelectItem>
              <SelectItem value="week" className="hover:bg-gray-50">Past Week</SelectItem>
              <SelectItem value="month" className="hover:bg-gray-50">Past Month</SelectItem>
              <SelectItem value="3months" className="hover:bg-gray-50">Past 3 Months</SelectItem>
              <SelectItem value="6months" className="hover:bg-gray-50">Past 6 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="text-sm font-medium text-gray-600">Total Records</div>
          <div className="text-2xl font-bold text-gray-900">{records.length}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border">
          <div className="text-sm font-medium text-green-600">Present</div>
          <div className="text-2xl font-bold text-green-700">
            {records.filter(r => r.status === 'present').length}
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border">
          <div className="text-sm font-medium text-red-600">Absent</div>
          <div className="text-2xl font-bold text-red-700">
            {records.filter(r => r.status === 'absent').length}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : currentRecords.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="font-semibold text-gray-900 py-4">Date</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4">Subject</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4">Faculty</TableHead>
                <TableHead className="font-semibold text-gray-900 py-4 text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentRecords.map((record, index) => (
                <TableRow 
                  key={record.id} 
                  className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                >
                  <TableCell className="py-4 font-medium text-gray-900">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{formatDate(record.date)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-gray-700 font-medium">
                    {record.subject}
                  </TableCell>
                  <TableCell className="py-4 text-gray-600">
                    {record.faculty?.name || 'N/A'}
                  </TableCell>
                  <TableCell className="py-4 text-center">
                    <Badge 
                      className={`px-3 py-1 text-xs font-medium ${
                        record.status === 'present' 
                          ? 'bg-green-100 text-green-800 border-green-200' 
                          : 'bg-red-100 text-red-800 border-red-200'
                      }`}
                    >
                      {record.status === 'present' ? 'Present' : 'Absent'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-700">
                Showing <span className="font-medium">{currentPage * RECORDS_PER_PAGE + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min((currentPage + 1) * RECORDS_PER_PAGE, records.length)}
                </span>{' '}
                of <span className="font-medium">{records.length}</span> results
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={currentPage === 0}
                  className="flex items-center space-x-1 border-gray-300 hover:bg-gray-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                      key={i}
                      variant={currentPage === i ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(i)}
                      className={`w-8 h-8 p-0 ${
                        currentPage === i 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentPage === totalPages - 1}
                  className="flex items-center space-x-1 border-gray-300 hover:bg-gray-100"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Records Found</h3>
          <p className="text-gray-600">No attendance records available for {getFilterLabel(dateFilter).toLowerCase()}</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default AttendanceHistory;
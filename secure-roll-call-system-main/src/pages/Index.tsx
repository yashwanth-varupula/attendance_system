import { Button } from "@/components/ui/button";
import Header from "/src/components/Header";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GraduationCap,
  Users,
  BarChart3,
  Shield,
  CalendarCheck,
  BookOpen,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function IndexPage() {
  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-6">
          Smart Attendance & Progress Tracker
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          monitor your attendance, strengthen your academic performance, and
          stay informed with transparent, real-time updates. For faculty, taking
          attendance is simplified; for students, tracking your progress is just
          a click away.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/auth">
            <Button size="lg" className="w-full sm:w-auto">
              Faculty Login
            </Button>
          </Link>
          <Link to="/student-portal">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Student Portal
            </Button>
          </Link>
        </div>
      </section>
      <section className="container mx-auto px-4 py-16">
        {" "}
        <h3 className="text-3xl font-bold text-center mb-12">
          Key Features
        </h3>{" "}
        <div className="grid md:grid-cols-3 gap-8">
          {" "}
          <Card className="text-center">
            {" "}
            <CardHeader>
              {" "}
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />{" "}
              <CardTitle>Faculty Dashboard</CardTitle>{" "}
              <CardDescription>
                {" "}
                Easy-to-use interface for taking and managing daily attendance{" "}
              </CardDescription>{" "}
            </CardHeader>{" "}
            <CardContent>
              {" "}
              <p className="text-gray-600">
                {" "}
                Mark attendance for All sections with automatic roll number
                management{" "}
              </p>{" "}
            </CardContent>{" "}
          </Card>{" "}
          <Card className="text-center">
            {" "}
            <CardHeader>
              {" "}
              <BarChart3 className="h-12 w-12 text-green-600 mx-auto mb-4" />{" "}
              <CardTitle>Student Analytics</CardTitle>{" "}
              <CardDescription>
                {" "}
                Real-time attendance tracking and percentage calculations{" "}
              </CardDescription>{" "}
            </CardHeader>{" "}
            <CardContent>
              {" "}
              <p className="text-gray-600">
                {" "}
                Students can instantly check their attendance percentage by
                entering their ID{" "}
              </p>{" "}
            </CardContent>{" "}
          </Card>{" "}
          <Card className="text-center">
            {" "}
            <CardHeader>
              {" "}
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />{" "}
              <CardTitle>Secure & Reliable</CardTitle>{" "}
              <CardDescription>
                {" "}
                Robust backend with user authentication and data protection{" "}
              </CardDescription>{" "}
            </CardHeader>{" "}
            <CardContent>
              {" "}
              <p className="text-gray-600">
                {" "}
                Your data is safely stored and accessible from anywhere, anytime{" "}
              </p>{" "}
            </CardContent>{" "}
          </Card>{" "}
        </div>{" "}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
           
            
          </div>
          <p className="text-gray-400">
            &copy; VKR VNB AGK College of Engineering. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Card from "../components/Card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const data = [
  { day: "Mon", progress: 20 },
  { day: "Tue", progress: 35 },
  { day: "Wed", progress: 50 },
  { day: "Thu", progress: 60 },
  { day: "Fri", progress: 75 },
  { day: "Sat", progress: 85 },
  { day: "Sun", progress: 90 },
];

const UserDashboard: React.FC = () => {
  const [streak, _setStreak] = useState(5);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <motion.main 
        className="container mx-auto px-4 py-8" 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold mb-6">Welcome, User!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Current Topic">
            <p className="text-gray-600 mb-2">Machine Learning Basics</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-black h-2.5 rounded-full" style={{ width: "45%" }}></div>
            </div>
            <p className="text-sm text-gray-500 mt-2">45% complete</p>
          </Card>
          <Card title="Today's Goals">
            <ul className="list-disc list-inside text-gray-600">
              <li>Review Linear Regression</li>
              <li>Complete 20 flashcards</li>
              <li>Start Decision Trees chapter</li>
            </ul>
          </Card>
          <Card title="Study Streak">
            <p className="text-gray-600 text-lg font-semibold">🔥 {streak} Days</p>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Weekly Progress">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="progress" stroke="#4F46E5" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Recent Activity">
            <ul className="text-gray-600">
              <li className="mb-2">✅ Completed: Linear Regression Quiz</li>
              <li className="mb-2">📖 Studied: Decision Trees (30 mins)</li>
              <li>💡 New Flashcards Created: 10</li>
            </ul>
          </Card>
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-bold mb-4">Quick Actions</h3>
          <div className="flex space-x-4">
            <Button onClick={()=>navigate("/schedule")} >Create New Study Plan</Button>
            <Button onClick={()=>navigate("/flashcards")} variant="secondary">Review Flashcards</Button>
            <Button onClick={()=>navigate("/roadmap")} variant="outline">Update Roadmap</Button>
          </div>
        </div>
      </motion.main>
    </div>
  );
};

export default UserDashboard;

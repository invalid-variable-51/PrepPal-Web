"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import Card from "./Card";
import { motion, AnimatePresence } from "framer-motion";

const timeSlots = [
  "8:00 AM - 9:30 AM",
  "10:00 AM - 11:30 AM",
  "12:00 PM - 1:30 PM",
  "2:00 PM - 3:30 PM",
  "4:00 PM - 5:30 PM",
  "6:00 PM - 7:30 PM",
];

const StudySchedule: React.FC = () => {
  const [schedule, setSchedule] = useState([
    { time: "10:00 AM - 11:30 AM", topic: "Linear Regression" },
    { time: "2:00 PM - 3:30 PM", topic: "Decision Trees" },
  ]);

  const [newTime, setNewTime] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [error, setError] = useState("");

  const handleAdd = (e: FormEvent) => {
    e.preventDefault();
    if (!newTime || !newTopic.trim()) {
      setError("Please select a time and enter a topic.");
      return;
    }
    if (schedule.some((item) => item.time === newTime)) {
      setError("This time slot already exists.");
      return;
    }

    setSchedule([...schedule, { time: newTime, topic: newTopic }]);
    setNewTime("");
    setNewTopic("");
    setError("");
  };

  const handleDelete = (time: string) => {
    setSchedule((prev) => prev.filter((item) => item.time !== time));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h2 className="text-4xl font-bold text-center mb-10 text-gray-900">📚 Personalized Study Schedule</h2>

      <form
        onSubmit={handleAdd}
        className="backdrop-blur-md bg-white/50 border border-gray-200 rounded-xl shadow-md p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      >
        <select
          value={newTime}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewTime(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-black"
        >
          <option value="">Select Time</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Topic (e.g., Flashcard Review)"
          value={newTopic}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTopic(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm shadow-sm focus:ring-2 focus:ring-black"
        />

        <button
          type="submit"
          className="bg-black text-white py-2 px-4 rounded-md hover:scale-105 transition font-medium"
        >
          ➕ Add Slot
        </button>
      </form>

      {error && (
        <p className="text-red-600 text-sm mb-6 text-center animate-pulse">{error}</p>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        <AnimatePresence>
          {schedule.map((item) => (
            <motion.div
              key={item.time}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              <Card title={item.time}>
                <div className="flex justify-between items-center text-gray-800">
                  <p className="text-sm">{item.topic}</p>
                  <button
                    onClick={() => handleDelete(item.time)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudySchedule;
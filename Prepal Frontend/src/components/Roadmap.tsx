// Final Roadmap.tsx with Zoom, Search, Tooltip, Export, and Fixed Layout
"use client";

import { useState, useCallback, ChangeEvent, useRef } from "react";
import { motion } from "framer-motion";
import { generateRoadmapFromHuggingFace } from "./openaiUtils";
import Input from "./Input";
import Button from "./Button";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import { Tooltip } from "react-tooltip";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface RoadmapItem {
  id: string;
  label: string;
  level: number;
  parentId?: string;
  x: number;
  y: number;
  completed?: boolean;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const getColorByLevel = (level: number) => {
  const colors = ["bg-white", "bg-blue-100", "bg-green-100", "bg-yellow-100"];
  return colors[level % colors.length];
};

const Roadmap = () => {
  const [topic, setTopic] = useState("");
  const [search, setSearch] = useState("");
  const [nodes, setNodes] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(false);
  const roadmapRef = useRef<HTMLDivElement>(null);

  const fetchInitialRoadmap = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    const roadmap = await generateRoadmapFromHuggingFace(topic);
    setLoading(false);

    const rootNodes = roadmap.slice(0, 3).map((label, index) => ({
      id: generateId(),
      label,
      level: 0,
      x: 300,
      y: 120 + index * 180,
      completed: false,
    }));

    setNodes(rootNodes);
  };

  const expandNode = useCallback(async (node: RoadmapItem) => {
    const children = await generateRoadmapFromHuggingFace(node.label);
    const childNodes = children.slice(0, 3).map((label, idx) => ({
      id: generateId(),
      label,
      level: node.level + 1,
      parentId: node.id,
      x: node.x + 350,
      y: node.y + (idx - 1) * 180,
      completed: false,
    }));

    setNodes((prev) => [...prev, ...childNodes]);
  }, []);

  const handleNodeClick = (node: RoadmapItem) => {
    const hasChildren = nodes.some((n) => n.parentId === node.id);
    if (!hasChildren) expandNode(node);
  };

  const handleChildClick = (label: string) => {
    const search = encodeURIComponent(`${label} site:developer.mozilla.org`);
    window.open(`https://www.google.com/search?q=${search}`, "_blank");
  };

  const toggleComplete = (id: string) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, completed: !n.completed } : n
      )
    );
  };

  const exportAsImage = async () => {
    const element = roadmapRef.current;
    if (!element) return;
    const dataUrl = await toPng(element);
    const pdf = new jsPDF("landscape");
    pdf.addImage(dataUrl, "PNG", 10, 10, 280, 150);
    pdf.save("roadmap.pdf");
  };

  const highlightMatch = (label: string) =>
    search && label.toLowerCase().includes(search.toLowerCase());

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 text-black px-6 py-8">
      <h1 className="text-4xl font-bold text-center mb-6">🧠 Generate Your Learning Roadmap</h1>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
        <Input
          value={topic}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setTopic(e.target.value)}
          placeholder="e.g., React, DevOps, AI"
          className="w-full sm:w-96 border border-gray-300 px-4 py-2 rounded-md"
          label="Topic"
        />
        <Button
          onClick={fetchInitialRoadmap}
          className="bg-black text-white px-6 py-2 mt-5 rounded-md hover:scale-105 transition"
        >
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <input
          type="text"
          placeholder="🔍 Search Node..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-400 px-3 py-2 rounded-md w-64 text-sm"
        />
        {nodes.length > 0 && (
          <Button
            onClick={exportAsImage}
            className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition text-sm"
          >
            Export PDF
          </Button>
        )}
      </div>

      <div className="w-full h-[calc(100vh-280px)] overflow-hidden border rounded-lg bg-white shadow-md">
        <TransformWrapper initialScale={1} minScale={0.5} maxScale={2}>
              <TransformComponent>
                <div id="roadmap-container" ref={roadmapRef} className="relative  w-[3000px] h-[2000px]">
                  <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    {nodes.map((child) => {
                      const parent = nodes.find((n) => n.id === child.parentId);
                      if (!parent) return null;
                      const startX = parent.x + 120;
                      const startY = parent.y + 50;
                      const endX = child.x + 120;
                      const endY = child.y;
                      return (
                        <line
                          key={`line-${child.id}`}
                          x1={startX}
                          y1={startY}
                          x2={endX}
                          y2={endY}
                          stroke="#cbd5e0"
                          strokeWidth={2}
                        />
                      );
                    })}
                  </svg>

                  {nodes.map((node) => (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      data-tip={node.label}
                      className={`absolute rounded-lg px-4 py-3 w-[200px] text-center border shadow-sm hover:shadow-md transition cursor-pointer ${
                        getColorByLevel(node.level)
                      } ${node.completed ? "border-green-600 bg-green-50" : ""} ${
                        highlightMatch(node.label) ? "ring-2 ring-blue-500" : ""
                      }`}
                      style={{ top: node.y, left: node.x }}
                      onClick={() =>
                        node.parentId ? handleChildClick(node.label) : handleNodeClick(node)
                      }
                    >
                      <input
                        type="checkbox"
                        checked={node.completed}
                        onChange={() => toggleComplete(node.id)}
                        className="mr-2"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <h3 className="text-sm font-semibold inline-block align-middle">
                        {node.label}
                      </h3>
                      <Tooltip place="top"/>
                    </motion.div>
                  ))}
                </div>
              </TransformComponent>
        </TransformWrapper>
      </div>
    </div>
  );
};

export default Roadmap;
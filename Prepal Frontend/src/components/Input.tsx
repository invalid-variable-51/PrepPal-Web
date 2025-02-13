import type React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

const Input: React.FC<InputProps> = ({ label, className = "", ...props }) => {
  return (
    <div className="mb-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black ${className}`}
        {...props}
      />
    </div>
  )
}

export default Input


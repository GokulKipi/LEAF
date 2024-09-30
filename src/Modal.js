import React, { useState } from "react";
import "tailwindcss/tailwind.css";

const Modal = ({ isOpen, onClose, content }) => {
  const [activeTab, setActiveTab] = useState("Use Cases");
  const [selectedSubOption, setSelectedSubOption] = useState(null);

  const kpiOptions = content.topic.kpis || [];
  const useCaseOptions = content.topic.useCases || []; // Ensure use cases are included

  console.log("KPI Options:", kpiOptions);
  console.log("Use Case Options:", useCaseOptions);
  console.log("Content:", content);

  if (!isOpen || !content) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="bg-white p-8 rounded-lg w-full max-w-6xl">
        {/* Modal Header */}
        <h2 className="text-2xl font-bold mb-4">
          {content.section} - {content.topic.name}
        </h2>

        {/* Tabs for switching between KPI's and Use Cases */}
        <div className="flex mb-4">
          <button
            className={`flex-1 px-3 py-2 mx-2 rounded ${
              activeTab === "KPI's" ? "bg-green-500 text-white" : "bg-gray-300"
            } text-sm transition`}
            onClick={() => setActiveTab("KPI's")}
          >
            KPI's
          </button>
          <button
            className={`flex-1 px-3 py-2 mx-2 rounded ${
              activeTab === "Use Cases"
                ? "bg-green-500 text-white"
                : "bg-gray-300"
            } text-sm transition`}
            onClick={() => setActiveTab("Use Cases")}
          >
            Use Cases
          </button>
        </div>

        {/* Render KPI or Use Case options */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(activeTab === "Use Cases" ? useCaseOptions : kpiOptions).map(
            (option, idx) => (
              <button
                key={idx}
                className={`px-4 py-2 rounded ${
                  selectedSubOption === option
                    ? "bg-green-500 text-white"
                    : "bg-gray-300"
                } text-sm transition`}
                onClick={() => setSelectedSubOption(option)}
              >
                {activeTab === "Use Cases" ? option.usecase : option.kpi}{" "}
                {/* Usecase name or KPI name */}
              </button>
            )
          )}
        </div>

        {/* Display selected KPI details */}
        {selectedSubOption && activeTab === "KPI's" && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">
              {selectedSubOption.kpi}
            </h3>
            <p>
              <strong>Explanation:</strong>{" "}
              {selectedSubOption.explanation || "No explanation available."}
            </p>
            <p>
              <strong>Formula:</strong>{" "}
              {selectedSubOption.formula || "No formula available."}
            </p>
          </div>
        )}

        {/* Display selected Use Case details */}
        {selectedSubOption && activeTab === "Use Cases" && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">
              {selectedSubOption.usecase}
            </h3>
            <p>
              <strong>Definition:</strong>{" "}
              {selectedSubOption.definitions || "No definition available."}
            </p>
            <p>
              <strong>Description:</strong>{" "}
              {selectedSubOption.description || "No description available."}
            </p>
            <p>
              <strong>Business Impact:</strong>{" "}
              {selectedSubOption.business_impact ||
                "No business impact available."}
            </p>
          </div>
        )}

        {/* Close button */}
        <button
          className="mt-4 px-4 py-2 bg-gray-500 text-white rounded float-right"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import kpiData from "./kpi_output.json"; // Import JSON dynamically
import "./TopicsList.css";

// Icon map for specific industries
const industryIcons = {
  "Oil & Gas": "⛽",
  Provider: "🔧",
  "Investment Banking": "💼",
  "Medical Device & Equipment Manufacturers": "🏥",
  Retail: "🛒",
  Hospitality: "🏨",
  Automobiles: "🚗",
  "Discrete Manufacturing": "🏭",
  "Wealth Management": "💰",
  Insurance: "📜",
  "Retail Banking": "🏦",
  CPG: "📦",
  Aviation: "✈️",
};

const TopicsList = () => {
  const [industries, setIndustries] = useState([]);

  useEffect(() => {
    // Extract industries dynamically from kpiData
    const extractedIndustries = kpiData
      .map((domainData) =>
        domainData.industries.map((industryData) => ({
          name: industryData.industry, // Industry name
          path: `/${industryData.industry.toLowerCase().replace(/\s+/g, "-")}`, // Dynamically generate path
          icon: industryIcons[industryData.industry] || "🏭", // Use specific icon or default
        }))
      )
      .flat();

    setIndustries(extractedIndustries);
  }, []);

  return (
    <div className="topics-container">
      <div className="inner-box">
        <div className="common-topics">
          <span>Common Topics: </span>
          <a href="/oil-&-gas">Oil & Gas</a>,{" "}
          <a href="/retail-banking">Retail Banking</a>,{" "}
          <a href="/insurance">Insurance</a>
        </div>
        <ul className="topics-list">
          {industries.map((industry, index) => (
            <li key={index} className="topic-item">
              <Link to={industry.path} className="topic-link">
                <span className="topic-icon">{industry.icon}</span>
                <span className="topic-name">{industry.name}</span>
                <span className="topic-arrow">➡️</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TopicsList;

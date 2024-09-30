import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Modal from "./Modal";
import "./RetailBankingDetail.css";
import kpiData from "./kpi_output.json"; // Import the JSON file
import { FaHome } from "react-icons/fa";

const RetailBankingDetail = () => {
  const { industry } = useParams(); // Capture the dynamic industry from the URL
  const location = useLocation(); // Capture the state passed from search results
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [loading, setLoading] = useState(false); // State to manage loading
  const [sections, setSections] = useState([]); // State to hold the sections data

  // Normalize the industry parameter and filter the corresponding data from kpiData
  const normalizedIndustry = industry
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-");

  useEffect(() => {
    const industryData = kpiData.flatMap((domainData) =>
      domainData.industries.filter((ind) => {
        const jsonIndustryName = ind.industry
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/&/g, "-");
        return jsonIndustryName === normalizedIndustry;
      })
    );

    if (industryData.length === 0) {
      setSections([]);
      return;
    }

    const newSections = industryData[0].classifications.map(
      (classification) => ({
        name: classification.classification,
        categories: classification.departments.map((department) => ({
          name: department.department,
          topics: department.subdepartments.map((subdepartment) => ({
            name: subdepartment.subdepartment,
            kpis: subdepartment.kpicollection,
            useCases: subdepartment.usecases || [],
          })),
        })),
      })
    );

    setSections(newSections);

    // Check for passed KPI from the search results
    const passedKpi = location.state?.kpi || null;

    if (passedKpi) {
      const foundKpi = newSections
        .flatMap((section) =>
          section.categories.flatMap((category) =>
            category.topics.flatMap((topic) =>
              topic.kpis.find((kpiObj) => kpiObj.kpi === passedKpi)
            )
          )
        )
        .filter(Boolean)[0];

      if (foundKpi) {
        setModalContent({
          section: "KPI from search",
          category: "KPI category",
          topic: { kpis: [foundKpi], useCases: [] },
        });
        setIsModalOpen(true);
      }
    }
  }, [normalizedIndustry, location.state]); // Dependencies to rerun the effect

  // Export to PDF function
  const exportToPDF = async () => {
    setLoading(true);
    const input = document.getElementById("pdf-content");

    try {
      const canvas = await html2canvas(input, {
        scale: 1,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
      pdf.save(`${industry}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTopicClick = (section, category, topic) => {
    setModalContent({
      section,
      category,
      topic,
      useCases: topic.useCases,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="retail-banking-page">
      <div className="header-container">
        <Link to="/" className="home-button">
          <FaHome />
        </Link>
        <h1 className="title">{industry}</h1>
        <button className="export-button" onClick={exportToPDF}>
          Export to PDF
        </button>
      </div>
      {loading && <div className="loading">Generating PDF...</div>}
      <div id="pdf-content">
        {sections.length > 0 ? (
          sections.map((section, sectionIdx) => (
            <div key={sectionIdx} className="section">
              <h2>{section.name}</h2>
              <div className="categories">
                {section.categories.map((category, categoryIdx) => (
                  <div key={categoryIdx} className="category">
                    <h3>{category.name}</h3>
                    <div className="topics">
                      {category.topics.map((topic, topicIdx) => (
                        <button
                          key={topicIdx}
                          className="topic-button"
                          onClick={() =>
                            handleTopicClick(section.name, category.name, topic)
                          }
                        >
                          {topic.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No data available for {industry}.</p>
        )}
      </div>
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          content={modalContent}
        />
      )}
    </div>
  );
};

export default RetailBankingDetail;

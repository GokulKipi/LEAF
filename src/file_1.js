import React, { useState } from "react";
import { Link } from "react-router-dom";
import Modal from "./Modal";
import "./RetailBankingDetail.css";
import html2pdf from "html2pdf.js";

const RetailBankingDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const sections = [
    {
      name: "Front Office",
      categories: [
        {
          name: "Sales",
          topics: [
            "Customer Acquisition",
            "Customer Onboarding",
            "Cross Selling & Upselling",
            "Customer Service",
            "Relationship Management",
            "Customer Life cycle",
          ],
        },
        {
          name: "Branch Operations",
          topics: [
            "Payments & Settlements",
            "Check & Draft Processing",
            "Account Servicing",
            "Remittances In & Out",
            "Currency Exchange",
            "Branch Cash Management",
            "ATM Cash Management",
            "Safety Deposit Box Management",
          ],
        },
        {
          name: "Facilities",
          topics: [
            "Branch Facilities & Furniture",
            "Branch Security",
            "Logistics",
            "Stationary & Consumables",
            "Lighting, Electricals & Electronics",
            "Repairs & Maintenance",
            "Real Estate",
            "Physical & Digital Assets Management",
          ],
        },
      ],
    },
    {
      name: "Middle Office",
      categories: [
        {
          name: "Sales",
          topics: [
            "Customer Acquisition",
            "Customer Onboarding",
            "Cross Selling & Upselling",
            "Customer Service",
            "Relationship Management",
            "Customer Life cycle",
          ],
        },
        {
          name: "Branch Operations",
          topics: [
            "Payments & Settlements",
            "Check & Draft Processing",
            "Account Servicing",
            "Remittances In & Out",
            "Branch Cash Management",
            "ATM Cash Management",
            "Safety Deposit Box Management",
          ],
        },
        {
          name: "Facilities",
          topics: [
            "Branch Facilities & Furniture",
            "Branch Security",
            "Logistics",
            "Stationary & Consumables",
            "Lighting, Electricals & Electronics",
            "Repairs & Maintenance",
            "Real Estate",
            "Physical & Digital Assets Management",
          ],
        },
      ],
    },
    {
      name: "Back Office",
      categories: [
        {
          name: "Sales",
          topics: [
            "Customer Acquisition",
            "Customer Onboarding",
            "Cross Selling & Upselling",
            "Customer Service",
            "Relationship Management",
            "Customer Life cycle",
          ],
        },
        {
          name: "Branch Operations",
          topics: [
            "Payments & Settlements",
            "Check & Draft Processing",
            "Account Servicing",
            "Remittances In & Out",
            "Branch Cash Management",
            "ATM Cash Management",
            "Safety Deposit Box Management",
          ],
        },
        {
          name: "Facilities",
          topics: [
            "Branch Facilities & Furniture",
            "Branch Security",
            "Logistics",
            "Stationary & Consumables",
            "Lighting, Electricals & Electronics",
            "Repairs & Maintenance",
            "Real Estate",
            "Physical & Digital Assets Management",
          ],
        },
        {
          name: "Facilities2",
          topics: [
            "Branch Facilities & Furniture",
            "Branch Security",
            "Logistics",
            "Stationary & Consumables",
            "Lighting, Electricals & Electronics",
            "Repairs & Maintenance",
            "Real Estate",
            "Physical & Digital Assets Management",
          ],
        },
      ],
    },
  ];

  // Handle topic button click
  const handleTopicClick = (section, category, topic) => {
    setModalContent({
      section,
      category,
      topic,
    });
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // Export to PDF
  const handleExportPDF = () => {
    const element = document.body; // Or specify a more specific element
    const opt = {
      margin: 1,
      filename: "Retail_Banking_Detail.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="retail-banking-page">
      <div className="header">
        <Link to="/" className="home-link">
          <span role="img" aria-label="Home" className="home-icon">
            🏠
          </span>
        </Link>

        <h1 className="title">Automobile</h1>

        <button className="export-button" onClick={handleExportPDF}>
          Export to PDF
        </button>
      </div>

      {/* Render sections and categories */}
      {sections.map((section, sectionIdx) => (
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
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Modal for displaying KPI details */}
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

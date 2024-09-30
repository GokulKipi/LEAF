import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import data from "./kpi_output.json"; // Adjust the path to your JSON file

const SearchResults = () => {
  const [filteredResults, setFilteredResults] = useState([]);
  const [expandedIndustry, setExpandedIndustry] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null); // To handle the modal
  const [selectedIndustry, setSelectedIndustry] = useState(""); // Track selected industry
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("query");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const results = [];

      // Search logic to find KPIs and use cases under industries
      data.forEach((domain) => {
        domain.industries.forEach((industry) => {
          const matchedKPIs = [];
          const matchedUseCases = [];

          industry.classifications.forEach((classification) => {
            classification.departments.forEach((department) => {
              department.subdepartments.forEach((subdepartment) => {
                // Check for matching KPIs
                subdepartment.kpicollection.forEach((kpi) => {
                  if (
                    kpi.kpi.toLowerCase().includes(searchQuery.toLowerCase())
                  ) {
                    matchedKPIs.push({
                      ...kpi,
                      subdepartment: subdepartment.subdepartment,
                    }); // Include subdepartment for rendering
                  }
                });

                // Check for matching use cases
                subdepartment.usecases.forEach((usecaseObj) => {
                  if (
                    typeof usecaseObj.usecase === "string" &&
                    usecaseObj.usecase
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  ) {
                    matchedUseCases.push(usecaseObj); // Push the entire object if matched
                  }
                });
              });
            });
          });

          // Only push industries with matched KPIs or use cases
          if (matchedKPIs.length > 0 || matchedUseCases.length > 0) {
            results.push({
              industry: industry.industry,
              matchedKPIs,
              matchedUseCases,
            });
          }
        });
      });

      setFilteredResults(results);
    };

    if (searchQuery) {
      fetchData();
    }
  }, [searchQuery]);

  const handleIndustryClick = (index) => {
    setExpandedIndustry(index === expandedIndustry ? null : index);
  };

  const goBackHome = () => {
    navigate("/");
  };

  const handleItemClick = (item, industry) => {
    setSelectedItem(item); // Open the modal with the clicked item details
    setSelectedIndustry(industry); // Set the selected industry for navigation
  };

  const closeModal = () => {
    setSelectedItem(null); // Close the modal
  };

  // Function to get the main topic from the industry name
  const getMainTopic = (industry) => {
    return industry.toLowerCase().replace(/\s+/g, "-"); // Convert to lower case and replace spaces with dashes
  };

  return (
    <div className="search-results-page py-6 px-8 bg-gray-50 min-h-screen">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={goBackHome}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md"
        >
          Back to Home
        </button>
      </div>

      {/* Search Results Header */}
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Search Results
      </h2>
      <div className="text-lg text-gray-600 mb-4">
        Results for{" "}
        <span className="font-bold text-blue-600">"{searchQuery}"</span>:
      </div>

      {/* Results Container */}
      <div className="results-container">
        {filteredResults.length > 0 ? (
          filteredResults.map((industry, index) => (
            <div key={index} className="industry-box mb-4">
              {/* Industry Title with Icon */}
              <div
                className="industry-title cursor-pointer flex justify-between items-center bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-2 rounded-lg shadow-md"
                onClick={() => handleIndustryClick(index)}
              >
                <div className="flex items-center">
                  <div className="icon-box bg-white text-teal-500 rounded-full p-2 mr-2">
                    <i className="fas fa-industry"></i>
                  </div>
                  <span className="text-lg">{industry.industry}</span>
                </div>
                <span className="ml-2">
                  {expandedIndustry === index ? "−" : "+"}
                </span>
              </div>

              {/* Expand to show KPIs and use cases */}
              {expandedIndustry === index && (
                <div className="kpi-container pl-4 mt-2 border border-gray-300 p-4 rounded-lg">
                  {/* Use Cases */}
                  {industry.matchedUseCases.length > 0 && (
                    <div className="usecase-section mb-4">
                      <h4 className="text-md font-semibold text-blue-600 mb-2">
                        Use Cases
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {industry.matchedUseCases.map(
                          (usecaseObj, usecaseIdx) => (
                            <button
                              key={usecaseIdx}
                              className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 shadow-sm transition-colors duration-300 whitespace-nowrap"
                              onClick={() =>
                                handleItemClick(usecaseObj, industry.industry)
                              } // Pass the entire object and industry name
                            >
                              {usecaseObj.usecase}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* KPIs grouped by subdepartment */}
                  <div className="kpi-section mb-4">
                    <h4 className="text-md font-semibold text-green-600 mb-2">
                      KPIs
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {industry.matchedKPIs.map((kpi, kpiIdx) => (
                        <button
                          key={kpiIdx}
                          className="bg-green-500 text-white rounded-md p-2 hover:bg-green-600 shadow-sm transition-colors duration-300 whitespace-nowrap"
                          onClick={() =>
                            handleItemClick(kpi, industry.industry)
                          } // Pass the KPI object and industry name
                        >
                          {kpi.kpi}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">
            No results found for{" "}
            <span className="font-bold text-blue-600">"{searchQuery}"</span>.
          </p>
        )}
      </div>

      {/* Modal for showing KPI or Use Case details */}
      {selectedItem && (
        <div className="modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div
            className="modal-content bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full" // Increased modal size
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            <h2 className="text-2xl font-bold mb-4">
              {selectedItem.kpi || selectedItem.usecase}
            </h2>{" "}
            {/* Dynamic heading */}
            {/* Display the individual fields of the selected KPI or use case */}
            {typeof selectedItem === "object" ? (
              <>
                {selectedItem.kpi ? ( // If it’s a KPI
                  <>
                    <p>
                      <strong>Formula:</strong> {selectedItem.formula || "N/A"}
                    </p>
                    <p>
                      <strong>Explanation:</strong>{" "}
                      {selectedItem.explanation || "N/A"}
                    </p>
                  </>
                ) : (
                  // If it’s a Use Case
                  <>
                    <p>
                      <strong>Definition:</strong>{" "}
                      {selectedItem.definitions || "N/A"}
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {selectedItem.description || "N/A"}
                    </p>
                    <p>
                      <strong>Business Impact:</strong>{" "}
                      {selectedItem.business_impact || "N/A"}
                    </p>
                  </>
                )}
                {/* Link to detail page */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => {
                      const mainTopic = getMainTopic(selectedIndustry); // Use the selected industry
                      navigate(`/${mainTopic}`); // Adjust link to match your structure dynamically
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Go to Detail Page
                  </button>
                  <button
                    onClick={closeModal}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <p>{selectedItem}</p> // Display use case if it's a string
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;

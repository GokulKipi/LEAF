from fastapi import FastAPI
from typing import List, Dict
from fastapi.middleware.cors import CORSMiddleware
import json
from pathlib import Path

app = FastAPI()

# Add CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your React app's origin here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data for the topics endpoint
topics_data = [
    {
        "id": 1,
        "name": "Financial Services",
        "icon": "🏦",
        "path": "/financial-services",
    },
    {
        "id": 2,
        "name": "Manufacturing",
        "icon": "🏭",
        "path": "/financial-services",
    },
    {
        "id": 3,
        "name": "Healthcare & Life Science",
        "icon": "🧑‍⚕️",
        "path": "/financial-services",
    },
    {
        "id": 4,
        "name": "Technology",
        "icon": "💻",
        "path": "/financial-services",
    },
    {
        "id": 5,
        "name": "Media & Entertainment",
        "icon": "🎬",
        "path": "/financial-services",
    },
    {
        "id": 6,
        "name": "Retail & CPG",
        "icon": "🛒",
        "path": "/financial-services",
    },
    {
        "id": 7,
        "name": "Professional Services & Consulting",
        "icon": "💼",
        "path": "/financial-services",
    },
]

# Data for the automobiles endpoint
automobiles_data = [
    {
        "name": "Front Office",
        "categories": [
            {
                "name": "Sales",
                "topics": [
                    {
                        "topic": "Customer Acquisition",
                        "KPIs": [
                            {
                                "KPI": "1",
                                "usecases": [
                                    {
                                        "name": "Conversion Rate",
                                        "definition": "The percentage of leads that become customers.",
                                        "formula": "(Number of Customers / Number of Leads) * 100",
                                    },
                                    {
                                        "name": "Cost Per Acquisition",
                                        "definition": "The average cost to acquire a new customer.",
                                        "formula": "Total Cost of Marketing / Number of New Customers",
                                    },
                                ],
                            },
                            {
                                "KPI": "2",
                                "usecases": [
                                    {
                                        "name": "Lead-to-Customer Ratio",
                                        "definition": "Ratio of leads to actual customers.",
                                        "formula": "Number of Customers / Number of Leads",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        "topic": "Customer Onboarding",
                        "KPIs": [
                            {
                                "KPI": "1",
                                "usecases": [
                                    {
                                        "name": "Onboarding Completion Rate",
                                        "definition": "Percentage of customers who complete the onboarding process.",
                                        "formula": "(Number of Completed Onboardings / Number of New Customers) * 100",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "Branch Operations",
                "topics": [
                    {
                        "topic": "Payments & Settlements",
                        "KPIs": [
                            {
                                "KPI": "1",
                                "usecases": [
                                    {
                                        "name": "Transaction Accuracy Rate",
                                        "definition": "Percentage of transactions processed without errors.",
                                        "formula": "(Number of Accurate Transactions / Total Number of Transactions) * 100",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        "topic": "Payments & Settlements",
                        "KPIs": [
                            {
                                "KPI": "1",
                                "usecases": [
                                    {
                                        "name": "Transaction Accuracy Rate",
                                        "definition": "Percentage of transactions processed without errors.",
                                        "formula": "(Number of Accurate Transactions / Total Number of Transactions) * 100",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        "topic": "Payments & Settlements",
                        "KPIs": [
                            {
                                "KPI": "1",
                                "usecases": [
                                    {
                                        "name": "Transaction Accuracy Rate",
                                        "definition": "Percentage of transactions processed without errors.",
                                        "formula": "(Number of Accurate Transactions / Total Number of Transactions) * 100",
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        "topic": "Payments & Settlements",
                        "KPIs": [
                            {
                                "KPI": "1",
                                "usecases": [
                                    {
                                        "name": "Transaction Accuracy Rate",
                                        "definition": "Percentage of transactions processed without errors.",
                                        "formula": "(Number of Accurate Transactions / Total Number of Transactions) * 100",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "Ops",
                "topics": [
                    {
                        "topic": "Payments & Settlements",
                        "KPIs": [
                            {
                                "KPI": "1",
                                "usecases": [
                                    {
                                        "name": "Transaction Accuracy Rate",
                                        "definition": "Percentage of transactions processed without errors.",
                                        "formula": "(Number of Accurate Transactions / Total Number of Transactions) * 100",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        "name": "Middle Office",
        "categories": [
            {
                "name": "Sales",
                "topics": [
                    {
                        "topic": "Customer Acquisition",
                        "KPIs": [
                            {
                                "KPI": "1",
                                "usecases": [
                                    {
                                        "name": "Conversion Rate",
                                        "definition": "The percentage of leads that become customers.",
                                        "formula": "(Number of Customers / Number of Leads) * 100",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "Branch Operations",
                "topics": [
                    {
                        "topic": "Payments & Settlements",
                        "KPIs": [
                            {
                                "KPI": "1",
                                "usecases": [
                                    {
                                        "name": "Transaction Accuracy Rate",
                                        "definition": "Percentage of transactions processed without errors.",
                                        "formula": "(Number of Accurate Transactions / Total Number of Transactions) * 100",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "Operations",
                "topics": [
                    {
                        "topic": "Payments & Settlements",
                        "KPIs": [
                            {
                                "KPI": "1",
                                "usecases": [
                                    {
                                        "name": "Transaction Accuracy Rate",
                                        "definition": "Percentage of transactions processed without errors.",
                                        "formula": "(Number of Accurate Transactions / Total Number of Transactions) * 100",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        "name": "Back Office",
        "categories": [
            {
                "name": "Sales",
                "topics": [
                    {
                        "topic": "Customer Acquisition",
                        "KPIs": [
                            {
                                "KPI": "1",
                                "usecases": [
                                    {
                                        "name": "Conversion Rate",
                                        "definition": "The percentage of leads that become customers.",
                                        "formula": "(Number of Customers / Number of Leads) * 100",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "Sales",
                "topics": [
                    {
                        "topic": "Customer Acquisition",
                        "KPIs": [
                            {
                                "KPI": "1",
                                "usecases": [
                                    {
                                        "name": "Conversion Rate",
                                        "definition": "The percentage of leads that become customers.",
                                        "formula": "(Number of Customers / Number of Leads) * 100",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "Sales",
                "topics": [
                    {
                        "topic": "Customer Acquisition",
                        "KPIs": [
                            {
                                "KPI": "1",
                                "usecases": [
                                    {
                                        "name": "Conversion Rate",
                                        "definition": "The percentage of leads that become customers.",
                                        "formula": "(Number of Customers / Number of Leads) * 100",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
]

# /topics endpoint
@app.get("/topics")
def get_topics() -> List[Dict]:
    return topics_data

# /automobiles endpoint
@app.get("/data")
def get_automobiles() -> List[Dict]:
    return automobiles_data

@app.get("/nested")
def get_nested() -> Dict:
    file_path = Path(__file__).parent / 'kpi_output.json'
    with file_path.open() as file:
        data = json.load(file)
    return data

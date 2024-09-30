import pandas as pd
import json

# Function to generate the JSON format nested by domain, industry, classification, department, and subdepartment
def generate_kpi_json(data):
    result = []
    
    # Grouping by Domain, Industry, Classification, Department, and SubDepartment
    grouped = data.groupby(['DOMAIN', 'INDUSTRY', 'CLASSIFICATION', 'DEPARTMENT', 'SUBDEPARTMENT'])
    
    # Create a dictionary to store the domain-level data
    domain_dict = {}
    
    # Iterate through each Domain, Industry, Classification, Department, and SubDepartment
    for (domain, industry, classification, department, subdepartment), group in grouped:
        kpicollection = []
        
        # Iterate through each KPI for the current grouping
        for _, row in group.iterrows():
            kpi_item = {
                "kpi": row['KPIS'],
                "explanation": row['EXPLANATION'],
                "formula": row['FORMULA']
            }
            kpicollection.append(kpi_item)
        
        # Nest subdepartments under departments
        subdepartment_data = {
            "subdepartment": subdepartment,
            "kpicollection": kpicollection
        }
        
        # If domain doesn't exist, add it
        if domain not in domain_dict:
            domain_dict[domain] = {}
        
        # If industry doesn't exist within domain, add it
        if industry not in domain_dict[domain]:
            domain_dict[domain][industry] = {}
        
        # If classification doesn't exist within industry, add it
        if classification not in domain_dict[domain][industry]:
            domain_dict[domain][industry][classification] = {}
        
        # If department doesn't exist within classification, add it
        if department not in domain_dict[domain][industry][classification]:
            domain_dict[domain][industry][classification][department] = []
        
        # Append subdepartment data under the respective department
        domain_dict[domain][industry][classification][department].append(subdepartment_data)
    
    # Now structure the domain, industry, classification, department, and subdepartment in the desired format
    for domain, industries in domain_dict.items():
        domain_data = {
            "domain": domain,
            "industries": []
        }
        
        for industry, classifications in industries.items():
            industry_data = {
                "industry": industry,
                "classifications": []
            }
            
            for classification, departments in classifications.items():
                classification_data = {
                    "classification": classification,
                    "departments": []
                }
                
                for department, subdepartments in departments.items():
                    department_data = {
                        "department": department,
                        "subdepartments": subdepartments
                    }
                    classification_data["departments"].append(department_data)
                
                industry_data["classifications"].append(classification_data)
            
            domain_data["industries"].append(industry_data)
        
        result.append(domain_data)
    
    return result

# Main function to load Excel file and write JSON output
def excel_to_json(excel_file, output_file):
    # Load the Excel file into a pandas DataFrame
    df = pd.read_excel(excel_file)
    
    # Strip any whitespace from column headers
    df.columns = df.columns.str.strip()

    # Generate the JSON structure
    kpi_data = generate_kpi_json(df)
    
    # Write the result to a JSON file
    with open(output_file, 'w') as json_file:
        json.dump(kpi_data, json_file, indent=4)

# Example usage
if __name__ == "__main__":
    input_excel = "D:\\reactproject\\leaf\\backend\\KPI.xlsx"  # Replace with your actual Excel file path
    output_json = 'kpi_output.json'
    print("Processing...")

    excel_to_json(input_excel, output_json)
    print("Completed")

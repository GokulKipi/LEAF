import pandas as pd
import json

def generate_kpi_json(data_kpis, data_usecases):
    result = []

    # Grouping by Domain, Industry, Classification, Department, and SubDepartment for KPIs
    grouped_kpis = data_kpis.groupby(['DOMAIN', 'INDUSTRY', 'CLASSIFICATION', 'DEPARTMENT', 'SUBDEPARTMENT'])

    usecase_dict = {}

    # Populate the use case dictionary
    for _, row in data_usecases.iterrows():
        key = (row['DOMAIN'], row['INDUSTRY'], row['SECTOR'], row['DEPARTMENT'], row['SUBDEPARTMENT'])
        usecase_entry = {
            "usecase": row['USECASE'],
            "definitions": row['DEFINITIONS'],
            "description": row['DESCRIPTION'],
            "business_impact": row['BUSINESS_IMPACT']
        }
        if key in usecase_dict:
            usecase_dict[key].append(usecase_entry)
        else:
            usecase_dict[key] = [usecase_entry]

    # Iterate through each Domain, Industry, Classification, Department, and SubDepartment for KPIs
    for (domain, industry, classification, department, subdepartment), group in grouped_kpis:
        kpicollection = []

        # Iterate through each KPI for the current grouping
        for _, row in group.iterrows():
            kpi_item = {
                "kpi": row['KPIS'],
                "explanation": row['EXPLANATION'],
                "formula": row['FORMULA']
            }
            kpicollection.append(kpi_item)

        # Create subdepartment data
        subdepartment_data = {
            "subdepartment": subdepartment,
            "kpicollection": kpicollection
        }

        # Check if there are corresponding use cases for this subdepartment
        key = (domain, industry, row['SECTOR'], department, subdepartment)
        if key in usecase_dict:
            subdepartment_data["usecases"] = usecase_dict[key]  # Store list of use cases
        else:
            subdepartment_data["usecases"] = []  # Set as an empty list if no use cases are found

        # Structure the domain dictionary
        domain_entry = next((d for d in result if d["domain"] == domain), None)
        if not domain_entry:
            domain_entry = {
                "domain": domain,
                "industries": []
            }
            result.append(domain_entry)

        # Check if the industry exists
        industry_entry = next((i for i in domain_entry["industries"] if i["industry"] == industry), None)
        if not industry_entry:
            industry_entry = {
                "industry": industry,
                "classifications": []
            }
            domain_entry["industries"].append(industry_entry)

        # Check if the classification exists
        classification_entry = next((c for c in industry_entry["classifications"] if c["classification"] == classification), None)
        if not classification_entry:
            classification_entry = {
                "classification": classification,
                "departments": []
            }
            industry_entry["classifications"].append(classification_entry)

        # Check if the department exists
        department_entry = next((d for d in classification_entry["departments"] if d["department"] == department), None)
        if not department_entry:
            department_entry = {
                "department": department,
                "subdepartments": []
            }
            classification_entry["departments"].append(department_entry)

        # Append subdepartment data
        department_entry["subdepartments"].append(subdepartment_data)

    return result

# Main function to load Excel file and write JSON output
def excel_to_json(excel_file, output_file):
    try:
        # Load the Excel file
        xls = pd.ExcelFile(excel_file)
        result = []

        # Iterate over each sheet in the Excel file
        for sheet_name in xls.sheet_names:
            if "KPI" in sheet_name:
                # Load the KPI sheet
                df_kpis = pd.read_excel(xls, sheet_name=sheet_name)
                df_kpis.columns = df_kpis.columns.str.strip()

                # Find the corresponding USECASES sheet
                usecase_sheet_name = sheet_name.replace("KPI", "USECASES")
                if usecase_sheet_name in xls.sheet_names:
                    df_usecases = pd.read_excel(xls, sheet_name=usecase_sheet_name)
                    df_usecases.columns = df_usecases.columns.str.strip()

                    # Generate the JSON for this pair of sheets and add to the result
                    kpi_data = generate_kpi_json(df_kpis, df_usecases)
                    result.extend(kpi_data)

        with open(output_file, 'w') as json_file:
            json.dump(result, json_file, indent=4)

        print(f"JSON output successfully created and written to {output_file}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    input_excel = "D:\\reactproject\\leaf\\backend\\LEAF.xlsx"  # Replace with your actual Excel file path
    output_json = 'kpi_output.json'
    print("Processing...")
    excel_to_json(input_excel, output_json)
    print("Completed")

import pandas as pd

def collect_all_occurrences_combined(file_path, search_string):
    xls = pd.ExcelFile(file_path)
    
    combined_results = {}   # <-- ONE dictionary for all sheets

    for sheet_name in xls.sheet_names:
        df = pd.read_excel(file_path, sheet_name=sheet_name, header=None)

        for row in range(df.shape[0]):
            for col in range(df.shape[1]):

                cell_value = df.iat[row, col]

                # Ignore empty cells
                if pd.isna(cell_value):
                    continue

                # Check for match
                if str(cell_value).strip() == search_string:

                    # Column header / first cell in this column
                    column_key = df.iat[0, col]
                    if pd.isna(column_key):
                        column_key = f"col_{col}"   # fallback header

                    # Extract the 5 rows below
                    start_row = row + 1
                    five_rows = df.iloc[start_row:start_row + 5, col]

                    # Count non-empty rows
                    non_empty_count = five_rows.apply(
                        lambda x: not pd.isna(x) and str(x).strip() != ""
                    ).sum()

                    # If the header hasn't appeared yet, create a list
                    if column_key not in combined_results:
                        combined_results[column_key] = []

                    # Add an occurrence item
                    combined_results[column_key].append({
                        "sheet": sheet_name,         # which sheet it came from
                        "found_at": (row, col),
                        "five_rows": five_rows.tolist(),
                        "non_empty_count": int(non_empty_count)
                    })

    return combined_results



# --------------------
# Example Use
# --------------------
file_path = "C:\\Users\\roser\\Documents\\coding-projects\\overcooked-website\\React-Version\\overcooked-lvl-selector-react\\Overcooked 2 Full Task Analysis.xlsx"
search_string = "Obstacle Type"

output = collect_all_occurrences_combined(file_path, search_string)

print(output)

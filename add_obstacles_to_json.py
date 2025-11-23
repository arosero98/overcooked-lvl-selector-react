from count_rows_under_string import collect_all_occurrences_combined
import json


def normalize_key(key):
    """
    Cleans and converts keys like:
      'Level 2.2 '  -> 'Level_2_2'
      ' Level 3.5'  -> 'Level_3_5'
    """
    key = key.strip()       # Remove leading/trailing spaces
    key = key.replace(" ", "_")
    key = key.replace(".", "_")
    return key


def add_obstacles_to_json(json_path, combined_results, output_path):
    """
    json_path: path to original JSON file
    combined_results: dict from collect_all_occurrences_combined()
    output_path: new file to write updated JSON
    """

    # Load JSON
    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Normalize dictionary keys first
    normalized_results = {
        normalize_key(k): v
        for k, v in combined_results.items()
    }

    # Process each JSON entry
    for level_key, level_data in data.items():

        if level_key in normalized_results:
            total_obstacles = sum(
                occurrence["non_empty_count"]
                for occurrence in normalized_results[level_key]
            )
        else:
            total_obstacles = 0

        level_data["num_obstacles"] = total_obstacles

    # Write updated JSON to file
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

    return data


file_path = "C:\\Users\\roser\\Documents\\coding-projects\\overcooked-website\\React-Version\\overcooked-lvl-selector-react\\Overcooked 2 Full Task Analysis.xlsx"
search_string = "Obstacle Type"

combined_results  = collect_all_occurrences_combined(file_path, search_string)
# print(combined_results)
updated_json = add_obstacles_to_json(
    json_path="public/all_levels.json",
    combined_results=combined_results,
     output_path="levels_with_obstacles.json"
)

# print(json.dumps(updated_json, indent=2))
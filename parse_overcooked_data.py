#!/usr/bin/env python3
"""
Script to parse Overcooked 2 Full Task Analysis.xlsx and generate JSON data.
"""

import openpyxl
import json
import re
from pathlib import Path
from datetime import time


# Mapping of Excel field names to JSON keys
FIELD_MAPPING = {
    "Level Time (mm:ss)": "time_to_complete",
    "Does Clock start at \"Go\" ?": "start_at_go",
    "Is Environment Fixed?": "fixed_environment",
    "Number of Recipes": "composite_num",  # We'll handle variations separately
    "Dish Washer?": "dish_washer",
    "Score for 1 Star (2 Players)": "one_star_score",
    "Number of Dishes": "challenge_score",
}


def is_level_header(value):
    """Check if a value is a level header like 'Level 1.1', 'Level 2.3', etc."""
    if value is None:
        return False
    value_str = str(value).strip()
    # Match pattern like "Level 1.1", "Level 2.3", etc.
    match = re.match(r'^Level (\d+\.\d+)$', value_str, re.IGNORECASE)
    return match.group(1) if match else None


def format_level_key(level_num):
    """Convert level number like '1.1' to 'Level_1_1'"""
    return f"Level_{level_num.replace('.', '_')}"


def convert_time_to_mmss(value):
    """Convert Excel time format to mm:ss"""
    if value is None:
        return "manual-input-needed"

    # If it's already a datetime.time object from Excel
    if isinstance(value, time):
        # Excel stores time as HH:MM:SS where HH=minutes, MM=seconds for game time
        minutes = value.hour
        seconds = value.minute
        return f"{minutes}:{seconds:02d}"

    # If it's a string
    value_str = str(value).strip()

    # Try to parse HH:MM:SS format (Excel format where HH=minutes, MM=seconds)
    time_match = re.match(r'^(\d+):(\d+):(\d+)$', value_str)
    if time_match:
        hours, mins, secs = map(int, time_match.groups())
        # Hours field represents minutes, minutes field represents seconds
        minutes = hours
        seconds = mins
        return f"{minutes}:{seconds:02d}"

    # Try mm:ss format (already correct)
    if re.match(r'^\d+:\d{2}$', value_str):
        return value_str

    return "manual-input-needed"


def parse_number_of_recipes(value):
    """Parse 'Number of Recipes' which might be '1 (2 variations)' or just '1.0'"""
    if value is None or str(value).strip() == "":
        return None, None

    value_str = str(value).strip()

    # Check for pattern like "1 (2 variations)"
    match = re.match(r'^(\d+)\s*\((\d+)\s*variations?\)$', value_str, re.IGNORECASE)
    if match:
        composite = match.group(1)
        variations = match.group(2)
        return composite, variations

    # Otherwise just a number
    try:
        num = float(value_str)
        if num.is_integer():
            return str(int(num)), None
        return str(num), None
    except (ValueError, AttributeError):
        return None, None


def validate_and_clean_value(field_name, value):
    """Validate and clean values based on field type"""
    if value is None or str(value).strip() == "":
        return "manual-input-needed"

    value_str = str(value).strip()

    # Time format validation
    if field_name == "time_to_complete":
        return convert_time_to_mmss(value)

    # Yes/No fields
    if field_name in ["start_at_go", "fixed_environment", "dish_washer"]:
        lower_val = value_str.lower()
        if lower_val in ["yes", "no", "y", "n"]:
            return "yes" if lower_val in ["yes", "y"] else "no"
        return "manual-input-needed"

    # Numeric fields
    if field_name in ["composite_num", "variation_num", "one_star_score", "challenge_score"]:
        # Skip "NA" values
        if value_str.upper() == "NA":
            return "manual-input-needed"

        try:
            num_val = float(value_str)
            if num_val.is_integer():
                return str(int(num_val))
            return str(num_val)
        except (ValueError, AttributeError):
            return "manual-input-needed"

    return value_str


def parse_sheet(sheet, sheet_name):
    """Parse a single sheet and extract level data"""
    levels_data = {}

    # Find all level headers in row 1
    print(f"\n{'='*60}")
    print(f"Processing {sheet_name}...")
    print('='*60)
    print("Scanning for level headers in row 1...")
    level_columns = {}

    for cell in sheet[1]:
        level_num = is_level_header(cell.value)
        if level_num:
            level_key = format_level_key(level_num)
            level_columns[level_key] = {
                'header_col': cell.column,
                'field_col': cell.column + 1,
                'value_col': cell.column + 2
            }
            print(f"Found {cell.value} at column {cell.column} (field col: {cell.column + 1}, value col: {cell.column + 2})")

    print(f"\nFound {len(level_columns)} levels")

    # For each level, scan through rows to find field values
    for level_key, cols in level_columns.items():
        print(f"\nProcessing {level_key}...")

        # Initialize level data
        levels_data[level_key] = {
            "time_to_complete": "manual-input-needed",
            "start_at_go": "manual-input-needed",
            "fixed_environment": "manual-input-needed",
            "composite_num": "manual-input-needed",
            "variation_num": "manual-input-needed",
            "dish_washer": "manual-input-needed",
            "one_star_score": "manual-input-needed",
            "challenge_score": "manual-input-needed",
            "video_link": ""
        }

        field_col = cols['field_col']
        value_col = cols['value_col']

        # Scan through all rows in the field column
        for row in range(1, sheet.max_row + 1):
            field_cell = sheet.cell(row=row, column=field_col)
            field_value = field_cell.value

            if field_value:
                field_str = str(field_value).strip()

                # Check if this is one of our target fields
                if field_str in FIELD_MAPPING:
                    json_key = FIELD_MAPPING[field_str]
                    value_cell = sheet.cell(row=row, column=value_col)
                    value = value_cell.value

                    # Special handling for "Number of Recipes"
                    if field_str == "Number of Recipes":
                        composite, variations = parse_number_of_recipes(value)
                        if composite:
                            levels_data[level_key]["composite_num"] = composite
                            print(f"  composite_num: {composite}")
                        if variations:
                            levels_data[level_key]["variation_num"] = variations
                            print(f"  variation_num: {variations}")
                        if not composite and not variations:
                            levels_data[level_key]["composite_num"] = "manual-input-needed"
                    else:
                        cleaned_value = validate_and_clean_value(json_key, value)
                        levels_data[level_key][json_key] = cleaned_value
                        print(f"  {json_key}: {cleaned_value}")

    return levels_data


def parse_excel_file(filepath):
    """Parse the Excel file and extract level data from all World sheets"""
    wb = openpyxl.load_workbook(filepath)
    all_levels_data = {}

    # Parse World 1 through World 6
    for world_num in range(1, 7):
        sheet_name = f"World {world_num}"

        # Check if sheet exists
        if sheet_name not in wb.sheetnames:
            print(f"\nWarning: Sheet '{sheet_name}' not found, skipping...")
            continue

        sheet = wb[sheet_name]
        levels_data = parse_sheet(sheet, sheet_name)

        # Merge into all_levels_data
        all_levels_data.update(levels_data)

    return all_levels_data


def main():
    """Main function"""
    excel_file = Path("Overcooked 2 Full Task Analysis.xlsx")

    if not excel_file.exists():
        print(f"Error: File '{excel_file}' not found!")
        return

    print(f"Parsing {excel_file}...\n")

    try:
        levels_data = parse_excel_file(excel_file)

        # Write to JSON file
        output_file = Path("overcooked_levels_data.json")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(levels_data, f, indent=2, ensure_ascii=False)

        print(f"\n✓ Successfully parsed {len(levels_data)} levels")
        print(f"✓ Data written to {output_file}")

        # Print summary
        print("\nSummary:")
        for level_key in sorted(levels_data.keys(), key=lambda x: [int(n) for n in x.replace('Level_', '').split('_')]):
            manual_needed = sum(1 for v in levels_data[level_key].values()
                              if v == "manual-input-needed")
            if manual_needed > 0:
                print(f"  {level_key}: {manual_needed} fields need manual input")
            else:
                print(f"  {level_key}: ✓ All fields parsed")

    except Exception as e:
        print(f"Error parsing file: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    main()

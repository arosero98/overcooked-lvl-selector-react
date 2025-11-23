import json

def calculate_challenge_score_for_levels(json_file_path, output_file_path=None):
    """
    Reads a JSON file with levels keyed by level name, calculates challenge score
    for each level, and updates each level with 'challenge_score'.
    """
    # Load JSON
    with open(json_file_path, 'r') as f:
        data = json.load(f)
    
    for level_key, level in data.items():
        # Helper to convert yes/no to 1/0
        yes_no_to_int = lambda x: 1 if str(x).lower() == 'yes' else 0
        
        # Helper to convert string numbers to float, empty string -> 0
        str_to_float = lambda x: float(x) if x not in ("", None) else 0
        
        # Extract values
        start_at_go = yes_no_to_int(level.get('start_at_go', 'no'))
        one_star_score = str_to_float(level.get('one_star_score', 0))
        fixed_environment = yes_no_to_int(level.get('fixed_environment', 'no'))
        composite_num = str_to_float(level.get('composite_num', 0))
        variation_num = str_to_float(level.get('variation_num', 0))
        dish_washer = yes_no_to_int(level.get('dish_washer', 'no'))
        num_obstacles = str_to_float(level.get('num_obstacles', 0))
        
        # Variations extra logic (optional: if it changes atomic challenges)
        variation_extra = 0
        if level.get('variation_changes_atomic', False):
            variation_extra = variation_num
        
        # Fixed environment extra if recipe_order_fixed is yes
        fixed_env_extra = 0
        if fixed_environment:
            if yes_no_to_int(level.get('recipe_order_fixed', 'no')):
                fixed_env_extra = 1
        
        # Calculate challenge score
        challenge_score = (
            start_at_go + 
            round(one_star_score / 100,0) + 
            dish_washer + 
            2 * composite_num + 
            variation_num + 
            variation_extra + 
            num_obstacles + 
            fixed_environment + 
            fixed_env_extra
        )
        
        # Update level
        level['challenge_score'] = challenge_score
    
    # Save updated JSON if requested
    if output_file_path:
        with open(output_file_path, 'w') as f:
            json.dump(data, f, indent=4)
    
    return data
updated_levels = calculate_challenge_score_for_levels('levels_with_obstacles.json', 'levels_with_scores.json')
print(updated_levels['Level_1_1'])
print(updated_levels['Level_1_2'])

import json

# Function to read JSON data from a file
def read_json(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

# Function to convert all strings in the JSON data to uppercase
def convert_to_uppercase(data):
    if isinstance(data, dict):
        return {key: convert_to_uppercase(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [convert_to_uppercase(item) for item in data]
    elif isinstance(data, str):
        return data.upper()
    else:
        return data

# Function to write JSON data to a file
def write_json(data, file_path):
    with open(file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=2)

# Example usage
input_file_path = 'wordle_kelime_listesi.json'  # Path to your input JSON file
output_file_path = 'wordle_kelime_listesi_upper.json'  # Path to save the modified JSON file

# Reading the original JSON data
original_data = read_json(input_file_path)

# Converting all strings to uppercase
modified_data = convert_to_uppercase(original_data)

# Saving the modified data to a new JSON file
write_json(modified_data, output_file_path)

print("Conversion to uppercase completed successfully.")

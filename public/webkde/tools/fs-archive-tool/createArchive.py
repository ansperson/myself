import os
import json
import sys

def get_meta_info(path, is_dir):
    return {
        "changeDate": 0,
        "owner": "root",
        "permission": [7, 5, 5],
        "type": "dir" if is_dir else "file"
    }

def create_archive_structure(base_path):
    archive = {}
    
    for root, dirs, files in os.walk(base_path):
        # Calculate relative path
        relative_path = os.path.relpath(root, base_path)
        
        # Handle the root directory specially
        if relative_path == ".":
            relative_path = ""
        
        # Define directory content
        dir_content = {}
        
        # Add files
        for file_name in files:
            file_path = os.path.join(root, file_name)
            with open(file_path, 'r') as file:
                content = file.read()
                
            dir_content[file_name] = {
                "meta": get_meta_info(file_path, is_dir=False),
                "content": content
            }
        
        # Add directories
        for dir_name in dirs:
            dir_path = os.path.join(root, dir_name)
            dir_content[dir_name] = {
                "meta": get_meta_info(dir_path, is_dir=True),
                "content": create_archive_structure(dir_path)
            }
        
        # Return only the contents of the current directory
        if relative_path == "":
            return dir_content

    return archive

def main(input_directory, output_file):
    # Create archive structure starting directly from the input directory
    archive_data = create_archive_structure(input_directory)
    
    with open(output_file, 'w') as f:
        json.dump(archive_data, f)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python archive.py input_directory output_archive.json")
        sys.exit(1)

    input_directory = sys.argv[1]
    output_file = sys.argv[2]

    if not os.path.isdir(input_directory):
        print(f"Error: Directory {input_directory} does not exist.")
        sys.exit(1)

    main(input_directory, output_file)


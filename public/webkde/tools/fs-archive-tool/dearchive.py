import os
import json
import sys

def create_structure(base_path, structure):
    for key, value in structure.items():
        if isinstance(value, dict):
            meta = value.get("meta", {})
            content = value.get("content", {})
            path = os.path.join(base_path, key)

            if meta.get("type") == "dir":
                if not os.path.exists(path):
                    os.makedirs(path)
                # Recursively create subdirectories and files
                create_structure(path, content)
            elif meta.get("type") == "file":
                with open(path, 'w') as file:
                    file.write(value.get("content", ""))
        else:
            print(f"Unexpected structure for key {key}")

def main(archive_file):
    # Derive the output directory name from the input file name
    base_directory = os.path.splitext(archive_file)[0]

    # Create the base directory if it doesn't exist
    if not os.path.exists(base_directory):
        os.makedirs(base_directory)

    # Load and process the JSON archive
    with open(archive_file, 'r') as f:
        archive_data = json.load(f)

    # Start creating structure from the root of the JSON archive
    create_structure(base_directory, archive_data)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python dearchive.py my_archive.json")
        sys.exit(1)

    archive_file = sys.argv[1]

    if not os.path.isfile(archive_file):
        print(f"Error: File {archive_file} does not exist.")
        sys.exit(1)

    main(archive_file)


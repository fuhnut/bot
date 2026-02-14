import os
import zipfile

def zip_directory_contents(path, output_zip, exclude_files, exclude_dirs):
    with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(path):
            # Exclude directories
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for file in files:
                if file in exclude_files:
                    continue
                
                file_path = os.path.join(root, file)
                # Calculate relative path from the root of the source directory
                arcname = os.path.relpath(file_path, path)
                zipf.write(file_path, arcname)

if __name__ == "__main__":
    source_dir = r"c:\Users\bobby\Downloads\pybotv2\website\bot-main"
    output_filename = r"c:\Users\bobby\Downloads\pybotv2\website\website_source.zip"
    
    exclusions = {".env", "pnpm-lock.yaml", "bun.lock", "package-lock.json", "yarn.lock"}
    exclude_folders = {"node_modules", ".next", ".git"}
    
    print(f"Zipping contents of {source_dir} to {output_filename}...")
    zip_directory_contents(source_dir, output_filename, exclusions, exclude_folders)
    print("Done!")

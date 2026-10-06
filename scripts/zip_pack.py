
import os, zipfile
base_dir = r"c:\Users\User\OneDrive\Documents\sentinel\canva-bunting-assets"
out_zip = r"c:\Users\User\OneDrive\Documents\sentinel\canva-bunting-assets.zip"
pub_zip = r"c:\Users\User\OneDrive\Documents\sentinel\public\branding\bunting\canva-bunting-assets.zip"

with zipfile.ZipFile(out_zip, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, base_dir)
            z.write(full_path, rel_path)

import shutil
shutil.copyfile(out_zip, pub_zip)
print(f"Zip created: {os.path.getsize(out_zip) / (1024*1024):.2f} MB")

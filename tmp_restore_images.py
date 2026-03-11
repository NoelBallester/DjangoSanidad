import os
import django
import csv

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

import api.models

def restore_images():
    count = 0
    with open('dump_mapping.csv', 'r') as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) != 4: continue
            model_name, pk, field_name, rel_path = row
            model_class = getattr(api.models, model_name)
            obj = model_class.objects.get(pk=pk)
            # As it's a FileField, we assign the relative string path
            setattr(obj, field_name, rel_path)
            obj.save()
            count += 1
    print(f"Restored {count} images to FileFields!")

if __name__ == '__main__':
    restore_images()

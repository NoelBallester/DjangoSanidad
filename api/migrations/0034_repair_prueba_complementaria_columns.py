from django.db import migrations


def ensure_prueba_complementaria_columns(apps, schema_editor):
    connection = schema_editor.connection
    introspection = connection.introspection

    table_targets = [
        ("necropsias", "prueba_complementaria"),
        ("muestrasnecropsia", "prueba_complementaria"),
    ]

    existing_tables = set(introspection.table_names(connection.cursor()))

    with connection.cursor() as cursor:
        for table_name, column_name in table_targets:
            if table_name not in existing_tables:
                continue

            description = introspection.get_table_description(cursor, table_name)
            existing_columns = {col.name for col in description}

            if column_name in existing_columns:
                continue

            schema_editor.execute(
                f"ALTER TABLE {table_name} ADD COLUMN {column_name} TEXT NULL"
            )


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0033_add_prueba_complementaria_necropsias"),
    ]

    operations = [
        migrations.RunPython(ensure_prueba_complementaria_columns, migrations.RunPython.noop),
    ]

<?php
require_once "modelo/Basedatos.php";
class MyDB extends Basedatos
{
    public function __construct()
    {
    }
}
$bd = new MyDB();
$conexion = $bd->getConexion();

$queries = [
    // Drop old Cassettes columns
    "ALTER TABLE cassettes DROP COLUMN IF EXISTS informacion_clinica",
    "ALTER TABLE cassettes DROP COLUMN IF EXISTS descripcion_microscopica",
    "ALTER TABLE cassettes DROP COLUMN IF EXISTS diagnostico_final",
    "ALTER TABLE cassettes DROP COLUMN IF EXISTS patologo_responsable",

    // Add new Cassettes columns
    "ALTER TABLE cassettes ADD COLUMN informe_descripcion VARCHAR(255) NULL",
    "ALTER TABLE cassettes ADD COLUMN informe_fecha DATE NULL",
    "ALTER TABLE cassettes ADD COLUMN informe_tincion VARCHAR(255) NULL",
    "ALTER TABLE cassettes ADD COLUMN informe_observaciones MEDIUMTEXT NULL",
    "ALTER TABLE cassettes ADD COLUMN informe_imagen LONGBLOB NULL",

    // Drop old Citologias columns
    "ALTER TABLE citologias DROP COLUMN IF EXISTS informacion_clinica",
    "ALTER TABLE citologias DROP COLUMN IF EXISTS descripcion_microscopica",
    "ALTER TABLE citologias DROP COLUMN IF EXISTS diagnostico_final",
    "ALTER TABLE citologias DROP COLUMN IF EXISTS patologo_responsable",

    // Add new Citologias columns
    "ALTER TABLE citologias ADD COLUMN informe_descripcion VARCHAR(255) NULL",
    "ALTER TABLE citologias ADD COLUMN informe_fecha DATE NULL",
    "ALTER TABLE citologias ADD COLUMN informe_tincion VARCHAR(255) NULL",
    "ALTER TABLE citologias ADD COLUMN informe_observaciones MEDIUMTEXT NULL",
    "ALTER TABLE citologias ADD COLUMN informe_imagen LONGBLOB NULL"
];

foreach ($queries as $q) {
    try {
        $conexion->exec($q);
        echo "Exito: $q\n";
    }
    catch (Exception $e) {
        echo "Error en: $q -> " . $e->getMessage() . "\n";
    }
}
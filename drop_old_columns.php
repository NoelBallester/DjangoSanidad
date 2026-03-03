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
    "ALTER TABLE cassettes DROP COLUMN informacion_clinica",
    "ALTER TABLE cassettes DROP COLUMN descripcion_microscopica",
    "ALTER TABLE cassettes DROP COLUMN diagnostico_final",
    "ALTER TABLE cassettes DROP COLUMN patologo_responsable",

    // Drop old Citologias columns
    "ALTER TABLE citologias DROP COLUMN informacion_clinica",
    "ALTER TABLE citologias DROP COLUMN descripcion_microscopica",
    "ALTER TABLE citologias DROP COLUMN diagnostico_final",
    "ALTER TABLE citologias DROP COLUMN patologo_responsable",
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
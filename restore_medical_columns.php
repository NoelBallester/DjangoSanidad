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
    "ALTER TABLE cassettes ADD COLUMN descripcion_microscopica MEDIUMTEXT NULL",
    "ALTER TABLE cassettes ADD COLUMN diagnostico_final MEDIUMTEXT NULL",
    "ALTER TABLE cassettes ADD COLUMN patologo_responsable VARCHAR(255) NULL",
    "ALTER TABLE citologias ADD COLUMN descripcion_microscopica MEDIUMTEXT NULL",
    "ALTER TABLE citologias ADD COLUMN diagnostico_final MEDIUMTEXT NULL",
    "ALTER TABLE citologias ADD COLUMN patologo_responsable VARCHAR(255) NULL",
];

foreach ($queries as $q) {
    try {
        $conexion->exec($q);
        echo "Exito: $q\n";
    }
    catch (Exception $e) {
        // Ignore duplicate column errors (1060), column already exists
        if (strpos($e->getMessage(), '1060') !== false) {
            echo "Ya existe (ignorado): $q\n";
        }
        else {
            echo "Error en: $q -> " . $e->getMessage() . "\n";
        }
    }
}
echo "Hecho.\n";
<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
   require_once("../Basedatos.php");
   require_once("MuestrasModel.php");
   $muestra = new MuestrasModel();
   error_reporting(E_ALL);
   $data = json_decode(file_get_contents("php://input"), true);
   $accion = $data["accion"];


   // Muestras de inicio
   if ($accion == "cargarMuestrasIndex") {
      $res = $muestra->cargarMuestrasIndex();
      echo json_encode($res);
      exit();
   }

   // Creamos un muestra
   if ($accion == "crearMuestra") {
      $res = $muestra->crearMuestra($data);
      echo json_encode($res);
      exit();
   }

   // Todos los bioquimica
   if ($accion == "cargarTodosMuestras") {
      $res = $muestra->cargarTodosMuestras();
      echo json_encode($res);
      exit();
   }

   // Un muestra por id
   if ($accion == "cargarMuestraId") {
      $muestraId = $data["muestraId"];
      $res = $muestra->cargarMuestraId($muestraId);

      echo json_encode($res);
      exit();
   }

   // Muestras por tipo_muestra
   if ($accion == "bioquimicaTipo") {
      $tipo_muestra = $data["tipo_muestra"];
      $res = $muestra->bioquimicaTipo($tipo_muestra);
      echo json_encode($res);
      exit();
   }

   // Muestra por número
   if ($accion == "bioquimicaNumero") {
      $num_muestra = $data["num_muestra"];
      $res = $muestra->bioquimicaNumero($num_muestra);
      echo json_encode($res);
      exit();
   }

   // Muestras por fecha
   if ($accion == "bioquimicaFecha") {
      $fecha = $data["fecha"];
      $res = $muestra->bioquimicaFecha($fecha);
      echo json_encode($res);
      exit();
   }

   // Muestras por rango de fecha
   if ($accion == "bioquimicaRangoFechas") {
      $fechainicio = $data["fechainicio"];
      $fechafin = $data["fechafin"];
      $res = $muestra->bioquimicaRangoFechas($fechainicio, $fechafin);
      echo json_encode($res);
      exit();
   }

   // Borrar cassete por id
   if ($accion == "borrarMuestra") {
      $id = $data["muestraId"];
      $res = $muestra->borrarMuestra($id);
      echo json_encode($res);
      exit();
   }

   //  modificar un muestra
   if ($accion == "modificarMuestra") {
      $res = $muestra->modificarMuestra($data);
      echo json_encode($res);
      exit();
   }

   // Actualizar Informe Médico
   if ($accion == "actualizarInformeMedico") {
      $res = $muestra->actualizarInformeMedico($data);
      echo json_encode($res);
      exit();
   }

   //  Muestras por QR
   if ($accion == "cargarMuestraQR") {
      $res = $muestra->cargarMuestraQR($data["qr"]);
      echo json_encode($res);
      exit();
   }
}
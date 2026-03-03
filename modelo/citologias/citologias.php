<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
   require_once("../Basedatos.php");
   require_once("CitologiasModel.php");
   $citologia = new CitologiasModel();
   error_reporting(E_ALL);
   $data = json_decode(file_get_contents("php://input"), true);
   $accion = $data["accion"];


   // Citologías de inicio
   if ($accion == "cargarCitologiasIndex") {
      $res = $citologia->cargarCitologiasIndex();
      echo json_encode($res);
      exit();
   }

   // Creación de citología
   if ($accion == "crearCitologia") {
      $res = $citologia->crearCitologia($data);
      echo json_encode($res);
      exit();
   }

   // Todos las citologías
   if ($accion == "cargarTodasCitologias") {
      $res = $citologia->cargarTodasCitologias();
      echo json_encode($res);
      exit();
   }

   // Una citología por id
   if ($accion == "cargarCitologiaId") {
      $citologiaId = $data["citologiaId"];
      $res = $citologia->cargarCitologiaId($citologiaId);

      echo json_encode($res);
      exit();
   }

   // Citologías por organo
   if ($accion == "citologiasOrgano") {
      $organo = $data["organo"];
      $res = $citologia->citologiasOrgano($organo);
      echo json_encode($res);
      exit();
   }

   // Citologías por número
   if ($accion == "citologiasNumero") {
      $num_citologia = $data["num_citologia"];
      $res = $citologia->citologiasNumero($num_citologia);
      echo json_encode($res);
      exit();
   }

   // Citologías por fecha
   if ($accion == "citologiasFecha") {
      $fecha = $data["fecha"];
      $res = $citologia->citologiasFecha($fecha);
      echo json_encode($res);
      exit();
   }

   // Cassette por rango de fecha
   if ($accion == "citologiasRangoFechas") {
      $fechainicio = $data["fechainicio"];
      $fechafin = $data["fechafin"];
      $res = $citologia->citologiasRangoFechas($fechainicio, $fechafin);
      echo json_encode($res);
      exit();
   }

   // Borrar citlogía por id
   if ($accion == "borrarCitologia") {
      $id = $data["citologiaId"];
      $res = $citologia->borrarCitologia($id);
      echo json_encode($res);
      exit();
   }

   //  modificar un citología
   if ($accion == "modificarCitologia") {
      $res = $citologia->modificarCitologia($data);
      echo json_encode($res);
      exit();
   }

   // Actualizar Informe Médico
   if ($accion == "actualizarInformeMedico") {
      $res = $citologia->actualizarInformeMedico($data);
      echo json_encode($res);
      exit();
   }

//    //  Cassettes por QR
//    if ($accion == "cargarCassetteQR") {
//       $res = $citologia->cargarCassetteQR($data["qr"]);
//       echo json_encode($res);
//       exit();
//    }
}
<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
   require_once("../Basedatos.php");
   require_once("CassettesModel.php");
   $cassette = new CassettesModel();
   error_reporting(E_ALL);
   $data = json_decode(file_get_contents("php://input"), true);
   $accion = $data["accion"];


   // Cassettes de inicio
   if ($accion == "cargarCassettesIndex") {
      $res = $cassette->cargarCassettesIndex();
      echo json_encode($res);
      exit();
   }

   // Creamos un cassette
   if ($accion == "crearCassette") {
      $res = $cassette->crearCassette($data);
      echo json_encode($res);
      exit();
   }

   // Todos los cassettes
   if ($accion == "cargarTodosCassettes") {
      $res = $cassette->cargarTodosCassettes();
      echo json_encode($res);
      exit();
   }

   // Un cassette por id
   if ($accion == "cargarCassetteId") {
      $cassetteId = $data["cassetteId"];
      $res = $cassette->cargarCassetteId($cassetteId);

      echo json_encode($res);
      exit();
   }

   // Cassettes por organo
   if ($accion == "cassettesOrgano") {
      $organo = $data["organo"];
      $res = $cassette->cassettesOrgano($organo);
      echo json_encode($res);
      exit();
   }

   // Cassette por número
   if ($accion == "cassettesNumero") {
      $num_cassette = $data["num_cassette"];
      $res = $cassette->cassettesNumero($num_cassette);
      echo json_encode($res);
      exit();
   }

   // Cassettes por fecha
   if ($accion == "cassettesFecha") {
      $fecha = $data["fecha"];
      $res = $cassette->cassettesFecha($fecha);
      echo json_encode($res);
      exit();
   }

   // Cassettes por rango de fecha
   if ($accion == "cassettesRangoFechas") {
      $fechainicio = $data["fechainicio"];
      $fechafin = $data["fechafin"];
      $res = $cassette->cassettesRangoFechas($fechainicio, $fechafin);
      echo json_encode($res);
      exit();
   }

   // Borrar cassete por id
   if ($accion == "borrarCassette") {
      $id = $data["cassetteId"];
      $res = $cassette->borrarCassette($id);
      echo json_encode($res);
      exit();
   }

   //  modificar un cassette
   if ($accion == "modificarCassette") {
      $res = $cassette->modificarCassette($data);
      echo json_encode($res);
      exit();
   }

   // Actualizar Informe Médico
   if ($accion == "actualizarInformeMedico") {
      $res = $cassette->actualizarInformeMedico($data);
      echo json_encode($res);
      exit();
   }

   //  Cassettes por QR
   if ($accion == "cargarCassetteQR") {
      $res = $cassette->cargarCassetteQR($data["qr"]);
      echo json_encode($res);
      exit();
   }
}
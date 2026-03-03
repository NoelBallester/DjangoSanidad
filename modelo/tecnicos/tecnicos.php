<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
   require_once('../Basedatos.php');
   require_once('TecnicosModel.php');
   $tec = new Tecnicos();
   error_reporting(E_ALL);
   $resul = [];
   $data = json_decode(file_get_contents('php://input'), true);
   $accion = $data['accion'];
   $identificador = $data['identificador'] ?? null;
   $password = $data['password'] ?? null;


   if ($accion == 'login') {
      $res = $tec->loginusuario($identificador, $password);

      if ($res == -2) {
         $resul['error'] = "Credenciales incorrectas.";
      }
      else
         if ($res == -3) {
            $resul['error'] = "El ID de usuario no existe.";
         }
         else
            if ($res == -4) {
               $resul['error'] = "ERROR AL CONSULTAR EN LA BD.";
            }
            else {
               $resul['error'] = "";
               $resul['user.id_tecnico'] = $res['id_tecnico'];
               $resul['rol'] = $res['rol'];
            }

      echo json_encode($resul);
      exit();
   }

   if ($accion == 'registro') {
      // If 'identificador' is provided and 'email' is not, use 'identificador' as 'email' for the model
      if (isset($data['identificador']) && !isset($data['email'])) {
         $data['email'] = $data['identificador'];
      }
      $res = $tec->insertar($data);
      if (is_numeric($res) && $res > 0) {
         $resul['user'] = true;
         $resul['id_tecnico'] = $res;
      }
      else if (is_string($res)) {
         $resul['error'] = $res; // Assuming $res string contains the error message
      }
      else if ($res == -1) {
         $resul['error'] = "Error en la conexión con la base de datos.";
      }
      else if ($res == -2) {
         $resul['error'] = "El ID de usuario ya está registrado.";
      }
      else if ($res == -3) {
         $resul['error'] = "La contraseña no cumple con los requisitos de seguridad (8-16 caracteres, mayúsculas, minúsculas y números).";
      }
      else if ($res == -4) {
         $resul['error'] = "Hubo un error interno al procesar el registro.";
      }
      else {
         $resul['error'] = "";
         $resul['user'] = $res;
      }

      echo json_encode($resul);
      exit();
   }


   // TODO
   if ($accion == 'solicitacontrasena') {
      $res = $tec->solicitacontrasena($identificador);
      $para = $identificador; // Use identificador as the recipient
      $asunto = "Solicita cambio contraseña";
      $mensaje = "Este es el cuerpo del correo.";

      // Cabeceras del correo
      $cabeceras = "MIME-Version: 1.0" . "\r\n";
      $cabeceras .= "Content-type: text/html; charset=utf-8";


      // Envía el correo
      // $resul = mail($para, $asunto, $mensaje, $cabeceras);
      mail('jjsanchezrodriguez@gmail.com', 'Mi título', $mensaje);

      // echo json_encode($para);
      // echo ($para);
      exit();
   }

   // TODO: Falta la modificación de los datos de una usuario

   if ($accion == 'listartecnicos') {
      $lista = $tec->listarTecnicos();
      if ($lista !== false) {
         echo json_encode(['exito' => true, 'tecnicos' => $lista]);
      }
      else {
         echo json_encode(['exito' => false, 'error' => 'Error al listar técnicos']);
      }
      exit();
   }

   if ($accion == 'modificartecnico') {
      $res = $tec->modificarTecnico($data);
      if ($res) {
         echo json_encode(['exito' => true]);
      }
      else {
         echo json_encode(['exito' => false, 'error' => 'Error al modificar técnico']);
      }
      exit();
   }

   if ($accion == 'eliminartecnico') {
      $res = $tec->eliminarTecnico($data['id_tecnico']);
      if ($res) {
         echo json_encode(['exito' => true]);
      }
      else {
         echo json_encode(['exito' => false, 'error' => 'Error al eliminar técnico']);
      }
      exit();
   }

}
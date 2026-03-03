<?php
class MuestrasModel extends Basedatos
{

    private $table;
    private $conexion;

    public function __construct()
    {
        $this->table = "bioquimicamuestras";
        $this->conexion = $this->getConexion();
    }

    // Mostramos los ultimo doce bioquimicamuestras creados, ordenados por fehca
    public function cargarMuestrasIndex()
    {
        try {
            $sql = "SELECT * FROM $this->table order by fecha desc limit 10";
            $statement = $this->conexion->prepare($sql);
            $statement->execute();
            $muestras = $statement->fetchAll(PDO::FETCH_ASSOC);
            // Retorna el array de registros

            return $muestras;
        //  return json_encode($muestras);
        }
        catch (PDOException $e) {
            return "ERROR AL CARGAR LOS 10 CASSETES MÁS RECIENTES" . $e->getMessage();
        }
    }

    // Recibe el array de los post
    public function crearMuestra($data)
    {
        if ($this->conexion == null) {
            return -1; // "ERROR BASE DE DATOS. SIN CONEXIÓN";
        }
        try {
            $qr = "--c--" . substr(uniqid() . mt_rand(), 0, 12);
            $temp_muestra = "temp_" . uniqid();

            $sql = "insert into $this->table 
            (muestra, fecha, descripcion, caracteristicas, 
            observaciones, qr_muestra, tipo_muestra, tecnicoIdTecnico, 
            informacion_clinica, descripcion_microscopica, diagnostico_final, patologo_responsable) 
            values (?,?,?,?,?,?,?,?,?,?,?,?)";
            $sentencia = $this->conexion->prepare($sql);

            // extraemos los parámetros de la variable post
            $sentencia->bindParam(1, $temp_muestra);
            $sentencia->bindParam(2, $data["fecha"]);
            $sentencia->bindParam(3, $data["descripcion"]);
            $sentencia->bindParam(4, $data["caracteristicas"]);
            $sentencia->bindParam(5, $data["observaciones"]);
            $sentencia->bindParam(6, $qr);
            $sentencia->bindParam(7, $data["tipo_muestra"]);
            $sentencia->bindParam(8, $data["tecnicoIdTecnico"]);
            $sentencia->bindParam(9, $data["clinica"]);
            $sentencia->bindParam(10, $data["microscopia"]);
            $sentencia->bindParam(11, $data["diagnostico"]);
            $sentencia->bindParam(12, $data["patologo"]);

            $sentencia->execute();
            //devuelvo el id
            $id = $this->conexion->lastInsertId();

            $sql2 = "UPDATE $this->table SET muestra = :id WHERE id_muestra = :id";
            $stmt2 = $this->conexion->prepare($sql2);
            $stmt2->execute(['id' => $id]);

            return $id;
        }
        catch (PDOException $e) {
            return "ERROR AL CREAR UN MUESTRA" . $e->getMessage();
        }
    }

    // Todos los bioquimicamuestras
    public function cargarTodosMuestras()
    {
        try {
            $sql = "SELECT * FROM $this->table order by fecha desc";
            $statement = $this->conexion->prepare($sql);
            $statement->execute();
            $muestras = $statement->fetchAll(PDO::FETCH_ASSOC);
            // Retorna el array de registros

            return $muestras;
        //  return json_encode($muestras);
        }
        catch (PDOException $e) {
            return "ERROR AL CARGAR TODO LOS MUESTRAS" . $e->getMessage();
        }
    }

    // Muestra por id
    public function cargarMuestraId($id)
    {
        try {
            $sql = "SELECT * FROM $this->table where id_muestra=:id";

            $statement = $this->conexion->prepare($sql);
            $statement->bindParam(':id', $id, PDO::PARAM_INT);
            $statement->execute();
            $tubo = $statement->fetch(PDO::FETCH_ASSOC);

            return $tubo;
        }
        catch (PDOException $e) {
            return "ERROR AL CARGAR MUESTRA POR ID" . $e->getMessage();
        }
    }

    // Muestras por tipo_muestra
    public function bioquimicamuestrasOrgano($tipo_muestra)
    {
        try {
            $sql = "SELECT * FROM $this->table where tipo_muestra=:tipo_muestra order by tipo_muestra";

            $statement = $this->conexion->prepare($sql);
            $statement->bindParam(':tipo_muestra', $tipo_muestra, PDO::PARAM_STR);
            $statement->execute();
            $muestras = $statement->fetchAll(PDO::FETCH_ASSOC);

            return $muestras;
        }
        catch (PDOException $e) {
            return "ERROR AL CARGAR MUESTRAS POR ORGANO" . $e->getMessage();
        }
    }

    // Muestras por número muestra
    public function bioquimicamuestrasNumero($num_muestra)
    {
        try {
            $sql = "SELECT * FROM $this->table where muestra=:num_muestra";

            $statement = $this->conexion->prepare($sql);
            $statement->bindParam(':num_muestra', $num_muestra, PDO::PARAM_STR);
            $statement->execute();
            $muestras = $statement->fetchAll(PDO::FETCH_ASSOC);

            return $muestras;
        }
        catch (PDOException $e) {
            return "ERROR AL CARGAR MUESTRAS POR ORGANO" . $e->getMessage();
        }
    }

    // Muestras por Fecha 
    public function bioquimicamuestrasFecha($fecha)
    {
        try {
            $sql = "SELECT * FROM $this->table where fecha=:fecha order by fecha";

            $statement = $this->conexion->prepare($sql);
            $statement->bindParam(':fecha', $fecha, PDO::PARAM_STR);
            $statement->execute();
            $muestras = $statement->fetchAll(PDO::FETCH_ASSOC);

            return $muestras;
        }
        catch (PDOException $e) {
            return "ERROR AL CARGAR MUESTRA POR FECHA" . $e->getMessage();
        }
    }

    // Muestras por Rango de Fechas 
    public function bioquimicamuestrasRangoFechas($fechainicio, $fechafin)
    {
        try {
            $sql = "SELECT * FROM $this->table 
            where fecha between :fechainicio and :fechafin
            order by fecha";

            $statement = $this->conexion->prepare($sql);
            $statement->bindParam(':fechainicio', $fechainicio, PDO::PARAM_STR);
            $statement->bindParam(':fechafin', $fechafin, PDO::PARAM_STR);
            $statement->execute();
            $muestras = $statement->fetchAll(PDO::FETCH_ASSOC);

            return $muestras;
        }
        catch (PDOException $e) {
            return "ERROR AL CARGAR MUESTRAS POR FECHAS" . $e->getMessage();
        }
    }

    // Borrar muestra por id
    public function borrarMuestra($id)
    {
        try {
            $sql = "DELETE from $this->table where id_muestra = :id";
            $statement = $this->conexion->prepare($sql);
            $statement->bindParam(':id', $id, PDO::PARAM_INT);
            $statement->execute();
            if ($statement->rowCount() == 0)
                return -1;
            else
                return "MUESTRA ELIMINADO: " . $id;
        }
        catch (PDOException $e) {
            return "ERROR AL BORRAR UN MUESTRA" . $e->getMessage();
        }
    }

    // Modificar Muestra
    public function modificarMuestra($data)
    {
        try {
            $sql = "update $this->table 
                    set muestra=?, fecha=?, descripcion=?, caracteristicas=?, observaciones=?, tipo_muestra=?, 
                    informacion_clinica=?, descripcion_microscopica=?, diagnostico_final=?, patologo_responsable=?
                    where id_muestra=?";
            $sentencia = $this->conexion->prepare($sql);

            $sentencia->bindParam(1, $data["muestra"]);
            $sentencia->bindParam(2, $data["fecha"]);
            $sentencia->bindParam(3, $data["descripcion"]);
            $sentencia->bindParam(4, $data["caracteristicas"]);
            $sentencia->bindParam(5, $data["observaciones"]);
            $sentencia->bindParam(6, $data["tipo_muestra"]);
            $sentencia->bindParam(7, $data["clinica"]);
            $sentencia->bindParam(8, $data["microscopia"]);
            $sentencia->bindParam(9, $data["diagnostico"]);
            $sentencia->bindParam(10, $data["patologo"]);
            $sentencia->bindParam(11, $data["muestraId"]);
            $sentencia->execute();
            if ($sentencia->rowCount() == 0)
                return "Registro NO actualizado, o no existe o no hay cambios: " . $data["muestraId"];
            else
                return "Registro actualizado: " . $data["muestraId"];
        }
        catch (PDOException $e) {
            return "ERROR AL ACTUALIZAR UN MUESTRA" . $e->getMessage();
        }
    }

    // Actualizar solo el informe médico
    public function actualizarInformeMedico($data)
    {
        try {
            $sql = "UPDATE $this->table 
                    SET informe_descripcion=?, informe_fecha=?, informe_tincion=?, informe_observaciones=?, informe_imagen=?
                    WHERE id_muestra=?";
            $sentencia = $this->conexion->prepare($sql);

            $sentencia->bindParam(1, $data["descripcion"]);
            $sentencia->bindParam(2, $data["fecha"]);
            $sentencia->bindParam(3, $data["tincion"]);
            $sentencia->bindParam(4, $data["observaciones"]);
            $sentencia->bindParam(5, $data["imagen"], PDO::PARAM_LOB);
            $sentencia->bindParam(6, $data["muestraId"]);

            $sentencia->execute();
            return "Informe actualizado correctamente";
        }
        catch (PDOException $e) {
            return "ERROR AL ACTUALIZAR INFORME: " . $e->getMessage();
        }
    }

    // Muestras por código QR
    public function cargarMuestraQR($qr)
    {
        try {
            $sql = "SELECT * FROM $this->table 
                where qr_muestra=:qr";

            $statement = $this->conexion->prepare($sql);
            $statement->bindParam(":qr", $qr);
            $statement->execute();
            $tubo = $statement->fetchAll(PDO::FETCH_ASSOC);

            return $tubo;
        }
        catch (PDOException $e) {
            return "ERROR AL CARGAR MUESTRAS POR QR" . $e->getMessage();
        }
    }

// public function loginusuario($email, $clave)
// {
//     if ($this->conexion == null) {
//         return -4; //"ERROR BASE DE DATOS. SIN CONEXIÓN";
//     }
//     try {
//         $sql = "SELECT * FROM $this->table  WHERE email = :email";
//         $statement = $this->conexion->prepare($sql);
//         $statement->bindParam(':email', $email, PDO::PARAM_STR);
//         $statement->execute();

//         if ($statement->rowCount() == 1) //si devuelve una fila existe
//         {
//             $row = $statement->fetch();

//             if (password_verify($clave, $row['password'])) {
//                 return $row['id_tecnico']; //"Validado. Clave correcta.";
//             } else {
//                 return -2; //"Clave incorrecta.";
//             }
//         } else
//             return -3; //"Usuario inexistente.";


//     } catch (PDOException $e) {
//         return -4; //"ERROR AL CONSULTAR.<br>" . $e->getMessage();
//     }
// } // fin consulta


// public function actualiza($post)
// {
//     try {
//         $sql = "update $this->table set dnombre=?, loc=? where dept_no = ?";
//         $sentencia = $this->conexion->prepare($sql);
//         // extraemos los parámetros de la variable $post
//         // suponemos que se llaman igual
//         $sentencia->bindParam(3, $post['dept_no']);
//         $sentencia->bindParam(1, $post['dnombre']);
//         $sentencia->bindParam(2, $post['loc']);
//         $num = $sentencia->execute();
//         if ($sentencia->rowCount() == 0)
//             return "Registro NO actualizado, o no existe o no hay cambios: " . $post['dept_no'];
//         else
//             return "Registro actualizado: " . $post['dept_no'];
//     } catch (PDOException $e) {
//         return "Error al actualizar.<br>" . $e->getMessage();
//     }
// }

// // Devuelve un array departamento
// public function getUnDepartamento($nudep)
// {
//     try {
//         $sql = "SELECT * FROM $this->table WHERE dept_no=?";
//         $sentencia = $this->conexion->prepare($sql);
//         $sentencia->bindParam(1, $nudep);
//         $sentencia->execute();
//         $row = $sentencia->fetch(PDO::FETCH_ASSOC);
//         if ($row) {
//             return $row;
//         }
//         return "SIN DATOS";
//     } catch (PDOException $e) {
//         return "ERROR AL CARGAR.<br>" . $e->getMessage();
//     }
// }

// public function getAll()
// {
//     $objetosdep = array();
//     try {
//         $sql = "select * from $this->table";
//         $statement = $this->conexion->query($sql);
//         $registros = $statement->fetchAll(PDO::FETCH_ASSOC);
//         $statement = null;
//         // Retorna el array de registros
//         return $registros;
//     } catch (PDOException $e) {
//         return "ERROR AL CARGAR.<br>" . $e->getMessage();
//     }
// }

// public function borrar($depno)
// {
//     try {
//         $sql = "delete from $this->table where dept_no= ? ";
//         $sentencia = $this->conexion->prepare($sql);
//         $sentencia->bindParam(1, $depno);
//         $num = $sentencia->execute();
//         if ($sentencia->rowCount() == 0)
//             return "Registro NO Borrado, no se localiza: " . $depno;
//         else
//             return "Registro Borrado: " . $depno;
//     } catch (PDOException $e) {
//         return "ERROR AL BORRAR.<br>" . $e->getMessage();
//     }
// }
}
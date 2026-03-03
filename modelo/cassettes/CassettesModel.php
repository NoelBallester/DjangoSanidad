<?php
class CassettesModel extends Basedatos
{

    private $table;
    private $conexion;

    public function __construct()
    {
        $this->table = "cassettes";
        $this->conexion = $this->getConexion();
    }

    // Mostramos los ultimo doce cassettes creados, ordenados por fehca
    public function cargarCassettesIndex()
    {
        try {
            $sql = "SELECT * FROM $this->table order by fecha desc limit 10";
            $statement = $this->conexion->prepare($sql);
            $statement->execute();
            $cassettes = $statement->fetchAll(PDO::FETCH_ASSOC);
            // Retorna el array de registros

            return $cassettes;
        //  return json_encode($cassettes);
        }
        catch (PDOException $e) {
            return "ERROR AL CARGAR LOS 10 CASSETES MÁS RECIENTES" . $e->getMessage();
        }
    }

    // Recibe el array de los post
    public function crearCassette($data)
    {
        if ($this->conexion == null) {
            return -1;
        }
        try {
            $qr = "--c--" . substr(uniqid() . mt_rand(), 0, 12);
            $manual_cassette = $data["cassette"];

            $sql = "insert into $this->table 
            (cassette, fecha, descripcion, caracteristicas, 
            observaciones, descripcion_microscopica, diagnostico_final, patologo_responsable,
            qr_casette, organo, tecnicoIdTecnico) 
            values (?,?,?,?,?,?,?,?,?,?,?)";
            $sentencia = $this->conexion->prepare($sql);

            $sentencia->bindParam(1, $manual_cassette);
            $sentencia->bindParam(2, $data["fecha"]);
            $sentencia->bindParam(3, $data["descripcion"]);
            $sentencia->bindParam(4, $data["caracteristicas"]);
            $sentencia->bindParam(5, $data["observaciones"]);
            $sentencia->bindParam(6, $data["microscopia"]);
            $sentencia->bindParam(7, $data["diagnostico"]);
            $sentencia->bindParam(8, $data["patologo"]);
            $sentencia->bindParam(9, $qr);
            $sentencia->bindParam(10, $data["organo"]);
            $sentencia->bindParam(11, $data["tecnicoIdTecnico"]);

            $sentencia->execute();
            $id = $this->conexion->lastInsertId();

            return $id;
        }
        catch (PDOException $e) {
            return "ERROR AL CREAR UN CASSETTE" . $e->getMessage();
        }
    }

    // Todos los cassettes
    public function cargarTodosCassettes()
    {
        try {
            $sql = "SELECT * FROM $this->table order by fecha desc";
            $statement = $this->conexion->prepare($sql);
            $statement->execute();
            $cassettes = $statement->fetchAll(PDO::FETCH_ASSOC);
            // Retorna el array de registros

            return $cassettes;
        //  return json_encode($cassettes);
        }
        catch (PDOException $e) {
            return "ERROR AL CARGAR TODO LOS CASSETTES" . $e->getMessage();
        }
    }

    // Cassette por id
    public function cargarCassetteId($id)
    {
        try {
            $sql = "SELECT * FROM $this->table where id_casette=:id";

            $statement = $this->conexion->prepare($sql);
            $statement->bindParam(':id', $id, PDO::PARAM_INT);
            $statement->execute();
            $cassette = $statement->fetch(PDO::FETCH_ASSOC);

            return $cassette;
        }
        catch (PDOException $e) {
            return "ERROR AL CARGAR CASSETTE POR ID" . $e->getMessage();
        }
    }

    // Cassettes por organo
    public function cassettesOrgano($organo)
    {
        try {
            $sql = "SELECT * FROM $this->table where organo=:organo order by organo";

            $statement = $this->conexion->prepare($sql);
            $statement->bindParam(':organo', $organo, PDO::PARAM_STR);
            $statement->execute();
            $cassettes = $statement->fetchAll(PDO::FETCH_ASSOC);

            return $cassettes;
        }
        catch (PDOException $e) {
            return "ERROR AL CARGAR CASSETTES POR ORGANO" . $e->getMessage();
        }
    }

    // Cassettes por número cassette
    public function cassettesNumero($num_cassette)
    {
        try {
            $sql = "SELECT * FROM $this->table where cassette=:num_cassette";

            $statement = $this->conexion->prepare($sql);
            $statement->bindParam(':num_cassette', $num_cassette, PDO::PARAM_STR);
            $statement->execute();
            $cassettes = $statement->fetchAll(PDO::FETCH_ASSOC);

            return $cassettes;
        }
        catch (PDOException $e) {
            return "ERROR AL CARGAR CASSETTES POR ORGANO" . $e->getMessage();
        }
    }

    // Cassettes por Fecha 
    public function cassettesFecha($fecha)
    {
        try {
            $sql = "SELECT * FROM $this->table where fecha=:fecha order by fecha";

            $statement = $this->conexion->prepare($sql);
            $statement->bindParam(':fecha', $fecha, PDO::PARAM_STR);
            $statement->execute();
            $cassettes = $statement->fetchAll(PDO::FETCH_ASSOC);

            return $cassettes;
        }
        catch (PDOException $e) {
            return "ERROR AL CARGAR CASSETTE POR FECHA" . $e->getMessage();
        }
    }

    // Cassettes por Rango de Fechas 
    public function cassettesRangoFechas($fechainicio, $fechafin)
    {
        try {
            $sql = "SELECT * FROM $this->table 
            where fecha between :fechainicio and :fechafin
            order by fecha";

            $statement = $this->conexion->prepare($sql);
            $statement->bindParam(':fechainicio', $fechainicio, PDO::PARAM_STR);
            $statement->bindParam(':fechafin', $fechafin, PDO::PARAM_STR);
            $statement->execute();
            $cassettes = $statement->fetchAll(PDO::FETCH_ASSOC);

            return $cassettes;
        }
        catch (PDOException $e) {
            return "ERROR AL CARGAR CASSETTES POR FECHAS" . $e->getMessage();
        }
    }

    // Borrar cassette por id
    public function borrarCassette($id)
    {
        try {
            $sql = "DELETE from $this->table where id_casette = :id";
            $statement = $this->conexion->prepare($sql);
            $statement->bindParam(':id', $id, PDO::PARAM_INT);
            $statement->execute();
            if ($statement->rowCount() == 0)
                return -1;
            else
                return "CASSETTE ELIMINADO: " . $id;
        }
        catch (PDOException $e) {
            return "ERROR AL BORRAR UN CASSETTE" . $e->getMessage();
        }
    }

    // Modificar Cassette
    public function modificarCassette($data)
    {
        try {
            $sql = "update $this->table 
                    set cassette=?, fecha=?, descripcion=?, caracteristicas=?, observaciones=?,
                    descripcion_microscopica=?, diagnostico_final=?, patologo_responsable=?, organo=?
                    where id_casette=?";
            $sentencia = $this->conexion->prepare($sql);

            $sentencia->bindParam(1, $data["cassette"]);
            $sentencia->bindParam(2, $data["fecha"]);
            $sentencia->bindParam(3, $data["descripcion"]);
            $sentencia->bindParam(4, $data["caracteristicas"]);
            $sentencia->bindParam(5, $data["observaciones"]);
            $sentencia->bindParam(6, $data["microscopia"]);
            $sentencia->bindParam(7, $data["diagnostico"]);
            $sentencia->bindParam(8, $data["patologo"]);
            $sentencia->bindParam(9, $data["organo"]);
            $sentencia->bindParam(10, $data["cassetteId"]);
            $sentencia->execute();
            if ($sentencia->rowCount() == 0)
                return "Registro NO actualizado, o no existe o no hay cambios: " . $data["cassetteId"];
            else
                return "Registro actualizado: " . $data["cassetteId"];
        }
        catch (PDOException $e) {
            return "ERROR AL ACTUALIZAR UN CASSETTE" . $e->getMessage();
        }
    }

    // Actualizar solo el informe médico
    public function actualizarInformeMedico($data)
    {
        try {
            $sql = "UPDATE $this->table 
                    SET informe_descripcion=?, informe_fecha=?, informe_tincion=?, informe_observaciones=?, informe_imagen=?
                    WHERE id_casette=?";
            $sentencia = $this->conexion->prepare($sql);

            $sentencia->bindParam(1, $data["descripcion"]);
            $sentencia->bindParam(2, $data["fecha"]);
            $sentencia->bindParam(3, $data["tincion"]);
            $sentencia->bindParam(4, $data["observaciones"]);
            $sentencia->bindParam(5, $data["imagen"], PDO::PARAM_LOB);
            $sentencia->bindParam(6, $data["cassetteId"]);

            $sentencia->execute();
            return "Informe actualizado correctamente";
        }
        catch (PDOException $e) {
            return "ERROR AL ACTUALIZAR INFORME: " . $e->getMessage();
        }
    }

    // Cassettes por código QR
    public function cargarCassetteQR($qr)
    {
        try {
            $sql = "SELECT * FROM $this->table 
                where qr_casette=:qr";

            $statement = $this->conexion->prepare($sql);
            $statement->bindParam(":qr", $qr);
            $statement->execute();
            $cassette = $statement->fetchAll(PDO::FETCH_ASSOC);

            return $cassette;
        }
        catch (PDOException $e) {
            return "ERROR AL CARGAR CASSETTES POR QR" . $e->getMessage();
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
<?php
class CitologiasModel extends Basedatos
{

    private $table;
    private $conexion;

    public function __construct()
    {
        $this->table = "citologias";
        $this->conexion = $this->getConexion();
    }

    // Mostramos las ultimas diez citologias creadas, ordenados por fecha
    public function cargarCitologiasIndex()
    {
        try {
            $sql = "SELECT * FROM $this->table order by fecha desc limit 10";
            $statement = $this->conexion->prepare($sql);
            $statement->execute();
            $citologias = $statement->fetchAll(PDO::FETCH_ASSOC);
            // Retorna el array de registros

            return $citologias;
        //  return json_encode($cassettes);
        }
        catch (PDOException $e) {
            return "ERROR AL CARGAR LOS 10 CITOLOGÍAS MÁS RECIENTES" . $e->getMessage();
        }
    }

    // Recibe el array de los post
    public function crearCitologia($data)
    {
        if ($this->conexion == null) {
            return -1;
        }
        try {
            $qr = "--c--" . substr(uniqid() . mt_rand(), 0, 12);
            $manual_citologia = $data["citologia"];

            $sql = "insert into $this->table 
            (citologia, fecha, tipo_citologia, descripcion, caracteristicas, 
            observaciones, descripcion_microscopica, diagnostico_final, patologo_responsable,
            qr_citologia, organo, tecnicoIdTecnico) 
            values (?,?,?,?,?,?,?,?,?,?,?,?)";
            $sentencia = $this->conexion->prepare($sql);

            $sentencia->bindParam(1, $manual_citologia);
            $sentencia->bindParam(2, $data["fecha"]);
            $sentencia->bindParam(3, $data["tipo_citologia"]);
            $sentencia->bindParam(4, $data["descripcion"]);
            $sentencia->bindParam(5, $data["caracteristicas"]);
            $sentencia->bindParam(6, $data["observaciones"]);
            $sentencia->bindParam(7, $data["microscopia"]);
            $sentencia->bindParam(8, $data["diagnostico"]);
            $sentencia->bindParam(9, $data["patologo"]);
            $sentencia->bindParam(10, $qr);
            $sentencia->bindParam(11, $data["organo"]);
            $sentencia->bindParam(12, $data["tecnicoIdTecnico"]);

            $sentencia->execute();
            $id = $this->conexion->lastInsertId();

            return $id;
        }
        catch (PDOException $e) {
            return "ERROR AL CREAR CITOLOGÍA" . $e->getMessage();
        }
    }

    // Todas las citologías
    public function cargarTodasCitologias()
    {
        try {
            $sql = "SELECT * FROM $this->table order by fecha desc";
            $statement = $this->conexion->prepare($sql);
            $statement->execute();
            $citologias = $statement->fetchAll(PDO::FETCH_ASSOC);
            // Retorna el array de registros

            return $citologias;
        //  return json_encode($cassettes);
        }
        catch (PDOException $e) {
            return "ERROR AL CARGAR TODAS LAS CITOLOGIAS" . $e->getMessage();
        }
    }

    // Citología por id
    public function cargarCitologiaId($id)
    {
        try {
            $sql = "SELECT * FROM $this->table where id_citologia=:id";

            $statement = $this->conexion->prepare($sql);
            $statement->bindParam(':id', $id, PDO::PARAM_INT);
            $statement->execute();
            $citologia = $statement->fetch(PDO::FETCH_ASSOC);

            return $citologia;
        }
        catch (PDOException $e) {
            return "ERROR AL CARGAR CITOLOGÍA POR ID" . $e->getMessage();
        }
    }

    // Citologías por organo
    public function citologiasOrgano($organo)
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
            return "ERROR AL CARGAR CITOLOGÍAS POR ORGANO" . $e->getMessage();
        }
    }

    // Citologías por numero
    public function citologiasNumero($numcitologia)
    {
        try {
            $sql = "SELECT * FROM $this->table where citologia=:numcitologia order by citologia";

            $statement = $this->conexion->prepare($sql);
            $statement->bindParam(':numcitologia', $numcitologia, PDO::PARAM_STR);
            $statement->execute();
            $cassettes = $statement->fetchAll(PDO::FETCH_ASSOC);

            return $cassettes;
        }
        catch (PDOException $e) {
            return "ERROR AL CARGAR CITOLOGÍAS POR NÚMERO" . $e->getMessage();
        }
    }

    // Citologías por Fecha 
    public function citologiasFecha($fecha)
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
            return "ERROR AL CARGAR CITOLOGÍAS POR FECHA" . $e->getMessage();
        }
    }

    // Citologías por Rango de Fechas 
    public function citologiasRangoFechas($fechainicio, $fechafin)
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
            return "ERROR AL CARGAR CITOLOGÍAS POR FECHAS" . $e->getMessage();
        }
    }

    // Borrar citología por id
    public function borrarCitologia($id)
    {
        try {
            $sql = "DELETE from $this->table where id_citologia = :id";
            $statement = $this->conexion->prepare($sql);
            $statement->bindParam(':id', $id, PDO::PARAM_INT);
            $statement->execute();
            if ($statement->rowCount() == 0)
                return -1;
            else
                return "CITOLOGÍA ELIMINADA: " . $id;
        }
        catch (PDOException $e) {
            return "ERROR AL BORRAR UNA CITOLOGÍA" . $e->getMessage();
        }
    }

    // Modificar Citología
    public function modificarCitologia($data)
    {
        try {
            $sql = "update $this->table 
                    set citologia=?, tipo_citologia=?, fecha=?, descripcion=?, caracteristicas=?,
                    observaciones=?, descripcion_microscopica=?, diagnostico_final=?, patologo_responsable=?, organo=?
                    where id_citologia=?";
            $sentencia = $this->conexion->prepare($sql);

            $sentencia->bindParam(1, $data["citologia"]);
            $sentencia->bindParam(2, $data["tipo"]);
            $sentencia->bindParam(3, $data["fecha"]);
            $sentencia->bindParam(4, $data["descripcion"]);
            $sentencia->bindParam(5, $data["caracteristicas"]);
            $sentencia->bindParam(6, $data["observaciones"]);
            $sentencia->bindParam(7, $data["microscopia"]);
            $sentencia->bindParam(8, $data["diagnostico"]);
            $sentencia->bindParam(9, $data["patologo"]);
            $sentencia->bindParam(10, $data["organo"]);
            $sentencia->bindParam(11, $data["citologiaId"]);

            $sentencia->execute();
            if ($sentencia->rowCount() == 0)
                return "Registro NO actualizado, o no existe o no hay cambios: " . $data["citologiaId"];
            else
                return "Registro actualizado: " . $data["citologiaId"];
        }
        catch (PDOException $e) {
            return "ERROR AL ACTUALIZAR UNA CITOLOGÍA" . $e->getMessage();
        }
    }


    // Actualizar solo el informe médico
    public function actualizarInformeMedico($data)
    {
        try {
            $sql = "UPDATE $this->table 
                    SET informe_descripcion=?, informe_fecha=?, informe_tincion=?, informe_observaciones=?, informe_imagen=?
                    WHERE id_citologia=?";
            $sentencia = $this->conexion->prepare($sql);

            $sentencia->bindParam(1, $data["descripcion"]);
            $sentencia->bindParam(2, $data["fecha"]);
            $sentencia->bindParam(3, $data["tincion"]);
            $sentencia->bindParam(4, $data["observaciones"]);
            $sentencia->bindParam(5, $data["imagen"], PDO::PARAM_LOB);
            $sentencia->bindParam(6, $data["citologiaId"]);

            $sentencia->execute();
            return "Informe actualizado correctamente";
        }
        catch (PDOException $e) {
            return "ERROR AL ACTUALIZAR INFORME: " . $e->getMessage();
        }
    }

// // Cassettes por código QR
// public function cargarCassetteQR($qr)
// {
//     try {
//         $sql = "SELECT * FROM $this->table 
//             where qr_casette=:qr";

//         $statement = $this->conexion->prepare($sql);
//         $statement->bindParam(":qr", $qr);
//         $statement->execute();
//         $cassette = $statement->fetchAll(PDO::FETCH_ASSOC);

//         return $cassette;
//     } catch (PDOException $e) {
//         return "ERROR AL CARGAR CASSETTES POR QR" . $e->getMessage();
//     }
// }

// // public function loginusuario($email, $clave)
// // {
// //     if ($this->conexion == null) {
// //         return -4; //"ERROR BASE DE DATOS. SIN CONEXIÓN";
// //     }
// //     try {
// //         $sql = "SELECT * FROM $this->table  WHERE email = :email";
// //         $statement = $this->conexion->prepare($sql);
// //         $statement->bindParam(':email', $email, PDO::PARAM_STR);
// //         $statement->execute();

// //         if ($statement->rowCount() == 1) //si devuelve una fila existe
// //         {
// //             $row = $statement->fetch();

// //             if (password_verify($clave, $row['password'])) {
// //                 return $row['id_tecnico']; //"Validado. Clave correcta.";
// //             } else {
// //                 return -2; //"Clave incorrecta.";
// //             }
// //         } else
// //             return -3; //"Usuario inexistente.";


// //     } catch (PDOException $e) {
// //         return -4; //"ERROR AL CONSULTAR.<br>" . $e->getMessage();
// //     }
// // } // fin consulta


// // public function actualiza($post)
// // {
// //     try {
// //         $sql = "update $this->table set dnombre=?, loc=? where dept_no = ?";
// //         $sentencia = $this->conexion->prepare($sql);
// //         // extraemos los parámetros de la variable $post
// //         // suponemos que se llaman igual
// //         $sentencia->bindParam(3, $post['dept_no']);
// //         $sentencia->bindParam(1, $post['dnombre']);
// //         $sentencia->bindParam(2, $post['loc']);
// //         $num = $sentencia->execute();
// //         if ($sentencia->rowCount() == 0)
// //             return "Registro NO actualizado, o no existe o no hay cambios: " . $post['dept_no'];
// //         else
// //             return "Registro actualizado: " . $post['dept_no'];
// //     } catch (PDOException $e) {
// //         return "Error al actualizar.<br>" . $e->getMessage();
// //     }
// // }

// // // Devuelve un array departamento
// // public function getUnDepartamento($nudep)
// // {
// //     try {
// //         $sql = "SELECT * FROM $this->table WHERE dept_no=?";
// //         $sentencia = $this->conexion->prepare($sql);
// //         $sentencia->bindParam(1, $nudep);
// //         $sentencia->execute();
// //         $row = $sentencia->fetch(PDO::FETCH_ASSOC);
// //         if ($row) {
// //             return $row;
// //         }
// //         return "SIN DATOS";
// //     } catch (PDOException $e) {
// //         return "ERROR AL CARGAR.<br>" . $e->getMessage();
// //     }
// // }

// // public function getAll()
// // {
// //     $objetosdep = array();
// //     try {
// //         $sql = "select * from $this->table";
// //         $statement = $this->conexion->query($sql);
// //         $registros = $statement->fetchAll(PDO::FETCH_ASSOC);
// //         $statement = null;
// //         // Retorna el array de registros
// //         return $registros;
// //     } catch (PDOException $e) {
// //         return "ERROR AL CARGAR.<br>" . $e->getMessage();
// //     }
// // }

// // public function borrar($depno)
// // {
// //     try {
// //         $sql = "delete from $this->table where dept_no= ? ";
// //         $sentencia = $this->conexion->prepare($sql);
// //         $sentencia->bindParam(1, $depno);
// //         $num = $sentencia->execute();
// //         if ($sentencia->rowCount() == 0)
// //             return "Registro NO Borrado, no se localiza: " . $depno;
// //         else
// //             return "Registro Borrado: " . $depno;
// //     } catch (PDOException $e) {
// //         return "ERROR AL BORRAR.<br>" . $e->getMessage();
// //     }
// // }
}
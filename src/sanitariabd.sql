-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-05-2024 a las 19:05:07
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sanitaria`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cassettes`
--

CREATE TABLE `cassettes` (
  `id_casette` int(11) NOT NULL,
  `cassette` varchar(50) NOT NULL,
  `fecha` date NOT NULL,
  `caracteristicas` mediumtext NOT NULL,
  `observaciones` mediumtext DEFAULT NULL,
  `qr_casette` varchar(255) NOT NULL,
  `organo` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `tecnicoIdTecnico` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `citologias`
--

CREATE TABLE `citologias` (
  `id_citologia` int(11) NOT NULL,
  `citologia` varchar(50) NOT NULL,
  `tipo_citologia` varchar(255) NOT NULL,
  `fecha` date NOT NULL,
  `caracteristicas` mediumtext NOT NULL,
  `observaciones` mediumtext DEFAULT NULL,
  `qr_citologia` varchar(255) NOT NULL,
  `organo` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `tecnicoIdTecnico` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes`
--

CREATE TABLE `imagenescitologia` (
  `id_imagen` int(11) NOT NULL,
  `imagen` longblob DEFAULT NULL,
  `muestraIdMuestra` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `imagenes`
--

CREATE TABLE `imagenes` (
  `id_imagen` int(11) NOT NULL,
  `imagen` longblob DEFAULT NULL,
  `muestraIdMuestra` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Estructura de tabla para la tabla `muestrascitologia`
--

CREATE TABLE `muestrascitologia` (
  `id_muestra` int(11) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `fecha` date NOT NULL,
  `observaciones` mediumtext DEFAULT NULL,
  `tincion` varchar(255) NOT NULL,
  `qr_muestra` varchar(255) NOT NULL,
  `citologiaIdCitologia` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `muestras`
--

CREATE TABLE `muestras` (
  `id_muestra` int(11) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `fecha` date NOT NULL,
  `observaciones` mediumtext DEFAULT NULL,
  `tincion` varchar(255) NOT NULL,
  `qr_muestra` varchar(255) NOT NULL,
  `cassetteIdCassette` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tecnicos`
--

CREATE TABLE `tecnicos` (
  `id_tecnico` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellidos` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `centro` varchar(255) DEFAULT NULL,
  `rol` enum('admin','patologia','laboratorio') NOT NULL DEFAULT 'patologia'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indices de la tabla `citlogias`
--
ALTER TABLE `citologias`
  ADD PRIMARY KEY (`id_citologia`),
  ADD KEY `tecnicoIdTecnico` (`tecnicoIdTecnico`);


-- Indices de la tabla `cassettes`
--
ALTER TABLE `cassettes`
  ADD PRIMARY KEY (`id_casette`),
  ADD KEY `tecnicoIdTecnico` (`tecnicoIdTecnico`);

--
-- Indices de la tabla `imagenes`
--
ALTER TABLE `imagenes`
  ADD PRIMARY KEY (`id_imagen`),
  ADD KEY `muestraIdMuestra` (`muestraIdMuestra`);

--
-- Indices de la tabla `imagenes`
--
ALTER TABLE `imagenescitologia`
  ADD PRIMARY KEY (`id_imagen`),
  ADD KEY `muestraIdMuestra` (`muestraIdMuestra`);

--
-- Indices de la tabla `muestras`
--
ALTER TABLE `muestras`
  ADD PRIMARY KEY (`id_muestra`),
  ADD KEY `cassetteIdCassette` (`cassetteIdCassette`);


--
-- Indices de la tabla `muestrascitologia`
--
ALTER TABLE `muestrascitologia`
  ADD PRIMARY KEY (`id_muestra`),
  ADD KEY `citologiaIdCitologia` (`citologiaIdCitologia`);

--
-- Indices de la tabla `tecnicos`
--
ALTER TABLE `tecnicos`
  ADD PRIMARY KEY (`id_tecnico`);

--
-- AUTO_INCREMENT de la tabla `cassettes`
--
ALTER TABLE `cassettes`
  MODIFY `id_casette` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de la tabla `imagenes`
--
ALTER TABLE `imagenes`
  MODIFY `id_imagen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de la tabla `muestras`
--
ALTER TABLE `muestras`
  MODIFY `id_muestra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de la tabla `citologias`
--
ALTER TABLE `citologias`
  MODIFY `id_citologia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de la tabla `imagenes`
--
ALTER TABLE `imagenescitologia`
  MODIFY `id_imagen` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de la tabla `muestras`
--
ALTER TABLE `muestrascitologia`
  MODIFY `id_muestra` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT de la tabla `tecnicos`
--
ALTER TABLE `tecnicos`
  MODIFY `id_tecnico` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Filtros para la tabla `cassettes`
--
ALTER TABLE `cassettes`
  ADD CONSTRAINT `cassettes_ibfk_1` FOREIGN KEY (`tecnicoIdTecnico`) REFERENCES `tecnicos` (`id_tecnico`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Filtros para la tabla `citologias`
--
ALTER TABLE `citologias`
  ADD CONSTRAINT `citologias_ibfk_1` FOREIGN KEY (`tecnicoIdTecnico`) REFERENCES `tecnicos` (`id_tecnico`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `imagenes`
--
ALTER TABLE `imagenes`
  ADD CONSTRAINT `imagenes_ibfk_1` FOREIGN KEY (`muestraIdMuestra`) REFERENCES `muestras` (`id_muestra`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `imagenescitologia`
--
ALTER TABLE `imagenescitologia`
  ADD CONSTRAINT `imagenescitologia_ibfk_1` FOREIGN KEY (`muestraIdMuestra`) REFERENCES `muestrascitologia` (`id_muestra`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `muestras`
--
ALTER TABLE `muestras`
  ADD CONSTRAINT `muestras_ibfk_1` FOREIGN KEY (`cassetteIdCassette`) REFERENCES `cassettes` (`id_casette`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `muestrascitologia`
--
ALTER TABLE `muestrascitologia`
  ADD CONSTRAINT `muestrascitologia_ibfk_1` FOREIGN KEY (`citologiaIdCitologia`) REFERENCES `citologias` (`id_citologia`) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

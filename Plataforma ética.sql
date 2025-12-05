-- 1. CREACIÓN DE LA BASE DE DATOS
-- -----------------------------------------------------
CREATE DATABASE IF NOT EXISTS plataforma_etica_ia
DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE plataforma_etica_ia;


-- -----------------------------------------------------
-- 2. TABLA: usuarios
-- Almacena la información de registro y login (basado en tu AuthPage.jsx)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  `usuario_id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL, -- Importante: Guarda la contraseña hasheada (ej. bcrypt), no en texto plano
  `rol` ENUM('estudiante', 'instructor', 'administrador') NOT NULL DEFAULT 'estudiante',
  `fecha_registro` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`usuario_id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) -- El email debe ser único
) 
ENGINE = InnoDB;


-- -----------------------------------------------------
-- 3. TABLA: cursos
-- Almacena la información de los cursos que ofreces
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS cursos (
  `curso_id` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(255) NOT NULL,
  `descripcion` TEXT NULL,
  `instructor_id` INT NOT NULL, -- El usuario que creó/imparte el curso
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `publicado` TINYINT(1) NOT NULL DEFAULT 0, -- 0 = Borrador, 1 = Publicado
  PRIMARY KEY (`curso_id`),
  INDEX `fk_cursos_usuarios_idx` (`instructor_id` ASC),
  CONSTRAINT `fk_cursos_usuarios`
    FOREIGN KEY (`instructor_id`)
    REFERENCES `usuarios` (`usuario_id`)
    ON DELETE CASCADE -- Si se borra el instructor, se borran sus cursos
    ON UPDATE CASCADE
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- 4. TABLA: lecciones
-- Almacena las lecciones individuales de cada curso
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS lecciones (
  `leccion_id` INT NOT NULL AUTO_INCREMENT,
  `curso_id` INT NOT NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `contenido` LONGTEXT NULL, -- Aquí puede ir texto, markdown, enlaces a videos, etc.
  `orden` INT NOT NULL DEFAULT 0, -- Para ordenar lecciones (1, 2, 3...)
  PRIMARY KEY (`leccion_id`),
  INDEX `fk_lecciones_cursos_idx` (`curso_id` ASC),
  CONSTRAINT `fk_lecciones_cursos`
    FOREIGN KEY (`curso_id`)
    REFERENCES `cursos` (`curso_id`)
    ON DELETE CASCADE -- Si se borra el curso, se borran sus lecciones
    ON UPDATE CASCADE
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- 5. TABLA: inscripciones (Relación Muchos-a-Muchos)
-- Conecta a los usuarios con los cursos en los que están inscritos
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS inscripciones (
  `inscripcion_id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `curso_id` INT NOT NULL,
  `fecha_inscripcion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`inscripcion_id`),
  INDEX `fk_inscripciones_usuarios_idx` (`usuario_id` ASC),
  INDEX `fk_inscripciones_cursos_idx` (`curso_id` ASC),
  UNIQUE INDEX `usuario_curso_UNIQUE` (`usuario_id` ASC, `curso_id` ASC), -- Un usuario solo puede inscribirse una vez al mismo curso
  CONSTRAINT `fk_inscripciones_usuarios`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `usuarios` (`usuario_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_inscripciones_cursos`
    FOREIGN KEY (`curso_id`)
    REFERENCES `cursos` (`curso_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- 6. TABLA: progreso_usuario (Relación Muchos-a-Muchos)
-- Rastrea qué lecciones ha completado un usuario
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS progreso_usuario (
  `progreso_id` INT NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `leccion_id` INT NOT NULL,
  `completado` TINYINT(1) NOT NULL DEFAULT 0,
  `fecha_completado` TIMESTAMP NULL,
  PRIMARY KEY (`progreso_id`),
  INDEX `fk_progreso_usuarios_idx` (`usuario_id` ASC),
  INDEX `fk_progreso_lecciones_idx` (`leccion_id` ASC),
  UNIQUE INDEX `usuario_leccion_UNIQUE` (`usuario_id` ASC, `leccion_id` ASC), -- Solo un registro de progreso por usuario/lección
  CONSTRAINT `fk_progreso_usuarios`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `usuarios` (`usuario_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_progreso_lecciones`
    FOREIGN KEY (`leccion_id`)
    REFERENCES `lecciones` (`leccion_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
ENGINE = InnoDB;

UPDATE usuarios
SET rol = 'administrador'
WHERE usuario_id = 2;


UPDATE cursos
SET publicado = 1
WHERE curso_id = 1; -- O usa: WHERE titulo = 'El nombre de tu curso';


ALTER TABLE lecciones 
ADD COLUMN tipo ENUM('video', 'texto', 'archivo') NOT NULL DEFAULT 'texto';
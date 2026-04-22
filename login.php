<?php
session_start();
include("conexion.php");

if (isset($_SESSION['usuario_id'])) {
    header("Location: inicio.html");
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: formulario.html");
    exit;
}

$usuario = $_POST['usuario'] ?? '';
$clave = $_POST['clave'] ?? '';

if ($usuario === '' || $clave === '') {
    header("Location: formulario.html?error=credenciales");
    exit;
}

$sql = "SELECT id, usuario, clave_hash FROM usuarios WHERE usuario = ?";
$consulta = $conexion->prepare($sql);

if (!$consulta) {
    header("Location: formulario.html?error=db");
    exit;
}

$consulta->bind_param("s", $usuario);
$consulta->execute();
$resultado = $consulta->get_result();
$fila = $resultado->fetch_assoc();

if ($fila && password_verify($clave, $fila['clave_hash'])) {
    session_regenerate_id(true);
    $_SESSION['usuario_id'] = $fila['id'];
    $_SESSION['usuario'] = $fila['usuario'];

    $consulta->close();
    $conexion->close();

    header("Location: inicio.html");
    exit;
}

$consulta->close();
$conexion->close();

header("Location: formulario.html?error=credenciales");
exit;

const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: 'test_db_ocp8_user',      // Reemplaza con tu usuario de PostgreSQL
    host: 'dpg-ct4i993qf0us7381qa80-a',
    database: 'test_db_ocp8', // Nombre de tu base de datos
    password: 'pv1DK352ggg6V8GOTMz4c0aUFhqJPWc4', // Reemplaza con tu contraseña de PostgreSQL
    port: 5432
});

// Rutas
app.get('/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios');
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Lista de Usuarios</title>
            </head>
            <body>
                <h1>Lista de Usuarios</h1>
                <table border="1">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Edad</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${result.rows.map(user => `
                            <tr>
                                <td>${user.id}</td>
                                <td>${user.nombre}</td>
                                <td>${user.correo}</td>
                                <td>${user.edad}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <h2>Agregar Usuario</h2>
                <form action="/usuarios" method="POST">
                    <input type="text" name="nombre" placeholder="Nombre" required>
                    <input type="email" name="correo" placeholder="Correo" required>
                    <input type="number" name="edad" placeholder="Edad" required>
                    <button type="submit">Agregar</button>
                </form>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send('Error al obtener los usuarios');
        console.error(error);
    }
});

app.post('/usuarios', async (req, res) => {
    const { nombre, correo, edad } = req.body;
    try {
        await pool.query('INSERT INTO usuarios (nombre, correo, edad) VALUES ($1, $2, $3)', [nombre, correo, edad]);
        res.redirect('/usuarios'); // Redirige a la lista de usuarios
    } catch (error) {
        res.status(500).send('Error al agregar el usuario');
        console.error(error);
    }
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor ejecutándose en http://localhost:${PORT}`));

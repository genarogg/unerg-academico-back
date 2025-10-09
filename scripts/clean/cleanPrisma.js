import fs from 'fs';
import path from 'path';
import dotenv from "dotenv";
dotenv.config();
/**
 * Elimina la carpeta de migraciones de Prisma y la base de datos SQLite
 * Solo funciona si DATABASE_URL apunta a un archivo SQLite
 */
function cleanupPrismaSQLite() {
    try {
        // Verificar si estamos usando SQLite
        const databaseUrl = process.env.DATABASE_URL;

        if (!databaseUrl) {
            console.log('❌ DATABASE_URL no está definida en las variables de entorno');
            return false;
        }

        // Verificar si la URL apunta a SQLite (comienza con "file:")
        if (!databaseUrl.startsWith('file:')) {
            console.log('❌ No estás usando SQLite. DATABASE_URL no comienza con "file:"');
            console.log(`   DATABASE_URL actual: ${databaseUrl}`);
            return false;
        }

        console.log('✅ Detectado SQLite. Procediendo con la limpieza...');

        // Rutas a eliminar
        const migrationsPath = path.join(process.cwd(), 'prisma', 'migrations');

        // Extraer la ruta del archivo SQLite de la URL
        const sqlitePath = databaseUrl.replace('file:', '');
        const fullSqlitePath = path.resolve("prisma", sqlitePath);

        let deletedItems = [];

        // Eliminar carpeta de migraciones si existe
        if (fs.existsSync(migrationsPath)) {
            fs.rmSync(migrationsPath, { recursive: true, force: true });
            deletedItems.push('📁 Carpeta de migraciones');
            console.log(`✅ Eliminada carpeta de migraciones: ${migrationsPath}`);
        } else {
            console.log(`ℹ️  Carpeta de migraciones no existe: ${migrationsPath}`);
        }

        // Eliminar archivo de base de datos SQLite si existe
        if (fs.existsSync(fullSqlitePath)) {
            fs.unlinkSync(fullSqlitePath);
            deletedItems.push('🗃️  Base de datos SQLite');
            console.log(`✅ Eliminada base de datos: ${fullSqlitePath}`);
        } else {
            console.log(`ℹ️  Archivo de base de datos no existe: ${fullSqlitePath}`);
        }

        // Eliminar archivo WAL si existe (SQLite Write-Ahead Logging)
        const walPath = fullSqlitePath + '-wal';
        if (fs.existsSync(walPath)) {
            fs.unlinkSync(walPath);
            deletedItems.push('📝 Archivo WAL');
            console.log(`✅ Eliminado archivo WAL: ${walPath}`);
        }

        // Eliminar archivo SHM si existe (SQLite Shared Memory)
        const shmPath = fullSqlitePath + '-shm';
        if (fs.existsSync(shmPath)) {
            fs.unlinkSync(shmPath);
            deletedItems.push('💾 Archivo SHM');
            console.log(`✅ Eliminado archivo SHM: ${shmPath}`);
        }

        if (deletedItems.length > 0) {
            console.log('\n🎉 Limpieza completada exitosamente!');
            console.log(`   Elementos eliminados: ${deletedItems.join(', ')}`);
        } else {
            console.log('\n📋 No había elementos para eliminar');
        }

        return true;

    } catch (error) {
        console.error('❌ Error durante la limpieza:', error.message);
        return false;
    }
}


export default cleanupPrismaSQLite


// Ejemplo de uso:
// import { cleanupPrismaSQLite } from './cleanup.js';
// cleanupPrismaSQLite();
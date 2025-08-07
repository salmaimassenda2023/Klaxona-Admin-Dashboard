#!/usr/bin/env node

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const BACKUP_DIR = './database/backup';
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

// Ensure backup directory exists
function ensureBackupDir() {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const timestampDir = path.join(BACKUP_DIR, TIMESTAMP);
    if (!fs.existsSync(timestampDir)) {
        fs.mkdirSync(timestampDir, { recursive: true });
    }

    return timestampDir;
}

// Execute shell command and return promise
function execCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stderr });
            } else {
                resolve(stdout);
            }
        });
    });
}

// Main backup function
async function backupDatabase() {
    const backupDir = ensureBackupDir();

    try {
        console.log('🚀 Starting database backup...');

        // Get schema dump
        console.log('📋 Backing up schema...');
        const schemaPath = path.join(backupDir, 'schema.sql');
        await execCommand(`supabase db dump --schema-only > "${schemaPath}"`);
        console.log('✅ Schema backup completed');

        // Get data dump
        console.log('📊 Backing up data...');
        const dataPath = path.join(backupDir, 'data.sql');
        await execCommand(`supabase db dump --data-only > "${dataPath}"`);
        console.log('✅ Data backup completed');

        // Get full dump (schema + data)
        console.log('🗃️ Creating full backup...');
        const fullPath = path.join(backupDir, 'full_backup.sql');
        await execCommand(`supabase db dump > "${fullPath}"`);
        console.log('✅ Full backup completed');

        // Create backup info file
        const infoPath = path.join(backupDir, 'backup_info.json');
        const backupInfo = {
            timestamp: new Date().toISOString(),
            backup_type: 'supabase_cli',
            files: ['schema.sql', 'data.sql', 'full_backup.sql']
        };
        fs.writeFileSync(infoPath, JSON.stringify(backupInfo, null, 2));

        console.log(`🎉 Backup completed successfully in: ${backupDir}`);

    } catch (error) {
        console.error('❌ Backup failed:', error.message);
        if (error.stderr) {
            console.error('Error details:', error.stderr);
        }
        process.exit(1);
    }
}

// Run the backup
backupDatabase();
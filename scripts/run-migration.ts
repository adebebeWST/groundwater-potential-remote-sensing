#!/usr/bin/env node
import 'reflect-metadata';
import 'module-alias/register.js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { join } from 'path';
import sql from 'mssql';

// Load environment variables
dotenv.config();

const config: sql.config = {
  server: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433'),
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'wst_services',
  options: {
    trustServerCertificate: true,
    encrypt: false,
  },
};

async function runMigration() {
  try {
    console.log('🚀 Connecting to SQL Server...');
    const pool = await sql.connect(config);
    
    console.log('✅ Connected to SQL Server successfully!');
    
    // Read and execute the migration file
    const migrationPath = join(__dirname, '..', 'migrations', '001_create_stations_table.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Running migration: 001_create_stations_table.sql');
    
    // Split by GO statements if any, and execute each batch
    const batches = migrationSQL
      .split(/\nGO\n|\ngo\n/i)
      .filter(batch => batch.trim().length > 0);
    
    for (const batch of batches) {
      if (batch.trim()) {
        await pool.request().query(batch);
      }
    }
    
    console.log('✅ Migration completed successfully!');
    
    // Verify the table was created
    const result = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_NAME = 'stations'
    `);
    
    if (result.recordset.length > 0) {
      console.log('✅ Stations table created successfully!');
    } else {
      console.log('❌ Failed to create stations table');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await sql.close();
  }
}

// Run the migration
runMigration();

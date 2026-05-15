-- Migration: Create stations table
-- Description: Creates the stations table for water measurement locations
-- Version: 001
-- Date: 2025-05-28

-- Create stations table for SQL Server
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='stations' AND xtype='U')
CREATE TABLE stations (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    code NVARCHAR(50) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
    longitude DECIMAL(11, 8) NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
    altitude DECIMAL(8, 2),
    description NVARCHAR(MAX),
    is_active BIT NOT NULL DEFAULT 1,
    tenant_id INT NOT NULL,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    -- Unique constraint for code
    CONSTRAINT UQ_stations_code UNIQUE (code)
);

-- Create indexes for performance
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_stations_tenant_id')
CREATE INDEX IX_stations_tenant_id ON stations (tenant_id);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_stations_location')
CREATE INDEX IX_stations_location ON stations (latitude, longitude);

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_stations_active')
CREATE INDEX IX_stations_active ON stations (is_active);

-- Add extended properties (SQL Server equivalent of comments)
EXEC sys.sp_addextendedproperty 
    @name=N'MS_Description', 
    @value=N'Water measurement stations for monitoring environmental data', 
    @level0type=N'SCHEMA', @level0name=N'dbo', 
    @level1type=N'TABLE', @level1name=N'stations';

EXEC sys.sp_addextendedproperty 
    @name=N'MS_Description', 
    @value=N'Primary key, auto-incrementing station identifier', 
    @level0type=N'SCHEMA', @level0name=N'dbo', 
    @level1type=N'TABLE', @level1name=N'stations', 
    @level2type=N'COLUMN', @level2name=N'id';

EXEC sys.sp_addextendedproperty 
    @name=N'MS_Description', 
    @value=N'Human-readable name of the station', 
    @level0type=N'SCHEMA', @level0name=N'dbo', 
    @level1type=N'TABLE', @level1name=N'stations', 
    @level2type=N'COLUMN', @level2name=N'name';

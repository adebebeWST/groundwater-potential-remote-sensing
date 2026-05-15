# SQL Server Setup Guide for WST Template Service

This guide explains how to set up and use Microsoft SQL Server with the WST Template Service.

## Prerequisites

1. **Microsoft SQL Server** - You can use:
   - SQL Server Express (free)
   - SQL Server Developer Edition (free)
   - SQL Server on Docker
   - Azure SQL Database

2. **SQL Server Management Studio (SSMS)** - Optional but recommended for database management

## Installation Options

### Option 1: SQL Server Express (Recommended for Development)

1. Download SQL Server Express from Microsoft's website
2. Install with default settings
3. Enable SQL Server Authentication during installation
4. Set a strong password for the `sa` account

### Option 2: SQL Server in Docker

```bash
# Pull the SQL Server Docker image
docker pull mcr.microsoft.com/mssql/server:2022-latest

# Run SQL Server in Docker
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=YourPassword123!" \
   -p 1433:1433 --name sqlserver --hostname sqlserver \
   -d mcr.microsoft.com/mssql/server:2022-latest
```

## Database Configuration

The application is already configured to use SQL Server. The configuration is in the `.env` file:

```env
# Database Configuration - SQL Server
DB_TYPE=mssql
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=YourPassword123!
DB_DATABASE=wst_services
```

### Environment Variables

- `DB_TYPE`: Set to `mssql` for SQL Server
- `DB_HOST`: SQL Server hostname (default: `localhost`)
- `DB_PORT`: SQL Server port (default: `1433`)
- `DB_USER`: SQL Server username (default: `sa`)
- `DB_PASSWORD`: SQL Server password (update this!)
- `DB_DATABASE`: Database name (default: `wst_services`)

## Database Setup

### 1. Create the Database

Connect to SQL Server and create the database:

```sql
CREATE DATABASE wst_services;
```

### 2. Run Migrations

The project includes a migration script to create the stations table:

```bash
# Run the migration
npm run migrate
```

Alternatively, you can run the SQL migration manually:

```sql
-- File: migrations/001_create_stations_table.sql
-- This creates the stations table with proper SQL Server syntax
```

### 3. Verify Setup

Once the database is set up, restart the application:

```bash
npm run build
npm start
```

Look for the connection success message:
```
🚀 Database connected successfully!
```

## Station Entity SQL Server Compatibility

The Station entity has been optimized for SQL Server:

- Uses `NVARCHAR` for text fields (Unicode support)
- Uses `BIT` for boolean fields
- Uses `DATETIME2` for timestamps
- Uses `DECIMAL` with proper precision for coordinates
- Includes proper SQL Server constraints and indexes

## Testing with SQL Server

### 1. Test Database Connection

```bash
# This will attempt to connect and run migrations
npm run migrate
```

### 2. Test Station CRUD Operations

Once connected to SQL Server, all Station operations will use the real database instead of mock data:

```bash
# Test endpoints
curl -X GET http://localhost:3001/stations
curl -X POST http://localhost:3001/stations -H "Content-Type: application/json" -d '{"name":"Test Station","code":"TEST001","latitude":40.7589,"longitude":-73.9851,"tenantId":1}'
```

## Troubleshooting

### Connection Issues

1. **"Could not connect"**: Verify SQL Server is running and accessible
2. **Authentication failed**: Check username/password in `.env`
3. **Database doesn't exist**: Create the database manually first

### Port Issues

- Default SQL Server port is 1433
- Make sure the port is not blocked by firewall
- For SQL Server Express, you might need to enable TCP/IP protocol

### SSL/TLS Issues

The configuration includes:
```typescript
options: {
  trustServerCertificate: true,
  encrypt: false,
}
```

For production, consider enabling encryption and using proper certificates.

## Production Considerations

### Security

1. **Change default passwords**: Never use default passwords in production
2. **Use environment variables**: Keep sensitive data in environment variables
3. **Enable encryption**: Set `encrypt: true` for production
4. **Use certificates**: Implement proper SSL/TLS certificates
5. **Principle of least privilege**: Create specific database users instead of using `sa`

### Performance

1. **Connection pooling**: The WST framework handles this automatically
2. **Indexes**: The migration includes performance indexes
3. **Query optimization**: Monitor and optimize queries as needed

### Monitoring

1. **Connection health**: Monitor database connection status
2. **Query performance**: Use SQL Server profiler or Azure Monitor
3. **Resource usage**: Monitor CPU, memory, and disk usage

## Development vs Production

### Development Setup
- Uses `sa` account for simplicity
- `trustServerCertificate: true`
- `encrypt: false`
- Local SQL Server instance

### Production Setup
- Dedicated database user with limited privileges
- Proper SSL/TLS certificates
- `encrypt: true`
- Managed database service (Azure SQL, AWS RDS, etc.)

## Migration Management

The project includes a simple migration system. To add new migrations:

1. Create a new SQL file in the `migrations/` directory
2. Follow the naming convention: `002_migration_name.sql`
3. Update the migration runner script to include the new migration
4. Run `npm run migrate`

## WST Framework Integration

This template integrates with the WST Framework's database package:

- **Dependency Injection**: Database connection is registered in the DI container
- **Error Handling**: Graceful fallback to mock data when database is unavailable
- **Logging**: Comprehensive logging of database operations
- **Type Safety**: Full TypeScript integration with TypeORM

## Support

For issues related to:
- **SQL Server**: Consult Microsoft SQL Server documentation
- **WST Framework**: Check WST Framework documentation
- **TypeORM**: Refer to TypeORM documentation for SQL Server

## Example Usage

```typescript
// The StationRepository automatically uses SQL Server when available
const stations = await stationRepository.findAll(tenantId);

// Falls back to mock data if database is unavailable
// No code changes needed in your services or controllers
```

The beauty of this setup is that your application code remains the same whether using the real database or mock data, making development and testing seamless.

-- Migration: Create groundwater SDSS tables
-- Description: Creates PostGIS-enabled tables for the Groundwater Spatial Decision Support System
-- Version: 002
-- Date: 2026-05-15
-- Requires: PostGIS extension enabled on PostgreSQL

-- Enable PostGIS (run once per database)
-- CREATE EXTENSION IF NOT EXISTS postgis;

-- Woreda boundaries (Ethiopian administrative level 3)
CREATE TABLE IF NOT EXISTS woredas (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  region     VARCHAR(50),
  zone       VARCHAR(50),
  geom       GEOMETRY(MultiPolygon, 4326)
);

CREATE INDEX IF NOT EXISTS idx_woredas_name ON woredas (name);
CREATE INDEX IF NOT EXISTS idx_woredas_geom ON woredas USING GIST (geom);

-- Groundwater points (boreholes and VES survey points)
CREATE TABLE IF NOT EXISTS groundwater_points (
  id                   SERIAL PRIMARY KEY,
  type                 VARCHAR(20) NOT NULL CHECK (type IN ('borehole', 'ves_point')),
  coordinates          GEOMETRY(Point, 4326) NOT NULL,
  woreda_id            INTEGER REFERENCES woredas(id) ON DELETE SET NULL,
  gwp_suitability      VARCHAR(10) NOT NULL CHECK (gwp_suitability IN ('high', 'moderate', 'low')),
  yield_lps            DECIMAL(5,2),
  depth_m              DECIMAL(6,2),
  confidence           DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 100),
  priority             INTEGER NOT NULL CHECK (priority IN (1, 2, 3)),
  uncertainty_category VARCHAR(50),
  metadata             JSONB,
  created_at           TIMESTAMP DEFAULT NOW(),
  updated_at           TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gwp_type         ON groundwater_points (type);
CREATE INDEX IF NOT EXISTS idx_gwp_suitability  ON groundwater_points (gwp_suitability);
CREATE INDEX IF NOT EXISTS idx_gwp_priority      ON groundwater_points (priority);
CREATE INDEX IF NOT EXISTS idx_gwp_woreda        ON groundwater_points (woreda_id);
CREATE INDEX IF NOT EXISTS idx_gwp_coordinates   ON groundwater_points USING GIST (coordinates);

-- Candidate areas (prioritized groundwater abstraction or recharge polygons)
CREATE TABLE IF NOT EXISTS candidate_areas (
  id             SERIAL PRIMARY KEY,
  priority       INTEGER NOT NULL CHECK (priority IN (1, 2, 3)),
  woreda_id      INTEGER REFERENCES woredas(id) ON DELETE SET NULL,
  woreda_name    VARCHAR(100),
  area_km2       DECIMAL(10,2),
  avg_yield_lps  DECIMAL(5,2),
  confidence     DECIMAL(5,2) NOT NULL DEFAULT 0 CHECK (confidence >= 0 AND confidence <= 100),
  borehole_count INTEGER NOT NULL DEFAULT 0,
  geom           GEOMETRY(MultiPolygon, 4326),
  created_at     TIMESTAMP DEFAULT NOW(),
  updated_at     TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ca_priority  ON candidate_areas (priority);
CREATE INDEX IF NOT EXISTS idx_ca_woreda    ON candidate_areas (woreda_id);
CREATE INDEX IF NOT EXISTS idx_ca_geom      ON candidate_areas USING GIST (geom);

-- Climate scenario raster cache (pre-computed or on-demand via GEE)
CREATE TABLE IF NOT EXISTS scenario_rasters (
  id          SERIAL PRIMARY KEY,
  scenario    VARCHAR(10) NOT NULL CHECK (scenario IN ('ssp126', 'ssp245', 'ssp370', 'ssp585')),
  year        INTEGER NOT NULL CHECK (year IN (2030, 2050, 2080)),
  raster_path TEXT NOT NULL,
  computed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE (scenario, year)
);

-- Trigger to auto-update updated_at on groundwater_points
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_gwp_updated_at') THEN
    CREATE TRIGGER trg_gwp_updated_at
      BEFORE UPDATE ON groundwater_points
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_ca_updated_at') THEN
    CREATE TRIGGER trg_ca_updated_at
      BEFORE UPDATE ON candidate_areas
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END;
$$;

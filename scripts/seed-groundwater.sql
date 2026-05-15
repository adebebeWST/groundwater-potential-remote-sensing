-- Seed script: Sample woreda data for Ethiopia groundwater SDSS
-- Run this after migration 002_create_groundwater_tables.sql

-- ─── Woreda boundaries (Addis Ababa sub-cities as proxy for woredas) ─────────
INSERT INTO woredas (name, region, zone) VALUES
  ('Akaki-Kaliti',  'Addis Ababa', 'Addis Ababa'),
  ('Bole',          'Addis Ababa', 'Addis Ababa'),
  ('Nifas Silk',    'Addis Ababa', 'Addis Ababa'),
  ('Yeka',          'Addis Ababa', 'Addis Ababa'),
  ('Kolfe Keranio', 'Addis Ababa', 'Addis Ababa'),
  ('Gulele',        'Addis Ababa', 'Addis Ababa'),
  ('Lideta',        'Addis Ababa', 'Addis Ababa'),
  ('Kirkos',        'Addis Ababa', 'Addis Ababa'),
  ('Arada',         'Addis Ababa', 'Addis Ababa'),
  ('Addis Ketema',  'Addis Ababa', 'Addis Ababa'),
  ('Adama',         'Oromia',      'East Shewa'),
  ('Bishoftu',      'Oromia',      'East Shewa'),
  ('Sebeta',        'Oromia',      'West Shewa'),
  ('Ambo',          'Oromia',      'West Shewa'),
  ('Jimma',         'Oromia',      'Jimma'),
  ('Hawassa',       'Sidama',      'Hawassa'),
  ('Shashemene',    'Oromia',      'West Arsi'),
  ('Bahir Dar',     'Amhara',      'South Gondar'),
  ('Gondar',        'Amhara',      'Central Gondar'),
  ('Dessie',        'Amhara',      'South Wollo'),
  ('Mekelle',       'Tigray',      'Central Tigray'),
  ('Dire Dawa',     'Dire Dawa',   'Dire Dawa')
ON CONFLICT DO NOTHING;

-- ─── Groundwater points (boreholes and VES) ───────────────────────────────────
INSERT INTO groundwater_points
  (type, coordinates, woreda_id, gwp_suitability, yield_lps, depth_m, confidence, priority, uncertainty_category)
VALUES
  ('borehole',  ST_SetSRID(ST_MakePoint(38.765, 9.012), 4326), 1, 'high',     12.5, 45.0, 88, 1, 'high_pot_low_uncert'),
  ('borehole',  ST_SetSRID(ST_MakePoint(38.820, 9.050), 4326), 1, 'high',     10.2, 52.0, 80, 1, 'high_pot_low_uncert'),
  ('borehole',  ST_SetSRID(ST_MakePoint(38.700, 8.980), 4326), 2, 'moderate',  7.8, 60.0, 65, 2, 'high_pot_med_uncert'),
  ('ves_point', ST_SetSRID(ST_MakePoint(38.750, 9.030), 4326), 1, 'high',     NULL, NULL, 75, 1, 'high_pot_low_uncert'),
  ('borehole',  ST_SetSRID(ST_MakePoint(38.850, 9.100), 4326), 3, 'low',       3.2, 80.0, 40, 3, 'high_pot_high_uncert'),
  ('borehole',  ST_SetSRID(ST_MakePoint(39.000, 9.200), 4326), 2, 'high',     14.1, 38.0, 90, 1, 'high_pot_low_uncert'),
  ('ves_point', ST_SetSRID(ST_MakePoint(38.900, 9.150), 4326), 2, 'moderate', NULL, NULL, 60, 2, 'high_pot_med_uncert'),
  ('borehole',  ST_SetSRID(ST_MakePoint(38.600, 8.900), 4326), 3, 'moderate',  6.5, 70.0, 58, 2, 'high_pot_med_uncert'),
  ('borehole',  ST_SetSRID(ST_MakePoint(38.650, 8.950), 4326), 3, 'low',       2.1, 95.0, 35, 3, 'high_pot_high_uncert'),
  ('ves_point', ST_SetSRID(ST_MakePoint(39.050, 9.250), 4326), 2, 'high',     NULL, NULL, 82, 1, 'high_pot_low_uncert')
ON CONFLICT DO NOTHING;

-- ─── Candidate areas ──────────────────────────────────────────────────────────
INSERT INTO candidate_areas
  (priority, woreda_id, woreda_name, area_km2, avg_yield_lps, confidence, borehole_count)
VALUES
  (1, 1, 'Akaki-Kaliti',  155.4, 11.8, 88, 5),
  (1, 2, 'Bole',           92.1, 13.2, 85, 3),
  (1, 3, 'Nifas Silk',     78.5, 10.5, 82, 4),
  (1, 4, 'Yeka',          110.3, 12.0, 80, 6),
  (1, 5, 'Kolfe Keranio',  88.7, 11.2, 78, 4),
  (2, 6, 'Gulele',         65.2,  8.4, 65, 3),
  (2, 7, 'Lideta',         54.8,  7.9, 62, 2),
  (2, 8, 'Kirkos',         60.1,  8.1, 60, 3),
  (3, 9, 'Arada',          42.3,  5.5, 45, 2),
  (3,10, 'Addis Ketema',   38.6,  4.8, 42, 1)
ON CONFLICT DO NOTHING;

-- ─── Scenario raster cache entries (placeholder paths) ───────────────────────
INSERT INTO scenario_rasters (scenario, year, raster_path) VALUES
  ('ssp126', 2030, '/data/rasters/ssp126_2030.tif'),
  ('ssp126', 2050, '/data/rasters/ssp126_2050.tif'),
  ('ssp126', 2080, '/data/rasters/ssp126_2080.tif'),
  ('ssp245', 2030, '/data/rasters/ssp245_2030.tif'),
  ('ssp245', 2050, '/data/rasters/ssp245_2050.tif'),
  ('ssp245', 2080, '/data/rasters/ssp245_2080.tif'),
  ('ssp370', 2030, '/data/rasters/ssp370_2030.tif'),
  ('ssp370', 2050, '/data/rasters/ssp370_2050.tif'),
  ('ssp370', 2080, '/data/rasters/ssp370_2080.tif'),
  ('ssp585', 2030, '/data/rasters/ssp585_2030.tif'),
  ('ssp585', 2050, '/data/rasters/ssp585_2050.tif'),
  ('ssp585', 2080, '/data/rasters/ssp585_2080.tif')
ON CONFLICT (scenario, year) DO NOTHING;

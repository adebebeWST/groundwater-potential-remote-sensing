# 🌊 Groundwater Spatial Decision Support System (SDSS)

**Ethiopia Ministry of Water & Energy – Groundwater Potential Mapping Portal**

A full-stack web application for identifying priority areas for groundwater abstraction and artificial recharge in Ethiopia. Combines remote sensing analysis, GIS data, and climate scenario modelling into a single interactive dashboard.

---

## 🏗️ Architecture Overview

```
CLIENT (React SPA – port 3000)
  ↕ HTTPS / proxy
BACKEND (Node.js / Express – port 3001)  ←──  WST Framework Compliant
  ↕
PostgreSQL + PostGIS (port 5432)   │   GeoServer (port 8080)
                                   │   Google Earth Engine (external)
```

### Technology Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 18 + TypeScript, Vite, TailwindCSS, Leaflet / React-Leaflet, Zustand |
| Backend   | Node.js 20+ / Express + TypeScript, WST Framework |
| Database  | PostgreSQL 15 + PostGIS (or SQL Server via WST default) |
| Tiles     | GeoServer WMTS / COG tile serving               |
| GEE Proxy | Google Earth Engine API for dynamic scenarios   |

---

## 📁 Project Structure

```
groundwater-potential-remote-sensing/
├── src/                          # Backend (Node.js / Express / WST Framework)
│   ├── domain/
│   │   ├── entities/             # GroundwaterPoint, CandidateArea, Woreda, ClimateScenario
│   │   └── interfaces/           # Repository interfaces
│   ├── infrastructure/
│   │   └── repositories/         # In-memory implementations (replace with PostGIS)
│   ├── services/
│   │   ├── MapService.ts         # Feature info, candidate areas, woreda search
│   │   └── StationService.ts     # (existing) Station CRUD
│   ├── presentation/
│   │   ├── controllers/
│   │   │   └── MapController.ts  # Map / GEE / Report endpoints
│   │   ├── routes/
│   │   │   └── map.routes.ts     # /api/map/*, /api/gee/*, /api/report/*
│   │   └── dto/
│   │       └── MapDTO.ts
│   └── container/modules.ts      # tsyringe DI registrations
├── migrations/
│   ├── 001_create_stations_table.sql
│   └── 002_create_groundwater_tables.sql  # PostGIS tables
├── scripts/
│   └── seed-groundwater.sql      # Sample Ethiopia woreda / borehole data
├── client/                       # Frontend (React SPA)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ControlPanel/     # ClimateSelector, YearSlider, LayerToggle
│   │   │   ├── MapView/          # MapView (Leaflet), MapLegend, LocationPopup
│   │   │   ├── CandidatePanel/   # Priority sections, candidate items
│   │   │   ├── SearchBar/        # Woreda autocomplete search
│   │   │   └── Shared/           # LoadingSpinner, ErrorBoundary, ActionBar
│   │   ├── services/             # api.ts, mapService, authService, reportService, geeService
│   │   ├── store/                # Zustand stores (mapStore, scenarioStore, uiStore)
│   │   ├── hooks/                # useMapClick, useLayerVisibility, useUrlState
│   │   ├── types/index.ts        # TypeScript interfaces
│   │   ├── App.tsx               # Three-panel layout
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── .env.example                  # Environment variable template
└── README.md
```

---

## 🚀 Quick Start

### 1. Clone and install backend dependencies

```bash
git clone <repository-url>
cd groundwater-potential-remote-sensing

# Install backend dependencies
npm install

# Copy environment config
cp .env.example .env
# Edit .env with your database and service credentials
```

### 2. Install frontend dependencies

```bash
cd client
npm install

# Copy frontend environment config
cp ../.env.example .env
# Set VITE_API_BASE_URL=http://localhost:3001/api in client/.env
```

### 3. Run database migrations (PostgreSQL + PostGIS)

```bash
# Connect to PostgreSQL and run:
psql -U gw_user -d groundwater_sdss -f migrations/002_create_groundwater_tables.sql
psql -U gw_user -d groundwater_sdss -f scripts/seed-groundwater.sql
```

### 4. Start the development servers

```bash
# Terminal 1 – Backend (port 3001)
npm run dev

# Terminal 2 – Frontend (port 3000)
cd client && npm run dev
```

Open **http://localhost:3000** to view the dashboard.

---

## 🗺️ API Endpoints

### Map Service (`/api/map/`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/map/layers` | List available map layers |
| GET | `/api/map/feature-info?lat=&lon=` | Groundwater data at clicked location |
| GET | `/api/map/candidate-areas?priority=&woreda=` | Filtered candidate areas |
| GET | `/api/map/search/woreda?q=` | Autocomplete woreda search |
| GET | `/api/map/boreholes?bbox=` | Borehole GeoJSON |
| GET | `/api/map/ves-points?bbox=` | VES point GeoJSON |
| GET | `/api/map/scenarios` | List all climate scenarios |

### GEE Proxy (`/api/gee/`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/gee/compute-scenario` | Compute scenario tile URL |

### Report Service (`/api/report/`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/report/generate` | Generate PDF report |
| GET | `/api/report/share/:token` | Retrieve shared map state |

### Auth (`/api/auth/`)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Authenticate user |
| POST | `/api/auth/logout` | Invalidate token |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/refresh` | Refresh JWT |

---

## 🌐 Frontend Features

| Feature | Component |
|---------|-----------|
| Climate scenario selector (SSP1-2.6 → SSP5-8.5) | `ClimateSelector` |
| Year selector (2030 / 2050 / 2080) | `YearSlider` |
| Layer toggle (GWP Map, Candidate Areas, Boreholes, VES, Uncertainty) | `LayerToggle` |
| Full-screen Leaflet map with OSM basemap | `MapView` |
| Click-to-query (GWP, yield, confidence, uncertainty) | `LocationPopup` |
| GWP suitability legend | `MapLegend` |
| Priority 1/2/3 candidate area panels | `CandidatePanel` |
| Woreda autocomplete search with map zoom | `SearchBar` |
| Generate PDF report | `ActionBar` |
| Shareable URL (preserves scenario, year, layers, viewport) | `useUrlState` |

---

## 🧪 Testing

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests
npm run test:int

# E2E tests
npm run test:e2e
```

---

## 📚 Swagger Documentation

Once the backend is running, visit **http://localhost:3001/doc** for interactive API docs.

---

## 🗄️ Database Schema (PostGIS)

Key tables created by `migrations/002_create_groundwater_tables.sql`:

- **`woredas`** – Ethiopian administrative boundaries (MultiPolygon)
- **`groundwater_points`** – Boreholes and VES survey points (Point)
- **`candidate_areas`** – Priority-ranked groundwater polygons (MultiPolygon)
- **`scenario_rasters`** – Climate scenario raster cache metadata

---

## 🌍 Climate Scenarios

| ID | Name | Description |
|----|------|-------------|
| `ssp126` | SSP1-2.6 | Low emissions (~1.5°C by 2100) |
| `ssp245` | SSP2-4.5 | Intermediate emissions (~2.7°C by 2100) |
| `ssp370` | SSP3-7.0 | High emissions (~3.6°C by 2100) |
| `ssp585` | SSP5-8.5 | Very high emissions (~4.4°C by 2100) |

---

Developed with ♥ for the Ethiopia Ministry of Water & Energy

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

- **@wst/core** - Fundamentos de Domain-Driven Design (DDD)
- **@wst/middleware** - Middlewares padronizados do Express
- **@wst/security** - Autenticação, criptografia e segurança completa
- **@wst/database** - Gerenciamento de banco de dados e repositórios
- **@wst/logger** - Sistema de logging estruturado
- **Express** - Framework web com arquitetura limpa
- **TypeScript** - Tipagem forte e segurança de tipos

---

## 🏗️ Arquitetura WST Framework Compliant

```plaintext
template-wst-services/
├── src/
│   ├── domain/                    # 🎯 Lógica de negócio central
│   │   ├── entities/             # Entidades usando @wst/core
│   │   ├── exceptions/           # Exceções de domínio usando @wst/core
│   │   └── events/               # Eventos de domínio usando @wst/core
│   ├── application/              # 🎮 Casos de uso da aplicação
│   │   ├── use-cases/           # Casos de uso estendendo @wst/core
│   │   ├── dtos/                # Objetos de transferência de dados
│   │   └── validation/          # Validação usando @wst/core
│   ├── infrastructure/           # 🔧 Preocupações externas
│   │   └── persistence/         # Repositórios usando @wst/database
│   ├── interfaces/               # 🌐 Camada de API
│   │   ├── controllers/         # Controladores estendendo @wst/middleware
│   │   └── http/                # Definições de rotas
│   ├── middleware/               # 🛡️ Middleware WST Framework
│   │   ├── Authenticated.ts     # → @wst/middleware.createJWTMiddleware
│   │   └── XApiKey.ts          # → @wst/middleware.apiKeyMiddleware
│   ├── containers/              # 📦 Configuração de DI
│   ├── config/                  # ⚙️ Configurações da aplicação
│   └── routes/                  # 🛤️ Registro de rotas usando @wst/middleware
├── package.json                 # 📋 Dependências WST Framework
├── tsconfig.json               # 🔧 Configuração TypeScript
└── README.md                   # 📖 Guia de uso do template
```

### 🎯 Benefícios da Arquitetura WST

- **🔄 Zero Duplicação**: Todas as funcionalidades usam pacotes WST
- **🏗️ Arquitetura Limpa**: Separação clara de responsabilidades
- **🔒 Segurança Padronizada**: Implementação consistente via @wst/security
- **📊 Logging Estruturado**: Sistema unificado via @wst/logger
- **⚡ Performance Otimizada**: Componentes testados e otimizados
- **🔧 Manutenibilidade**: Atualizações automáticas via packages WST
│   │       │       │   └── access-token-usecase.unit.spec.ts
│   │       │       ├── FindStationController.ts
│   │       │       └── FindStationUseCase.ts
│   ├── providers/
│   │   └── DataProvider/
│   │       ├── implementations/
│   │       │   └── DayjsDateProvider.ts
│   │       └── IDataProvider.ts
│   ├── routes/
│   │   ├── index.ts
│   │   └── paths.ts
│   ├── services/
│   │   └── api.ts
├── shared/
│   ├── Sql.ts
│   ├── app.ts
│   ├── lambda.ts
│   └── server.ts
├── .dockerignore
├── .env
├── .env.test
├── .gitignore
├── auto-imports.d.ts
├── babel.config.js
├── docker-compose.yaml
├── Dockerfile
├── Dockerfile.dev
├── ecosystem.config.js
├── example.env
├── jest.config.ts
├── jest.setup.ts
├── package.json
├── prettier.config.js
├── README.md
├── serverless.yml
├── tsconfig.jest.json
├── tsconfig.json
└── yarn.lock
```

---

## 🚀 Quick Start

### 1. Clone e Configure o Template

```bash
# Clone o template
git clone <repository-url> meu-microservico
cd meu-microservico

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp example.env .env
# Edite o .env com suas configurações
```

### 2. Desenvolva seu Primeiro Endpoint

```typescript
// src/application/use-cases/MinhaFeatureUseCase.ts
import { UseCase } from '@wst/core';

export class MinhaFeatureUseCase extends UseCase<InputDTO, OutputDTO> {
  async execute(input: InputDTO): Promise<OutputDTO> {
    // Sua lógica de negócio aqui
    return { success: true, data: input };
  }
}

// src/interfaces/controllers/MinhaFeatureController.ts
import { BaseController } from '@wst/middleware';

export class MinhaFeatureController extends BaseController {
  constructor(private useCase: MinhaFeatureUseCase) {
    super();
  }

  async handle(req: Request, res: Response): Promise<void> {
    const result = await this.useCase.execute(req.body);
    this.ok(res, result);
  }
}
```

### 3. Execute o Projeto

```bash
# Desenvolvimento
npm run dev

# Build para produção  
npm run build

# Executar em produção
npm run production
```

### 4. Acesse a Documentação

- **Swagger UI**: http://localhost:3001/docs
- **Health Check**: http://localhost:3001/health
- **API Base**: http://localhost:3001/api

---

## 🏗️ Implementação de Módulos

### Estrutura Recomendada por Módulo:
import { Authenticated } from '@middleware/Authenticated';

{
  method: 'POST',
  moduleByName: 'Auth',
  url: '/secure-hello',
  handlers: helloWorldController.handle,
  middlewares: [Authenticated],
}
```

---

## 🏗️ WST Framework Integration

Este template utiliza o WST Framework, um conjunto de pacotes padronizados para desenvolvimento de microserviços:

### Pacotes WST Utilizados:

- **@wst/core** → Fundamentos de Domain-Driven Design e arquitetura base
- **@wst/database** → Conexões de banco e padrões de repositório
- **@wst/logger** → Sistema de logging estruturado e configurável
- **@wst/middleware** → Middlewares padronizados para Express
- **@wst/security** → Serviços de segurança (criptografia, JWT, senhas, tokens)

### Benefícios da Padronização:

- **Consistência** entre projetos e equipes
- **Reutilização** de código testado e otimizado
- **Manutenibilidade** centralizada nos pacotes WST
- **Escalabilidade** com padrões estabelecidos

### Exemplo de Uso - @wst/security:

```ts
import { SecurityManager, JWTService, EncryptionService } from '@wst/security';

// Serviço de segurança completo
const securityManager = new SecurityManager();

// Criptografia
const encrypted = await securityManager.encrypt('dados sensíveis');
const decrypted = await securityManager.decrypt(encrypted);

// Senhas
const hashedPassword = await securityManager.hashPassword('senha123');
const isValid = await securityManager.verifyPassword('senha123', hashedPassword);

// JWT Tokens
const token = await securityManager.signJWT({ userId: 1, tenantId: 10 });
const payload = await securityManager.verifyJWT(token);
```

---

## 📦 Injeção de Dependência

A aplicação usa `tsyringe` para gerenciar dependências.

### Registro:

```ts
// containers/modules.ts
import { container } from 'tsyringe';
import { IAuthRepository } from '@modules/auth/repositories/Auth/IAuthRepository';
import { AuthRepository } from '@modules/auth/repositories/Auth/AuthRepository';

container.registerSingleton<IAuthRepository>('AuthRepository', AuthRepository);
```

No use case:

```ts
@injectable()
class HelloWorldUseCase {
  constructor(
    @inject('AuthRepository')
    private authRepository: IAuthRepository
  ) {}
}
```

---

## 🌐 Registro de Rotas

Rotas são agrupadas por módulos e registradas dinamicamente.

### Exemplo:

```ts
// modules/auth/route/paths.ts
import { HelloWorldController } from '../useCases/HelloWorld/HelloWorldController';
import { Authenticated } from '@middleware/Authenticated';

const helloWorldController = new HelloWorldController();

const paths = [
  {
    method: 'POST',
    moduleByName: 'Auth',
    url: '/hello-world',
    handlers: helloWorldController.handle,
    middlewares: [], // público
  },
  {
    method: 'POST',
    moduleByName: 'Auth',
    url: '/secure-hello',
    handlers: helloWorldController.handle,
    middlewares: [Authenticated], // protegido
  },
];

export default paths;
```

### Registro global:

```ts
// routes/index.ts
import { authRoutes } from '@modules/auth/route';
import { swaggerRoutes } from '@config/swagger';
import { Router } from 'express';
import { errorMiddleware } from '@middleware/AppError';

const router = Router();

const moduleRegister = [
  { name: 'Doc', url: '/doc', handlers: swaggerRoutes },
  { name: 'Auth', url: '/', handlers: authRoutes },
];

moduleRegister.forEach(module => {
  router.use(module.url, module.handlers);
});

router.use(errorMiddleware);

export { router, moduleRegister };
```

---

## 📚 Documentação Swagger

As rotas são anotadas com Swagger para gerar documentação automática.

```ts
/**
 * @swagger
 * /hello-world:
 *   post:
 *     summary: Exemplo de rota pública
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Hello World
 */
```

Acesse em: `http://localhost:<porta>/doc`

---

## ✅ Testando

- `yarn dev` → executa localmente com `ts-node` e `tsconfig-paths`
- `yarn test` → executa todos os testes (`unit`, `int`, `e2e`) e mescla os relatórios de cobertura
- `yarn test:unit` → executa **testes unitários** com cobertura (`coverage/unit`)
- `yarn test:int` → executa **testes de integração** com cobertura (`coverage/int`)
- `yarn test:e2e` → executa **testes end-to-end** com cobertura (`coverage/e2e`)
- `yarn posttest` → mescla os relatórios de cobertura em um único diretório (`/coverage`)
- `yarn build` → gera build para produção
- `yarn start:lambda` → executa o serviço no formato compatível com AWS Lambda

## 🧪 Tipos de Testes

- **Testes Unitários (`test:unit`)**
  - Foco: métodos e funções isoladas, sem dependências externas.
  - Exemplo: lógica de negócio pura, validação de dados.
  - Benefício: rápidos e confiáveis para regras simples.

- **Testes de Integração (`test:int`)**
  - Foco: interação entre serviços, repositórios e bancos (mock ou real).
  - Exemplo: serviços que utilizam repositórios e provedores.
  - Benefício: valida contratos internos entre camadas da aplicação.

- **Testes End-to-End (`test:e2e`)**
  - Foco: fluxo completo da aplicação via rotas HTTP reais.
  - Exemplo: autenticação, criação de recursos, validações completas.
  - Benefício: garante que tudo funciona como esperado em produção.

---

## ✨ Contribuição

1. Crie uma branch para sua feature: `git checkout -b feature/nome-da-feature`
2. Faça commits claros e concisos
3. Abra um PR com o template de descrição preenchido

---

Desenvolvido com ♥ por JohnnyDev

---

## ✅ Do's (Recomendações)

- **Use sempre os pacotes WST** em vez de criar implementações customizadas
- **Estenda as classes base** do @wst/core (Entity, UseCase, BaseController)
- **Utilize @wst/logger** para todas as operações de logging
- **Implemente repositórios** seguindo os padrões @wst/database
- **Configure segurança** usando exclusivamente @wst/security
- **Siga a arquitetura DDD** estabelecida pelos pacotes WST

### ❌ Don'ts (Evite)

- **Não duplique funcionalidades** já disponíveis nos pacotes WST
- **Não crie middlewares customizados** se existirem equivalentes em @wst/middleware
- **Não implemente logging customizado** - use @wst/logger
- **Não misture padrões** - mantenha 100% compatibilidade WST
- **Não ignore as interfaces** definidas nos pacotes WST

### 🏗️ Padrões de Implementação

```typescript
// ✅ Correto - Usando WST Framework
import { Entity } from '@wst/core';
import { BaseController } from '@wst/middleware';
import { UseCase } from '@wst/core';

class MinhaEntity extends Entity {
  // Implementação usando padrões WST
}

class MeuController extends BaseController {
  // Controlador seguindo padrões WST
}

// ❌ Incorreto - Implementação customizada
class MinhaEntityCustomizada {
  // Evite criar implementações próprias
}
```

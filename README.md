# 🚀 WST Framework Microservice Template

**100% WST Framework Compliant Template** - Gold Standard Implementation

Este projeto é um template de microserviço que segue completamente os padrões do WST Framework, utilizando:

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

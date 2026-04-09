# Kronuz Client

App de agendamento público — interface que os clientes finais usam para agendar serviços. Cada unidade tem seu subdomínio: `{slug}.kronuz.app`.

## Stack

- React 18 + TypeScript 5
- Vite 5
- Tailwind CSS 3
- React Router 6
- React Query (TanStack)
- React Hook Form + Zod
- Zustand para state management
- Vitest para testes

## Setup

```bash
# Instalar dependências
yarn install

# Copiar variáveis de ambiente
cp .env.example .env

# Iniciar em dev
yarn dev
```

### Dev local com subdomínios

Adicionar no `/etc/hosts`:
```
127.0.0.1  barbearia-teste.localhost
127.0.0.1  outra-unidade.localhost
```

## Variáveis de Ambiente

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL da API backend |

## Scripts

| Comando | Descrição |
|---|---|
| `yarn dev` | Inicia dev server |
| `yarn build` | Build de produção (Vite) |
| `yarn build:check` | Build com type-check (tsc + Vite) |
| `yarn preview` | Preview do build local |
| `yarn test` | Roda testes |
| `yarn test:watch` | Testes em watch mode |
| `yarn coverage` | Testes com cobertura |

## Deploy (Coolify)

Build Command:
```
yarn build
```

Start Command: Servido via Caddy (detectado automaticamente pelo Nixpacks para apps estáticos).

Variável extra para o Nixpacks:
```
NIXPACKS_NODE_VERSION=22.12.0
```

## DNS

Wildcard `*.kronuz.app` apontando para o servidor. Ver `docs/slug-subdomain-infrastructure.md` no admin para detalhes.

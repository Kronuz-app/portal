# Plano de Implementação: Frontend-Backend Integration

## Visão Geral

Substituir todos os Mock_Services por Real_Services em ambos os frontends (`trinity-scheduler-client` e `trinity-scheduler-admin`), implementando a infraestrutura de HTTP, conversão de preços, mapeamento de dados e autenticação real.

## Tasks

- [x] 1. Infraestrutura base — Client Frontend
  - [x] 1.1 Criar `src/lib/api.ts` com `decodeShopId()`, `clientApi()` e `ApiError`
    - `decodeShopId()` lê `?ref=` da URL e decodifica base64 para obter o shopId
    - `clientApi()` chama `fetch(VITE_API_URL + path)` com header `X-Shop-Id` automático
    - `ApiError` com campo `status: number`
    - Se `VITE_API_URL` não estiver definida, usar `http://localhost:3000` como fallback e logar erro no console
    - _Requirements: 1.1, 1.2, 1.4, 1.5_

  - [ ]* 1.2 Escrever property tests para `src/lib/api.ts` (client)
    - **Property 1: base64 round-trip** — `decodeShopId()` retorna o shopId original após codificação base64
    - **Property 2: clientApi X-Shop-Id invariante** — toda requisição inclui `X-Shop-Id` igual ao shopId decodificado
    - **Validates: Requirements 1.2, 1.4**

  - [x] 1.3 Criar `src/lib/price.ts` com `centsToReais()` e `reaisToCents()`
    - `centsToReais(cents)` → `cents / 100`
    - `reaisToCents(reais)` → `Math.round(reais * 100)`
    - _Requirements: 9.1, 9.6_

  - [ ]* 1.4 Escrever property tests para `src/lib/price.ts` (client)
    - **Property 7: cents↔reais round-trip** — `reaisToCents(centsToReais(cents)) === cents` para todo inteiro não-negativo
    - **Validates: Requirements 9.1, 9.2, 9.6**

  - [x] 1.5 Criar `.env` e `.env.example` no `trinity-scheduler-client`
    - `.env`: `VITE_API_URL=http://localhost:3000` e `VITE_SHOP_ID=`
    - `.env.example`: mesmas chaves com valores de exemplo
    - _Requirements: 1.1_

- [x] 2. Infraestrutura base — Admin Frontend
  - [x] 2.1 Criar `src/lib/api.ts` com `adminApi()` e `ApiError` no `trinity-scheduler-admin`
    - `adminApi()` lê token do `localStorage` e inclui `Authorization: Bearer <token>` automaticamente
    - Intercepta resposta 401: remove token do localStorage e redireciona para `/login`
    - `ApiError` com campo `status: number`
    - _Requirements: 2.1, 2.2, 2.6_

  - [ ]* 2.2 Escrever property tests para `src/lib/api.ts` (admin)
    - **Property 3: adminApi Authorization Bearer invariante** — toda requisição inclui `Authorization: Bearer <token>` exato
    - **Validates: Requirements 2.2**

  - [x] 2.3 Criar `src/utils/price.ts` com `centsToReais()` e `reaisToCents()` no `trinity-scheduler-admin`
    - Mesma lógica do client: `centsToReais` → `/ 100`, `reaisToCents` → `Math.round(* 100)`
    - _Requirements: 9.2, 9.5_

  - [ ]* 2.4 Escrever property tests para `src/utils/price.ts` (admin)
    - **Property 7: cents↔reais round-trip** — `reaisToCents(centsToReais(cents)) === cents`
    - **Property 8: reaisToCents arredondamento** — `reaisToCents(x) === Math.round(x * 100)` para valores com até 2 casas decimais
    - **Validates: Requirements 9.2, 9.5, 9.6**

  - [x] 2.5 Criar `src/lib/mappers.ts` com `fromBackendProfessional()` e `toBackendProfessional()` no `trinity-scheduler-admin`
    - `fromBackendProfessional`: `professionalId` → `id`, `professionalName` → `name`
    - `toBackendProfessional`: `id` → `professionalId`, `name` → `professionalName`
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ]* 2.6 Escrever property tests para `src/lib/mappers.ts`
    - **Property 9: toBackendProfessional mapeamento** — `toBackendProfessional(staff).professionalId === staff.id` e `.professionalName === staff.name`
    - **Property 10: staff↔professional round-trip** — `fromBackendProfessional(toBackendProfessional(staff))` preserva `id` e `name`
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4**

  - [x] 2.7 Criar `.env` e `.env.example` no `trinity-scheduler-admin`
    - `.env`: `VITE_API_URL=http://localhost:3000`
    - `.env.example`: mesma chave com valor de exemplo
    - _Requirements: 2.1_

- [x] 3. Checkpoint — Infraestrutura base
  - Garantir que todos os testes de infraestrutura passam. Verificar se `clientApi` e `adminApi` compilam sem erros de tipo. Perguntar ao usuário se há dúvidas antes de continuar.

- [x] 4. Stores de autenticação
  - [x] 4.1 Modificar `src/stores/authStore.ts` no `trinity-scheduler-client`
    - `init()` chama `authService.validateSession(clientId)` ao inicializar; remove clientId e redireciona se inválido
    - `login(phone)` chama `authService.login(phone)` e armazena `clientId` no localStorage
    - _Requirements: 3.1, 3.2, 3.4, 3.5_

  - [ ]* 4.2 Escrever property tests para `src/stores/authStore.ts`
    - **Property 6: clientId round-trip** — após `authStore.login()` bem-sucedido, `localStorage.getItem("trinity_client_id")` === clientId retornado e `isAuthenticated === true`
    - **Validates: Requirements 3.2**

  - [x] 4.3 Modificar `src/stores/userStore.ts` no `trinity-scheduler-admin`
    - `login(email, password)` → `POST /admin/auth/login`, salva token no localStorage, atualiza estado
    - `logout()` → remove token do localStorage, limpa estado
    - `init()` → lê token do localStorage e restaura sessão
    - _Requirements: 2.3, 2.4, 2.5, 4.1, 4.2, 4.3_

  - [ ]* 4.4 Escrever property tests para `src/stores/userStore.ts`
    - **Property 4: JWT localStorage round-trip** — após `login()` + `init()`, `isAuthenticated === true` e token no localStorage igual ao original
    - **Property 5: logout remove JWT** — após `logout()`, `localStorage.getItem("trinity_admin_token") === null` e `isAuthenticated === false`
    - **Validates: Requirements 2.3, 2.4, 2.5**

- [x] 5. Serviços de autenticação — Client Frontend
  - [x] 5.1 Modificar `src/services/authService.ts` no `trinity-scheduler-client`
    - `login(phone)` → `POST /auth/login` via `clientApi`, retorna `clientId`
    - `validateSession(clientId)` → `GET /auth/validate?clientId=<id>` via `clientApi`, retorna `boolean`
    - Remover importações de mocks
    - _Requirements: 3.1, 3.2, 3.4, 18.1, 18.3, 18.4_

- [x] 6. Serviços de dados — Client Frontend
  - [x] 6.1 Modificar `src/services/serviceService.ts` no `trinity-scheduler-client`
    - `getServices()` → `GET /services` via `clientApi`, aplica `centsToReais` no campo `price`
    - Remover importações de mocks
    - _Requirements: 5.1, 5.3, 9.3, 18.1, 18.3_

  - [x] 6.2 Criar `src/services/addonService.ts` no `trinity-scheduler-client`
    - `getAddons()` → `GET /addons` via `clientApi`, aplica `centsToReais` no campo `price`
    - _Requirements: 5.2, 5.3, 5.5, 9.3_

  - [x] 6.3 Modificar `src/services/professionalService.ts` no `trinity-scheduler-client`
    - `getProfessionals()` → `GET /professionals` via `clientApi`
    - Remover importações de mocks
    - _Requirements: 6.1, 18.1, 18.3_

  - [x] 6.4 Modificar `src/services/availabilityService.ts` no `trinity-scheduler-client`
    - `getAvailableSlots(professionalId, date, serviceDuration)` → `GET /availability/slots` com query params via `clientApi`
    - `getDisabledDates(professionalId, startDate, endDate)` → `GET /availability/disabled-dates` com query params via `clientApi`
    - Omitir `professionalId` da query string quando nulo
    - Remover importações de mocks
    - _Requirements: 7.1, 7.2, 7.3, 18.1, 18.3_

  - [x] 6.5 Modificar `src/services/appointmentService.ts` no `trinity-scheduler-client`
    - `getAppointments(clientId)` → `GET /appointments?clientId=<id>` via `clientApi`, aplica `centsToReais` no campo `price`
    - `createAppointment(payload)` → `POST /appointments` via `clientApi`, aplica `centsToReais` na resposta
    - `cancelAppointment(id, reason)` → `PATCH /appointments/<id>/cancel` via `clientApi`
    - Remover importações de mocks
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 9.3, 18.1, 18.3_

- [x] 7. Checkpoint — Client Frontend
  - Garantir que todos os serviços do client compilam e os testes passam. Verificar que nenhuma importação de mock permanece. Perguntar ao usuário se há dúvidas antes de continuar.

- [x] 8. Serviços de agendamentos e clientes — Admin Frontend
  - [x] 8.1 Modificar `src/services/appointmentService.ts` no `trinity-scheduler-admin`
    - `getAll(filters)` → `GET /admin/appointments` com filtros como query params via `adminApi`; converte `staffId` → `professionalId` na query string; aplica `fromBackendProfessional` e `centsToReais` nas respostas
    - `getByDate(date)` → `GET /admin/appointments?date=<date>` via `adminApi`
    - `getById(id)` → `GET /admin/appointments/<id>` via `adminApi`
    - `create(data)` → `POST /admin/appointments` com `toBackendProfessional` aplicado via `adminApi`
    - `update(id, data)` → `PUT /admin/appointments/<id>` via `adminApi`
    - `delete(id)` → `DELETE /admin/appointments/<id>` via `adminApi`
    - Remover importações de mocks
    - _Requirements: 10.5, 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 18.2, 18.3_

  - [x] 8.2 Modificar `src/services/clientService.ts` no `trinity-scheduler-admin`
    - `getAll()` → `GET /admin/clients` via `adminApi`, aplica `centsToReais` em `totalSpent`
    - `search(query, page, perPage)` → `GET /admin/clients?search=&page=&perPage=` via `adminApi`, aplica `centsToReais` em `totalSpent`
    - `getById(id)`, `create(data)`, `update(id, data)`, `delete(id)` → endpoints reais via `adminApi`
    - Remover importações de mocks
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 18.2, 18.3_

- [x] 9. Serviços de catálogo e equipe — Admin Frontend
  - [x] 9.1 Modificar `src/services/serviceService.ts` no `trinity-scheduler-admin`
    - `getAll()` → `GET /admin/services` via `adminApi`, aplica `centsToReais` em `price`
    - `create(data)` → `POST /admin/services` com `reaisToCents` em `price` via `adminApi`
    - `update(id, data)` → `PUT /admin/services/<id>` com `reaisToCents` em `price` via `adminApi`
    - `getById(id)`, `delete(id)` → endpoints reais via `adminApi`
    - Remover importações de mocks
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 9.4, 9.5, 18.2, 18.3_

  - [x] 9.2 Modificar `src/services/staffService.ts` no `trinity-scheduler-admin`
    - `getAll(filters)` → `GET /admin/professionals?unitId=<id>` via `adminApi`, aplica `fromBackendProfessional` nas respostas
    - `create(data)` → `POST /admin/professionals` com `toBackendProfessional` via `adminApi`
    - `update(id, data)` → `PUT /admin/professionals/<id>` com `toBackendProfessional` via `adminApi`
    - `getById(id)`, `delete(id)` → endpoints reais via `adminApi`
    - Remover importações de mocks
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 10.1, 10.2, 10.3, 18.2, 18.3_

  - [x] 9.3 Modificar `src/services/unitService.ts` no `trinity-scheduler-admin`
    - `getAll()` → `GET /admin/units` via `adminApi`
    - `create(data)` → `POST /admin/units` via `adminApi`
    - `update(id, data)` → `PUT /admin/units/<id>` via `adminApi`
    - `getById(id)`, `delete(id)` → endpoints reais via `adminApi`
    - Remover importações de mocks
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 18.2, 18.3_

- [x] 10. Serviços de configuração e dashboard — Admin Frontend
  - [x] 10.1 Criar `src/services/shopService.ts` no `trinity-scheduler-admin`
    - `getShop()` → `GET /admin/shop` via `adminApi`
    - `updateShop(data)` → `PUT /admin/shop` via `adminApi`
    - `getHours()` → `GET /admin/shop/hours` via `adminApi`
    - `updateHours(hours)` → `PUT /admin/shop/hours` via `adminApi`
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [x] 10.2 Criar `src/services/dashboardService.ts` no `trinity-scheduler-admin`
    - `getStats(date)` → `GET /admin/dashboard/stats?date=<YYYY-MM-DD>` via `adminApi`, aplica `centsToReais` em `revenue`
    - `getWeeklyRevenue()` → `GET /admin/dashboard/weekly-revenue` via `adminApi`, aplica `centsToReais` em todos os valores numéricos de cada entrada
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 9.4_

  - [x] 10.3 Modificar `src/stores/shopStore.ts` no `trinity-scheduler-admin`
    - `loadShop()` chama `shopService.getShop()` e atualiza o estado
    - `saveShop(data)` chama `shopService.updateShop(data)` e atualiza o estado
    - _Requirements: 16.1, 16.2_

- [x] 11. Hooks do Admin Frontend
  - [x] 11.1 Modificar `src/hooks/useClients.ts` no `trinity-scheduler-admin`
    - Passar `search`, `page` e `perPage` como query params para `clientService.search()` — não filtrar localmente
    - _Requirements: 13.1_

  - [x] 11.2 Modificar `src/hooks/useStaff.ts` no `trinity-scheduler-admin`
    - Passar `unitId` como query param para `staffService.getAll({ unitId })` — não filtrar localmente
    - _Requirements: 11.1_

  - [x] 11.3 Modificar `src/hooks/useAppointments.ts` no `trinity-scheduler-admin`
    - Passar todos os filtros (`date`, `staffId`, `status`, `serviceId`, `clientId`) como query params para `appointmentService.getAll(filters)` — não filtrar localmente
    - _Requirements: 12.1, 12.2_

- [x] 12. Checkpoint final — Garantir que todos os testes passam
  - Garantir que todos os testes passam em ambos os frontends. Verificar que nenhuma importação de mock permanece nos serviços. Perguntar ao usuário se há dúvidas antes de encerrar.

## Notas

- Tasks marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada task referencia os requisitos específicos para rastreabilidade
- Checkpoints garantem validação incremental a cada grupo lógico
- Testes de propriedade usam **fast-check** com mínimo de 100 iterações
- Cada teste de propriedade deve incluir a tag: `// Feature: frontend-backend-integration, Property N: <texto>`
- Testes de propriedade são complementares aos testes unitários, não substitutos

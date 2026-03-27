# Prompt de Recriação — Trinity Scheduler Client

Você vai recriar do zero uma aplicação mobile-first de agendamento de serviços chamada **Kronuz** (anteriormente Trinity Scheduler Client). O objetivo é manter **todas as funcionalidades existentes** mas com **layouts completamente novos** — visual moderno, limpo e diferente do atual.

---

## Stack Obrigatória

- React 18 + TypeScript 5
- Vite 5 (build tool)
- Tailwind CSS 3.4 (sem shadcn/ui — componentes customizados)
- React Router DOM v6
- Zustand v5 (estado global)
- TanStack React Query v5 (estado servidor)
- React Hook Form v7 + Zod v3 (formulários)
- Lucide React (ícones)
- Axios ou fetch nativo para API

---

## Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:3000
```

Acesso via `import.meta.env.VITE_API_URL || 'http://localhost:3000'`

---

## Sistema de Referência (Shop/Unit)

A aplicação identifica o estabelecimento de duas formas:

### 1. Subdomínio (principal)
- URL: `barbearia-centro.localhost` ou `barbearia-centro.kronuz.com.br`
- O slug é extraído do subdomínio (leftmost label)
- Chama `GET /client/units/resolve/:slug` (sem autenticação)
- Resposta: `{ unitId, shopId, unitName, shopName, address }`
- Salva no localStorage: `trinity_shop_id`, `trinity_unit_id`, `trinity_unit_name`, `trinity_unit_address`

### 2. Parâmetro `?ref=` (legado)
- Contém base64 de `shopId` ou `shopId:unitId`
- Decodifica e salva no localStorage

### Header obrigatório
Todas as chamadas à API (exceto `/client/units/resolve/:slug`) devem incluir:
```
X-Shop-Id: <shopId do localStorage>
```

---

## Rotas da Aplicação

```
/                          → LoginPage (pública)
/agendamento               → BookingPage (protegida)
/agendamento/sucesso       → BookingSuccessPage (protegida)
/meus-agendamentos         → AppointmentsPage (protegida)
/meus-agendamentos/:id     → AppointmentDetailPage (protegida)
*                          → NotFoundPage
```

Rotas protegidas redirecionam para `/` se não autenticado.

---

## Autenticação

**Sem JWT.** Autenticação por telefone que retorna um `clientId`.

### Estado (Zustand — `authStore`)
```typescript
{
  clientId: string | null
  clientName: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
```

### Ações
- `login(phone)` → POST `/auth/login` → salva `clientId` no localStorage (`trinity_client_id`)
- `loginFromUrl(clientId)` → login automático via URL param, valida sessão em background
- `logout()` → limpa localStorage e estado
- `setClientName(name)` → atualiza nome no estado
- `init()` → ao iniciar app, lê `clientId` do localStorage e valida via `GET /auth/validate?clientId=`

### Endpoints de Auth
```
POST /auth/login
  Body: { phone: string }
  Response: { clientId: string, name: string | null }

GET /auth/validate?clientId=<id>
  Response: { clientId: string, name: string | null }

PATCH /auth/name
  Body: { clientId: string, name: string }
  Response: 200 OK
```

---

## Fluxo de Inicialização do App

1. Extrai slug do subdomínio
2. Se tem slug → chama `resolveSlug(slug)` → salva dados no localStorage
3. Se já tem cache no localStorage → usa imediatamente (evita flash de loading)
4. Carrega skin baseada no `niche` do estabelecimento (via `GET /client/shop/info`)
5. Aplica cores CSS via variáveis CSS customizadas
6. Renderiza app com `SkinProvider`

Se não há slug nem shopId → exibe `HomePage` (landing page genérica).
Se resolução falha e não há cache → exibe `SlugNotFoundError`.

---

## Sistema de Skins (Temas)

Cada estabelecimento tem um `niche` (`barbearia` ou `salao-beleza`) que define o tema visual.

### Estrutura do tema
```typescript
interface ThemeConfig {
  metadata: {
    nicheId: string        // "barbearia" | "salao-beleza"
    displayName: string
    description?: string
  }
  colors: {
    primary: string        // ex: "#d4af37"
    secondary: string      // ex: "#242424"
    accent: string
    background: string
    text: string
    muted: string
    border: string
    input: string
  }
  texts: Record<string, any>  // textos customizados por nicho
}
```

### Aplicação das cores
As cores são aplicadas como variáveis CSS no `:root`:
```css
--color-primary: #d4af37;
--color-background: #121212;
/* etc */
```

### Tema barbearia (exemplo)
```json
{
  "primary": "#d4af37",
  "secondary": "#242424",
  "accent": "#b8964f",
  "background": "#121212",
  "text": "#ebebeb",
  "muted": "#242424",
  "border": "#2e2e2e",
  "input": "#2e2e2e"
}
```

---

## Tipos de Dados

```typescript
interface Service {
  id: string
  name: string
  duration: number    // minutos
  price: number       // em reais (já convertido de centavos)
  description: string
  icon?: string       // nome de ícone Lucide
  image?: string      // URL
}

interface AddonService {
  id: string
  name: string
  duration: number
  price: number
  image?: string
}

interface Professional {
  id: string
  name: string
  avatar: string      // URL ou placeholder
  specialties: string[]
}

interface TimeSlot {
  time: string        // "09:00", "09:30"
  available: boolean
}

interface Appointment {
  id: string
  clientId: string
  serviceId: string
  serviceName: string
  professionalId: string
  professionalName: string
  date: string        // "YYYY-MM-DD"
  time: string        // "HH:MM"
  duration: number
  price: number       // em reais
  status: "confirmed" | "cancelled" | "completed"
  cancelReason?: string
}

interface CreateAppointmentPayload {
  clientId: string
  serviceId: string
  professionalId: string | null   // null = sem preferência
  addonIds?: string[]
  date: string
  time: string
  unitId?: string | null
}
```

---

## Estado do Wizard de Agendamento (Zustand — `bookingStore`)

```typescript
{
  currentStep: number          // 0 a 3
  selectedService: Service | null
  selectedAddons: AddonService[]
  selectedProfessional: Professional | null   // null = sem preferência (válido)
  selectedDate: string | null
  selectedTime: string | null
}
```

### Ações
- `setService(service)` → define serviço
- `toggleAddon(addon)` → adiciona/remove addon
- `setProfessional(professional | null)` → define profissional (null = sem preferência)
- `setDateTime(date, time)` → define data e hora
- `goToStep(step)` → navega para etapa específica (usado no StepIndicator)
- `nextStep()` / `prevStep()` → avança/volta etapa
- `reset()` → limpa tudo e volta ao step 0

---

## Wizard de Agendamento — 4 Etapas

### Etapa 0 — Seleção de Serviço + Adicionais

**Endpoint:** `GET /services` → lista serviços ativos
**Endpoint:** `GET /addons` → lista adicionais ativos

**Comportamento:**
- Lista serviços com nome, duração, preço, imagem/ícone
- Ao selecionar um serviço, exibe seção de adicionais (se houver)
- Adicionais são opcionais, seleção múltipla (toggle)
- Cada addon mostra: nome, duração extra, preço, imagem
- Botão "Continuar" aparece após selecionar serviço
- Preço em centavos na API → converter para reais na exibição

### Etapa 1 — Seleção de Profissional

**Endpoint:** `GET /professionals?unitId=<unitId>` → lista profissionais ativos

**Comportamento:**
- Lista profissionais com avatar, nome, especialidades
- Primeira opção sempre: "Sem preferência" (valor `null` no store)
- Botão "Continuar" aparece após qualquer seleção (incluindo "sem preferência")
- Etapas concluídas no StepIndicator são clicáveis (permite voltar)

### Etapa 2 — Seleção de Data e Horário

**Endpoints:**
```
GET /availability/slots?date=YYYY-MM-DD&professionalId=<id>&serviceDuration=<min>&unitId=<id>
  Response: [{ time: "09:00", available: boolean }]

GET /availability/disabled-dates?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&professionalId=<id>&unitId=<id>
  Response: ["2025-03-15", "2025-03-16"]
```

**Comportamento:**
- Exibe scroll horizontal com próximos 30 dias
- Datas em `disabledDates` ficam desabilitadas (sem slots disponíveis)
- Ao selecionar data, carrega slots disponíveis
- `serviceDuration` = duração do serviço + soma das durações dos addons
- Sem `professionalId` → API retorna união de disponibilidade de todos
- Slots indisponíveis ficam visualmente desabilitados mas visíveis
- Botão "Continuar" aparece após selecionar data + horário

### Etapa 3 — Confirmação

**Endpoint:** `POST /appointments`
```json
Body: {
  "clientId": "string",
  "serviceId": "string",
  "professionalId": "string | null",
  "addonIds": ["string"],
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "unitId": "string | null"
}
Response: Appointment
```

**Comportamento:**
- Exibe resumo completo: serviço, adicionais, profissional, data, hora, duração total, preço total
- Preço total = serviço + soma dos adicionais
- Duração total = serviço + soma das durações dos adicionais
- Botão "Confirmar agendamento"
- Botão "Voltar e editar"
- Em caso de erro, exibe mensagem + botão "Tentar novamente"
- Sucesso → navega para `/agendamento/sucesso` passando `{ appointment, addons }` via `location.state`

---

## ClientNameGate

Componente que envolve o BookingPage. Se o cliente não tem nome cadastrado (`clientName === null`), exibe formulário para coletar o nome antes de prosseguir.

- Campo: nome completo (obrigatório)
- Chama `PATCH /auth/name` com `{ clientId, name }`
- Após salvar, atualiza `clientName` no store e exibe o conteúdo filho

---

## Página de Sucesso (`/agendamento/sucesso`)

Recebe dados via `location.state`:
- `appointment: Appointment`
- `addons: AddonService[]`

**Exibe:**
- Ícone de sucesso
- Data e horário formatados
- Duração total
- Profissional
- Serviço principal
- Lista de adicionais (se houver)
- Valor total
- Botão "Adicionar à agenda" → gera URL do Google Calendar
- Botão "Meus agendamentos" → navega para `/meus-agendamentos`

### Google Calendar URL
```
https://calendar.google.com/calendar/render?action=TEMPLATE
  &text=<serviceName> - <shopName>
  &dates=<startYYYYMMDDTHHMMSS>/<endYYYYMMDDTHHMMSS>
  &details=Profissional: <professionalName>
  &location=<unitAddress>
```

---

## Página de Agendamentos (`/meus-agendamentos`)

**Endpoint:** `GET /appointments?clientId=<id>`
```
Response: Appointment[]  (ordenado desc por date/time)
```

**Comportamento:**
- Divide em duas seções: "Próximos" e "Histórico"
- Próximos: `date >= hoje` E `status !== "cancelled"`
- Histórico: `date < hoje` OU `status === "cancelled"`
- Cada card mostra: serviço, profissional, data, hora, duração, preço, status
- Status com cores: confirmado (primary), cancelado (destructive), concluído (muted)
- Cards de "Próximos" são clicáveis → navega para `/meus-agendamentos/:id`
- Cards de "Histórico" não são clicáveis
- Loading state com skeletons
- Seção vazia com mensagem amigável

---

## Página de Detalhe do Agendamento (`/meus-agendamentos/:id`)

**Dados:** Busca da lista já carregada pelo `useAppointments` (sem nova chamada de API)

**Exibe:**
- Botão voltar para `/meus-agendamentos`
- Header com nome do serviço, profissional e badge de status
- Detalhes: serviço, profissional, data formatada, horário + duração, valor
- Se `status === "confirmed"` e `date >= hoje`:
  - Botão "Adicionar à agenda" (Google Calendar)
  - Botão "Cancelar agendamento"
- Se `status === "cancelled"` e tem `cancelReason`: exibe motivo do cancelamento

### Fluxo de Cancelamento
1. Clica "Cancelar agendamento" → exibe formulário inline
2. Textarea obrigatória para justificativa
3. Botão "Confirmar cancelamento" (desabilitado se textarea vazia)
4. Botão "Voltar" para fechar formulário sem cancelar
5. Chama `PATCH /appointments/:id/cancel` com `{ reason: string }`
6. Sucesso → navega para `/meus-agendamentos`

**Endpoint:**
```
PATCH /appointments/:id/cancel
  Body: { reason: string }
  Response: 200 OK
```

---

## Página de Login (`/`)

**Comportamento:**
- Se já autenticado → redireciona para `/agendamento`
- Campo de telefone com máscara: `(11) 99999-9999` ou `(11) 99999-9999`
- Validação Zod: apenas dígitos, mínimo 10, máximo 11 dígitos
- Botão "Entrar" desabilitado enquanto inválido ou carregando
- Após login bem-sucedido → navega para `/agendamento`

### Máscara de telefone
```
(XX) XXXX-XXXX    → 10 dígitos (fixo)
(XX) XXXXX-XXXX   → 11 dígitos (celular)
```

---

## Layout e Navegação

### Header (sticky top)
- Nome do estabelecimento (do localStorage `trinity_unit_name`) como link para `/agendamento`
- Botão "Sair" → chama `logout()`

### Bottom Navigation (sticky bottom)
- "Agendar" → `/agendamento` (ícone CalendarPlus)
- "Agendamentos" → `/meus-agendamentos` (ícone CalendarCheck)
- Indicador visual na tab ativa (linha na base)

### MobileLayout
Envolve páginas autenticadas com Header + conteúdo scrollável + Bottom Nav.

---

## StepIndicator

Barra de progresso do wizard com 4 etapas.

- Círculos numerados conectados por linhas
- Etapa atual: borda primary, número visível
- Etapas concluídas: fundo primary, ícone de check, **clicáveis** (permite voltar)
- Etapas futuras: borda muted, número, não clicáveis
- Labels das etapas abaixo dos círculos (visíveis em sm+, etapa ativa sempre visível)
- Animação de transição entre etapas: fade + slide da direita

---

## Textos Configuráveis (`config/texts.json`)

Todos os textos da UI vêm deste arquivo. Estrutura:

```json
{
  "login": {
    "titulo": "Bem-vindo",
    "subtitulo": "Informe seu telefone para continuar",
    "placeholder": "(11) 99999-9999",
    "botaoEntrar": "Entrar"
  },
  "booking": {
    "etapas": ["Serviço", "Profissional", "Data e Horário", "Confirmação"],
    "servico": { "titulo": "...", "subtitulo": "..." },
    "adicionais": { "titulo": "...", "subtitulo": "...", "botaoContinuar": "Continuar" },
    "profissional": { "titulo": "...", "subtitulo": "...", "semPreferencia": "Sem preferência", "botaoContinuar": "Continuar" },
    "dataHorario": { "titulo": "...", "subtitulo": "...", "semHorarios": "...", "botaoContinuar": "Continuar" },
    "confirmacao": { "titulo": "...", "botaoConfirmar": "...", "botaoVoltar": "..." },
    "sucesso": { "titulo": "...", "mensagem": "...", "botaoAgenda": "...", "botaoNovo": "...", "botaoAgendamentos": "..." }
  },
  "agendamentos": {
    "titulo": "Meus agendamentos",
    "proximos": "Próximos",
    "anteriores": "Histórico",
    "cancelar": "Cancelar agendamento",
    "confirmarCancelamento": "...",
    "justificativaPlaceholder": "...",
    "justificativaObrigatoria": "...",
    "canceladoComSucesso": "...",
    "vazio": "...",
    "vazioProximos": "...",
    "vazioHistorico": "...",
    "hoje": "Hoje",
    "motivoCancelamento": "Motivo do cancelamento"
  },
  "validacao": {
    "apenasNumeros": "...",
    "telefoneMinimo": "...",
    "telefoneMaximo": "...",
    "telefoneInvalido": "..."
  },
  "geral": {
    "carregando": "Carregando...",
    "erro": "Ocorreu um erro. Tente novamente.",
    "tentarNovamente": "Tentar novamente",
    "sair": "Sair"
  }
}
```

---

## Formatação de Dados

```typescript
// Preço: centavos → reais
function centsToReais(cents: number): number {
  return cents / 100
}

// Exibição de moeda
new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
// → "R$ 45,00"

// Data YYYY-MM-DD → "segunda-feira, 15 de março de 2025"
const [year, month, day] = date.split('-').map(Number)
new Date(year, month - 1, day).toLocaleDateString('pt-BR', {
  weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
})

// Data curta para lista de agendamentos
new Date(year, month - 1, day).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
// → "15 mar"
```

---

## Componentes UI Base (criar do zero com Tailwind)

- `Button` — variantes: `primary`, `secondary`, `ghost`; prop `loading` (spinner); prop `disabled`
- `Input` — com label, prop `error` para mensagem de erro
- `Card` — container com borda e fundo
- `Dialog` / `Modal` — overlay com conteúdo centralizado
- `Skeleton` — placeholder de carregamento (animação pulse)
- `SkeletonList` — lista de skeletons com `count` prop
- `AppointmentSkeleton` — skeleton específico para cards de agendamento

---

## Hooks TanStack Query

```typescript
useServices()         // GET /services
useAddons()           // GET /addons
useProfessionals()    // GET /professionals?unitId=<id>
useAvailableSlots(professionalId, date, serviceDuration)
  // GET /availability/slots + GET /availability/disabled-dates
useAppointments(clientId)
  // GET /appointments?clientId=<id>
  // Retorna: { upcoming, past, isLoading, isError }
useCreateAppointment()  // mutation POST /appointments
useCancelAppointment()  // mutation PATCH /appointments/:id/cancel
useShop()             // GET /client/shop/info?unitId=<id>
```

---

## Comportamentos Importantes

1. **Preço em centavos**: A API retorna preços em centavos. Converter para reais antes de exibir e armazenar no estado.

2. **unitId**: Sempre incluir `unitId` (do localStorage `trinity_unit_id`) nas chamadas de disponibilidade, profissionais e criação de agendamento.

3. **Sem preferência de profissional**: `professionalId: null` é um valor válido. A API auto-atribui o profissional disponível.

4. **Datas sem timezone**: Ao parsear datas `YYYY-MM-DD`, usar `new Date(year, month-1, day)` para evitar problemas de fuso horário.

5. **Scroll para topo**: Ao mudar de etapa no wizard, fazer scroll para o topo suavemente.

6. **Animação entre etapas**: Fade + slide da direita ao trocar de etapa.

7. **Cache de sessão**: Se `clientId` está no localStorage mas a validação falha por erro de rede, manter o estado (não fazer logout automático).

8. **Slug em cache**: Se já tem dados no localStorage, exibir imediatamente sem esperar a resolução do slug (evita flash de loading).

---

## Estrutura de Arquivos Sugerida

```
src/
├── components/
│   ├── ui/              # Button, Input, Card, Dialog, Skeleton, etc.
│   ├── booking/         # BookingWizard, ServiceSelection, ProfessionalSelection,
│   │                    # DateTimeSelection, BookingConfirmation, StepIndicator,
│   │                    # ClientNameGate, ServiceCard, ProfessionalCard, TimeSlotGrid
│   └── layout/          # Header, MobileLayout, BottomNav
├── pages/               # LoginPage, BookingPage, BookingSuccessPage,
│                        # AppointmentsPage, AppointmentDetailPage, NotFoundPage, HomePage
├── hooks/               # useServices, useAddons, useProfessionals, useAvailableSlots,
│                        # useAppointments, useCreateAppointment, useCancelAppointment,
│                        # useShop, useCalendarUrl, useMetaTags
├── services/            # authService, appointmentService, availabilityService,
│                        # serviceService, addonService, professionalService,
│                        # shopService, slugResolver
├── stores/              # authStore, bookingStore
├── contexts/            # SkinContext
├── config/
│   ├── texts.json
│   └── skins/           # barbearia.json, salao-beleza.json, loader.ts, schema.ts
├── lib/
│   ├── api.ts           # clientApi, decodeShopId, getUnitId
│   ├── types.ts
│   ├── utils.ts         # cn, formatCurrency, formatDate, buildGoogleCalendarUrl
│   ├── price.ts         # centsToReais
│   └── encoding.ts      # decodeBase62
├── schemas/
│   └── phoneSchema.ts   # Zod schema para telefone
├── App.tsx
├── main.tsx
└── index.css
```

---

## Requisitos de Design (NOVO LAYOUT)

Crie um visual completamente diferente do atual. Sugestões de direção:

- **Moderno e minimalista**: espaçamento generoso, tipografia clara, hierarquia visual forte
- **Mobile-first**: tudo otimizado para toque, botões grandes (min 44px), áreas clicáveis confortáveis
- **Dark mode nativo**: o tema barbearia usa fundo escuro (`#121212`) com dourado (`#d4af37`)
- **Cards com profundidade**: sombras sutis, bordas arredondadas, estados hover/active visíveis
- **Feedback visual imediato**: loading states, estados de seleção claros, transições suaves
- **Tipografia**: use uma fonte display para títulos (ex: `font-display`) e sans-serif para corpo
- **Cores via CSS variables**: toda a paleta deve vir das variáveis CSS aplicadas pelo sistema de skins

O layout atual é funcional mas básico. O novo deve ter personalidade visual forte, mantendo a mesma UX e fluxo.

---

## Idioma

Toda a interface em **português (Brasil)**.

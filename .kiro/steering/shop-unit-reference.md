---
inclusion: auto
---

# Sistema de Referência Shop/Unit

Este documento explica como o portal do cliente processa links de agendamento gerados pelo painel administrativo, identificando o estabelecimento e unidade corretos.

## Visão Geral

O sistema usa URLs com parâmetros codificados em base64 para identificar qual estabelecimento (shop) e unidade (unit) o cliente está acessando. Isso permite:

- Links de agendamento únicos por estabelecimento/unidade
- Filtragem automática de serviços e profissionais por unidade
- Experiência personalizada por estabelecimento
- Rastreamento de origem dos agendamentos

## Formato da URL

```
https://agendamento.com?ref=<base64_encoded_payload>
```

### Conteúdo do Base64

O parâmetro `ref` contém um payload codificado em base64:

**Apenas estabelecimento:**
```
Payload: "shopId"
Base64: btoa("shopId")
Exemplo: "loja-sp" → "bG9qYS1zcA=="
```

**Estabelecimento + Unidade:**
```
Payload: "shopId:unitId"
Base64: btoa("shopId:unitId")
Exemplo: "loja-sp:unidade-01" → "bG9qYS1zcDp1bmlkYWRlLTAx"
```

## Implementação

### 1. Decodificação da URL

```typescript
// src/lib/api.ts

export function decodeRef(ref: string): { shopId: string; unitId?: string } {
  try {
    const decoded = atob(ref); // Decodifica base64
    const [shopId, unitId] = decoded.split(':'); // Separa por ":"
    return { shopId, unitId };
  } catch {
    throw new Error('Invalid reference');
  }
}
```

### 2. Armazenamento Local

Os valores são salvos em `localStorage` para persistir durante a sessão:

```typescript
// src/App.tsx (exemplo simplificado)

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref');
  
  if (ref) {
    const { shopId, unitId } = decodeRef(ref);
    localStorage.setItem('shopId', shopId);
    if (unitId) {
      localStorage.setItem('unitId', unitId);
    }
  }
}, []);
```

### 3. Header Automático nas Requisições

Todas as chamadas à API incluem automaticamente o header `X-Shop-Id`:

```typescript
// src/lib/api.ts

export const clientApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

clientApi.interceptors.request.use((config) => {
  const shopId = localStorage.getItem('shopId');
  if (shopId) {
    config.headers['X-Shop-Id'] = shopId;
  }
  return config;
});
```

## Fluxo de Dados

```
1. Cliente acessa URL com ?ref=base64
   ↓
2. App.tsx decodifica o parâmetro
   ↓
3. shopId e unitId são salvos no localStorage
   ↓
4. Todas as requisições incluem X-Shop-Id header
   ↓
5. Backend filtra dados pelo estabelecimento/unidade
   ↓
6. Cliente vê apenas serviços/profissionais relevantes
```

## Uso no Código

### Verificar se há referência válida

```typescript
const shopId = localStorage.getItem('shopId');
const unitId = localStorage.getItem('unitId');

if (!shopId) {
  // Redirecionar para página de erro ou solicitar link válido
}
```

### Filtrar por unidade

```typescript
// O backend já filtra automaticamente via X-Shop-Id header
// Mas você pode usar unitId para lógica adicional no frontend

const { data: services } = useQuery({
  queryKey: ['services', unitId],
  queryFn: () => serviceService.getAll(), // Já filtrado pelo backend
});
```

### Limpar referência (logout/reset)

```typescript
const clearReference = () => {
  localStorage.removeItem('shopId');
  localStorage.removeItem('unitId');
};
```

## Componentes Afetados

### Hooks que usam a referência

- `useServices` - Lista serviços do estabelecimento/unidade
- `useProfessionals` - Lista profissionais da unidade
- `useAvailableSlots` - Calcula horários disponíveis
- `useCreateAppointment` - Cria agendamento no estabelecimento

### Páginas que dependem da referência

- `BookingPage` - Fluxo principal de agendamento
- `AppointmentsPage` - Lista agendamentos do cliente
- Todas as páginas que fazem requisições à API

## Validação e Tratamento de Erros

### Link inválido ou expirado

```typescript
try {
  const { shopId, unitId } = decodeRef(ref);
  // Validar no backend se shop/unit existem
} catch (error) {
  // Mostrar mensagem de erro
  toast.error('Link de agendamento inválido');
  // Redirecionar para página de erro
}
```

### Estabelecimento inativo

```typescript
// Backend retorna 404 ou 403
// Interceptor de resposta trata o erro

clientApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 404) {
      toast.error('Estabelecimento não encontrado');
    }
    return Promise.reject(error);
  }
);
```

## Casos de Uso

### Cliente acessa link compartilhado

```
1. Admin gera link: ?ref=bG9qYS1zcDp1bmlkYWRlLTAx
2. Cliente clica no link do WhatsApp
3. App decodifica: shopId="loja-sp", unitId="unidade-01"
4. Cliente vê apenas serviços da Unidade 01
```

### Cliente sem link (acesso direto)

```
1. Cliente acessa site sem ?ref=
2. shopId não existe no localStorage
3. Mostrar página solicitando link válido
4. Ou redirecionar para página de seleção de estabelecimento
```

### Múltiplas unidades

```
1. Link com unitId específico
2. Serviços e profissionais filtrados por unidade
3. Horários calculados apenas para aquela unidade
```

## Segurança

- Base64 não é criptografia, apenas codificação
- IDs são públicos e podem ser decodificados facilmente
- Validação real deve acontecer no backend
- Não armazenar dados sensíveis no payload
- Backend deve verificar se shop/unit estão ativos

## Troubleshooting

### Serviços não aparecem
✓ Verificar se `X-Shop-Id` está no header da requisição
✓ Confirmar que shopId está no localStorage
✓ Validar se estabelecimento tem serviços cadastrados

### Link não funciona
✓ Verificar formato do base64
✓ Confirmar que shopId existe no backend
✓ Checar se estabelecimento está ativo

### Dados de outro estabelecimento aparecem
✓ Limpar localStorage
✓ Acessar URL com ?ref= correto novamente
✓ Verificar se interceptor está funcionando

## Variáveis de Ambiente

```env
# .env
VITE_API_URL=https://api.seusite.com
```

## Referências

- Implementação: `src/lib/api.ts`
- Uso: `src/App.tsx`
- Geração (Admin): `trinity-scheduler-admin/src/components/CopyBookingLink.tsx`

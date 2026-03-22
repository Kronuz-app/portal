# Product Overview

Trinity Scheduler Client é a aplicação mobile-first voltada para clientes finais realizarem agendamentos de serviços em estabelecimentos de beleza, saúde e bem-estar.

## Core Features

### Fluxo de Agendamento (Wizard Multi-Etapas)

O processo de agendamento é dividido em etapas guiadas:

1. **Seleção de Serviço**
   - Listagem de serviços disponíveis com preço e duração
   - Imagens e descrições dos serviços
   - Filtros por categoria (se aplicável)

2. **Escolha de Serviços Adicionais (Opcionais)**
   - Addons complementares ao serviço principal
   - Seleção múltipla
   - Cálculo automático de preço e duração total

3. **Seleção de Profissional**
   - Listagem de profissionais disponíveis
   - Opção "Sem preferência" (sistema escolhe automaticamente)
   - Avatar e nome do profissional

4. **Escolha de Data e Horário**
   - Calendário para seleção de data
   - Slots de horário disponíveis baseados em:
     - Horários de funcionamento da unidade
     - Disponibilidade do profissional
     - Agendamentos existentes
     - Duração total do serviço (principal + addons)
   - Visualização de horários ocupados/disponíveis

5. **Confirmação do Agendamento**
   - Resumo completo do agendamento
   - Serviço(s) selecionado(s)
   - Profissional escolhido
   - Data e horário
   - Preço total
   - Botão de confirmação

### Autenticação

- Autenticação simplificada via telefone
- Sem necessidade de senha
- Token JWT para sessão
- Criação automática de perfil de cliente no primeiro acesso
- Persistência de sessão em localStorage

### Gestão de Agendamentos

- **Visualização de Agendamentos**
  - Lista de agendamentos próximos
  - Histórico de agendamentos passados
  - Status visual (confirmado, concluído, cancelado)
  - Detalhes completos de cada agendamento

- **Detalhes do Agendamento**
  - Informações do serviço
  - Profissional responsável
  - Data e horário
  - Endereço da unidade
  - Preço total
  - Status atual

- **Cancelamento**
  - Opção de cancelar agendamentos futuros
  - Campo obrigatório de justificativa
  - Confirmação antes do cancelamento

### Integrações

- **Calendário**
  - Botão "Adicionar à agenda"
  - Geração de arquivo .ics
  - Compatível com Google Calendar, Apple Calendar, Outlook

- **Compartilhamento**
  - Links de agendamento via WhatsApp
  - Compartilhamento de detalhes do agendamento

### Sistema de Referência

- **URL com Referência**: `?ref=base64(shopId:unitId)`
  - Codificação base64 de shopId e unitId
  - Decodificação automática no carregamento
  - Armazenamento em localStorage

- **Slug-Based Routing**: `/:slug`
  - URLs amigáveis (ex: `/barbearia-centro`)
  - Resolução de slug para shopId/unitId via API
  - Melhor SEO e experiência do usuário

### Sistema de Skins (Temas)

- Temas customizáveis por estabelecimento
- Configuração de cores, fontes e branding
- SkinContext para acesso global ao tema
- Loading screen personalizado
- Suporte a múltiplos skins

### Multi-Unidade

- Suporte a estabelecimentos com múltiplas unidades
- Cada unidade tem:
  - Slug único para URL
  - Horários de funcionamento próprios
  - Profissionais específicos
  - Endereço e informações de contato

## User Experience

### Design Mobile-First

- Interface otimizada para smartphones
- Touch-friendly (botões e áreas clicáveis grandes)
- Navegação intuitiva
- Feedback visual imediato
- Animações suaves

### Fluxo Guiado

- Wizard passo a passo
- Indicador de progresso
- Botões "Voltar" e "Próximo"
- Validação em cada etapa
- Mensagens de erro claras

### Textos Configuráveis

- Todos os textos em `config/texts.json`
- Fácil tradução/localização
- Personalização por nicho/segmento
- Terminologia específica do negócio

### Performance

- Lazy loading de componentes
- Caching de dados com React Query
- Otimização de imagens
- Bundle splitting

## User Roles

O sistema é voltado para clientes finais que desejam:
- Agendar serviços online
- Gerenciar seus agendamentos
- Visualizar histórico
- Cancelar agendamentos quando necessário

Não há níveis de permissão - todos os usuários têm acesso às mesmas funcionalidades.

## Fluxo de Uso

1. Cliente acessa URL do estabelecimento (via slug ou ref)
2. Visualiza página inicial com informações do estabelecimento
3. Inicia processo de agendamento
4. Seleciona serviço, addons (opcional), profissional, data e horário
5. Faz login via telefone (se não autenticado)
6. Confirma agendamento
7. Recebe confirmação com detalhes
8. Pode adicionar à agenda
9. Pode visualizar/cancelar agendamentos posteriormente

## Language

A aplicação está em português (Brasil).

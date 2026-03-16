# Documento de Requisitos

## Introdução

Aplicação de agendamento voltada ao cliente final, permitindo que usuários agendem serviços de forma rápida e intuitiva. O nicho inicial é barbearia, mas a arquitetura deve suportar troca fácil de nicho (textos em JSON, cores via tokens Tailwind, componentes reutilizáveis). A autenticação é simplificada via número de telefone (sem senha). Não há backend real — os hooks registram dados via console.log (abordagem mock/stub). A stack é React, React Hook Form, Zod, React Query e Tailwind CSS.

## Glossário

- **App_Agendamento**: A aplicação React voltada ao cliente final para agendamento de serviços
- **Cliente**: O usuário final que acessa a aplicação para agendar serviços
- **Identificador_Cliente**: ID único retornado após autenticação por telefone, armazenado em localStorage
- **Servico**: Um serviço oferecido pelo estabelecimento (ex: corte, barba), com nome, duração e preço
- **Profissional**: O profissional que executa o serviço (ex: barbeiro)
- **Horario_Disponivel**: Um slot de tempo disponível para agendamento com um profissional específico
- **Agendamento**: O registro de um serviço agendado, contendo cliente, serviço, profissional, data e horário
- **Arquivo_Textos**: Arquivo JSON centralizado contendo todos os textos da aplicação, organizados por página/funcionalidade
- **Tokens_Tema**: Tokens de cores e tipografia definidos no Tailwind, que representam a identidade visual do nicho atual
- **Hook_Mock**: Hook React Query que registra operações via console.log em vez de realizar chamadas HTTP reais

## Requisitos

### Requisito 1: Autenticação por Telefone

**User Story:** Como cliente, eu quero me identificar usando meu número de telefone completo, para que eu possa acessar a aplicação sem precisar de senha.

#### Critérios de Aceitação

1. WHEN o Cliente informa um número de telefone válido (formato numérico, mínimo 10 dígitos), THE App_Agendamento SHALL retornar um Identificador_Cliente e armazená-lo em localStorage
2. WHEN o Cliente acessa a aplicação com um Identificador_Cliente presente em localStorage, THE App_Agendamento SHALL identificar o Cliente automaticamente sem solicitar o telefone novamente
3. WHEN o Cliente acessa a aplicação via URL contendo um Identificador_Cliente como parâmetro, THE App_Agendamento SHALL armazenar o Identificador_Cliente em localStorage e identificar o Cliente
4. IF o Cliente informa um número de telefone com formato inválido (não numérico ou menos de 10 dígitos), THEN THE App_Agendamento SHALL exibir uma mensagem de erro de validação descritiva
5. WHEN o Cliente solicita sair da aplicação, THE App_Agendamento SHALL remover o Identificador_Cliente do localStorage e redirecionar para a tela de identificação

### Requisito 2: Seleção de Serviço

**User Story:** Como cliente, eu quero visualizar e selecionar os serviços disponíveis, para que eu possa escolher o que desejo agendar.

#### Critérios de Aceitação

1. WHEN o Cliente acessa a etapa de seleção de serviço, THE App_Agendamento SHALL exibir a lista de Servicos disponíveis com nome, duração e preço de cada um
2. WHEN o Cliente seleciona um Servico, THE App_Agendamento SHALL registrar a seleção e avançar para a etapa de seleção de profissional
3. THE App_Agendamento SHALL exibir os Servicos em formato de cards visuais com ícone ou imagem representativa
4. WHILE a lista de Servicos está sendo carregada, THE App_Agendamento SHALL exibir um estado de carregamento (skeleton) para o Cliente

### Requisito 3: Seleção de Profissional

**User Story:** Como cliente, eu quero escolher o profissional que vai me atender, para que eu possa agendar com quem eu preferir.

#### Critérios de Aceitação

1. WHEN o Cliente acessa a etapa de seleção de profissional, THE App_Agendamento SHALL exibir a lista de Profissionais disponíveis com nome e foto
2. WHEN o Cliente seleciona um Profissional, THE App_Agendamento SHALL registrar a seleção e avançar para a etapa de seleção de data e horário
3. THE App_Agendamento SHALL oferecer a opção "Sem preferência" que permite ao sistema atribuir um Profissional disponível automaticamente
4. WHILE a lista de Profissionais está sendo carregada, THE App_Agendamento SHALL exibir um estado de carregamento (skeleton) para o Cliente

### Requisito 4: Seleção de Data e Horário

**User Story:** Como cliente, eu quero escolher a data e o horário do meu atendimento, para que eu possa agendar no momento mais conveniente.

#### Critérios de Aceitação

1. WHEN o Cliente acessa a etapa de seleção de data, THE App_Agendamento SHALL exibir um calendário com os próximos 30 dias disponíveis para agendamento
2. WHEN o Cliente seleciona uma data, THE App_Agendamento SHALL exibir os Horarios_Disponiveis para o Profissional selecionado naquela data
3. WHEN o Cliente seleciona um Horario_Disponivel, THE App_Agendamento SHALL registrar a seleção e avançar para a etapa de confirmação
4. THE App_Agendamento SHALL desabilitar visualmente datas sem Horarios_Disponiveis no calendário
5. THE App_Agendamento SHALL exibir os Horarios_Disponiveis em formato de grade com slots de tempo claramente identificados
6. WHILE os Horarios_Disponiveis estão sendo carregados, THE App_Agendamento SHALL exibir um estado de carregamento (skeleton) para o Cliente

### Requisito 5: Confirmação e Criação do Agendamento

**User Story:** Como cliente, eu quero revisar e confirmar meu agendamento antes de finalizá-lo, para que eu tenha certeza de que os dados estão corretos.

#### Critérios de Aceitação

1. WHEN o Cliente acessa a etapa de confirmação, THE App_Agendamento SHALL exibir um resumo com Servico selecionado, Profissional, data, horário e preço
2. WHEN o Cliente confirma o agendamento, THE App_Agendamento SHALL criar o Agendamento via Hook_Mock (registrando os dados via console.log) e exibir uma tela de sucesso
3. WHEN o Cliente deseja alterar algum dado antes de confirmar, THE App_Agendamento SHALL permitir navegação de volta às etapas anteriores mantendo as seleções já feitas
4. IF a criação do Agendamento falha, THEN THE App_Agendamento SHALL exibir uma mensagem de erro e permitir que o Cliente tente novamente
5. WHEN o agendamento é criado com sucesso, THE App_Agendamento SHALL exibir a tela de sucesso com os detalhes do Agendamento e opção de agendar novamente

### Requisito 6: Visualização de Agendamentos do Cliente

**User Story:** Como cliente, eu quero ver meus agendamentos futuros e passados, para que eu possa acompanhar meu histórico.

#### Critérios de Aceitação

1. WHEN o Cliente acessa a tela de agendamentos, THE App_Agendamento SHALL exibir a lista de Agendamentos do Cliente separados em "Próximos" e "Anteriores"
2. THE App_Agendamento SHALL exibir para cada Agendamento o Servico, Profissional, data, horário e status
3. WHEN o Cliente seleciona um Agendamento futuro, THE App_Agendamento SHALL exibir opções de cancelamento
4. WHILE a lista de Agendamentos está sendo carregada, THE App_Agendamento SHALL exibir um estado de carregamento (skeleton) para o Cliente

### Requisito 7: Cancelamento de Agendamento

**User Story:** Como cliente, eu quero cancelar um agendamento futuro, para que eu possa desistir caso não possa comparecer.

#### Critérios de Aceitação

1. WHEN o Cliente solicita cancelar um Agendamento futuro, THE App_Agendamento SHALL exibir um diálogo de confirmação antes de efetuar o cancelamento
2. WHEN o Cliente confirma o cancelamento, THE App_Agendamento SHALL cancelar o Agendamento via Hook_Mock (registrando via console.log) e atualizar a lista de agendamentos
3. IF o cancelamento falha, THEN THE App_Agendamento SHALL exibir uma mensagem de erro e manter o Agendamento inalterado

### Requisito 8: Arquitetura de Reusabilidade por Nicho

**User Story:** Como desenvolvedor, eu quero que a aplicação seja facilmente adaptável a diferentes nichos de negócio, para que eu possa reutilizar a base de código.

#### Critérios de Aceitação

1. THE App_Agendamento SHALL carregar todos os textos exibidos ao Cliente a partir do Arquivo_Textos (JSON), organizado por página e funcionalidade
2. THE App_Agendamento SHALL definir todas as cores da interface via Tokens_Tema no Tailwind, sem cores hardcoded nos componentes
3. THE App_Agendamento SHALL organizar componentes de UI como módulos reutilizáveis, separados da lógica de negócio
4. WHEN um desenvolvedor altera o Arquivo_Textos e os Tokens_Tema, THE App_Agendamento SHALL refletir o novo nicho sem alterações em componentes React
5. THE App_Agendamento SHALL utilizar um arquivo de configuração de nicho que define o nome do estabelecimento, logo e metadados do nicho atual

### Requisito 9: Interface Premium e Responsiva

**User Story:** Como cliente, eu quero uma interface bonita e fluida no celular, para que a experiência de agendamento seja agradável.

#### Critérios de Aceitação

1. THE App_Agendamento SHALL renderizar corretamente em telas de 320px a 1440px de largura
2. THE App_Agendamento SHALL priorizar o layout mobile-first, com a experiência principal otimizada para smartphones
3. THE App_Agendamento SHALL utilizar animações e transições suaves entre as etapas do fluxo de agendamento
4. THE App_Agendamento SHALL utilizar tipografia e espaçamento consistentes definidos nos Tokens_Tema
5. THE App_Agendamento SHALL exibir feedback visual (loading, sucesso, erro) para todas as ações do Cliente

### Requisito 10: Hooks Mock sem Backend

**User Story:** Como desenvolvedor, eu quero que os hooks funcionem sem backend real, para que eu possa desenvolver e testar a interface de forma independente.

#### Critérios de Aceitação

1. THE App_Agendamento SHALL implementar todos os hooks de dados usando React Query com funções que registram operações via console.log
2. THE App_Agendamento SHALL retornar dados mock realistas nos hooks de consulta (serviços, profissionais, horários, agendamentos)
3. THE App_Agendamento SHALL simular latência de rede (delay configurável) nos hooks para testar estados de carregamento
4. WHEN um hook de mutação é chamado (criar agendamento, cancelar), THE App_Agendamento SHALL registrar os dados completos via console.log e retornar uma resposta mock de sucesso
5. THE App_Agendamento SHALL manter os dados mock em arquivos separados, organizados por entidade (serviços, profissionais, horários, agendamentos)

### Requisito 11: Validação de Formulários

**User Story:** Como cliente, eu quero que os formulários validem meus dados em tempo real, para que eu saiba imediatamente se algo está errado.

#### Critérios de Aceitação

1. THE App_Agendamento SHALL validar o campo de telefone usando esquema Zod integrado com React Hook Form
2. WHEN o Cliente submete um formulário com dados inválidos, THE App_Agendamento SHALL exibir mensagens de erro específicas por campo, carregadas do Arquivo_Textos
3. THE App_Agendamento SHALL validar dados no momento da interação do Cliente (on blur ou on change) sem aguardar submissão do formulário
4. THE App_Agendamento SHALL desabilitar o botão de submissão enquanto o formulário contiver erros de validação

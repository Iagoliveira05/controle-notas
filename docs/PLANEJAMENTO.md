# Planejamento — Controle de Gastos por Comprovantes

**Atualizado em:** 18/10/2026
**Estado atual:** Fase 4, com cadastro de cartões, ciclo centralizado e filtros de histórico implementados. A próxima pendência é associar gastos a cartões e testar os ciclos.

## Regras de execução

- Ler `/docs` e `AGENTS.md` antes de cada fase.
- Trabalhar em etapas pequenas e atualizar `PROGRESSO.md` após cada etapa significativa.
- Não marcar tarefa como concluída sem implementação e validação real.
- Priorizar custo zero e preservar o projeto existente.

## Fase 0 — Inspeção e documentação

- [x] `T001` Inspecionar estrutura, `package.json` e configurações.
- [x] `T002` Verificar React, TypeScript, Vite e Tailwind instalados.
- [x] `T003` Criar/revisar os documentos de `/docs`.
- [x] `T004` Criar/revisar `AGENTS.md`.
- [x] `T005` Registrar estado inicial real em `PROGRESSO.md`.

## Fase 1 — Fundação

- [ ] `T010` Ajustar apenas dependências necessárias.
- [ ] `T011` Criar estrutura por responsabilidade.
- [x] `T012` Implementar layout responsivo e navegação.
- [ ] `T013` Centralizar formatação BRL, datas e validações.

Observação: a validação básica está em `src/utils/validators.ts`; T010, T011 e T013 permanecem abertas até a cobertura final e testes automatizados.

## Fase 2 — Modelo, Firebase e segurança

- [x] `T020` Definir tipos TypeScript para gasto, cartão e categoria.
- [x] `T021` Criar camada de persistência.
- [x] `T022` Configurar variáveis de ambiente sem segredos privados.
- [x] `T023` Preparar e publicar regras de segurança do Firestore.
- [x] `T024` Documentar configuração manual do Firebase e cotas gratuitas.
- [x] `T025` Mostrar estado claro quando Firebase não estiver configurado.

## Fase 3 — Cadastro e OCR

- [x] `T030` Implementar cadastro manual.
- [x] `T031` Implementar seleção e prévia de imagem.
- [x] `T032` Integrar OCR local e análise automática via Firebase AI Logic.
- [x] `T033` Interpretar valores e datas brasileiras.
- [x] `T034` Implementar revisão e edição dos dados extraídos.
- [x] `T035` Implementar salvamento e tratamento de erros.
- [x] `T036` Implementar edição e exclusão.

## Fase 4 — Cartões e períodos

- [x] `T040` Implementar cadastro e edição de cartões.
- [x] `T041` Implementar função central para ciclo da fatura em `src/utils/billingCycle.ts`.
- [x] `T042` Implementar histórico por intervalo de datas.
- [ ] `T043` Implementar filtro por cartão; filtros por categoria, pagamento e período já estão disponíveis.
- [ ] `T044` Testar fechamento no último dia, fevereiro, virada de ano e compra no dia de fechamento.

Próxima etapa: adicionar `cardId` aos gastos e testar a associação entre gasto, cartão e ciclo.

## Fase 5 — Dashboard

- [ ] `T050` Implementar totais do período.
- [ ] `T051` Implementar compras recentes.
- [ ] `T052` Implementar agrupamento por categoria.
- [ ] `T053` Implementar comparação com período anterior, se houver dados.
- [ ] `T054` Implementar estados vazios e gastos pendentes de revisão.

## Fase 6 — Testes e qualidade

- [ ] `T060` Criar testes unitários das regras de negócio.
- [ ] `T061` Criar testes dos fluxos principais de interface.
- [x] `T062` Executar verificação de tipos via `npm run build`.
- [ ] `T063` Executar testes automatizados; o projeto ainda não possui script `test`.
- [x] `T064` Executar build de produção.
- [x] `T065` Corrigir falhas e registrar resultados reais.

## Fase 7 — Entrega

- [ ] `T070` Revisar segurança e custo zero.
- [ ] `T071` Atualizar documentos.
- [ ] `T072` Finalizar instruções de execução local.
- [x] `T073` Documentar publicação gratuita e limites.
- [ ] `T074` Apresentar resumo final de entrega e pendências.

## Gestão de mudanças

Quando uma decisão técnica alterar o escopo, registrar a justificativa em `ARQUITETURA.md`, atualizar `REQUISITOS.md`, ajustar as tarefas e registrar impacto e próxima ação em `PROGRESSO.md`.

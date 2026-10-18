# Planejamento — Controle de Gastos por Comprovantes

## Regras de execução
- Ler `/docs` e `AGENTS.md` antes de cada fase.
- Trabalhar em etapas pequenas.
- Atualizar `PROGRESSO.md` após cada etapa significativa.
- Não marcar tarefa como concluída sem implementação e validação.
- Priorizar custo zero e preservar o projeto existente.

## Fase 0 — Inspeção e documentação
- [x] `T001` Inspecionar estrutura, `package.json` e configurações.
- [x] `T002` Verificar React, TypeScript, Vite e Tailwind instalados.
- [x] `T003` Criar/revisar os documentos de `/docs`.
- [x] `T004` Criar/revisar `AGENTS.md`.
- [x] `T005` Registrar estado inicial real em `PROGRESSO.md`.

**Conclusão:** documentação coerente e estado do repositório registrado.

## Fase 1 — Fundação
- [ ] `T010` Ajustar apenas dependências necessárias.
- [ ] `T011` Criar estrutura por responsabilidade.
- [ ] `T012` Implementar layout responsivo e navegação.
- [ ] `T013` Centralizar formatação BRL, datas e validações.

Observação: a validação básica do formulário já está centralizada em `src/utils/validators.ts`; a tarefa permanece aberta até cobrir o modelo final em centavos e testes automatizados.

**Conclusão:** aplicação inicia e compila; layout básico funciona em celular e desktop.

## Fase 2 — Modelo, Firebase e segurança
- [x] `T020` Definir tipos TypeScript para gasto, cartão e categoria.
- [x] `T021` Criar camada de persistência.
- [x] `T022` Configurar variáveis de ambiente sem segredos privados.
- [x] `T023` Preparar regras de segurança do Firestore.
- [x] `T024` Documentar configuração manual do Firebase e cotas gratuitas.
- [x] `T025` Mostrar estado claro quando Firebase não estiver configurado.

**Conclusão:** persistência validada ou bloqueios documentados; acesso isolado por usuário.

## Fase 3 — Cadastro e OCR
- [x] `T030` Implementar cadastro manual.
- [x] `T031` Implementar seleção e prévia de imagem.
- [ ] `T032` Integrar OCR local.
- [ ] `T033` Interpretar valores e datas brasileiras.
- [ ] `T034` Implementar revisão e edição dos dados extraídos.
- [ ] `T035` Implementar salvamento e tratamento de erros.
- [ ] `T036` Implementar edição e exclusão.

**Conclusão:** cadastro manual e por imagem funcionam sem API paga.

## Fase 4 — Cartões e períodos
- [ ] `T040` Implementar cadastro e edição de cartões.
- [ ] `T041` Implementar uma função central para ciclo da fatura.
- [ ] `T042` Implementar histórico mensal e por intervalo.
- [ ] `T043` Implementar filtros por cartão, categoria e pagamento.
- [ ] `T044` Testar fechamento no último dia, fevereiro, virada de ano e compra no dia de fechamento.

**Conclusão:** filtros e faturas seguem regra documentada e testada.

## Fase 5 — Dashboard
- [ ] `T050` Implementar totais do período.
- [ ] `T051` Implementar compras recentes.
- [ ] `T052` Implementar agrupamento por categoria.
- [ ] `T053` Implementar comparação com período anterior, se houver dados.
- [ ] `T054` Implementar estados vazios e gastos pendentes de revisão.

**Conclusão:** indicadores derivam de dados reais.

## Fase 6 — Testes e qualidade
- [ ] `T060` Criar testes unitários das regras de negócio.
- [ ] `T061` Criar testes dos fluxos principais de interface.
- [ ] `T062` Executar verificação de tipos.
- [ ] `T063` Executar testes.
- [ ] `T064` Executar build de produção.
- [ ] `T065` Corrigir falhas e registrar resultados reais.

## Fase 7 — Entrega
- [ ] `T070` Revisar segurança e custo zero.
- [ ] `T071` Atualizar documentos.
- [ ] `T072` Finalizar instruções de execução local.
- [ ] `T073` Documentar publicação gratuita e limites.
- [ ] `T074` Apresentar resumo de entrega e pendências.

## Gestão de mudanças
Se uma decisão técnica alterar o escopo:
1. Registrar justificativa em `ARQUITETURA.md`.
2. Atualizar `REQUISITOS.md` se o comportamento esperado mudar.
3. Atualizar tarefas e dependências neste documento.
4. Registrar impacto e próxima ação em `PROGRESSO.md`.

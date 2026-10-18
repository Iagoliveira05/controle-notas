# Progresso — Controle de Gastos por Comprovantes

**Atualizado em:** 2026-10-18

## Estado atual

O projeto está na Fase 3. A aplicação possui interface responsiva refatorada, cadastro manual, filtros, exclusão local, seleção de imagem/câmera e análise automática com Gemini via Firebase AI Logic.

O SDK Firebase, autenticação por e-mail/senha, persistência Firestore por usuário e regras publicadas foram implementados. O OCR local usa Tesseract.js; interpretação automática de campos ainda não foi implementada.

## Resumo por fase

| Fase                       | Estado               | Situação real                                                                                    |
| -------------------------- | -------------------- | ------------------------------------------------------------------------------------------------ |
| 0. Inspeção e documentação | Concluída            | Repositório, stack e documentos revisados.                                                       |
| 1. Fundação                | Em andamento         | Layout, navegação e validação básica prontas; falta concluir testes e modelo em centavos.        |
| 2. Firebase e segurança    | Quase concluída      | Login, persistência e regras publicadas; falta validar fluxo completo com conta real. |
| 3. Cadastro e OCR          | Em andamento          | Imagem, prévia e OCR local implementados; faltam interpretação e revisão estruturada dos campos. |
| 4. Cartões e períodos      | Não iniciada         | Tela de cartões é apenas informativa.                                                            |
| 5. Dashboard               | Parcial              | Totais básicos existem; indicadores completos ainda não.                                         |
| 6. Testes e qualidade      | Parcial              | Lint, TypeScript e build passam; não há testes automatizados.                                    |
| 7. Entrega                 | Parcial              | Publicado na Vercel, com Deployment Protection ativa.                                            |

## Tarefas concluídas

- `T001–T005`: inspeção da estrutura, `package.json`, stack e documentação.
- `T012`: layout e navegação básicos.
- Validação inicial do formulário em `src/utils/validators.ts`.
- Publicação do projeto Vercel `controle-notas`.
- Seleção de imagem pela galeria e captura pela câmera em dispositivos compatíveis.
- Prévia local da imagem, sem upload externo e sem persistência automática.
- Camada inicial Firebase em `src/lib/firebase.ts`, com configuração ausente detectada explicitamente.
- Regras Firestore em `firestore.rules`, restringindo dados ao UID autenticado.
- Configuração Web aplicada localmente e na produção Vercel; nenhum segredo administrativo foi usado.
- Login e cadastro por e-mail/senha em `src/components/AuthForm.tsx`.
- Gastos autenticados persistidos em `users/{uid}/expenses`, com `amountCents`.
- OCR local com Tesseract.js em `src/services/ocrService.ts`, com progresso, ampliação, escala de cinza e contraste.
- Interpretador heurístico em `src/services/receiptParser.ts` para total, data e primeira linha provável do estabelecimento.
- Ação explícita para aplicar sugestões ao formulário, mantendo todos os campos editáveis.
- Modal de cadastro reorganizado para telas pequenas e grandes, com prévia e bloco visual de sugestões.

## Tarefas pendentes principais

- Configurar Firebase Authentication e Firestore com variáveis `VITE_*`.
- Habilitar/verificar o provedor E-mail/Senha e testar login/gravação com conta real.
- Criar regras Firestore que isolem os dados por usuário.
- Migrar valores para centavos inteiros.
- Interpretar valores e datas brasileiras sem assumir que o maior número é o total.
- Testar o interpretador com comprovantes reais e variados; a heurística permanece sujeita a revisão manual.
- Ajustar o OCR para layouts específicos após coletar exemplos reais de comprovantes, sem enviar imagens para serviços externos.
- Confirmar App Check ativo no console e testar Gemini com comprovantes reais, quotas e imagens ilegíveis.
- Validar visualmente o novo fluxo em celular e desktop com conta Firebase real.
- Revisar e salvar os campos extraídos pelo OCR.
- Implementar cartões, ciclos de fatura, edição de gastos e filtros completos.
- Criar testes unitários e de interface.

## Validações executadas

| Comando             | Resultado                                                                         |
| ------------------- | --------------------------------------------------------------------------------- |
| `npm run lint`      | Passou sem erros.                                                                 |
| `npm run build`     | Passou; TypeScript e build Vite concluídos.                                       |
| `npm run test`      | Não disponível; não existe script de testes.                                      |
| `vercel curl`       | HTML da aplicação confirmado com bypass da proteção Vercel.                       |
| `npx vercel --prod` | Nova versão com captura/galeria publicada e pronta; alias de produção preservado. |
| `npm install firebase` | SDK instalado; npm reportou avisos de engine para Node 22 e vulnerabilidades na árvore, a avaliar antes da entrega. |
| `npx vercel --prod` | Nova versão com variáveis Firebase de produção publicada; alias preservado. |
| `npm run lint` | Passou após a implementação de autenticação e persistência. |
| `npm run build` | Passou; o Vite emitiu aviso de chunk acima de 500 kB. |
| `npm run lint` | Passou após o pré-processamento de imagem e melhoria visual do formulário. |
| `npx firebase-tools deploy --only firestore:rules --project ontrole-db60e` | Regras compiladas e publicadas com sucesso em `cloud.firestore`. |
| `npm run lint` | Passou após o interpretador OCR e revisão de sugestões. |
| `npm run lint` | Passou após a integração Firebase AI Logic/Gemini. |
| `npm run build` | Passou; bundle inclui `firebase/ai` e emitiu aviso de chunk acima de 500 kB. |
| `npm run build` | Passou; o Vite emitiu aviso de chunk acima de 500 kB. |

## Publicação

- Projeto: `controle-notas`
- URL: <https://controle-notas-psi.vercel.app>
- Estado: publicado, com Deployment Protection ativa na conta Vercel.

## Próxima etapa

Configurar a conexão segura com o Firebase criado pelo responsável, sem adicionar credenciais privadas ao frontend. Depois disso, implementar persistência autenticada antes de ativar OCR e armazenamento de dados derivados da imagem.

## Riscos e limites conhecidos

## Ajuste de layout e T041 — ciclo de fatura

- Modal de cadastro corrigido para rolagem interna estável em zoom e telas pequenas, com `100dvh`, safe-area e prevenção de rolagem concorrente.
- Criada `getBillingCycle` em `src/utils/billingCycle.ts`, centralizando início, fechamento e vencimento do ciclo, inclusive meses curtos e virada de ano.
- `npm run lint` e `npm run build` passaram; permanece apenas o aviso conhecido de bundle acima de 500 kB.

## Fase 4 — cartões: T040

- Cadastro, edição e exclusão de cartões implementados.
- Campos: nome, instituição, dia de fechamento e dia de vencimento.
- Persistência em `users/{uid}/cards` no Firestore; modo local usa `localStorage` identificado pela aplicação.
- `npm run lint` e `npm run build` passaram; o build mantém apenas o aviso conhecido de bundle acima de 500 kB.

## T036 — edição e exclusão

- A lista agora oferece edição e exclusão com confirmação.
- A edição atualiza Firestore com `updatedAt` quando autenticado e atualiza o `localStorage` no modo local.
- Totais e filtros são recalculados a partir da lista atualizada.
- `npm run lint` e `npm run build` passaram após a implementação.

## Ajuste do reconhecimento Gemini

- O prompt agora exige portugues do Brasil, rotulos locais de pagamento e data no formato `YYYY-MM-DD`.
- A interface tambem converte `YYYY/MM/DD` e reconhece `credit_card`/`debit_card` como formas de pagamento locais.
- `npm run lint` e `npm run build` passaram apos o ajuste.

## T035 — salvamento e erros

- O salvamento aguarda a persistÃªncia assÃ­ncrona, evita duplo envio e informa erro ao usuÃ¡rio quando a gravaÃ§Ã£o falha.
- `npm run lint` passou.
- `npm run build` passou; permanece apenas o aviso conhecido de bundle acima de 500 kB.

## Atualização da etapa atual — 18/10/2026

- O reconhecimento do Gemini agora aplica automaticamente os campos reconhecidos ao formulário.
- Categoria e forma de pagamento são normalizadas contra as opções disponíveis, incluindo cartão de débito e combustível.
- Datas em `DD/MM/AAAA`, `DD-MM-AAAA` e `AAAA-MM-DD` são convertidas para o formato aceito pelo campo de data e validadas como datas reais.
- `npm run lint` e `npm run build` passaram após a correção.
- O commit anterior havia sido enviado antes da validação final e o deploy correspondente falhou no TypeScript; a correção foi publicada no commit `a9d8893` e no alias de produção da Vercel.

- A foto selecionada é descartada ao fechar o formulário; ela ainda não é salva.
- `capture="environment"` depende do navegador e do dispositivo; em desktop normalmente abre o seletor de arquivos.
- O Firebase criado no console não significa que a aplicação já está conectada.
- A proteção da Vercel pode impedir visitantes não autenticados de verem a aplicação.
- Cotas gratuitas e armazenamento de imagens precisam ser confirmados antes de ativação.

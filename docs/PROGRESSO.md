# Progresso — Controle de Gastos por Comprovantes

**Atualizado em:** 2026-10-18

## Estado atual

O projeto está no início da Fase 2 (Firebase), com a fundação da Fase 1 ainda parcialmente aberta. A aplicação já possui interface responsiva, navegação, cadastro manual, filtros e exclusão local. A seleção de imagem/câmera foi adicionada nesta etapa e exibe uma prévia local.

O SDK Firebase, o arquivo `.env.example` e as regras Firestore foram adicionados. As configurações Web foram aplicadas em `.env.local` e nas variáveis de produção da Vercel. Autenticação por e-mail/senha e persistência Firestore por usuário foram implementadas; a publicação das regras no projeto Firebase ainda depende do CLI/autorização do ambiente.

## Resumo por fase

| Fase                       | Estado               | Situação real                                                                                    |
| -------------------------- | -------------------- | ------------------------------------------------------------------------------------------------ |
| 0. Inspeção e documentação | Concluída            | Repositório, stack e documentos revisados.                                                       |
| 1. Fundação                | Em andamento         | Layout, navegação e validação básica prontas; falta concluir testes e modelo em centavos.        |
| 2. Firebase e segurança    | Em andamento         | SDK, variáveis, aviso de configuração e regras versionadas; falta autenticação, persistência e teste das regras. |
| 3. Cadastro e OCR          | Em andamento inicial | Cadastro manual existe; imagem pode ser escolhida/capturada e visualizada; OCR ainda não existe. |
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

## Tarefas pendentes principais

- Configurar Firebase Authentication e Firestore com variáveis `VITE_*`.
- Publicar `firestore.rules` e habilitar/verificar o provedor E-mail/Senha no console Firebase.
- Criar regras Firestore que isolem os dados por usuário.
- Migrar valores para centavos inteiros.
- Integrar OCR local, preferencialmente Tesseract.js.
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

## Publicação

- Projeto: `controle-notas`
- URL: <https://controle-notas-psi.vercel.app>
- Estado: publicado, com Deployment Protection ativa na conta Vercel.

## Próxima etapa

Configurar a conexão segura com o Firebase criado pelo responsável, sem adicionar credenciais privadas ao frontend. Depois disso, implementar persistência autenticada antes de ativar OCR e armazenamento de dados derivados da imagem.

## Riscos e limites conhecidos

- A foto selecionada é descartada ao fechar o formulário; ela ainda não é salva.
- `capture="environment"` depende do navegador e do dispositivo; em desktop normalmente abre o seletor de arquivos.
- O Firebase criado no console não significa que a aplicação já está conectada.
- A proteção da Vercel pode impedir visitantes não autenticados de verem a aplicação.
- Cotas gratuitas e armazenamento de imagens precisam ser confirmados antes de ativação.

# Arquitetura — Controle de Gastos por Comprovantes

## 1. Princípios
- Custo zero obrigatório.
- OCR local sempre que viável.
- Separação entre interface, regras de negócio, OCR e persistência.
- TypeScript consistente.
- Documentação sincronizada com o código.
- Nenhum segredo privado no frontend.

## 2. Stack prevista
- React + TypeScript.
- Vite, se compatível com a configuração existente.
- Tailwind CSS, respeitando a versão instalada.
- Firebase Authentication para identidade, quando configurado.
- Cloud Firestore para dados estruturados.
- Tesseract.js ou alternativa open source para OCR local.
- React Router se a navegação justificar.
- Lucide React para ícones.
- Vitest e React Testing Library, se compatíveis.

Estado atualizado em 2026-10-18: React 19, TypeScript 6, Vite 8, CSS próprio e SDK Firebase instalado. A configuração usa somente variáveis `VITE_*`; sem elas, a aplicação permanece explicitamente em modo local. Autenticação e persistência ainda não foram conectadas à interface.

## 3. Estrutura sugerida

Adaptar à estrutura existente; não criar arquivos vazios só para seguir a árvore.

```text
src/
  app/
  components/
    ui/
    layout/
    feedback/
  features/
    auth/
    expenses/
    receipts/
    cards/
    dashboard/
    history/
  hooks/
  lib/
    firebase.ts
    formatters.ts
    validators.ts
  services/
    expenseService.ts
    cardService.ts
    ocrService.ts
  domain/
    expense.ts
    card.ts
    billingCycle.ts
  test/
docs/
```

A estrutura atual ainda é menor: `components/`, `hooks/`, `data/`, `types/` e `utils/`, com `App.tsx` coordenando a tela. A expansão será incremental.

## 4. Responsabilidades

- **Interface:** páginas, componentes, formulários, carregamento, erros e acessibilidade.
- **Domínio:** tipos, validações, formatação e cálculo determinístico das faturas.
- **OCR/IA:** recebe imagem local somente após ação explícita, usa Tesseract local ou Firebase AI Logic/Gemini, valida a resposta e sugere campos; não salva automaticamente.
- **Serviços de aplicação:** coordenam validação, criação, edição, exclusão e consultas.
- **Persistência:** encapsula chamadas ao Firebase; evitar consultas Firestore espalhadas pelos componentes.

## 5. Fluxo por imagem
1. Usuário seleciona ou captura imagem.
2. Aplicação mostra a prévia local e inicia automaticamente a análise Gemini.
3. A interface mostra carregamento, sucesso ou falha.
4. Gemini sugere estabelecimento, data, total, categoria e pagamento quando identificáveis.
5. A interface lista campos encontrados e ausentes; usuário revisa e corrige os campos.
6. Aplicação valida os dados.
7. Registro é persistido.
8. Histórico e indicadores são atualizados.

Se o OCR falhar, permitir cadastro manual.

## 6. Estratégia de OCR
- Executar OCR no navegador com Tesseract.js ou alternativa equivalente. Implementado em `src/services/ocrService.ts` com idioma português, progresso e pré-processamento local (ampliação, escala de cinza e contraste).
- Não enviar imagens ou texto para APIs externas.
- Interpretar valores brasileiros como `1.234,56`.
- Distinguir total, subtotal, desconto, troco e valor recebido.
- Não presumir que o maior valor numérico é o total.
- Sinalizar campos incertos. O texto reconhecido é apresentado para revisão e não preenche campos automaticamente.
- Testar com comprovantes diversos e documentar limitações.
- A precisão continua dependente de foco, iluminação, perspectiva, resolução e layout do comprovante; nenhuma implementação local garante leitura perfeita.

## 7. Firebase
- Ler configuração do cliente por variáveis `VITE_*`.
- Configuração pública do Firebase não substitui regras de segurança.
- Nunca incluir service-account keys ou segredos administrativos no frontend.
- A integração Gemini usa Firebase AI Logic com Gemini Developer API; não há chave Gemini no código. Firebase App Check deve permanecer ativo em produção.
- Isolar dados por usuário autenticado.
- Se faltar configuração, mostrar mensagem explícita.
- Considerar Firebase Emulator Suite para testes locais.

## 8. Imagens e custo zero
Não presumir que Firebase Storage está disponível sem custo na configuração escolhida.

Avaliar nesta ordem:
1. Processar a imagem e persistir somente os campos revisados.
2. Permitir ao usuário manter/baixar a imagem localmente.
3. Usar armazenamento em nuvem apenas se as condições gratuitas forem confirmadas e as regras de acesso estiverem configuradas.

Não usar `localStorage` como substituto silencioso da nuvem. Se houver modo de demonstração local, identificá-lo claramente.

## 9. Qualidade
- O layout usa um container flex com `min-width: 0`; a barra lateral permanece em viewport própria (`position: sticky`) e o conteúdo controla o overflow horizontal.
- O historico aplica filtros locais por texto, categoria, forma de pagamento e intervalo civil `YYYY-MM-DD`, evitando consultas extras ao Firestore.
- Validar antes de persistir.
- Tratar falhas de rede e permissão.
- Evitar logs de dados financeiros e documentos completos.
- Testar cálculos de fatura fora da interface.
- Executar testes, verificação de tipos e build.
- Registrar resultados reais em `PROGRESSO.md`.

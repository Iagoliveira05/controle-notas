# Requisitos — Controle de Gastos por Comprovantes

**Versão:** 1.0  
**Status:** Requisitos iniciais; validar durante a inspeção do repositório.  
**Restrição principal:** custo zero obrigatório.

## 1. Objetivo

Criar uma aplicação web responsiva para registrar gastos por fotos de notas fiscais, cupons e comprovantes. A aplicação deve tentar extrair automaticamente as informações, permitir revisão manual e oferecer histórico por mês, fatura ou período personalizado.

## 2. Premissas iniciais

- O projeto React já existe e `/docs` está criada.
- A senha inicialmente solicitada é `teste123`; isso não torna seguro validar a senha apenas no frontend.
- O OCR deve funcionar localmente no navegador, sem APIs pagas.
- Dados estruturados podem ser persistidos no Firebase/Firestore, dentro das condições gratuitas disponíveis.
- O armazenamento permanente de fotos não deve ser assumido até que sua disponibilidade sem custo seja verificada.
- O suporte a vários cartões é previsto, mas a interface deve continuar simples.

Essas premissas devem ser confirmadas ou atualizadas conforme o projeto evoluir.

## 3. Requisitos funcionais

### RF-01 — Acesso
- Disponibilizar tela de acesso.
- Considerar `teste123` como senha inicial solicitada.
- Não usar uma verificação somente no React como proteção real dos dados.
- Preferir autenticação real e regras de acesso no Firebase.
- Nunca expor credenciais administrativas no frontend.

### RF-02 — Cadastro manual
- Permitir cadastrar gasto sem imagem.
- Exigir descrição/estabelecimento, valor válido e data da compra.
- Permitir categoria, forma de pagamento e cartão opcionais.

### RF-03 — Captura e OCR
- Permitir selecionar uma imagem e, quando suportado, abrir a câmera.
- Mostrar prévia antes do processamento.
- Executar OCR local com Tesseract.js ou alternativa open source equivalente.
- Tentar identificar estabelecimento, data e valor total.
- Não enviar imagens para APIs externas pagas.
- Exibir progresso, erros e opção de tentar novamente.
- Não salvar dados inferidos sem revisão do usuário.

### RF-04 — Revisão
- Mostrar campos reconhecidos em formulário editável.
- Sinalizar informações ausentes ou incertas.
- Permitir corrigir os campos antes de salvar.
- Não inventar informações quando o OCR falhar.

### RF-05 — Gestão dos gastos
- Criar, consultar, editar e excluir gastos.
- Confirmar antes de excluir.
- Recalcular totais após alterações.
- Armazenar valores em centavos inteiros para evitar erros de ponto flutuante.

### RF-06 — Categorias
Categorias iniciais: Alimentação, Mercado, Transporte, Combustível, Saúde, Educação, Moradia, Lazer, Compras, Serviços e Outros. O usuário pode corrigir a categoria sugerida.

### RF-07 — Cartões e faturas
- Permitir cadastrar cartões com nome, dia de fechamento e vencimento.
- Associar gasto a um cartão ou deixá-lo sem cartão.
- Consultar por ciclo de fatura, mês calendário e intervalo personalizado.
- Documentar a regra para compras no dia de fechamento.
- Tratar fevereiro, meses curtos e virada de ano.

### RF-08 — Histórico
- Filtrar por período, cartão, categoria e forma de pagamento.
- Buscar por estabelecimento ou descrição.
- Ordenar por data e valor.
- Exibir total e quantidade de compras.
- Mostrar estado vazio quando não houver registros.

### RF-09 — Dashboard
- Mostrar total gasto no período selecionado.
- Mostrar compras recentes, quantidade de compras e gastos por categoria.
- Comparar com o período anterior quando houver dados.
- Destacar gastos que precisam de revisão.
- Oferecer ação principal para registrar gasto.
- Nunca apresentar dados fictícios como dados reais.

### RF-10 — Persistência
- Usar Firestore para dados estruturados quando configurado.
- Isolar registros por usuário autenticado.
- Não substituir silenciosamente nuvem por armazenamento local.
- Se o Firebase não estiver configurado, indicar claramente o modo de desenvolvimento.

## 4. Requisitos não funcionais

- Interface em português brasileiro.
- Responsiva, priorizando uso no celular.
- Acessibilidade básica: labels, foco visível, contraste e áreas de toque adequadas.
- Formatação BRL e datas brasileiras.
- Separação entre interface, regras de negócio, OCR e persistência.
- Tratamento de erros e estados de carregamento.
- TypeScript consistente; evitar `any` sem justificativa.
- Dependências mínimas e compatíveis com o projeto existente.
- Testes para regras de negócio.
- Executar testes, verificação de tipos e build antes da entrega.

## 5. Restrição de custo zero

- Não usar serviços pagos nem APIs pagas de IA/OCR.
- Não habilitar faturamento automaticamente.
- Verificar as condições atuais dos planos gratuitos antes de escolher cada serviço.
- Priorizar OCR local.
- Verificar especificamente as condições do Firebase Storage antes de depender dele para imagens.
- Se armazenamento de imagens não for viável sem custo, permitir salvar o gasto sem manter a foto e documentar a limitação.
- Não prometer uso ilimitado de cotas gratuitas.

## 6. Critérios de aceitação

- [ ] Cadastro manual de gastos funciona.
- [x] Imagem pode ser selecionada e visualizada.
- [x] OCR é executado localmente e não depende de API paga.
- [ ] Dados extraídos podem ser revisados e corrigidos.
- [ ] Gastos podem ser editados e excluídos.
- [ ] Totais refletem as alterações.
- [ ] Histórico filtra corretamente por intervalo.
- [ ] Ciclos de fatura seguem regra documentada e testada.
- [ ] Interface funciona em telas pequenas e grandes.
- [ ] Regras Firebase impedem acesso a dados de outros usuários.
- [ ] Nenhum serviço pago é obrigatório.
- [ ] Testes, verificação de tipos e build foram executados e os resultados reais registrados em `PROGRESSO.md`.

## 7. Fora do escopo inicial

- Integração bancária.
- Importação automática de transações bancárias.
- APIs pagas de IA.
- Contabilidade empresarial.
- Compartilhamento multiusuário de despesas.
- Garantia de leitura perfeita de qualquer nota ou fotografia.

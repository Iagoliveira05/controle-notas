# Banco de Dados — Controle de Gastos por Comprovantes

## 1. Objetivo

Definir um modelo simples para gastos e cartões, com isolamento por usuário e consultas por data. Confirmar o modelo final após inspecionar o projeto e a configuração Firebase.

## 2. Regras gerais

- Persistência principal prevista: Cloud Firestore, dentro das condições gratuitas disponíveis.
- Cada registro pertence a um usuário autenticado.
- Valores monetários em centavos inteiros.
- Data da compra representa a data civil do comprovante, sem deslocamento involuntário de fuso.
- Timestamps de criação/atualização consistentes.
- Não armazenar imagem em nuvem até confirmar opção compatível com custo zero.

## 3. Coleções sugeridas

### `users/{userId}/expenses/{expenseId}`

A aplicação usa este caminho para usuários autenticados. O campo de interface `amount` é convertido para `amountCents` antes do envio ao Firestore.

| Campo               | Tipo                | Obrigatório | Descrição                                 |
| ------------------- | ------------------- | ----------: | ----------------------------------------- |
| `description`       | string              |         Sim | Estabelecimento ou descrição              |
| `amountCents`       | inteiro             |         Sim | Valor em centavos, maior que zero         |
| `purchaseDate`      | string `YYYY-MM-DD` |         Sim | Data civil da compra                      |
| `categoryId`        | string              |         Não | Categoria                                 |
| `paymentMethod`     | enum                |         Não | `credit`, `debit`, `pix`, `cash`, `other` |
| `cardId`            | string/null         |         Não | Cartão associado                          |
| `ocrText`           | string              |         Não | Texto extraído, se necessário             |
| `ocrReviewed`       | boolean             |         Sim | Indica revisão dos dados extraídos        |
| `receiptStorageRef` | string/null         |         Não | Referência opcional à imagem              |
| `createdAt`         | timestamp           |         Sim | Criação                                   |
| `updatedAt`         | timestamp           |         Sim | Última alteração                          |

### `users/{userId}/cards/{cardId}`

| Campo         | Tipo         | Obrigatório | Descrição            |
| ------------- | ------------ | ----------: | -------------------- |
| `name`        | string       |         Sim | Nome personalizado   |
| `closingDay`  | inteiro 1–31 |         Sim | Dia de fechamento    |
| `dueDay`      | inteiro 1–31 |         Sim | Dia de vencimento    |
| `institution` | string       |         Não | Instituição          |
| `active`      | boolean      |         Sim | Cartão ativo/inativo |
| `createdAt`   | timestamp    |         Sim | Criação              |
| `updatedAt`   | timestamp    |         Sim | Atualização          |

### Categorias

Categorias iniciais podem ser fixas no código para reduzir complexidade. Se forem personalizáveis, armazenar em `users/{userId}/categories/{categoryId}`.

## 4. Valores e datas

- Converter `R$ 12,34` em `1234` centavos.
- Evitar somas monetárias com ponto flutuante.
- Validar `amountCents` como inteiro positivo.
- Usar `purchaseDate` no formato `YYYY-MM-DD` para preservar a data civil.
- Usar timestamps do servidor para `createdAt` e `updatedAt`, quando disponíveis.

## 5. Consultas e índices

Consultas previstas:

- Gastos por usuário e intervalo de `purchaseDate`.
- Gastos por período e cartão.
- Gastos por período e categoria.
- Ordenação por data descendente.
- Busca textual simples no conjunto carregado; não presumir busca textual completa nativa do Firestore.

Criar índices compostos somente quando as consultas reais exigirem e versioná-los quando apropriado.

## 6. Ciclo da fatura

A regra deve estar em uma função central, por exemplo `getBillingCycle(purchaseDate, closingDay)`, e ser testada.

Definir explicitamente:

- Se a compra no dia do fechamento pertence à fatura que fecha naquele dia ou à seguinte.
- Como lidar com dias inexistentes em meses curtos.
- Como lidar com virada de ano.
- Como exibir o período e a data de vencimento.

Não duplicar essa regra em componentes diferentes.

## 7. Segurança

- Usar regras que restrinjam leitura e escrita a `request.auth.uid == userId`.
- Validar tipos e limites no cliente e, quando possível, nas regras.
- Não considerar validação de interface suficiente.
- Testar tentativas de acesso a dados de outro usuário.

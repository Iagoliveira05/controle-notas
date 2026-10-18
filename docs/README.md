# Controle de Gastos por Comprovantes

Aplicação web para registrar despesas por imagem ou manualmente, revisar dados extraídos por OCR e consultar gastos por mês, cartão/fatura ou período personalizado.

## Estado do projeto

O repositório já contém uma fundação funcional em React/Vite e a camada inicial de configuração Firebase. As variáveis Web estão configuradas localmente e na Vercel; dashboard, histórico, filtro, cadastro manual e exclusão local existem. Autenticação, persistência Firestore, OCR e testes automatizados ainda não foram implementados. Consulte `PROGRESSO.md` para evidências reais.

## Requisitos previstos

- Node.js em versão LTS compatível com o projeto existente.
- npm (ou o gerenciador já utilizado no repositório).
- Projeto Firebase configurado para persistência na nuvem.
- Navegador moderno para captura/seleção de imagem e OCR local.

## Instalação e execução

Os comandos definitivos dependem do `package.json` existente. Como referência, em um projeto Vite com npm:

```bash
npm install
npm run dev
```

Antes de executar, confira os scripts disponíveis no `package.json`. Não substitua scripts existentes sem necessidade.

## Configuração Firebase

1. Crie/configure um projeto Firebase dentro das condições gratuitas disponíveis.
2. Habilite Firebase Authentication e escolha um método de autenticação apropriado.
3. Habilite Cloud Firestore.
4. Aplique as regras de segurança versionadas no repositório.
5. Configure as variáveis de ambiente documentadas em `.env.example`.
6. Não coloque credenciais administrativas no frontend.
7. Confirme cotas e condições gratuitas antes de publicar.

A configuração de Firebase ainda deve ser feita pelo responsável pelo projeto; não inclua credenciais reais neste documento.

## OCR e imagens

O OCR deve ser executado localmente no navegador e não usar APIs pagas. O processamento pode falhar em imagens desfocadas ou notas apagadas; por isso, todo campo extraído precisa ser revisável.

O armazenamento permanente de imagens não deve ser habilitado até que sua disponibilidade sem custo seja confirmada. A aplicação deve continuar permitindo o registro dos dados sem manter a fotografia.

## Testes e build

Confira os scripts existentes e execute os comandos correspondentes para:
- testes automatizados;
- verificação de tipos;
- build de produção.

Registre os comandos e resultados reais em `PROGRESSO.md`. Não declare validações como executadas sem executá-las.

## Publicação gratuita

A hospedagem e os serviços escolhidos devem ser verificados quanto às condições gratuitas vigentes antes da publicação. Não habilite faturamento automaticamente e não dependa de funcionalidades pagas.

### Vercel

O projeto foi publicado no projeto Vercel `controle-notas` em:

<https://controle-notas-psi.vercel.app>

A implantação está com Deployment Protection habilitada na conta Vercel. Para disponibilizar o site publicamente, desative essa proteção no painel do projeto ou configure o domínio/acesso conforme a política da conta. A publicação não configura Firebase, OCR ou persistência em nuvem.

## Solução de problemas

- **Firebase não configurado:** confira as variáveis de ambiente e mostre a mensagem de configuração da aplicação.
- **OCR não reconhece a nota:** tente imagem mais nítida e revise os campos manualmente.
- **Sem conexão:** não afirmar que dados foram sincronizados; informar o estado real.
- **Build falha:** consultar a mensagem completa, corrigir a causa e atualizar `PROGRESSO.md`.

## Documentação relacionada

- `REQUISITOS.md`
- `PLANEJAMENTO.md`
- `PROGRESSO.md`
- `ARQUITETURA.md`
- `BANCO_DE_DADOS.md`
- `SEGURANCA.md`

# Segurança — Controle de Gastos por Comprovantes

## 1. Objetivo
Proteger os registros financeiros e evitar que a senha inicial seja confundida com uma solução de segurança completa.

## 2. Autenticação
- A senha inicialmente solicitada é `teste123`.
- Não armazenar senha em texto puro no código, Firestore ou `localStorage`.
- Não proteger dados somente ocultando páginas no React.
- Preferir Firebase Authentication com usuário configurado de forma segura.
- O fluxo implementado usa Firebase Authentication por e-mail e senha; o provedor precisa estar habilitado no console Firebase.
- Não criar usuário administrativo no frontend.
- Não colocar credenciais administrativas ou chaves de service account em variáveis `VITE_*`.
- Se for necessário configurar usuário manualmente no console Firebase, documentar o procedimento.

## 3. Regras de acesso
- Exigir autenticação para dados privados.
- Restringir cada usuário aos caminhos que contenham seu próprio UID.
- Negar acesso por padrão a caminhos não previstos.
- Criar e versionar regras do Firestore.
- Se Storage for usado, criar regras específicas e confirmar a viabilidade gratuita antes.
- Não publicar regras permissivas como `allow read, write: if true`.
- A análise Gemini é opcional e envia a imagem ao Google via Firebase AI Logic somente após ação explícita. App Check deve ser configurado e aplicado no console antes da publicação pública.

## 4. Configuração
- Usar `.env.local` para configuração local e manter o arquivo fora do Git.
- Fornecer `.env.example` com nomes de variáveis e valores ilustrativos não secretos.
- A configuração Firebase Web em `VITE_*` é pública por natureza; ela não deve conter credenciais administrativas. O acesso aos dados depende de autenticação e regras Firestore.
- Lembrar que a configuração cliente do Firebase pode ser pública, mas as regras de segurança são essenciais.
- Nunca inserir tokens privados, senhas de serviço ou credenciais administrativas no bundle do frontend.

## 5. Dados pessoais
- Evitar armazenar CPF/CNPJ ou texto integral da nota se não forem necessários.
- Não registrar texto integral de comprovantes em logs.
- Limitar a retenção de imagem e OCR ao necessário.
- Pedir confirmação antes de excluir gastos.
- Documentar como excluir dados do usuário.

## 6. Custo e disponibilidade
- Verificar as condições atuais dos planos gratuitos dos serviços utilizados.
- Não habilitar faturamento automaticamente.
- Não prometer que cotas gratuitas são ilimitadas.
- Se uma funcionalidade puder gerar cobrança, não ativá-la sem autorização explícita e uma alternativa gratuita documentada.

## 7. Limitação da senha fixa
Uma senha compartilhada e fixa pode ser descoberta e não identifica individualmente os usuários. Se a aplicação for publicada, usar autenticação real e regras de backend. A senha `teste123` deve ser tratada como credencial inicial de desenvolvimento, alterada antes de qualquer uso público e nunca como único mecanismo de proteção dos dados.

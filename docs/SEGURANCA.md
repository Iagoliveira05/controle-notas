# Segurança
O modo local não oferece autenticação nem isolamento entre perfis e é explicitamente de desenvolvimento. Nunca incluir senha fixa, chaves privadas ou credenciais no frontend. Produção deve usar Firebase Authentication e regras Firestore/Storage por UID, com variáveis públicas do Firebase separadas de segredos.

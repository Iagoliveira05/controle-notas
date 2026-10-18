# Banco de dados
Modo atual: localStorage (`expenses`), com id, descrição, valor em reais, data, categoria e pagamento. Não é sincronizado nem adequado para produção. Futuro Firestore: coleção por usuário, valores em centavos, timestamps, regras por `request.auth.uid`; imagens devem ser opcionais e não armazenadas sem avaliar cotas gratuitas.

# Instruções para agentes — Controle de Gastos

1. Antes de alterar código, leia `docs/REQUISITOS.md`, `docs/PLANEJAMENTO.md`, `docs/PROGRESSO.md` e os documentos técnicos relevantes.
2. A pasta `docs/` é a fonte oficial dos requisitos e decisões do projeto. Não contradiga os documentos silenciosamente.
3. Inspecione o repositório e `package.json` antes de instalar dependências ou alterar configurações.
4. Preserve funcionalidades e configurações existentes; não recrie o projeto sem necessidade.
5. Custo zero é requisito obrigatório: não adicione APIs pagas, serviços que exijam assinatura ou faturamento habilitado automaticamente.
6. Prefira OCR local no navegador. Não envie imagens a APIs externas.
7. Não invente resultados de OCR, dados de gastos, credenciais, testes ou status de tarefas.
8. Nunca exponha senhas, service-account keys ou credenciais administrativas no frontend.
9. Não trate uma senha validada apenas no React como autenticação segura. Implemente regras reais de acesso aos dados.
10. Após cada etapa significativa, atualize `docs/PROGRESSO.md` com o estado real e evidências.
11. Atualize `docs/PLANEJAMENTO.md`, `docs/ARQUITETURA.md`, `docs/BANCO_DE_DADOS.md`, `docs/SEGURANCA.md` e `docs/REQUISITOS.md` quando decisões ou comportamentos mudarem.
12. Execute os testes, verificação de tipos e build disponíveis. Registre resultados reais; não marque tarefas como concluídas sem validação.
13. Mantenha componentes pequenos, TypeScript consistente, validação centralizada e tratamento de erros.
14. Se uma exigência não puder ser atendida sem custo ou com segurança, documente o bloqueio e proponha alternativa gratuita antes de implementar uma solução insegura.
15. Não deixe botões sem ação nem apresente dados fictícios como dados reais.

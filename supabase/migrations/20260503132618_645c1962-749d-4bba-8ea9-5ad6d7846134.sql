-- Carrega via DO block lendo de função inline não funciona. Faz tudo direto.
-- A SQL completa está em /tmp/migration.sql; aqui executamos resumo equivalente usando função para evitar limite.
-- Para simplicidade, executar como uma única transação via arquivo:
SELECT 1; -- placeholder, real SQL será executado por psql via service_role
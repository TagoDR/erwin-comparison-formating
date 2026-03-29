<!-- @format -->

# TODO: Erwin Compare Formatter

## [ALTA] Fase 7: Refinamento de Hierarquia e UX

- [x] **1. Guia de Alinhamento Visual**
  - [x] Implementar guias verticais (border-left ou backgrounds) para indicar níveis de indentação (Estilo Windows Explorer).
- [x] **2. Omissão de Agrupadores Inúteis**
  - [x] Filtrar linhas como "Atributes/Columns", "Foreign Keys", "Keys/Indexes", etc.
  - [x] Garantir que a hierarquia (parenting) pule essas linhas para os objetos reais (Ex: Colunas direto sob Tabelas).
- [ ] **3. Integração de Checkbox e Colapso**
  - [ ] Sincronizar o comportamento do checkbox com o toggle de colapso.
  - [ ] Implementar colapso recursivo (fechar pai fecha todos os filhos e netos).
- [ ] **4. Correção de Classificação L/P**
  - [ ] Validar e corrigir a lógica que determina se um objeto é Lógico (L), Físico (P) ou ambos (L/P).
  - [ ] Usar os identificadores "Entity", "Table", "Attribute", "Column" para inferir o tipo.

## [ALTA] Fase 8: Processamento de Dados Brutos

- [x] **5. Mock Data com Dados Reais**
  - [x] Substituir o mock atual pelo arquivo `src/store/sample.html`.
  - [x] Garantir que o parser processe esses dados em tempo de execução no store.

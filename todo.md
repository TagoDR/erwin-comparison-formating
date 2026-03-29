<!-- @format -->

# TODO: Erwin Compare Formatter

## [ALTA] Fase 4: Refinamento de Layout e UX

- [x] **1. Densidade Extrema (Espaçamento)**
  - [x] Reduzir `line-height` para `1.1` em toda a tabela.
  - [x] Reduzir `padding` das células para o mínimo funcional (`0.1rem 0.4rem`).
  - [x] Garantir que ícones e checkboxes não forcem a altura da linha.
- [x] **2. Reorganização de Filtros**
  - [x] Mover campo de busca por nome do `app-header` para `app-stats`.
  - [x] Centralizar a área de filtros e estatísticas.
- [x] **3. Correção do Botão Fechar**
  - [x] Ajustar alinhamento flex (icon + texto) no botão "Fechar Arquivo".

## [ALTA] Fase 5: Agrupamento e Visibilidade

- [x] **4. Agrupamento por Objeto (Tree Logic)**
  - [x] Refinar `data.store.ts` para identificar sub-hierarquias completas.
  - [x] Preparar lógica para colapso recursivo via checkbox ou clique.
- [x] **5. Alternar Propriedades**
  - [x] Criar estado `showProperties$` no store.
  - [x] Adicionar botão "Esconder/Mostrar Propriedades" junto às estatísticas.
  - [x] Filtrar linhas que não sejam `isHeader` quando o modo estiver ativo.

## [ALTA] Fase 6: Lógica de Negócio e Amostragem

- [ ] **6. Tratamento de Campos Calculados**
  - [ ] Implementar detecção de `[Calculated]` nas células.
  - [ ] Adicionar regra: se todas as propriedades de um objeto forem `[Calculated]` em ambos os lados, o objeto não conta para estatísticas de mudança.
- [ ] **7. Suporte a Diferentes Modelos**
  - [ ] Ajustar parser para aceitar identificadores Lógicos ("Entity", "Attribute"), Físicos ("Table", "Column") ou ambos.
- [ ] **8. Visibilidade Condicional de Propriedades**
  - [ ] Garantir que objetos novos/excluídos mostrem todas as propriedades.
  - [ ] Garantir que objetos alterados mostrem apenas propriedades com diferenças reais.
- [ ] **9. Mock Data Realista**
  - [ ] Atualizar `mock-data.ts` com a amostra fornecida no `AGENTS.md` (Seção 9.2).

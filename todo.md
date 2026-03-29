# TODO: Erwin Compare Formatter

## [ALTA] Fase 1: Estética e UI
- [ ] **1. Paleta Office 2010**
    - [ ] Atualizar `index.css` com variáveis para Azul, Vermelho, Verde, Roxo, Aqua e Laranja (Base, 80%, 60%, 40%, -25%, -50%).
    - [ ] Mapear Tabelas/Entidades para "Cor Base".
    - [ ] Mapear Atributos/Colunas para "60% Mais Claro".
    - [ ] Mapear outros objetos para escala de Laranja.
- [ ] **2. Redimensionamento de Ícones**
    - [ ] Criar variável `--icon-size` no `:root`.
    - [ ] Aplicar dinamicamente em todos os SVGs do Tabler Icons, sem alterar os arquivos svg originais.
- [ ] **3. Correção de Scroll (Header Sticky)**
    - [ ] Ajustar `top` do `th` no `app-table.css`.
    - [ ] Verificar se há `z-index` ou `overflow` causando o "sliver".
- [ ] **4. Densidade de Informação**
    - [ ] Reduzir `padding` das células `td` e `th`.
    - [ ] Ajustar `line-height`, maioria das informações tem apenas uma linha, mas é possivel ter textos muito grandes.
- [ ] **5. Botão de Cópia**
    - [ ] Ajustar `opacity` base para ~0.4.
    - [ ] Garantir visibilidade sem hover, mudando para 1.0 no hover.
- [ ] **6. Contraste de Texto**
    - [ ] Definir cores de texto (Preto ou cores escuras do Office) para linhas coloridas.

## [MÉDIA] Fase 2: Comportamento Global
- [ ] **7. Limpeza da Coluna Tipo**
    - [ ] Modificar parser ou renderização para exibir apenas o tipo do objeto (ex: "Attribute/Column") e não o nome (ex: "Attribute/Column: NAME").
- [ ] **8. Título da Página Dinâmico**
    - [ ] Sincronizar `document.title` com o nome do arquivo carregado no store.
- [ ] **9. Drag & Drop Onipresente**
    - [ ] Adicionar listener global de `dragover` e `drop` no `main.ts`.

## [FUNCIONAL] Fase 3: Interatividade
- [ ] **10. Linhas Colapsáveis**
    - [ ] Implementar estado de colapso por ID de objeto no store.
    - [ ] Adicionar ícone de expandir/colapsar.
- [ ] **11. Filtro por Nome**
    - [ ] Adicionar campo de input no `app-header`.
    - [ ] Criar seletor derivado no store para filtrar a lista de dados.
- [ ] **12. Checklist e Controle Lateral**
    - [ ] Adicionar coluna de checkbox à esquerda.
    - [ ] Vincular checkbox de linha de cabeçalho ao estado de colapso.
    - [ ] Estilizar checkbox para parecer nativo/discreto.



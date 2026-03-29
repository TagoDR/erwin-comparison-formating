# TODO: Erwin Compare Formatter

## [ALTA] Fase 1: Estética e UI
- [x] **1. Paleta Office 2010**
    - [x] Atualizar `index.css` com variáveis para Azul, Vermelho, Verde, Roxo, Aqua e Laranja (Base, 80%, 60%, 40%, -25%, -50%).
    - [x] Mapear Tabelas/Entidades para "Cor Base".
    - [x] Mapear Atributos/Colunas para "60% Mais Claro".
    - [x] Mapear outros objetos para escala de Laranja.
- [x] **2. Redimensionamento de Ícones**
    - [x] Criar variável `--icon-size` no `:root`.
    - [x] Aplicar dinamicamente em todos os SVGs do Tabler Icons, sem alterar os arquivos svg originais.
- [x] **3. Correção de Scroll (Header Sticky)**
    - [x] Ajustar `top` do `th` no `app-table.css`.
    - [x] Verificar se há `z-index` ou `overflow` causando o "sliver".
- [x] **4. Densidade de Informação**
    - [x] Reduzir `padding` das células `td` e `th`.
    - [x] Ajustar `line-height`, maioria das informações tem apenas uma linha, mas é possivel ter textos muito grandes.
- [x] **5. Botão de Cópia**
    - [x] Ajustar `opacity` base para ~0.4.
    - [x] Garantir visibilidade sem hover, mudando para 1.0 no hover.
- [x] **6. Contraste de Texto**
    - [x] Definir cores de texto (Preto ou cores escuras do Office) para linhas coloridas.

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



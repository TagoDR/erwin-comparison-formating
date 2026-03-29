# Projeto: Erwin Compare Formatter

## 1. Visão Geral

O **Erwin Compare Formatter** é um utilitário especializado projetado para processar relatórios de diferença HTML gerados pelo Erwin Data Modeler. Ele transforma os dados brutos de comparação em uma interface visual, pesquisável e filtrável, otimizada para analistas humanos.

O resultado final é uma aplicação HTML de arquivo único (gerada via Vite) para fácil distribuição e uso offline.

## 2. Stack Técnica

- **Framework:** Vite com TypeScript
- **Gerenciamento de Estado:** [Nanostores](https://github.com/nanostores/nanostores) para [Lit](https://lit.dev/)
- **Tipo de Saída:** HTML de arquivo único (usando `vite-plugin-singlefile`)
- **Framework de UI:** [Bootflat](http://bootflat.github.io/) (baseado em Bootstrap 3) com tema escuro personalizado.
- **Idioma Alvo:** Português (pt_BR) para instruções da interface do usuário.
- **Linting:** Biome
- **Ícones:** Tabler Icons

## 3. Requisitos de UI/UX

### 3.1. Layout

A interface é dividida em duas seções primárias:

1. **Cabeçalho (Barra Superior Estática):**
   - Uma linha fina de alto contraste no topo da tela.
   - **Carregamento de Arquivo:** Área para escolher um arquivo via input padrão ou drag-and-drop.
   - **Gerenciamento de Arquivo:** Um botão para "Fechar Arquivo" que limpa a sessão atual.
   - **Filtros:** Seletores e campos de busca para Tipo de Alteração, Categoria de Objeto e Nome.

2. **Exibição Principal (Layout Dividido):**
   - **Painel de Estatísticas:** Uma tabela de resumo com 3 linhas (Geral, Tabelas, Colunas) e 5 colunas (Tipo, Total, Inclusão, Alteração, Exclusão).
   - **Painel da Tabela de Dados:** A exibição de dados aprimorada principal conforme definido na seção 3.3.

### 3.2. Processamento de Dados (Lógica do Parser)

- **Parsing de Indentação:** Interpretar espaços iniciais na coluna "Type" do Erwin para construir uma hierarquia de objetos. (A indentação é tipicamente múltiplos de 4 espaços).
- **Lógica de Diferença:** A coluna "Difference" do Erwin não é confiável e deve ser ignorada. O status é determinado por:
  - **Inclusão (I):** Modelo Direito (Right Model) está vazio.
  - **Exclusão (E):** Modelo Esquerdo (Left Model) está vazio.
  - **Alteração (A):** Ambos os modelos possuem valores, mas são diferentes.
- **Elevação de Status (Status Hoisting):**
  - Alterações no nível de propriedade são elevadas para o objeto pai (ex: Tabela ou Coluna).
  - Objetos pai herdam o status "mais alto" encontrado em sua subárvore: `Exclusão > Inclusão > Alteração > Sem Mudança`.
- **Flags de Visualização:** Propriedades "Logical Only" e "Physical Only" são elevadas para a linha do identificador.

### 3.3. Configuração da Tabela

| Coluna          | Descrição                                               |
| :-------------- | :------------------------------------------------------ |
| **Check**       | Controle visual/funcional para checklist e colapso.     |
| **Type**        | Hierarquia de objetos indentada (sem o nome do objeto). |
| **Prop**        | Identificador do objeto pai.                            |
| **Change**      | I (Inclusão), A (Alteração) ou E (Exclusão).            |
| **View**        | L (Lógica), P (Física) ou L/P.                          |
| **Left Model**  | Dados do modelo de trabalho.                            |
| **Right Model** | Dados do modelo de referência (baseline).               |

## 4. Codificação Visual (Office 2010 Palette)

### 4.1. Cores de Status

| Objeto                              | Inclusão (Verde) | Alteração (Roxo) | Exclusão (Vermelho) | Texto  |
| :---------------------------------- | :--------------- | :--------------- | :------------------ | :----- |
| **Tabela/Entidade**                 | #9BBB59 (Base)   | #8064A2 (Base)   | #C0504D (Base)      | Branco |
| **Atributo/Coluna**                 | #D7E3BC (60%)    | #CCC1D9 (60%)    | #E5B9B7 (60%)       | Preto  |
| **Propriedades de qualquer objeto** | branco           | branco           | branco              | Preto  |

### 4.2. Outros Objetos

Todos os outros objetos seguem a escala de Laranja (Ênfase 6):

- Nível 0: #F79646 (Base)
- Nível 1: #FAC08F (40% Claro)
- Nível 2+: #FBD5B5 (60% Claro) ou #FDE9D9 (80% Claro)

## 5. Estrutura de Arquivos

- `src/parser/`: Lógica de processamento do HTML do Erwin.
- `src/components/`: Componentes Lit baseados em Bootflat (`app-header`, `app-stats`, `app-table`).
- `src/store/`: Gerenciamento de estado para dados, filtragem e estados de carregamento.

## 6. Plano de Desenvolvimento (Roadmap)

### Fase 1: Refinamento Estético e UI (Prioridade Alta)

- [ ] **Ajuste de Cores (Office 2010):** Implementar a paleta completa no `index.css` e mapear para as linhas da tabela.
- [ ] **Controle de Ícones:** Definir variáveis CSS para redimensionar Tabler Icons globalmente.
- [ ] **Correção do Header Sticky:** Ajustar o offset do header da tabela para evitar sobreposição de scroll.
- [ ] **Densidade de Dados:** Reduzir o padding das células para exibir mais informações.
- [ ] **Botão de Cópia:** Tornar o botão semi-transparente e sempre visível para facilitar o acesso.
- [ ] **Contraste de Texto:** Garantir que o texto nas linhas coloridas use cores do Office 2010 ou preto para legibilidade.

### Fase 2: Limpeza e Comportamento Global (Prioridade Média)

- [ ] **Limpeza da Coluna Tipo:** Remover o nome do objeto da coluna "Tipo", deixando apenas a categoria (ex: "Entity/Table").
- [ ] **Título Dinâmico:** Atualizar o `document.title` com o nome do arquivo carregado.
- [ ] **Drag & Drop Global:** Permitir arrastar arquivos para qualquer lugar da aplicação para carregá-los.

### Fase 3: Interatividade e Filtragem (Prioridade Funcional)

- [ ] **Linhas Colapsáveis:** Permitir clicar em linhas de identificação de objeto para ocultar/exibir seu conteúdo.
- [ ] **Filtro por Nome:** Adicionar campo de busca no cabeçalho para filtrar tabelas/entidades específicas.
- [ ] **Coluna de Checklist:** Adicionar coluna à esquerda com checkbox para controle do analista e integração com colapso de linhas.

## 7. Estrutura do Arquivo de Entrada e Dados de Exemplo

### 7.1. Regras Lógicas

- **Aninhamento:** 4 espaços = 1 Nível.
- **Detecção de Mudança:**
  - `Left != "" && Right == ""` -> **Inclusão (I)**
  - `Left == "" && Right != ""` -> **Exclusão (E)**
  - `Left != "" && Right != "" && Left != Right` -> **Alteração (A)**

### 7.2. Cenários de Exemplo Complexos

#### Cenário A: Alteração de Tabela (Elevada)

| Type                         | Left   | Difference | Right       | Resultado Lógico        |
| :--------------------------- | :----- | :--------- | :---------- | :---------------------- |
| Entity/Table                 | CLI    | -          | CLI         | **A** (Elevado de Name) |
| &nbsp;&nbsp;&nbsp;&nbsp;Name | Client | -          | Client Info | **A**                   |

#### Cenário B: Nova Coluna (Elevada)

| Type                                                                                  | Left    | Difference | Right | Resultado Lógico          |
| :------------------------------------------------------------------------------------ | :------ | :--------- | :---- | :------------------------ |
| Entity/Table                                                                          | PROD    | -          | PROD  | **A** (Elevado de Column) |
| &nbsp;&nbsp;&nbsp;&nbsp;Columns                                                       |         | -          |       |                           |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Attribute/Column                      | SK_PROD | -          |       | **I**                     |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Physical Name | SK_PROD | -          |       | **I**                     |

#### Cenário C: Relacionamento Excluído

| Type                         | Left | Difference | Right | Resultado Lógico |
| :--------------------------- | :--- | :--------- | :---- | :--------------- |
| Relationship                 |      | -          | FK_01 | **E**            |
| &nbsp;&nbsp;&nbsp;&nbsp;Name |      | -          | FK_01 | **E**            |

### 7.3. Amostra Extensa de Dados

```text
Model| AAAA| - |AAAB
    Nome| AAAA| - |AAAB
    Author| John| - |John A
Entities/Tables| | - |
    Entity/Table| CLI| - |CLI
        Physical Name| GGGGG| - |GGGGG
        Name| Client| - |Client
        Description| a...z| - |a...z
        Logical Only| false| - |false
        Physical Only| false| - |false
        Columns| | - |
            Attribute/Column| NM_CLI| - |NM_CLI
                Physical Name| NM_CLI| - |NM_CLI
                Name| Name Client| - |Name Client
                Logical Datatype| Char(50)| - |Char(30)
                Physical Datatype| char(50)| - |char(30)
                Logical Only| false| - |false
                Physical Only| false| - |false
            Attribute/Column| CD_CLI| - |CD_CLI
                Physical Name| CD_CLI| - |CD_CLI
                Name| Code Client| - |Code Client
                Logical Datatype| Integer| - |Integer
                Physical Datatype| int| - |int
                Logical Only| false| - |false
                Physical Only| false| - |false
        Relationships| | - |
            Relationship|FK_01||FK_01
                Name|FK_01||FK_01
            Relationship|FK_02||FK_02
                Name|FK_02||FK_02
        Tablespaces| | - |
            Tablespace| TB_001| - |TB_001
        Indexes| | - |
            Index| IFK_001| - |IFK_001
```

## 8. Configuração de Saída

- **Nome do Arquivo:** `Erwin_Formatar_CompleteCompare_v5.html`

## 9. Amostra de dados

Dados reais extratidos de uma comparação convertidos para markdown.
A indentação no Erwin segue múltiplos de 4 espaços (aqui representados por '·').

### 9.1. Regras de Processamento Complementares

- **Identificadores de Modelo:**
  - Lógico e Físico: "Entity/Table" e "Attribute/Column".
  - Apenas Lógico: "Entity" e "Attribute".
  - Apenas Físico: "Table" e "Column".
- **Visibilidade de Dados:**
  - Objetos Novos (Inclusão) e Excluídos: Devem mostrar quase todas as informações (propriedades).
  - Objetos Alterados: Devem mostrar apenas as propriedades que possuem diferenças entre o Left e Right.
- **Campos Calculados (Herança):**
  - Células contendo `[Calculated]` indicam herança de valores.
  - **Regra de Estatística:** Se um objeto possui todas as suas propriedades marcadas como `[Calculated]` em ambos os lados (Left e Right), este objeto **não deve** ser contabilizado nas estatísticas de alteração, pois não houve mudança real no nível do objeto.

### 9.2. Amostra de Dados Real

| Object                        | Left                                            | Right                                         |
| ----------------------------- | ----------------------------------------------- | --------------------------------------------- |
| ····Entity/Table              | CLI                                             | CLI_PF                                        |
| ······Name                    | Cliente                                         | Cliente Pessoa Fisica                         |
| ······Physical Name           | CLI                                             | CLI_PF                                        |
| ······Description             | Cliente de interesse da intituição              | Cliente Pessoa Fisica cadastrado              |
| ······Comment                 | Cliente de interesse da intituição [Calculated] | Cliente Pessoa Fisica cadastrado [Calculated] |
| ······Max Rows                | 10000000                                        |                                               |
| ······Growth By               | 10000                                           |                                               |
| ······Initial Rows            | 0                                               |                                               |
| ········Atributes/Columns     |                                                 |                                               |
| ··········Atribute/Column     | NR_PTR                                          | NR_PTR                                        |
| ············Name              | Numero da Partição                              | Numero da Particao                            |
| ············Physical Only     | true                                            | false                                         |
| ············Theme             | A.Fisico                                        |                                               |
| ··········Atribute/Column     | CD_OPR                                          |                                               |
| ············Name              | Codigo Operação                                 |                                               |
| ············Logical Datatype  | CHAR(8)                                         |                                               |
| ············Physical Datatype | CHAR(8) [Calculated]                            |                                               |
| ············Physical Name     | CD_OPR                                          |                                               |
| ············Null Option       |                                                 | Not Null                                      |
| ············Parent Domain     |                                                 | String                                        |
| ············Description       | Codigo da Operação do sistama                   |                                               |
| ············Comment           | Codigo da Operação do sistama [Calculated]      |                                               |
| ············Logical Only      | false                                           |                                               |
| ············Physical Only     | false                                           |                                               |
| ············Theme             | Corporativa                                     |                                               |
| ··········Atribute/Column     |                                                 | CD_PRD                                        |
| ············Name              |                                                 | Codigo Produto                                |
| ············Logical Datatype  |                                                 | Integer                                       |
| ············Physical Datatype |                                                 | Integer [Calculated]                          |
| ············Physical Name     |                                                 | CD_PRD                                        |
| ············Description       |                                                 | Codigo do Produto da Empresa                  |
| ············Comment           |                                                 | Codigo do Produto da Empresa [Calculated]     |
| ············Logical Only      |                                                 | false                                         |
| ············Physical Only     |                                                 | false                                         |
| ············Theme             |                                                 | Corporativa                                   |
| ············Null Option       |                                                 | Not Null                                      |
| ············Parent Domain     |                                                 | Number                                        |
| ········Foreign Keys          |                                                 |                                               |
| ··········Foreign Key         | FK_CLI_02                                       |                                               |
| ············Name              | FK_CLI_02                                       |                                               |
| ········Keys/Indexes          |                                                 |                                               |
| ··········Key/Index           | IX_CLI_02                                       |                                               |
| ············Type              | FK                                              |                                               |
| ····Entity/Table              | OPR                                             |                                               |
| ······Name                    | Operação                                        |                                               |
| ······Physical Name           | OPR                                             |                                               |
| ······Description             | Operação do sistama                             |                                               |
| ······Comment                 | Operação do sistama [Calculated]                |                                               |
| ······Logical Only            | true                                            |                                               |
| ······Physical Only           | false                                           |                                               |
| ······Theme                   | Corporativa                                     |                                               |
| ········Atributes/Columns     |                                                 |                                               |
| ··········Atribute/Column     | CD_OPR                                          |                                               |
| ············Name              | Codigo Operação                                 |                                               |
| ············Logical Datatype  | CHAR(8)                                         |                                               |
| ············Physical Datatype | CHAR(8) [Calculated]                            |                                               |
| ············Physical Name     | CD_OPR                                          |                                               |
| ············Null Option       |                                                 | Not Null                                      |
| ············Parent Domain     |                                                 | String                                        |
| ············Description       | Codigo da Operação do sistama                   |                                               |
| ············Comment           | Codigo da Operação do sistama [Calculated]      |                                               |
| ············Logical Only      | false                                           |                                               |
| ············Physical Only     | false                                           |                                               |
| ············Theme             | Corporativa                                     |                                               |
| ····Entity/Table              |                                                 | PRD                                           |
| ······Name                    |                                                 | Produto                                       |
| ······Physical Name           |                                                 | PRD                                           |
| ······Description             |                                                 | Produto da Empresa                            |
| ······Comment                 |                                                 | Produto da Empresa [Calculated]               |
| ······Logical Only            |                                                 | true                                          |
| ······Physical Only           |                                                 | false                                         |
| ······Theme                   |                                                 | Corporativa                                   |
| ········Atributes/Columns     |                                                 |                                               |
| ··········Atribute/Column     |                                                 | CD_PRD                                        |
| ············Name              |                                                 | Codigo Produto                                |
| ············Logical Datatype  |                                                 | Integer                                       |
| ············Physical Datatype |                                                 | Integer [Calculated]                          |
| ············Physical Name     |                                                 | CD_PRD                                        |
| ············Description       |                                                 | Codigo do Produto da Empresa                  |
| ············Comment           |                                                 | Codigo do Produto da Empresa [Calculated]     |
| ············Logical Only      |                                                 | false                                         |
| ············Physical Only     |                                                 | false                                         |
| ············Theme             |                                                 | Corporativa                                   |
| ············Null Option       |                                                 | Not Null                                      |
| ············Parent Domain     |                                                 | Number                                        |



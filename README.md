# Erwin Compare Formatter (v5)

Utilitário especializado para transformar relatórios de diferença do Erwin Data Modeler em uma interface visual moderna, filtrável e de fácil análise.

---

## 📂 Para o Usuário

### Como obter o aplicativo
O aplicativo é distribuído como um único arquivo HTML que funciona totalmente offline.
*   **Download:** [Clique aqui para acessar a pasta do projeto e baixar o arquivo `Erwin_Formatar_CompleteCompare.html`](./dist/Erwin_Formatar_CompleteCompare.html) (ou localize-o na pasta `dist/` deste repositório).

### Instruções de Uso
1.  **Abra o arquivo:** Clique duas vezes no arquivo `.html` baixado para abri-lo em seu navegador de preferência (Chrome, Edge, Firefox, etc).
2.  **Carregue o relatório:**
    *   Arraste o arquivo HTML gerado pelo **Erwin "Complete Compare"** para a área central.
    *   Ou clique na área de seleção para buscar o arquivo em seu computador.
3.  **Analise os dados:**
    *   Use os **Filtros** no topo para isolar inclusões, alterações ou exclusões.
    *   Visualize a **Hierarquia** dos objetos (Tabelas -> Colunas -> Propriedades) com indentação clara.
    *   **Cores Pastéis:** Verde (Inclusão), Roxo (Alteração) e Vermelho (Exclusão).
    *   **Copiar Dados:** Use os botões de cópia (ícones de prancheta) para copiar nomes de tabelas individualmente ou a lista completa de tabelas impactadas.

---

## 🛠️ Desenvolvimento e Manutenção

Esta seção é destinada a desenvolvedores que desejam modificar ou compilar o projeto.

### Stack Técnica
*   **Framework:** [Lit](https://lit.dev/) (Web Components) para uma interface reativa e leve.
*   **Bundler:** [Vite](https://vitejs.dev/) com o plugin `vite-plugin-singlefile` para garantir que todo o CSS, JS e ativos sejam embutidos em um único HTML.
*   **UI/Design:** Baseado no framework **Bootflat** (Dark Slate theme) com customizações para visualização de dados.
*   **Ícones:** [Tabler Icons](https://tabler-icons.io/) carregados via `vite-svg-loader` e injetados como componentes Lit.
*   **Linting:** [Biome](https://biomejs.dev/) para padronização de código.

### Comandos Principais
1.  **Instalação:**
    ```bash
    npm install
    ```
2.  **Ambiente de Desenvolvimento:**
    ```bash
    npm run dev
    ```
3.  **Compilação (Build):**
    Gera o arquivo final na pasta `dist/`.
    ```bash
    npm run build
    ```
    *Nota: O script de build utiliza PowerShell para renomear o arquivo de saída automaticamente.*

---
**Versão:** 5.0.0

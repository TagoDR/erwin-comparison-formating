import type { ErwinRow } from './data.store';

/**
 * Mock data representing a parsed Erwin comparison report.
 * Prop column groups rows by their immediate parent data object.
 */
export const MOCK_ERWIN_DATA: ErwinRow[] = [
  { 
    type: 'Model: Inventory_System', 
    prop: 'Inventory', 
    change: 'A', 
    view: 'L/P', 
    leftModel: 'v2.1', 
    rightModel: 'v2.0', 
    indent: 0, 
    isHeader: true 
  },
  { 
    type: '    Author', 
    prop: 'Inventory', 
    change: 'A', 
    view: '', 
    leftModel: 'Data Team', 
    rightModel: 'Admin', 
    indent: 4 
  },
  { 
    type: '    Version Date', 
    prop: 'Inventory', 
    change: '', 
    view: '', 
    leftModel: '2023-10-27', 
    rightModel: '2023-10-27', 
    indent: 4 
  },
  
  // TABLE LEVEL
  { 
    type: 'Entity/Table: CUSTOMER', 
    prop: 'CUSTOMER', 
    change: 'A', 
    view: 'L/P', 
    leftModel: 'Active', 
    rightModel: 'Active', 
    indent: 0, 
    isHeader: true 
  },
  { 
    type: '    Physical Name', 
    prop: 'CUSTOMER', 
    change: '', 
    view: '', 
    leftModel: 'TB_CUSTOMER', 
    rightModel: 'TB_CUSTOMER', 
    indent: 4 
  },
  { 
    type: '    Definition', 
    prop: 'CUSTOMER', 
    change: 'A', 
    view: 'L', 
    leftModel: 'Updated client registry', 
    rightModel: 'Client registry', 
    indent: 4 
  },
  { 
    type: '    Columns', 
    prop: 'CUSTOMER', 
    change: 'A', 
    view: '', 
    leftModel: '', 
    rightModel: '', 
    indent: 4 
  },
  
  // COLUMN LEVEL (Nested in Table)
  { 
    type: '        Attribute/Column: EMAIL', 
    prop: 'EMAIL', 
    change: 'I', 
    view: 'L/P', 
    leftModel: 'VARCHAR(255)', 
    rightModel: '', 
    indent: 8, 
    isHeader: true 
  },
  { 
    type: '            Physical Name', 
    prop: 'EMAIL', 
    change: 'I', 
    view: '', 
    leftModel: 'NM_EMAIL', 
    rightModel: '', 
    indent: 12 
  },
  { 
    type: '            Logical Only', 
    prop: 'EMAIL', 
    change: 'I', 
    view: '', 
    leftModel: 'false', 
    rightModel: '', 
    indent: 12 
  },
  
  { 
    type: '        Attribute/Column: PHONE', 
    prop: 'PHONE', 
    change: 'A', 
    view: 'P', 
    leftModel: 'VARCHAR(20)', 
    rightModel: 'VARCHAR(15)', 
    indent: 8, 
    isHeader: true 
  },
  { 
    type: '            Physical Datatype', 
    prop: 'PHONE', 
    change: 'A', 
    view: '', 
    leftModel: 'VARCHAR(20)', 
    rightModel: 'VARCHAR(15)', 
    indent: 12 
  },

  // ANOTHER TABLE (Inclusion)
  { 
    type: 'Entity/Table: PRODUCT_STOCK', 
    prop: 'PRODUCT_STOCK', 
    change: 'I', 
    view: 'P', 
    leftModel: 'Created', 
    rightModel: '', 
    indent: 0, 
    isHeader: true 
  },
  { 
    type: '    Physical Name', 
    prop: 'PRODUCT_STOCK', 
    change: 'I', 
    view: '', 
    leftModel: 'TB_PROD_STOCK', 
    rightModel: '', 
    indent: 4 
  },
  
  // RELATIONSHIP (Exclusion)
  { 
    type: 'Relationship: FK_ORDERS_CUST', 
    prop: 'FK_ORDERS_CUST', 
    change: 'E', 
    view: 'L/P', 
    leftModel: '', 
    rightModel: 'Active', 
    indent: 0, 
    isHeader: true 
  },
  { 
    type: '    Name', 
    prop: 'FK_ORDERS_CUST', 
    change: 'E', 
    view: '', 
    leftModel: '', 
    rightModel: 'FK_ORDERS_CUST', 
    indent: 4 
  }
];

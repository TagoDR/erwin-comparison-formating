Erwin Data Modeler can compare two models and then produce an html file with the differences.
This project is about ingesting the html file from local pc then displaying the original data, in a more colorful way for faster human analysis
- it will allow for filtering properties
- each data object (Table, column, view, tablespace, index...) will have a categorization for better filtering it a separated column
- each row of a data object identifier will show a comparison if it is a new object, deleted, or a change

The project will be build in vite using singlefile plugin, the result would be open by an human analyst
the ui will be a slim sticky row at the top of the screen, with a file input to receive the html file from the computer, with instructions in portuguese pt_BR
below it will be a display area that will show the formated data

Data object identifier row should be colored appropriately
- New table will be dark green
- Changed tables will be dark purple
- Delete Tables will be dark red
- New column will be green
- Changed column will be purple
- Delete column will be red
- Other objects will be oragen with decreasing strength as it becomes more nested

most objects are organized as
- identifier row of the data object
    - properties of the data object
    -  list for nested data object
        - identifier row of the nested data object
        - properties of the nested data object
    -  list for nested data object
            - identifier row of the 2n nested data object
            - properties of the 2n nested data object
            -  list for nested data object
                    - identifier row of the 2n nested data object
                    - properties of the 2n nested data object


the resulting data table should be filterable by:
    - changes type(inclusion , exclusion, change)
    - data object type, just table and others


The original data is as folows
Columm 1 - Type (table, atribute...) the nesting is defined by indentation with spaces
collum 2 - Left model, the working model
Columm 3 - Right model, the reference model

The formated data will have additinal columns
Prop - Identify the data object grouping, then replicated to all property rows of the object
Change - 'I' for inclusion, 'A' for Changes, 'E' deletions, the information is hoisted to the data object identifier row, then replicated to all property rows of the object
View - Tables and colums have 2 special properties, "Logical Only" and "Physical Only" , the information is hoisted to the data object identifier row


the project may use webawesome components for standard look and feel, llms.txt contains all in formation about using it
#User inputs:
x - name of the table.
y - name and type of the columns.

in 
```
/db/migrations/0000_ordinary_thanos.sql 
```
create a new table called {x}.
with the following columns: {y}

Add file to the
```
/db/queries/{x}-queries.ts 
```
and make it similar to the other files in the folder (for {x} table).


Add file to the 
```
/db/schema/{x}-schema.ts 
```
and make it similar to the other files in the folder (for {x} table).
then add schema to the index.ts in this folder.

Update the db.ts file to include the new table. like others

Create actions file in
```
/actions/{x}-actions.ts 
```
and make it similar to the other files in the folder (for {x} table).

Exist to balance performance with these 3 problems:
- Dirty Read - transaction A reads uncommitted change made by transaction B, then B rolls back and so A read a non existent data and acted on it
- Non-Repeatable Read - transaction A reads a row, B changes it and commits, A reads again and finds it changed since its start. Can make the logic unstable
- Phantom Read - running aggregate query like “count all X items” will change value if someone inserts a new item and commits meanwhile

## Isolation Levels
From safest and slowest to most dangerous but fastest:
- Read Uncommitted - checks nothing, fastest
- Read Committed (default in most DB) - only sees committed changes, protects from dirty read
- Repeatable Read - locks rows so others can’t edit them. Prevents dirty read and non-repeatable read but is slower. Does kot prevent phantom read
- Serializable - if transactions touch same table then they occur one at a time. Safest but slowest

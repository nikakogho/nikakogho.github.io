Deciding who reads from and writes to cache/DB and when
![caching_patterns.gif](caching_patterns.gif)

## Read Through

Backend just calls to cache, unaware of DB layer at all. Cache decides when to answer itself or refresh its content from DB.
Redis Connect can do this but standard Redis doesn’t.

## Cache Aside

Backend side control: backend decides when to write to cache, when to read from cache, when to go to DB instead.
On write we write to DB and update or invalidate cache.

## Write Through

App writes to cache, cache synchronously (instantly) writes to DB.

## Write Around

On write we only update DB.
On read if cache is missing the key then we update cache from DB.

Better when we have many writes but few reads so caching every write is wasteful

## Write Back

App writes to cache.
Cache accumulates and then asynchronously writes to DB.
Can have consistency problems

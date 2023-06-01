# 2. Improvement on message passing: Requesting arbitrary data

In the previous exercise, I implemented a simple program where a client and server ran asynchronously and communicated by passing messages. This time, the client will send arbitrary queries to the server to execute.

---
## Design

### Server
- The server holds a mutable database. To keep things simple, this is a simple data structure. There is information about the ice-cream the server has such as the existing flavors, their recipes, existing orders and which flavors they are in, etc. The database fields are as follows:
  - `flavors_stock: Vec<String>` -> represents the flavors in stock. 
  - `flavor_recipes: HashMap<String, Vec<String>>` -> represents the recipes of each flavor (it is guaranteed  that the existing flavors can only be flavors from this list).
  - I can add more later if I like.
- The database is initialized upon `run_server()`. When it receives a request, it calls the closure sent with the request on the database.
- The server doesn't deal with error handling. It returns a `Result` to the client. The content of the result will be be of the generic type passed from the client.

### Client
- The client sends queries to the server. The `ClientRequest` consists of a one-shot channel and query. The query is a `FnOnce` function that takes the server's data as a reference (`&Database`), and the return type is arbitrary. I think I can achieve this using a generic type and trait bounds (Even though I understand generics, trait objects and traits, I still need to figure this out).
- For example, the client can query the database for how many different flavors it has (integer), which flavors do not have dairy in their recipes (list of strings), and more.


A simple diagram of the communication process I made GPT draw for me:
```
+---------+                           +--------+
|         | --(1) Prepare Query-----> |        |
|  Client |                           | Server |
|         |                           |        |
+---------+                           +--------+
                                       |
                                       V
                             (2) Execute Query on Database
                                       |
                                       V
+---------+                           +--------+
|         | <---(3) Send Result ----- |        |
|  Client |                           | Server |
|         |                           |        |
+---------+                           +--------+

```

---
## Implementation

// todo
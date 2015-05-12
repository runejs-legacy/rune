Rune Framework
==============
Rune Framework is an API framework for Node.js written in Ecmascript 7. It includes MongoDB Orm, RESTful controller layer.
This project is just a child, developing and changing day by day, not recommended for production projects.

# Getting Started

First install Rune Framework globally.
```
npm install -g rune
```

Create a new API project.
```
rune new myapi
```

Then start the server.
```
cd myapi
rune server
```

```
GET http://localhost:3000/
```
will return 404 and empty object.

## Create a new model
models/todo.js
```javascript
import { type, required, Timestamps } from 'rune/orm';

@Timestamps
export class Todo extends BaseModel {
  @type(String)
  @required
  content;
}
```

## Create a new controller
controllers/todos.js
```javascript
export class TodosController extends BaseController {
  async index() {
    let todos = await Todo.fetch();
    this.$reply(todos);
  }

  async create() {
    let todo = await Todo.create(this.$params);
    this.$reply(todo);
  }

  async destroy() {
    let todo = await Todo.find(this.$params.id);
    await todo.destroy();
    this.$reply(null, 204);
  }
}
```

## Configure routes
config/routes.js
```javascript
export default (root) => {
  root.resources('todos');
};
```

Then restart server with
```
rune server
```

Then make some request
```
GET http://localhost:3000/todos
POST http://localhost:3000/todos
DELETE http://localhost:3000/todos/THE_POST_ID
```

## TODOs for First Beta Version (0.1.0)
- [ ] Seperate modules into different repos (http, orm, exec)
- [ ] Embedded Documents and relationships for ORM
- [ ] Documentation
- [ ] Lots of unit tests
- [ ] Lots of discussions
- [ ] Lots of help
- [ ] Better CLI
- [ ] Create core team
- [ ] Build a website for runejs.io
- [ ] REPL Module (Maybe, rune console command)

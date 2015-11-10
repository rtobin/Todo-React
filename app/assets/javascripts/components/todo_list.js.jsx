var TodosList = React.createClass({
  getInitialState: function () {
    return ({
      todos: TodoStore.all()
    });
  },

  handleClick: function (e) {
    e.preventDefault();
    var curTodo = parseInt(e.currentTarget.id);
    this.setState({curTodo: curTodo});
  },

  render: function () {
    var that = this;
    var todoId = this.state.curTodo;
    var todos = this.state.todos;
    var mainView;
    for (var i = 0; i < todos.length; i++) {
      if (todos[i].id === todoId) {
        mainView = todos[i];
      }
    }
    var result;
    if (mainView) {
      result = <TodoDetailView todo={mainView} />;
    }

    return (
      <div>
        <div className="todo-sidebar">
          <TodosForm />
          <ul>
          {this.state.todos.map(function(todo){
              return (
                <li
                  id={todo.id}
                  key={todo.id}
                  onClick={that.handleClick}>{todo.title}
                </li>
              );
            })
          }

          </ul>
        </div>

        <div className="todo-main-view">
          {result}
        </div>
      </div>
    );
  },

  todosChanged: function () {
    this.setState({todos: TodoStore.all()});
  },

  componentDidMount: function () {
    TodoStore.addChangedHandler(this.todosChanged);
    TodoStore.fetch();
  },

  componentWilUnmount: function () {
    TodoStore.removeChangedHandler(this.todosChanged);
  }
});

var TodosListItem = React.createClass({
  handleDestroy: function (e) {
    e.preventDefault();
    TodoStore.destroy(parseInt(e.currentTarget.id));
  },

  render: function () {
    var todo = this.props.todo;

    return (
      <div className='todo-sidebar'>
        <TodoDetailView todo={todo}/>
        <StepsList todo={todo} />
        <DoneButton todo={todo}/>
        <button className="todo-item-delete"
                id={todo.id}
                onClick={this.handleDestroy}>Delete
        </button>
      </div>
    );
  }
});

var TodosForm = React.createClass({
  getInitialState: function () {
    return ({
      title: "",
      body: "",
    })
  },

  updateTitle: function (e) {
    e.preventDefault();
    this.setState({title: e.currentTarget.value});
  },

  updateBody: function (e) {
    e.preventDefault();
    this.setState({body: e.currentTarget.value});
  },

  handleSubmit: function (e) {
    e.preventDefault();
    TodoStore.create({
      title: this.state.title,
      body: this.state.body
    });
    this.setState({title: "", body: ""})
  },

  render: function () {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>Title
          <input className="form-title" type="text" onChange={this.updateTitle} value={this.state.title} />
        </label>
        <label>Body
          <textarea className="form-body" onChange={this.updateBody} value={this.state.body} />
        </label>
        <button>Add Todo</button>
      </form>
    );
  }
});

var DoneButton = React.createClass({
  handleDone: function () {
    TodoStore.toggleDone(this.props.todo.id);
  },

  render: function () {
    var doneStr = this.props.todo.done ? "Undo" : "Done";
    return <button onClick={this.handleDone}>{doneStr}</button>
  }
});

var TodoDetailView = React.createClass({
  getInitialState: function () {
    return {expanded: true};
  },

  toggleBody: function () {
    this.setState({expanded: !this.state.expanded})
  },

  render: function () {
    var todo = this.props.todo;
    var body;
    var titleClass = 'title'
    if (this.state.expanded) {
      body = <div className='body'>{todo.body}</div>;
      titleClass += " expanded";
    }

    return (
      <div className="todo-item-detail">
        <div className={titleClass}>{todo.title}</div>
        {body}
        <StepsList key={todo.id} todo={todo} />
      </div>
    );
  }
});

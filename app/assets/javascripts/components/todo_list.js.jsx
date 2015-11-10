var TodosList = React.createClass({
  getInitialState: function () {
    return ({
      todos: TodoStore.all()
    });
  },

  render: function () {
    return (
      <div>
        <TodosForm />
        <ul>
          {
            this.state.todos.map(function (todo, id) {
              return <TodosListItem key={id} todo={todo} />;
            })
          }
        </ul>
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
    TodoStore.destroy(parseInt(e.currentTarget.id));
  },

  render: function () {
    var todo = this.props.todo;

    return (
      <div className='todo-item'>
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
    this.setState({title: e.currentTarget.value});
  },

  updateBody: function (e) {
    this.setState({body: e.currentTarget.value});
  },

  handleSubmit: function (e) {
    TodoStore.create({
      title: this.state.title,
      body: this.state.body
    });
  },

  render: function () {
    return (
      <form onSubmit={this.handleSubmit}>
        <input className="form-title" type="text" onChange={this.updateTitle} value={this.state.title} />
        <textarea className="form-body" onChange={this.updateBody} value={this.state.body} />
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
    return {expanded: false};
  },

  toggleBody: function () {
    this.setState({expanded: !this.state.expanded})
  },

  render: function () {
    var todo = this.props.todo;
    var body;

    if (this.state.expanded) {
      body = <div className='body'>{todo.body}</div>;
    }

    return (
      <div className="todo-item-detail">
        <div onClick={this.toggleBody} className='title'>{todo.title}</div>
        {body}
      </div>
    );
  }
});

var StepsList = React.createClass({
  getInitialState: function () {
    return ({
      steps: StepStore.all(this.props.todo.id)
    });
  },

  render: function () {
    var todo = this.props.todo;
    return (
      <div>
        <StepsForm todo={todo} />
        <ul>
          {
            this.state.steps.map(function (step, id) {
              return (
                <StepsListItem key={id}
                  step={step} todo={todo}/>);
            })
          }
        </ul>
      </div>
    );
  },

  stepsChanged: function () {
    this.setState({steps: StepStore.all(this.props.todo.id)});
  },

  componentDidMount: function () {
    StepStore.addChangedHandler(this.stepsChanged);
    StepStore.fetch(this.props.todo.id);
  },

  componentWilUnmount: function () {
    StepStore.removeChangedHandler(this.stepsChanged);
  }
});

var StepsListItem = React.createClass({
  handleDestroy: function (e) {
    StepStore.destroy(this.props.todo.id, parseInt(e.currentTarget.id));
  },

  render: function () {
    var step = this.props.step;

    return (
      <div className='step-item'>
        <li>{step.content}</li>
        <StepDoneButton step={step} todo={this.props.todo}/>
        <button className="step-item-delete"
                id={step.id}
                onClick={this.handleDestroy}>Delete
        </button>
      </div>
    );
  }
});

var StepsForm = React.createClass({
  getInitialState: function () {
    return ({
      content: "",
    })
  },

  updateContent: function (e) {
    this.setState({content: e.currentTarget.value});
  },

  handleSubmit: function (e) {
    StepStore.create({
      content: this.state.content,
      todo_id: this.props.todo.id
    });
  },

  render: function () {
    return (
      <form onSubmit={this.handleSubmit}>
        <input className="form-content" type="text"
            onChange={this.updateContent}
            value={this.state.content} />
        <button>Add Step</button>
      </form>
    );
  }
});

var StepDoneButton = React.createClass({
  handleDone: function () {
    StepStore.toggleDone(this.props.todo.id, this.props.step.id);
  },

  render: function () {
    var stepDoneStr = this.props.step.done ? "Undo" : "Done";
    return <button onClick={this.handleDone}>{stepDoneStr}</button>
  }
});

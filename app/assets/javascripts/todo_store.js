(function (root) {
  "use strict";
  var _todos = [];
  var _callbacks = [];

  var TodoStore = root.TodoStore = {};

  TodoStore.changed = function () {
    _callbacks.forEach(function(callback) {
      callback();
    });
  };

  TodoStore.addChangedHandler = function (callback) {
    _callbacks.push(callback);
  };

  TodoStore.removeChangedHandler = function (callback) {
    var idx = _callbacks.indexOf(callback);
    _callbacks.splice(idx,1);
  };

  TodoStore.all = function () {
    return _todos.slice();
  };

  TodoStore.fetch = function () {
    $.ajax({
      url: '/api/todos',
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        _todos = data;
        TodoStore.changed();
      }
    });
  };

  TodoStore.create = function (todo) {
    $.ajax({
      url: '/api/todos',
      type: 'POST',
      dataType: 'json',
      data: {todo: todo},
      success: function (data) {
        _todos.push(data);
        TodoStore.changed();
      }
    });
  };

  TodoStore.destroy = function (id) {
    var idx = TodoStore.find(id);
    if (idx >= 0) {
      $.ajax({
        url: '/api/todos/' + id,
        type: 'DELETE',
        dataType: 'json',
        success: function (data) {
          _todos.splice(idx, 1);
          TodoStore.changed();
        }
      });
    }
  };

  TodoStore.find = function (id) {
    for (var i = 0; i < _todos.length; i++) {
      if (_todos[i].id === id) {
        return i;
      }
    }

    return -1;
  };

  TodoStore.toggleDone = function (id) {
    var idx = TodoStore.find(id);

    if (idx >= 0) {
      var done = !_todos[idx].done;

      $.ajax({
        url: '/api/todos/' + id,
        type: 'PATCH',
        dataType: 'json',
        data: {todo: {done: done}},
        success: function (data) {
          _todos[idx].done = done;
          TodoStore.changed();
        }
      });
    }
  };

})(this);

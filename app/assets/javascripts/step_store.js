(function (root) {
  "use strict";
  var _steps = {};
  var _callbacks = [];

  var StepStore = root.StepStore = {};

  StepStore.changed = function () {
    _callbacks.forEach(function(callback) {
      callback();
    });
  };

  StepStore.addChangedHandler = function (callback) {
    _callbacks.push(callback);
  };

  StepStore.removeChangedHandler = function (callback) {
    var idx = _callbacks.indexOf(callback);
    _callbacks.splice(idx,1);
  };

  StepStore.all = function (id) {
    var _return;
    _return = (_steps[id]) ? _steps[id].slice() : [];
    return _return;
  };

  StepStore.fetch = function (id) {
    $.ajax({
      url: '/api/todos/' + id +'/steps',
      type: 'GET',
      dataType: 'json',
      success: function (data) {
        _steps[id] = data;
        StepStore.changed();
      }
    });
  };

  StepStore.create = function (step) {
    $.ajax({
      url: '/api/todos/' + step.todo_id + '/steps/',
      type: 'POST',
      dataType: 'json',
      data: {step: step},
      success: function (data) {
        _steps[step.todo_id].push(data);
        StepStore.changed();
      }
    });
  };

  StepStore.destroy = function (todo_id, id) {
    var idx = StepStore.find(todo_id, id);
    if (idx >= 0) {
      $.ajax({
        url: '/api/steps/' + id,
        type: 'DELETE',
        dataType: 'json',
        success: function (data) {
          _steps[todo_id].splice(idx, 1);
          StepStore.changed();
        }
      });
    }
  };

  StepStore.find = function (todo_id, id) {
    for (var i = 0; i < _steps[todo_id].length; i++) {
      if (_steps[todo_id][i].id === id) {
        return i;
      }
    }

    return -1;
  };

  StepStore.toggleDone = function (todo_id, id) {
    var idx = StepStore.find(todo_id, id);

    if (idx >= 0) {
      var done = !_steps[todo_id][idx].done;

      $.ajax({
        url: '/api/steps/' + id,
        type: 'PATCH',
        dataType: 'json',
        data: {step: {done: done}},
        success: function (data) {
          _steps[todo_id][idx].done = done;
          StepStore.changed();
        }
      });
    }
  };

})(this);

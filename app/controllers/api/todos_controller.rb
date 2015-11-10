class Api::TodosController < ApplicationController
  def index
    @todos = Todo.all
    render json: @todos.to_json
  end

  def show
    @todo = Todo.find(params[:id])
    render json: @todo.to_json
  end

  def create
    @todo = Todo.create!(todo_params)
    render json: @todo.to_json
  end

  def update
    @todo = Todo.find(params[:id])
    @todo.update!(todo_params)
    render json: @todo.to_json
  end

  def destroy
    @todo = Todo.find(params[:id])
    @todo.destroy!
    render json: @todo.to_json
  end

  private
  def todo_params
    params.require(:todo).permit(:title, :body, :done)
  end
end

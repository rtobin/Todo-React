class Api::StepsController < ApplicationController
  def index
    @steps = Step.where(todo_id: params[:todo_id])
    render json: @steps.to_json
  end

  def create
    @step = Step.new(step_params)
    @step.todo_id = params[:todo_id]
    @step.save!
    render json: @step.to_json
  end

  def update
    @step = Step.find(params[:id])
    @step.update!(step_params)
    render json: @step.to_json
  end

  def destroy
    @step = Step.find(params[:id])
    @step.destroy!
    render json: @step.to_json
  end

  private
  def step_params
    params.require(:step).permit(:content, :done)
  end
end

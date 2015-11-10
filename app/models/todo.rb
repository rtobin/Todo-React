class Todo < ActiveRecord::Base
  validates :title, :body, presence: true
  validates :done, inclusion: {in: [true, false]}

  has_many :steps,
    class_name: 'Step',
    foreign_key: :todo_id,
    primary_key: :id
end

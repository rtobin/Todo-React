class CreateSteps < ActiveRecord::Migration
  def change
    create_table :steps do |t|
      t.integer :todo_id, null: false
      t.text :content, null: false

      t.timestamps null: false
    end
    add_foreign_key :steps, :todos, column: :todo_id
    add_index :steps, :todo_id
  end
end

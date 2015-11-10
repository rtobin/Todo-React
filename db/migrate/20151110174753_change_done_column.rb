class ChangeDoneColumn < ActiveRecord::Migration
  def change
    remove_column :todos, :done
    add_column :todos, :done, :boolean, default: false
  end
end

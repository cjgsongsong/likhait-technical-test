class Api::CategoriesController < ApplicationController
  def index
    categories = Category.order(:name)
    render json: categories
  end

  def category_params
    params.require(:category).permit(:name)
  end

  def format_category(category)
    {
      created_at: category.created_at,
      id: category.id,
      name: category.name,
      updated_at: category.updated_at,
    }
  end
end

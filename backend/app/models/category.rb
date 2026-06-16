class Category < ApplicationRecord
  has_many :expenses, dependent: :destroy

  validates :name, uniqueness: { case_sensitive: false }, format: {
    with: /\A[A-Z][A-Za-z0-9 ]*\z/,
    message: "must start with an uppercase letter followed by zero to many alphanumeric characters and spaces"
  }
end

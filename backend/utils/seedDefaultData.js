const Category = require("../models/Category")
const defaultCategories = require("../data/defaultCategories")

async function seedDefaultCategories() {
  for (const category of defaultCategories) {
    await Category.updateOne(
      { name: category.name },
      {
        $set: {
          description: category.description,
        },
        $setOnInsert: {
          name: category.name,
        },
      },
      { upsert: true }
    )
  }
}

module.exports = {
  seedDefaultCategories,
}

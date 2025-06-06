const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  subcategories: { type: [String], required: false } // ✅ Must be predefined, not user-entered
});

export const Category = mongoose.model('Category', categorySchema);
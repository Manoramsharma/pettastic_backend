const petModel = require("../models/petModel");

class ProductService {
  async uploadProduct(body, user) {
    try {
      const { petName, price, breed, petDescription } = body;

      petModel.create({
        petName,
        price,
        breed,
        petDescription,
      });
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const product = await productModel.findById(id);
      this.deleteImages(product.images).then((_) => {
        productModel.deleteOne({ _id: id }, function (err, __) {
          if (err) {
            throw err;
          }
        });
      });
    } catch (error) {
      l.error("[DELETE PRODUCT SERVICE]", id);
      throw error;
    }
  }
}
module.exports = new ProductService();

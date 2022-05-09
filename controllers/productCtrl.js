const Pets = require("../models/petModel");
const userModel = require("../models/userModel");
const cart = require("../models/cart");

const ProductsService = require("../services/products.service");
class Controller {
  async uploadProduct(req, res, next) {
    try {
      await ProductsService.uploadProduct(req.body, req.user);
      res.status(200).json({ message: "Product Uploaded successfully" });
    } catch (error) {
      next(error);
    }
  }
  async deleteProduct(req, res, next) {
    try {
      const product = await productModel.findById(req.params.id);
      if (!product) throw { status: 404, message: "Product does not exist" };
      const deleteProduct = await ProductsService.deleteProduct(req.params.id);
      res.status(200).json({ message: "Product Deleted successfully" });
    } catch (error) {
      l.error("[DELETE PRODUCT CONTROLLER]", req);
      next(error);
    }
  }

  async addToCart(req, res, next) {
    try {
      let item;
      item = cart.findOne({ user: req.user });
      if (!item) {
        item = new cart({ user: req.user });
      }
      item.product.push(req.params.id);
      item.save();
      res.status(200).json({ message: "Product Added to cart successfully" });
    } catch (error) {
      next(error);
    }
  }

  async getCart(req, res, next) {
    try {
      const item = cart
        .findOne({ user: req.user })
        .populate("cartItems.product");
      if (!item) throw { status: 404, message: "no item found" };

      res.status(200).json({ products: item.cartItems });
    } catch (error) {
      next(error);
    }
  }

  async getAllProducts(req, res) {
    try {
      const result = await Product.find({})
        .populate("user", "username avatar")
        .sort("-createdAt");

      res.status(200).json({ result: result });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error });
    }
  }

  async likeProduct(req, res) {
    try {
      let product = await productModel.find({
        _id: req.params.id,
        likes: req.user._id,
      });

      if (product.length > 0)
        return res.status(500).json({ msg: "You already liked" });

      const newProduct = await productModel
        .findOneAndUpdate(
          { _id: req.params.id },
          {
            $push: {
              likes: req.user._id,
            },
          },
          { new: true }
        )
        .populate("user");
      product = await productModel.find({
        _id: req.params.id,
      });
      await userModel.findOneAndUpdate(
        { _id: newProduct.user._id },
        {
          $push: {
            notifications: {
              userAvatar: req.user.avatar,
              message: `${req.user.fullname} liked you Product`,
              postImg: product[0].images[0],
              url: `/buyproduct/${product[0]._id}`,
            },
            unreadnotifications: {
              userAvatar: req.user.avatar,
              message: `${req.user.fullname} liked you Product`,
              postImg: product[0].images[0],
              url: `/buyproduct/${product[0]._id}`,
            },
          },
        },
        { new: true }
      );

      res.json({ newProduct });
    } catch (err) {
      console.log(err);
      l.error("[LIKE PRODUCT]", req);
      next(error);
    }
  }
  async unlikeProduct(req, res, next) {
    try {
      const newProduct = await productModel.findOneAndUpdate(
        { _id: req.params.id },
        {
          $pull: { likes: req.user._id },
        },
        { new: true }
      );

      res.json({ newProduct });
    } catch (error) {
      next(error);
    }
  }
}
module.exports = new Controller();

import { Product } from './product.model'
import { User, roles } from '../user/user.model'
import { AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}

const product = (_, { id }) => Product.findById(id).exec()

const products = () => Product.find({}).exec()

const newProduct = (_, { input }, ctx) => {
  return Product.create({ ...input, createdBy: ctx.user._id })
}

const updateProduct = (_, { id, input }) => {
  return Product.findByIdAndUpdate(id, input, { new: true }).exec()
}
const removeProduct = (_, { id }) => Product.findByIdAndRemove(id).exec()

export default {
  Query: {
    product,
    products
  },
  Mutation: {
    newProduct,
    updateProduct,
    removeProduct
  },
  Product: {
    __resolveType(product) {},
    async createdBy(product) {
      console.log(product)
      return User.findById(product.createdBy).exec()
    }
  }
}

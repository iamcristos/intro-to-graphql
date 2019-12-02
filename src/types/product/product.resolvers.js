import { Product } from './product.model'
import { User, roles } from '../user/user.model'
import { AuthenticationError } from 'apollo-server'
import mongoose from 'mongoose'

const productsTypeMatcher = {
  GAMING_PC: 'GamingPc',
  BIKE: 'Bike',
  DRONE: 'Drone'
}

/** product */
const product = (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError('not allowed')
  }
  return Product.findById(args.id)
    .lean()
    .exec()
}

const newProduct = (_, args, ctx) => {
  // use this fake ID for createdBy for now until we talk auth
  if (!ctx.user || ctx.user.role !== roles.admin) {
    throw new AuthenticationError('not allowed')
  }
  // const createdBy = mongoose.Types.ObjectId()
  const createdBy = ctx.user._id
  return Product.create({ ...args.input, createdBy })
}

const products = (_, args, ctx) => {
  if (!ctx.user) {
    throw new AuthenticationError('not allowed')
  }
  return Product.find({})
    .lean()
    .exec()
}

const updateProduct = (_, args, ctx) => {
  if (!ctx.user || ctx.user.role !== roles.admin) {
    throw new AuthenticationError('not allowed')
  }
  const update = args.input
  return Product.findByIdAndUpdate(ctx.user.id, update, { new: true })
    .lean()
    .exec()
}

const removeProduct = (_, args, ctx) => {
  if (!ctx.user || ctx.user.role !== roles.admin) {
    throw new AuthenticationError('not allowed')
  }
  return Product.findByIdAndRemove(args.id)
    .lean()
    .exec()
}

export default {
  Query: {
    products,
    product
  },
  Mutation: {
    newProduct,
    updateProduct,
    removeProduct
  },
  Product: {
    __resolveType(product) {
      return productsTypeMatcher[product.type]
    },
    createdBy(product) {
      return User.findById(product.createdBy)
        .lean()
        .exec()
    }
  }
}

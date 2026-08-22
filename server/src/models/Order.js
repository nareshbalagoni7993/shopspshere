import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    image: { type: String }
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  { _id: false }
);

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
  'cancelled'
];

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderDate: { type: Date, default: Date.now },
    status: { type: String, enum: ORDER_STATUSES, default: 'pending' },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    total: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'refunded'],
      default: 'pending'
    },
    shippingAddress: { type: addressSchema, required: true },
    trackingNumber: { type: String },
    estimatedDeliveryDate: { type: Date },
    deliveredDate: { type: Date, default: null }
  },
  { timestamps: true }
);

orderSchema.set('toJSON', {
  virtuals: true,
  transform: (_doc, ret) => {
    ret.id = ret.orderNumber;
    delete ret._id;
    delete ret.__v;
  }
});

export default mongoose.model('Order', orderSchema);

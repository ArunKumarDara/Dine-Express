const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const orderItemsModel = require("../model/orderItemsModel");
const paymentModel = require("../model/paymentModel");
const orderModel = require("../model/orderModel");

const makePayment = async (req, res) => {
  console.log(req.headers.origin);
  try {
    const { cart, orderSummary } = req.body;
    const { totalAmount, user, deliverTo, orderItems } = orderSummary;
    const lineItems = cart.map((product) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 84,
      },
      quantity: product.quantity,
    }));

    const lastOrder = await orderModel.findOne(
      {},
      {},
      { sort: { orderNo: -1 } }
    );
    const lastOrderNumber = lastOrder ? lastOrder.orderNo : 0;
    const order = new orderModel({
      totalAmount,
      user,
      restaurant: cart[0]?.availableIn._id,
      deliverTo,
      orderNo: Number(lastOrderNumber) + 1,
    });
    const saveOrder = await order.save();

    for (let i = 0; i < orderItems.length; i++) {
      const items = new orderItemsModel({
        orderId: saveOrder._id,
        itemId: orderItems[i]._id,
        quantity: orderItems[i].quantity,
      });
      await items.save();
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}&orderId=${saveOrder._id}`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    const payment = new paymentModel({
      user: user,
      order: saveOrder._id,
      sessionId: session.id,
      amount: totalAmount,
    });
    await payment.save();

    res.send({
      success: true,
      message: "payment successful",
      url: session.url,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = makePayment;

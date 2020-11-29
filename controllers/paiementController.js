const stripe = require("stripe")(process.env.STRIPE_KEY);

const postCharge = async (req, res) => {
  try {
    const { amount, source, receipt_email } = req.body;

    const charge = await stripe.charges.create({
      amount,
      currency: "eur",
      source,
      receipt_email,
    });
    if (!charge) throw new Error("charge unsuccessful");

    res.status(200).json({
      message: "charge posted successfully",
      charge,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { postCharge };

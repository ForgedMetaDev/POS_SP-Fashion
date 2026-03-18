const gstCalculator = (amount, gstRate) => {
  const gst = Number(((amount * gstRate) / 100).toFixed(2));
  const cgst = Number((gst / 2).toFixed(2));
  const sgst = Number((gst / 2).toFixed(2));
  const finalAmount = Number((amount + gst).toFixed(2));

  return {
    gst,
    cgst,
    sgst,
    finalAmount
  };
};

module.exports = gstCalculator;

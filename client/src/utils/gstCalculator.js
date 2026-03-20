export const calculateGST = (amount, gstRate) => {
  const safeAmount = Number(amount) || 0;
  const safeRate = Number(gstRate) || 0;

  const gst = (safeAmount * safeRate) / 100;
  const cgst = gst / 2;
  const sgst = gst / 2;
  const finalAmount = safeAmount + gst;

  return {
    amount: Number(safeAmount.toFixed(2)),
    gst: Number(gst.toFixed(2)),
    cgst: Number(cgst.toFixed(2)),
    sgst: Number(sgst.toFixed(2)),
    finalAmount: Number(finalAmount.toFixed(2))
  };
};

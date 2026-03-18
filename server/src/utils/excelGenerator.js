const ExcelJS = require('exceljs');

const createSalesExcelBuffer = async (title, rows) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Sales Report');

  sheet.addRow([title]);
  sheet.mergeCells('A1:F1');
  sheet.getCell('A1').font = { bold: true, size: 14 };

  sheet.addRow(['Date', 'Order Count', 'Total Amount', 'CGST', 'SGST', 'Final Amount']);
  sheet.getRow(2).font = { bold: true };

  rows.forEach((row) => {
    sheet.addRow([
      row.label,
      row.orderCount,
      row.totalAmount,
      row.cgst,
      row.sgst,
      row.finalAmount
    ]);
  });

  sheet.columns.forEach((column) => {
    column.width = 18;
  });

  return workbook.xlsx.writeBuffer();
};

module.exports = {
  createSalesExcelBuffer
};

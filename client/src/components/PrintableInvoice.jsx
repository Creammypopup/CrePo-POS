import React from 'react';

// This is the component that will be printed
export const PrintableInvoice = React.forwardRef((props, ref) => {
    // In a real app, you would pass invoice data via props
    const { invoiceData } = props;

    return (
        <div ref={ref} className="p-8 font-sans">
            <header className="flex justify-between items-center pb-4 border-b">
                <div>
                    <h1 className="text-3xl font-bold">ใบแจ้งหนี้/Invoice</h1>
                    <p>เลขที่: INV-2025-001</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold">บริษัท วัสดุก่อสร้าง จำกัด</h2>
                    <p>123 หมู่ 4 ต.บางประกอก อ.อัมพวา จ.สมุทรสงคราม 75110</p>
                    <p>โทร: 089-123-4567</p>
                </div>
            </header>
            <main className="mt-8">
                {/* Customer Info */}
                <section className="mb-8">
                    <h3 className="font-bold mb-2">ข้อมูลลูกค้า:</h3>
                    <p>คุณ สมชาย ใจดี</p>
                    <p>99/9 ถ.พระราม 2 กทม. 10150</p>
                </section>
                {/* Items Table */}
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">รายการ</th>
                            <th className="p-2 text-right">จำนวน</th>
                            <th className="p-2 text-right">ราคา/หน่วย</th>
                            <th className="p-2 text-right">รวม</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border-b">
                            <td className="p-2">ปูนซีเมนต์ TPI (แดง)</td>
                            <td className="p-2 text-right">10</td>
                            <td className="p-2 text-right">150.00</td>
                            <td className="p-2 text-right">1,500.00</td>
                        </tr>
                        <tr className="border-b">
                            <td className="p-2">ท่อ PVC 4 นิ้ว</td>
                            <td className="p-2 text-right">5</td>
                            <td className="p-2 text-right">80.00</td>
                            <td className="p-2 text-right">400.00</td>
                        </tr>
                    </tbody>
                </table>
                {/* Total */}
                <div className="flex justify-end mt-4">
                    <div className="w-1/3">
                        <div className="flex justify-between">
                            <span className="font-bold">ยอดรวม</span>
                            <span>1,900.00</span>
                        </div>
                         <div className="flex justify-between font-bold text-xl mt-2 border-t pt-2">
                            <span>ยอดสุทธิ</span>
                            <span>1,900.00</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
});
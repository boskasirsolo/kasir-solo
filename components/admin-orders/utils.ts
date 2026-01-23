
import { Order, OrderItem, SiteConfig } from '../../types';
import { formatRupiah, formatOrderId } from '../../utils';

export const getStatusColor = (status: string) => {
    switch(status) {
        case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        case 'paid': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        case 'processed': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
        case 'completed': return 'bg-green-500/10 text-green-400 border-green-500/20';
        case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
        default: return 'bg-gray-500/10 text-gray-500';
    }
};

export const handlePrintInvoice = (order: Order, items: OrderItem[], config: SiteConfig) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert("Pop-up diblokir. Izinkan pop-up untuk mencetak invoice.");

    const invoiceDate = new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    const companyName = config.company_legal_name || "PT MESIN KASIR SOLO";
    const companyAddress = config.address_solo || "Perum Graha Tiara 2 B1, Kartasura, Sukoharjo";
    const companyPhone = config.whatsapp_number ? (config.whatsapp_number.startsWith('62') ? '+' + config.whatsapp_number : config.whatsapp_number) : "+62 823 2510 3336";
    const companyEmail = config.email_address || "admin@kasirsolo.my.id";
    const displayId = formatOrderId(order.id);

    const html = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <title>Invoice #${displayId}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap');
            @page { size: A4; margin: 0; }
            body { 
                font-family: 'Outfit', sans-serif; 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact;
                margin: 0;
                background: #f3f4f6;
            }
            .page {
                width: 210mm;
                height: 297mm;
                padding: 0;
                margin: 0 auto;
                background: white;
                position: relative;
                overflow: hidden;
                box-shadow: 0 0 20px rgba(0,0,0,0.1);
            }
            .header-bg {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 180px;
                background: #111827;
                z-index: 0;
            }
            .header-stripe {
                position: absolute;
                top: 0;
                right: 35%;
                width: 80px;
                height: 300px;
                background: #FF5F1F;
                transform: skewX(-35deg);
                z-index: 1;
            }
            .content-wrapper {
                position: relative;
                z-index: 10;
                padding: 40px 60px;
            }
            .pill-label {
                background: #111827;
                color: white;
                padding: 4px 15px;
                border-radius: 4px;
                font-size: 10pt;
                font-weight: 700;
                display: inline-block;
                margin-bottom: 15px;
            }
            table { width: 100%; border-collapse: collapse; }
            th { 
                background: #FF5F1F; 
                color: white; 
                text-transform: uppercase; 
                font-size: 10pt; 
                padding: 12px 15px;
                text-align: left;
            }
            td { 
                padding: 15px; 
                border-bottom: 1.5px solid #eee;
                font-size: 10pt;
                color: #374151;
            }
            .total-box {
                background: #FF5F1F;
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                font-weight: 800;
                font-size: 14pt;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .footer-accent {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 40px;
                display: flex;
            }
            .footer-orange { background: #FF5F1F; flex: 1; }
            .footer-navy { 
                background: #111827; 
                width: 40%;
                clip-path: polygon(20% 0, 100% 0, 100% 100%, 0% 100%);
            }
        </style>
    </head>
    <body>
        <div class="page">
            <div class="header-bg"></div>
            <div class="header-stripe"></div>

            <div class="content-wrapper">
                <!-- TOP HEADER -->
                <div class="flex justify-between items-start mb-20">
                    <div class="text-white">
                        <h1 class="text-3xl font-bold tracking-tighter leading-none">PT MESIN KASIR SOLO</h1>
                        <p class="text-xs tracking-[0.3em] uppercase opacity-70 mt-2">Digital Solutions Partner</p>
                    </div>
                    <div class="text-right">
                        <h2 class="text-5xl font-bold text-brand-orange leading-none" style="color: #FF5F1F">INVOICE</h2>
                        <p class="text-sm font-bold text-white mt-2">ID NO : ${displayId}</p>
                    </div>
                </div>

                <!-- ADDRESSES -->
                <div class="grid grid-cols-2 gap-20 mb-16">
                    <div>
                        <div class="pill-label">Invoice To :</div>
                        <div class="pl-1">
                            <p class="font-bold text-lg text-gray-900 uppercase">${order.customer_name}</p>
                            <p class="text-sm text-gray-500 mt-1 leading-relaxed">${order.customer_address}</p>
                            <p class="text-sm text-gray-500 font-bold mt-1">Phone : ${order.customer_phone}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="pill-label">Invoice From :</div>
                        <div class="pr-1">
                            <p class="font-bold text-lg text-gray-900">${companyName}</p>
                            <p class="text-sm text-gray-500 mt-1 leading-relaxed">${companyAddress}</p>
                            <p class="text-sm text-gray-500 font-bold mt-1">Phone : ${companyPhone}</p>
                        </div>
                    </div>
                </div>

                <!-- TABLE -->
                <table class="mb-10">
                    <thead>
                        <tr>
                            <th style="width: 50%">DESCRIPTION</th>
                            <th style="text-align: center">PRICE</th>
                            <th style="text-align: center">QTY</th>
                            <th style="text-align: right">TOTAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items.map(item => `
                            <tr>
                                <td class="font-bold">${item.product_name}</td>
                                <td align="center">${formatRupiah(item.price).replace('Rp', '').trim()}</td>
                                <td align="center">${item.quantity}</td>
                                <td align="right" class="font-bold">${formatRupiah(item.price * item.quantity).replace('Rp', '').trim()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <!-- FOOTER INFO -->
                <div class="grid grid-cols-12 gap-8 mt-12">
                    <div class="col-span-7 space-y-8">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div class="pill-label !mb-3">Payment Method :</div>
                                <p class="text-[9pt] text-gray-500">Account No : <span class="text-gray-900 font-bold">5859 4594 0674 0414</span></p>
                                <p class="text-[9pt] text-gray-500">Bank : <span class="text-gray-900 font-bold">Bank Neo Commerce</span></p>
                                <p class="text-[9pt] text-gray-500">Name : <span class="text-gray-900 font-bold">PT MESIN KASIR SOLO</span></p>
                            </div>
                            <div>
                                <div class="pill-label !mb-3">Contact Info :</div>
                                <p class="text-[9pt] text-gray-500">Phone : <span class="text-gray-900 font-bold">${companyPhone}</span></p>
                                <p class="text-[9pt] text-gray-500">Email : <span class="text-gray-900 font-bold">${companyEmail}</span></p>
                                <p class="text-[9pt] text-gray-500">Web : <span class="text-gray-900 font-bold">www.kasirsolo.my.id</span></p>
                            </div>
                        </div>
                        
                        <div>
                            <h4 class="font-bold text-gray-900 mb-2">Thanks for your business</h4>
                            <p class="text-[8pt] text-gray-400 leading-relaxed italic">
                                Barang yang sudah dibeli tidak dapat ditukar atau dikembalikan kecuali ada perjanjian garansi sebelumnya. 
                                Pastikan melakukan video unboxing saat paket diterima untuk klaim asuransi pengiriman.
                            </p>
                        </div>
                    </div>

                    <div class="col-span-5 space-y-3 pt-4">
                        <div class="flex justify-between text-gray-600 font-bold">
                            <span>Subtotal :</span>
                            <span>${formatRupiah(order.total_amount)}</span>
                        </div>
                        <div class="flex justify-between text-gray-400 text-sm">
                            <span>Tax (0%) :</span>
                            <span>Rp 0</span>
                        </div>
                        <div class="flex justify-between text-gray-400 text-sm pb-4 border-b border-gray-100">
                            <span>Discount :</span>
                            <span>Rp 0</span>
                        </div>
                        <div class="total-box">
                            <span>TOTAL</span>
                            <span>${formatRupiah(order.total_amount)}</span>
                        </div>

                        <div class="pt-16 text-center">
                            <div class="w-48 border-b-2 border-gray-900 mx-auto mb-2"></div>
                            <p class="font-bold text-gray-900 uppercase">${order.customer_name}</p>
                            <p class="text-[8pt] text-gray-400 uppercase tracking-widest">Authorized Signature</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- BOTTOM STRIPE -->
            <div class="footer-accent">
                <div class="footer-orange"></div>
                <div class="footer-navy"></div>
            </div>
        </div>

        <script>
            window.onload = () => {
                setTimeout(() => {
                    window.print();
                }, 800);
            }
        </script>
    </body>
    </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
};

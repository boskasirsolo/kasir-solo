
import { Order, OrderItem, SiteConfig } from '../../types';
import { formatRupiah } from '../../utils';

export const getStatusColor = (status: string) => {
    switch(status) {
        case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        case 'paid': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        case 'processed': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
        case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
        case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
        default: return 'bg-gray-500/10 text-gray-500';
    }
};

export const handlePrintInvoice = (order: Order, items: OrderItem[], config: SiteConfig) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert("Pop-up diblokir. Izinkan pop-up untuk mencetak invoice.");

    const invoiceDate = new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    const dueDate = new Date(new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    const companyName = config.companyLegalName || "PT MESIN KASIR SOLO";
    const companyAddress = config.addressSolo || "Perum Graha Tiara 2 B1, Kartasura, Sukoharjo, Jawa Tengah";
    const companyPhone = config.whatsappNumber ? (config.whatsappNumber.startsWith('62') ? '+' + config.whatsappNumber : config.whatsappNumber) : "+62 823 2510 3336";
    const stampColor = order.status === 'cancelled' ? 'text-red-500 border-red-500' : 'text-green-600 border-green-600';
    
    const isPaid = order.status === 'completed' || order.status === 'paid' || order.status === 'processed';
    const stampText = isPaid ? 'LUNAS (PAID)' : (order.status === 'cancelled' ? 'DIBATALKAN' : 'UNPAID');

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Invoice #${order.id}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            @page { size: A4; margin: 0; }
            body { 
                font-family: 'Inter', sans-serif; 
                -webkit-print-color-adjust: exact; 
                print-color-adjust: exact;
                width: 210mm; height: 297mm;
                background: white; margin: 0 auto; padding: 10mm 15mm;
                box-sizing: border-box; display: flex; flex-direction: column;
                justify-content: space-between; position: relative;
            }
            .watermark { 
                position: absolute; top: 45%; left: 50%; 
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 6rem; weight: 900; opacity: 0.1; 
                border: 6px solid; padding: 1rem 3rem; 
                z-index: 0; white-space: nowrap; pointer-events: none;
            }
            table { width: 100%; border-collapse: collapse; font-size: 10pt; }
            th { text-transform: uppercase; font-size: 8pt; letter-spacing: 0.05em; color: #6b7280; padding: 8px 4px; border-bottom: 2px solid #e5e7eb; border-top: 1px solid #e5e7eb; background: #f9fafb; }
            td { padding: 8px 4px; border-bottom: 1px solid #f3f4f6; color: #1f2937; }
            .totals-row td { border-bottom: none; padding-top: 4px; padding-bottom: 4px; }
        </style>
    </head>
    <body>
        <div class="watermark ${stampColor}">${stampText}</div>
        <div style="flex: 1; display: flex; flex-direction: column;">
            <div class="flex justify-between items-start mb-8 relative z-10 border-b border-gray-200 pb-6">
                <div class="w-1/2 pr-4">
                    <h1 class="text-2xl font-bold text-gray-900 mb-1 tracking-tight">${companyName}</h1>
                    <p class="text-xs text-gray-500 leading-relaxed max-w-xs">${companyAddress}</p>
                    <p class="text-xs text-gray-500 mt-1 font-mono">Tel: ${companyPhone}</p>
                    ${config.npwpNumber ? `<p class="text-xs text-gray-500 mt-0.5 font-mono">NPWP: ${config.npwpNumber}</p>` : ''}
                </div>
                <div class="text-right w-1/2">
                    <h2 class="text-3xl font-bold text-gray-800 uppercase tracking-widest mb-1">Invoice</h2>
                    <p class="text-sm font-bold text-gray-600">#INV-${order.id}</p>
                    <div class="mt-2 text-xs text-gray-500">
                        <p>Tanggal: <span class="text-gray-900 font-medium">${invoiceDate}</span></p>
                        <p>Jatuh Tempo: <span class="text-gray-900 font-medium">${dueDate}</span></p>
                    </div>
                </div>
            </div>
            <div class="flex justify-between mb-8 relative z-10 bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                <div class="w-1/2">
                    <h3 class="text-[8pt] font-bold text-gray-400 uppercase tracking-wider mb-2">Ditagihkan Kepada:</h3>
                    <p class="text-sm font-bold text-gray-900 uppercase">${order.customer_name}</p>
                    <p class="text-xs text-gray-600 max-w-xs leading-snug mt-1">${order.customer_address}</p>
                    <p class="text-xs text-gray-600 mt-1 font-mono">${order.customer_phone}</p>
                </div>
                ${order.tracking_number ? `
                <div class="text-right w-1/2">
                    <h3 class="text-[8pt] font-bold text-gray-400 uppercase tracking-wider mb-2">Info Pengiriman:</h3>
                    <p class="text-sm font-bold text-gray-800">${order.courier}</p>
                    <p class="text-xs font-mono text-gray-600 bg-white border border-gray-200 px-2 py-1 rounded inline-block mt-1">Resi: ${order.tracking_number}</p>
                </div>` : ''}
            </div>
            <div class="relative z-10 flex-grow">
                <table class="w-full mb-6">
                    <thead><tr><th class="text-left pl-2">Deskripsi Produk</th><th class="text-center w-16">Qty</th><th class="text-right w-32">Harga Satuan</th><th class="text-right w-32 pr-2">Total</th></tr></thead>
                    <tbody>
                        ${items.map((item: any) => {
                            const specs = item.products?.specs;
                            const specsText = specs ? Object.entries(specs).map(([k, v]) => `${k}: ${v}`).join('; ') : '';
                            return `<tr><td class="pl-2 py-2 align-top"><p class="font-medium text-gray-900">${item.product_name}</p>${specsText ? `<p class="text-[8pt] text-gray-500 leading-tight mt-0.5 italic">${specsText}</p>` : ''}</td><td class="text-center text-gray-500 py-2 align-top">${item.quantity}</td><td class="text-right text-gray-500 py-2 align-top">Rp ${new Intl.NumberFormat('id-ID').format(item.price)}</td><td class="text-right font-bold pr-2 py-2 align-top">Rp ${new Intl.NumberFormat('id-ID').format(item.price * item.quantity)}</td></tr>`
                        }).join('')}
                    </tbody>
                </table>
            </div>
            <div class="flex flex-row justify-between items-start mb-8 relative z-10 mt-4 border-t border-gray-200 pt-6">
                <div class="w-1/2 pr-8">
                    <h4 class="text-[8pt] font-bold text-gray-400 uppercase mb-2">Pembayaran Transfer:</h4>
                    <div class="text-xs text-gray-700 bg-gray-50 p-3 rounded border border-gray-100">
                        <p class="font-bold">Bank Neo Commerce (BNC)</p>
                        <p class="font-mono text-sm my-1">5859 4594 0674 0414</p>
                        <p class="text-[10px] text-gray-500 uppercase">a.n PT MESIN KASIR SOLO</p>
                    </div>
                </div>
                <div class="w-1/2 pl-8">
                    <table class="w-full">
                        <tr class="totals-row"><td class="text-right text-xs text-gray-500">Subtotal</td><td class="text-right text-xs font-bold text-gray-800 w-32">${formatRupiah(order.total_amount)}</td></tr>
                        <tr class="totals-row"><td class="text-right text-xs text-gray-500">Pajak (PPN 0%)</td><td class="text-right text-xs font-bold text-gray-800">Rp 0</td></tr>
                        <tr><td class="text-right text-lg font-bold text-gray-900 pt-2">TOTAL</td><td class="text-right text-lg font-bold text-gray-900 pt-2">${formatRupiah(order.total_amount)}</td></tr>
                    </table>
                </div>
            </div>
        </div>
        <div class="grid grid-cols-2 gap-8 pt-2 relative z-10 mb-10">
            <div class="text-center pt-2"><p class="text-xs text-gray-400">Penerima</p><div class="h-20 border-b border-gray-300 w-2/3 mx-auto"></div><p class="text-xs text-gray-800 font-bold mt-2 uppercase">${order.customer_name}</p></div>
            <div class="text-center pt-2"><p class="text-xs text-gray-400">Hormat Kami,</p><div class="h-20 border-b border-gray-300 w-2/3 mx-auto"></div><p class="text-xs text-gray-800 font-bold mt-2">Finance Dept.</p></div>
        </div>
        <script>window.onload = () => { setTimeout(() => window.print(), 500); }</script>
    </body></html>`;
    printWindow.document.write(html);
    printWindow.document.close();
};


import React from 'react';
import { Search } from 'lucide-react';
import { Product } from '../types';
import { SectionHeader, Badge, Card, Input } from '../components/ui';
import { formatRupiah } from '../utils';

export const ShopPage = ({ products }: { products: Product[] }) => (
  <div className="container mx-auto px-4 py-10 animate-fade-in">
    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
      <div className="text-left">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">Katalog <span className="text-brand-orange">Mesin Kasir</span></h2>
        <p className="text-gray-400 text-lg">Pilihan paket POS terbaik untuk Retail, F&B, dan Jasa</p>
      </div>
      <div className="relative group w-full md:w-80">
        <Input 
          value="" onChange={() => {}} 
          placeholder="Cari hardware..." 
          className="pl-12 py-3 rounded-full"
        />
        <Search className="absolute left-4 top-3.5 text-gray-500 w-5 h-5 group-hover:text-brand-orange transition-colors" />
      </div>
    </div>

    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <Card key={product.id} className="flex flex-col h-full">
          <div className="relative h-56 overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
            <div className="absolute top-3 right-3">
              <Badge>{product.category}</Badge>
            </div>
          </div>
          <div className="p-6 flex flex-col flex-grow relative">
            <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">{product.name}</h3>
            <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-grow">{product.description}</p>
            <div className="mt-auto pt-4 border-t border-white/5">
              <div className="text-2xl font-display font-bold text-brand-orange mb-4">{formatRupiah(product.price)}</div>
              <a 
                href={`https://wa.me/6282325103336?text=Halo PT Mesin Kasir Solo, saya tertarik dengan produk ${product.name}.`}
                target="_blank"
                rel="noreferrer"
                className="w-full block text-center py-3 bg-white/5 border border-white/10 hover:bg-brand-orange hover:border-brand-orange text-white rounded-lg font-bold transition-all hover:shadow-neon"
              >
                Pesan / Tanya Stok
              </a>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

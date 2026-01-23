
import React from 'react';
import { Package, User, Phone, MapPin, DollarSign, Calendar, MessageCircle, ArrowRight } from 'lucide-react';
import { Order, Lead } from '../../types';
import { formatRupiah, formatOrderId } from '../../utils';
import { CmdBadge, CmdButton } from '../admin/ui-shared/atoms';

// --- MOLEKUL: KARTU PESANAN RINGKAS ---
export const OrderMiniCard = ({ 
  order, 
  onClick, 
  isActive 
}: { 
  order: Order, 
  onClick: () => void, 
  isActive: boolean 
}) => (
  <div 
    onClick={onClick}
    className={`p-4 rounded-2xl border transition-all cursor-pointer group mb-2 ${
      isActive 
        ? 'bg-brand-orange/10 border-brand-orange shadow-neon-text/5' 
        : 'bg-brand-card/40 border-white/5 hover:border-white/20'
    }`}
  >
    <div className="flex justify-between items-start mb-3">
      <div className="flex items-center gap-2">
        <Package size={14} className={isActive ? 'text-brand-orange' : 'text-gray-600'} />
        <span className="font-mono text-[10px] text-gray-400">#{formatOrderId(order.id, 'ORD')}</span>
      </div>
      <CmdBadge 
        label={order.status} 
        variant={order.status === 'completed' ? 'success' : order.status === 'pending' ? 'warning' : 'info'} 
      />
    </div>
    
    <h5 className={`text-xs font-bold truncate mb-1 ${isActive ? 'text-white' : 'text-gray-300'}`}>
      {order.customer_name}
    </h5>
    
    <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
      <span className="text-[10px] text-gray-500 font-mono">
        {new Date(order.created_at).toLocaleDateString('id-ID')}
      </span>
      <span className="text-xs font-black text-brand-orange">
        {formatRupiah(order.total_amount)}
      </span>
    </div>
  </div>
);

// --- MOLEKUL: KARTU LEAD (SHADOW/SIMULASI) ---
export const LeadMiniCard = ({ 
  lead, 
  onFollowUp 
}: { 
  lead: Lead, 
  onFollowUp: (l: Lead) => void 
}) => (
  <div className="p-4 rounded-2xl bg-brand-dark/50 border border-white/5 hover:border-blue-500/30 transition-all group">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-blue-400 transition-colors">
        <User size={18} />
      </div>
      <div className="min-w-0">
        <h4 className="text-xs font-bold text-white truncate">{lead.name}</h4>
        <p className="text-[9px] text-gray-500 font-mono">{lead.phone}</p>
      </div>
    </div>
    
    <div className="bg-black/30 p-2 rounded-lg border border-white/5 mb-4">
      <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">ID LEAD: #{formatOrderId(lead.id, 'LED')}</p>
      <p className="text-[10px] text-gray-400 italic line-clamp-1">{lead.interest || 'Umum'}</p>
    </div>

    <CmdButton 
      onClick={() => onFollowUp(lead)} 
      variant="ghost" 
      icon={MessageCircle} 
      label="SAPA JURAGAN" 
      className="w-full py-2 hover:bg-green-600/10 hover:text-green-500 hover:border-green-500/30"
    />
  </div>
);

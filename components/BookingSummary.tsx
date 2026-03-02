
import React, { useState, useMemo } from 'react';
import { BookingState, DiscountInfo, Guest, EventData } from '../types';
import { 
  CreditCard, 
  Upload, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  FileCheck,
  Percent,
  AlertCircle,
  ShieldCheck,
  Info,
  Heart,
  Tag,
  Trash2,
  FileText,
  User,
  Paperclip,
  Sparkles,
  GraduationCap,
  Shield,
  ChevronLeft
} from 'lucide-react';
import { STUDENT_DISCOUNT_PERCENT, SERVICE_DISCOUNT_PERCENT, TAX_RATE, MOCK_EVENT, MOCK_COUPONS } from '../constants';

interface BookingSummaryProps {
  bookingState: BookingState;
  event: EventData;
  ui: any;
  config: any;
  onConfirm: () => void;
  onBack: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ bookingState, event, ui, config, onConfirm, onBack }) => {
  const [expandedGuests, setExpandedGuests] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<DiscountInfo | null>(null);
  const [couponError, setCouponError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateAddOns = (guest: Guest) => {
    let total = 0;
    if (guest.addOns.foodPass) total += config.addOnPrices.foodPass;
    if (guest.addOns.adventurePass) total += config.addOnPrices.adventurePass;
    if (guest.addOns.extraStay.enabled) {
      const room = config.roomTypes.find((r: any) => r.name === guest.addOns.extraStay.type);
      if (room) {
        total += room.price * guest.addOns.extraStay.days;
      }
    }
    return total;
  };

  const basePrice = bookingState.plan?.finalPrice || 0;
  const totalAddOns = bookingState.guests.reduce((sum, guest) => sum + calculateAddOns(guest), 0);
  const subtotal = (basePrice * bookingState.guests.length) + totalAddOns;
  
  const discount = appliedCoupon 
    ? (appliedCoupon.type === 'percentage' ? (subtotal * appliedCoupon.value / 100) : appliedCoupon.value)
    : 0;
    
  const tax = (subtotal - discount) * config.taxRate;
  const total = subtotal - discount + tax;

  const handleApplyCoupon = () => {
    const coupon = config.coupons.find((c: any) => c.code.toUpperCase() === couponCode.toUpperCase());
    if (coupon) {
      setAppliedCoupon(coupon);
      setCouponError('');
    } else {
      setCouponError(ui.payment.coupon.error);
      setAppliedCoupon(null);
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirm();
    }, 2000);
  };

  const bookingDate = useMemo(() => new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 w-full animate-fadeIn pb-32">
      {/* Banner & Title Section */}
      <div className="mb-10 bg-white rounded-[32px] overflow-hidden shadow-sm border border-stone-100">
        <div className="h-48 relative">
          <img src={event.banner} className="w-full h-full object-cover brightness-75" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent flex items-end p-8">
            <div className="text-white">
              <h2 className="text-3xl font-black tracking-tight">{event.title}</h2>
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest mt-2 text-stone-200">
                <span>{event.date}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                <span>Booking Date: {bookingDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-8">
          {/* Guest-wise Summary Table */}
          <div className="bg-white rounded-[32px] shadow-sm border border-stone-100 overflow-hidden">
             <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                   <h4 className="text-lg font-bold flex items-center gap-2 text-stone-900">
                      <Heart className="w-5 h-5 text-teal-700" /> {ui.sections.guests.title}
                   </h4>
                   <button 
                     onClick={() => setExpandedGuests(!expandedGuests)}
                     className="text-teal-700 text-[10px] font-black uppercase tracking-widest bg-teal-50 px-4 py-2 rounded-xl hover:bg-teal-100 transition-all flex items-center gap-2"
                   >
                     {expandedGuests ? <><ChevronUp className="w-3 h-3" /> {ui.sections.guests.hideDetails}</> : <><ChevronDown className="w-3 h-3" /> {ui.sections.guests.viewDetails}</>}
                   </button>
                </div>

                <div className="overflow-hidden border border-stone-100 rounded-2xl">
                   <table className="w-full text-left text-sm border-collapse">
                      <thead className="bg-stone-50 text-stone-500 font-bold uppercase text-[10px] tracking-widest">
                         <tr>
                            <th className="px-6 py-4">{ui.table.particulars}</th>
                            <th className="px-6 py-4 text-center">{ui.table.guests}</th>
                            <th className="px-6 py-4 text-right">{ui.table.amount}</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-50">
                         {bookingState.guests.map((g, idx) => (
                           <React.Fragment key={g.id}>
                             <tr className={`bg-white hover:bg-stone-50/50 transition-colors ${g.age < 18 ? 'bg-teal-50/10' : ''}`}>
                                <td className="px-6 py-4">
                                   <p className="font-bold text-stone-900">{g.name}</p>
                                   <p className="text-[10px] text-stone-400 font-medium">
                                     {g.age < 18 ? 'Young Mind Plan' : 'Standard Plan'} ({bookingState.plan?.title})
                                   </p>
                                </td>
                                <td className="px-6 py-4 text-center font-bold text-stone-600">1</td>
                                <td className="px-6 py-4 text-right">
                                   <p className="font-black text-stone-900">₹{(basePrice + calculateAddOns(g)).toLocaleString()}</p>
                                   <p className="text-[9px] text-stone-400 font-bold uppercase tracking-tight">
                                     Base: ₹{basePrice.toLocaleString()} {calculateAddOns(g) > 0 ? `+ Add-ons: ₹${calculateAddOns(g).toLocaleString()}` : ''}
                                   </p>
                                </td>
                             </tr>
                             {expandedGuests && (
                               <tr className="bg-stone-50/30">
                                 <td colSpan={3} className="px-10 py-3">
                                   <div className="text-[10px] space-y-1">
                                      <div className="grid grid-cols-2 gap-x-8">
                                         <p className="text-stone-500">Age: <span className="font-bold text-stone-900">{g.age}</span></p>
                                         <p className="text-stone-500">Contact: <span className="font-bold text-stone-900">{g.phone}</span></p>
                                      </div>
                                      {g.remark && (
                                        <div className="mt-2 pt-2 border-t border-stone-100">
                                          <p className="font-black text-stone-300 uppercase text-[8px] mb-0.5">Remark Box</p>
                                          <p className="italic text-stone-400">"{g.remark}"</p>
                                        </div>
                                      )}
                                   </div>
                                 </td>
                               </tr>
                             )}
                           </React.Fragment>
                         ))}

                         <tr className="bg-stone-50/50">
                            <td className="px-6 py-4 font-black text-stone-500 text-[10px] uppercase tracking-widest">{ui.payment.breakdown.subtotal}</td>
                            <td className="px-6 py-4 text-center font-bold text-stone-500">{bookingState.guests.length}</td>
                            <td className="px-6 py-4 text-right font-black text-stone-900">₹{subtotal.toLocaleString()}</td>
                         </tr>

                         {discount > 0 && (
                           <tr className="bg-emerald-50/30">
                              <td className="px-6 py-4">
                                 <p className="font-bold text-emerald-800">{ui.payment.coupon.applied}</p>
                                 <p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest">{appliedCoupon?.code}</p>
                              </td>
                              <td className="px-6 py-4"></td>
                              <td className="px-6 py-4 text-right font-black text-emerald-600">- ₹{discount.toLocaleString()}</td>
                          </tr>
                         )}

                         <tr className="bg-white">
                            <td className="px-6 py-4 font-bold text-stone-400 text-xs uppercase tracking-tighter">{ui.payment.breakdown.tax} ({(config.taxRate * 100).toFixed(0)}%)</td>
                            <td className="px-6 py-4"></td>
                            <td className="px-6 py-4 text-right font-bold text-stone-500">₹{tax.toLocaleString()}</td>
                         </tr>

                         <tr className="bg-stone-900 text-white">
                            <td className="px-6 py-5">
                               <p className="font-black uppercase tracking-[0.2em] text-[10px]">{ui.payment.breakdown.totalLabel}</p>
                               <p className="text-[8px] text-stone-500 uppercase">Payable Amount</p>
                            </td>
                            <td className="px-6 py-5"></td>
                            <td className="px-6 py-5 text-right text-2xl font-black text-teal-400">₹{total.toLocaleString()}</td>
                         </tr>
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        </div>

        {/* Right Column: Payment Sidebar */}
        <div className="lg:col-span-4 relative">
           <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-stone-200 border border-stone-100">
                <h3 className="text-xl font-black text-stone-900 mb-8 tracking-tight">{ui.payment.title}</h3>
                
                {/* Coupon Input */}
                <div className="mb-8">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      placeholder={ui.payment.coupon.placeholder}
                      className="flex-1 bg-stone-50 border-2 border-stone-100 rounded-xl px-4 py-3 text-sm font-bold focus:border-teal-700 outline-none transition-all uppercase placeholder:normal-case"
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      className="bg-stone-900 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all"
                    >
                      {ui.payment.coupon.cta}
                    </button>
                  </div>
                  {couponError && <p className="text-red-500 text-[10px] font-bold mt-2 ml-1">{couponError}</p>}
                </div>

                <button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-teal-700 hover:bg-teal-800 disabled:bg-stone-200 text-white py-5 rounded-3xl font-black text-lg transition-all shadow-xl shadow-teal-100 flex items-center justify-center gap-3 group relative overflow-hidden"
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>{ui.payment.processing}</span>
                    </div>
                  ) : (
                    <>
                      <CreditCard className="w-6 h-6" /> {ui.payment.cta}
                    </>
                  )}
                </button>
                
                <div className="mt-6 flex items-center justify-center gap-6 opacity-40">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" className="h-3 object-contain" alt="Visa" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" className="h-5 object-contain" alt="Mastercard" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png" className="h-4 object-contain" alt="PayPal" />
                </div>
              </div>

              <div className="bg-stone-50 rounded-3xl p-6 border border-stone-100">
                 <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
                       <ShieldCheck className="w-6 h-6 text-teal-700" />
                    </div>
                    <div>
                       <h5 className="text-sm font-black text-stone-900 mb-1">{ui.payment.security.title}</h5>
                       <p className="text-[10px] text-stone-500 font-medium leading-relaxed">{ui.payment.security.desc}</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Back Button */}
      <button 
        onClick={onBack}
        className="mt-12 flex items-center gap-2 text-stone-400 hover:text-stone-900 font-black text-xs uppercase tracking-widest transition-all"
      >
        <ChevronLeft className="w-5 h-5" /> {ui.footer.back}
      </button>
    </div>
  );
};

export default BookingSummary;

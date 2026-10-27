import React, { useState } from 'react';
import {
  Zap,
  Smartphone,
  Wallet,
  Banknote,
  CheckCircle2,
  Copy,
  Check,
  UploadCloud,
  Clock,
  CheckCheck
} from 'lucide-react';
import { User, PaymentRecord, AppConfig } from '../../types';

interface PaymentTabProps {
  currentUser: User;
  config: AppConfig;
  userPayments: PaymentRecord[];
  onSubmitPayment: (data: {
    amount: number;
    method: string;
    ref: string;
    receiptImg: string;
  }) => void;
  currencyText: string;
  t: Record<string, string>;
}

export const PaymentTab: React.FC<PaymentTabProps> = ({
  currentUser,
  config,
  userPayments,
  onSubmitPayment,
  currencyText,
  t,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<'instapay' | 'vodafone' | 'other' | 'cash'>('instapay');
  const [refCode, setRefCode] = useState('');
  const [receiptBase64, setReceiptBase64] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methodsData = {
    instapay: { name: 'InstaPay (إنستاباي)', icon: <Zap className="w-4 h-4 text-orange-500" /> },
    vodafone: { name: 'Vodafone Cash (فودافون كاش)', icon: <Smartphone className="w-4 h-4 text-red-500" /> },
    other: { name: 'Orange / Etisalat / WE', icon: <Wallet className="w-4 h-4 text-emerald-500" /> },
    cash: { name: 'Cash (كاش يدوي بالرووف)', icon: <Banknote className="w-4 h-4 text-amber-500" /> },
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setReceiptBase64((event.target?.result as string) || '');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser.balance <= 0) {
      alert('حسابك الحالي صفر وليس عليك أي مستحقات! تسلم يا غالي.');
      return;
    }

    setIsSubmitting(true);
    onSubmitPayment({
      amount: currentUser.balance,
      method: methodsData[selectedMethod].name,
      ref: refCode || 'بدون رقم مرجعي',
      receiptImg: receiptBase64,
    });

    setRefCode('');
    setReceiptBase64('');
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-4 shadow-sm">
        {/* Title and balance display */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <h3 className="font-black text-base text-slate-900 dark:text-white">
              {t.payment_title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t.payment_desc}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-slate-400 font-semibold block">
              {t.required_amount}
            </span>
            <span className="text-2xl font-black text-[var(--brand-color)]">
              {currentUser.balance} {currencyText}
            </span>
          </div>
        </div>

        {/* Method selector */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-700 dark:text-slate-300">
            {t.choose_payment_method}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(methodsData) as Array<keyof typeof methodsData>).map((key) => {
              const item = methodsData[key];
              const isSelected = selectedMethod === key;
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => setSelectedMethod(key)}
                  className={`p-3 rounded-2xl border text-right transition-all flex items-center gap-2 ${
                    isSelected
                      ? 'bg-[var(--brand-color)]/10 border-[var(--brand-color)] text-slate-900 dark:text-white font-black shadow-sm ring-1 ring-[var(--brand-color)]'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  {item.icon}
                  <span className="text-xs truncate">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Details box for transfer instructions */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs space-y-2">
          {selectedMethod === 'instapay' && (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[10px]">عنوان إنستاباي للدفع:</span>
                <span className="text-[var(--brand-color)] font-black text-sm select-all">
                  {config.paymentInfo.instapay}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(config.paymentInfo.instapay, 'insta')}
                className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                {copiedKey === 'insta' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'insta' ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>
          )}

          {selectedMethod === 'vodafone' && (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[10px]">رقم محفظة فودافون كاش:</span>
                <span className="text-red-500 font-black text-sm select-all">
                  {config.paymentInfo.vodafone}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(config.paymentInfo.vodafone, 'voda')}
                className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                {copiedKey === 'voda' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'voda' ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>
          )}

          {selectedMethod === 'other' && (
            <div className="flex items-center justify-between">
              <div>
                <span className="text-slate-500 block text-[10px]">رقم محافظ أورنج / اتصالات / وي:</span>
                <span className="text-emerald-500 font-black text-sm select-all">
                  {config.paymentInfo.other}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(config.paymentInfo.other, 'other')}
                className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                {copiedKey === 'other' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'other' ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>
          )}

          {selectedMethod === 'cash' && (
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                الدفع نقداً باليد في الرووف:
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                سلم المبلغ لمدير القعدة أو ضعه في صندوق الأمانة، واضغط على زر التأكيد تحت عشان تبلغ الإدارة.
              </p>
            </div>
          )}
        </div>

        {/* Inputs & Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-1">
          <div>
            <label className="text-xs text-slate-700 dark:text-slate-300 font-black mb-1.5 block">
              {t.payment_ref_label}
            </label>
            <input
              type="text"
              value={refCode}
              onChange={(e) => setRefCode(e.target.value)}
              placeholder="Ref-982341 أو رقم التليفون المحول منه"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-[var(--brand-color)]"
            />
          </div>

          <div>
            <label className="text-xs text-slate-700 dark:text-slate-300 font-black mb-1.5 block">
              {t.receipt_upload_label}
            </label>
            <label className="w-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[var(--brand-color)] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50 dark:bg-slate-950 transition">
              <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                {receiptBase64 ? 'تم إرفاق الإيصال بنجاح (اضغط للتغيير)' : 'اضغط لاختيار صورة إيصال التحويل'}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, Screenshot</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {receiptBase64 && (
              <div className="mt-2 relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-md">
                <img
                  src={receiptBase64}
                  alt="Receipt Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={currentUser.balance <= 0 || isSubmitting}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-600/25 active:scale-98 transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.btn_confirm_payment}</span>
          </button>
        </form>
      </div>

      {/* User previous payments status */}
      {userPayments.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 space-y-3 shadow-sm">
          <h4 className="font-black text-sm text-slate-900 dark:text-white">
            سجل إيصالاتك السابقة:
          </h4>
          <div className="space-y-2">
            {userPayments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs"
              >
                <div>
                  <div className="font-black text-slate-800 dark:text-white">
                    {p.amount} {currencyText} - {p.method}
                  </div>
                  <div className="text-[10px] text-slate-400">مرجع: {p.ref} | {p.time}</div>
                </div>

                <span
                  className={`text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 ${
                    p.status === 'approved'
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                  }`}
                >
                  {p.status === 'approved' ? (
                    <>
                      <CheckCheck className="w-3 h-3" />
                      <span>تم الاعتماد</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-3 h-3" />
                      <span>قيد المراجعة</span>
                    </>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Volume2,
  VolumeX,
  X,
  Send,
  HelpCircle,
  Sparkles,
  Ticket,
  GlassWater,
  CreditCard,
  MessageSquare,
  Building2,
  Play,
  RotateCcw
} from 'lucide-react';
import { AppData } from '../types';

interface MoeinAssistantProps {
  appData: AppData;
  onNavigateTab: (tabId: string) => void;
  isAdmin?: boolean;
}

interface Message {
  sender: 'moein' | 'user';
  text: string;
  actionTab?: string;
  actionText?: string;
}

export const MoeinAssistant: React.FC<MoeinAssistantProps> = ({
  appData,
  onNavigateTab,
  isAdmin = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const moeinConfig = appData.config.moeinSettings || {
    enabled: true,
    showOnUserPages: true,
    voiceSpeechEnabled: true,
    permittedTopics: '',
    forbiddenSecrets: '',
    customWelcome: '',
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'moein',
      text:
        moeinConfig.customWelcome ||
        'يا هلا بيك يا صاحبي في الرووف! أنا "مُعين"، أخوك وصاحبك ومستشارك الذكي. هنا عشان أوجّهك خطوة بخطوة، وأقولك إزاي تسجل تيكيتك، وتسحب من بار الأمانة بروقان، وتسدد حسابك بدون أي لفة. قولي تحب نبدأ بإيه؟',
    },
  ]);

  // Handle Speech Synthesis
  const speakText = (text: string) => {
    if (!soundEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-EG';
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 1 && soundEnabled) {
      speakText(messages[0].text);
    }
  }, [isOpen]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // If disabled by Admin
  if (!moeinConfig.enabled) return null;
  if (!isAdmin && !moeinConfig.showOnUserPages) return null;

  const quickQuestions = [
    {
      title: 'إزاي أستخدم التطبيق؟',
      icon: <HelpCircle className="w-3.5 h-3.5 text-orange-500" />,
      handler: () => {
        handleUserAsk(
          'إزاي أستخدم تطبيق الرووف؟',
          'الموضوع في منتهى السلاسة يا صاحبي:\n١. اضغط على "التيكيت" تحت عشان تسجل حضورك اليوم برسم الخدمة والتكييف.\n٢. ادخل على "البار" اسحب اللي نفسك فيه وسجل الصنف اللي أخدته عشان نظام الأمانة.\n٣. افتح "الشات" هزر واتفق مع الشلة على مواعيد اللمّة.\n٤. تابع "الدعوات" عشان سهرات البلايستيشن والشواء.\n٥. وفي أي وقت ادخل على "الدفع" وسدد حسابك بإنستاباي أو كاش!'
        );
      },
    },
    {
      title: 'نظام أمانة الثلاجة شغال إزاي؟',
      icon: <GlassWater className="w-3.5 h-3.5 text-blue-500" />,
      handler: () => {
        handleUserAsk(
          'نظام أمانة الثلاجة والميني بار شغال إزاي؟',
          'بص يا غالي، ثلاجة الرووف مبنية على أمانتنا وكلمة الرجالة.. ادخل على تاب "البار" من تحت، هتلاقي المشروبات الساقعة والسخنة والتسالي. لما تسحب حاجة بإيدك من الثلاجة، اضغط فوراً على زرار "أخدت ده" عشان ينزل في حسابك وينقص من رصيد الثلاجة، وتفضل تلاجتنا مليانة دايماً!',
          'barTab',
          'فتح البار والثلاجة الآن'
        );
      },
    },
    {
      title: 'إزاي نظام حجز التيكيت وتأكيده شغال؟',
      icon: <Ticket className="w-3.5 h-3.5 text-emerald-500" />,
      handler: () => {
        handleUserAsk(
          'إزاي نظام حجز التيكيت والقبول شغال؟',
          `نظام الحجز في الرووف راقي ومنظم جداً يا صاحبي:\n١. اضغط على "سجل تيكيت اليوم" أو ادخل على تاب "التيكيت" تحت.\n٢. اختار ميعاد حضورك وعدد الأفراد وأي طلبات خاصة.\n٣. الطلب بيوصل لمدير النظام عشان يقبله ويعتمده.\n٤. بمجرد قبول المدير، بيظهرلك زرار تأكيد الحضور النهائي قبل ميعادك بساعة على الأقل عشان مكانك وتكييفك يفضلوا محجوزين ليك ومفيش حد ياخدهم!`,
          'ticketTab',
          'افتح صفحة التيكيت والحجز'
        );
      },
    },
    {
      title: 'أشهر مطاعم شبرا لسهرة الرووف؟',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
      handler: () => {
        handleUserAsk(
          'إيه أشهر مطاعم شارع شبرا اللي نقدر نطلب منها؟',
          'يا عيني على أكل شبرا الأصيل! عندنا في دليل المطاعم بالتطبيق:\n• كشري التحرير بشارع شبرا (19719)\n• بازوكا فرايد تشيكن عند مترو روض الفرج (16455)\n• أنس الدمشقي شاورما سوري ومشاوي بالخلفاوي\n• بـ لبن قشطوطة وكشري حلو وأم علي\n• كبابجي العربي والدهان للمشويات\n• بريموز بيتزا وخان الفطير وعصائر القبيصي وفرغلي فريش!\nتقدر تفتح الدليل وتشوف المنيو وتتصل بالدليفري مباشرة!'
        );
      },
    },
    {
      title: 'طريقة تسديد الحساب والدفع؟',
      icon: <CreditCard className="w-3.5 h-3.5 text-purple-500" />,
      handler: () => {
        handleUserAsk(
          'طريقة تسديد الحساب والدفع؟',
          `حسابك بيجمع التيكيت ومشتريات البار. عشان تسدد:\n١. اضغط على تاب "الدفع" في أقصى اليمين تحت.\n٢. اختار إنستاباي أو فودافون كاش أو كاش يدوي.\n٣. حول المبلغ واكتب الرقم المرجعي أو ارفع سكرين شوت الإيصال.\n٤. اضغط تأكيد، والإدارة بتعتمد التحويل وتصفر حسابك فوراً!`,
          'payTab',
          'فتح صفحة الدفع والتسوية'
        );
      },
    },
    {
      title: 'مين طور التطبيق؟ وعن شركة عزوتي؟',
      icon: <Building2 className="w-3.5 h-3.5 text-amber-500" />,
      handler: () => {
        handleUserAsk(
          'مين طور التطبيق ده وعن شركة عزوتي؟',
          'التطبيق ده وأنا (مُعين) تم ابتكارنا وتطويرنا بالكامل وبشكل حصري بواسطة شركة "عزوتي للبرمجيات وتكنولوجيا المعلومات"، من خلال العبقري والمطور "محمد عبد الرحمن يوسف". وكل الحقوق الملكية الفكرية وتصميم الأنظمة تعود له وللشركة بكل فخر!'
        );
      },
    },
  ];

  const handleUserAsk = (
    q: string,
    forcedReply?: string,
    actionTab?: string,
    actionText?: string
  ) => {
    setMessages((prev) => [...prev, { sender: 'user', text: q }]);

    setTimeout(() => {
      let reply = forcedReply;

      if (!reply) {
        const lower = q.toLowerCase();
        if (lower.includes('حجز') || lower.includes('تيكيت') || lower.includes('حضور') || lower.includes('سعر')) {
          reply = `حجز قعدة اليوم بـ ${appData.config.ticketPrice} ج.م. اضغط على "سجل تيكيت اليوم" وحدد وقتك، والمدير بيوافق عليه وتأكد حضورك قبل الميعاد بساعة!`;
          actionTab = 'ticketTab';
          actionText = 'صفحة التيكيت والحجز';
        } else if (lower.includes('مطعم') || lower.includes('أكل') || lower.includes('شبرا') || lower.includes('كشري') || lower.includes('شاورما') || lower.includes('بيتزا') || lower.includes('بلبن') || lower.includes('دليفري')) {
          reply = 'دليل مطاعم شارع شبرا جاهز وفيه كشري التحرير، بازوكا، أنس الدمشقي، كبابجي العربي، بريموز بيتزا، بلبن، وعصائر القبيصي بالمنيو وأرقام التليفونات للطلب المباشر للرووف!';
        } else if (lower.includes('بار') || lower.includes('ثلاجة') || lower.includes('مشروب') || lower.includes('كانز') || lower.includes('قهوة')) {
          reply = 'كل المشروبات والمقرمشات معروضة بصورها الحية في صفحة "البار" تحت. افتح التاب واضغط "أخدت ده" بعد ما تسحب طلبك بالأمانة يا صاحبي.';
          actionTab = 'barTab';
          actionText = 'افتح البار';
        } else if (lower.includes('فلوس') || lower.includes('حساب') || lower.includes('دفع') || lower.includes('سداد') || lower.includes('انستاباي') || lower.includes('فودافون')) {
          reply = `حسابك المستحق حالياً هو ${appData.currentUser.balance} ج.م. ادخل على تاب "الدفع" وسدد بسهولة عبر إنستاباي (${appData.config.paymentInfo.instapay}) أو فودافون كاش (${appData.config.paymentInfo.vodafone}).`;
          actionTab = 'payTab';
          actionText = 'سدد الآن';
        } else if (lower.includes('شات') || lower.includes('كلام') || lower.includes('صحاب') || lower.includes('رسالة')) {
          reply = 'الشات موجود في تاب "الشات" تحت، تقدر تدردش مع كل شباب الرووف وتبعث رسايل لحظية!';
          actionTab = 'chatTab';
          actionText = 'ادخل الشات';
        } else if (lower.includes('سهرة') || lower.includes('ماتش') || lower.includes('دعوة') || lower.includes('ايفنت')) {
          reply = 'كل السهرات وماتشات فيفا والشواء بتلاقيها في تاب "الدعوات". تقدر تأكد حضورك بضغطة زرار!';
          actionTab = 'eventsTab';
          actionText = 'شوف الدعوات';
        } else if (lower.includes('مدير') || lower.includes('ادمن') || lower.includes('admin') || lower.includes('لوحة')) {
          reply = 'دخول المدير سري ومحمي: اضغط ٥ مرات ورا بعض بسرعة على أيقونة لوجو التطبيق فوق على اليمين، واكتب كلمة السر (الافتراضية 0000)!';
        } else {
          reply = `يا غالي، أنا سامعك وفاهمك كويس! لو بتسأل عن أي صفحة في الرووف دايماً بص على القائمة اللي تحت:\n• التيكيت لتسجيل الحضور\n• البار للمشروبات والتسالي\n• الشات لهزار ولمّة الصحاب\n• الدعوات للسهرات الجاية\n• الدفع لتسوية الحساب\nلو في أي استفسار تاني أنا معاك في ضهرك!`;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'moein',
          text: reply!,
          actionTab,
          actionText,
        },
      ]);
      speakText(reply!);
    }, 400);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim()) return;
    const q = inputQuestion.trim();
    setInputQuestion('');
    handleUserAsk(q);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <div className="fixed bottom-20 left-4 z-40 flex items-center gap-2">
        <button
          onClick={() => {
            setIsOpen(true);
            if (!isSpeaking && soundEnabled && messages.length > 0) {
              speakText(messages[messages.length - 1].text);
            }
          }}
          className="relative group bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white p-3 rounded-2xl shadow-xl shadow-orange-500/30 flex items-center gap-2.5 active:scale-95 transition-all"
          title="تحدث مع مُعين"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-bounce" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 absolute -top-1 -right-1"></span>
          </div>
          <span className="text-xs font-black hidden sm:inline-block">مُعين (المساعد الذكي)</span>

          {isSpeaking && (
            <div className="flex items-center gap-0.5 px-1">
              <span className="w-1 bg-white rounded-full voice-bar"></span>
              <span className="w-1 bg-white rounded-full voice-bar" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1 bg-white rounded-full voice-bar" style={{ animationDelay: '0.4s' }}></span>
            </div>
          )}
        </button>
      </div>

      {/* Main Moein Dialog Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-2 sm:p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-base">مُعين | رفيق الرووف</h3>
                    <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-bold">
                      ابن بلد وجدع
                    </span>
                  </div>
                  <p className="text-[11px] text-white/90">
                    بدمج روح وضاح، عقل كابتن لوكا، والسرعة الفائقة
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    if (isSpeaking) stopSpeaking();
                    else setSoundEnabled(!soundEnabled);
                  }}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition text-white"
                  title={soundEnabled ? 'كتم الصوت' : 'تشغيل الصوت'}
                >
                  {soundEnabled ? (
                    isSpeaking ? (
                      <Volume2 className="w-4 h-4 text-emerald-300 animate-pulse" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )
                  ) : (
                    <VolumeX className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => {
                    stopSpeaking();
                    setIsOpen(false);
                  }}
                  className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Speaking Status Banner */}
            {isSpeaking && (
              <div className="bg-orange-50 dark:bg-orange-950/40 border-b border-orange-200 dark:border-orange-800/40 px-3 py-1.5 flex items-center justify-between text-xs text-orange-700 dark:text-orange-300">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5">
                    <span className="w-1 bg-orange-500 rounded-full voice-bar"></span>
                    <span className="w-1 bg-orange-500 rounded-full voice-bar" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1 bg-orange-500 rounded-full voice-bar" style={{ animationDelay: '0.4s' }}></span>
                  </span>
                  <span className="font-bold">مُعين بيتكلم بصوت بشري...</span>
                </div>
                <button
                  onClick={stopSpeaking}
                  className="text-[10px] bg-orange-200 dark:bg-orange-900 px-2 py-0.5 rounded font-bold hover:bg-orange-300"
                >
                  إيقاف الصوت
                </button>
              </div>
            )}

            {/* Quick Questions Chips */}
            <div className="p-3 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 flex gap-1.5 overflow-x-auto custom-scroll">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={q.handler}
                  className="shrink-0 flex items-center gap-1.5 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-orange-500 rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-slate-300 font-bold transition shadow-sm"
                >
                  {q.icon}
                  <span>{q.title}</span>
                </button>
              ))}
            </div>

            {/* Messages Chat Box */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scroll">
              {messages.map((m, idx) => {
                const isMoein = m.sender === 'moein';
                return (
                  <div
                    key={idx}
                    className={`flex flex-col ${isMoein ? 'items-start' : 'items-end'}`}
                  >
                    <div className="text-[10px] text-slate-400 mb-1 flex items-center gap-1">
                      {isMoein ? (
                        <>
                          <Sparkles className="w-3 h-3 text-orange-500" />
                          <span className="font-bold text-orange-600 dark:text-orange-400">
                            مُعين
                          </span>
                        </>
                      ) : (
                        <span>أنت</span>
                      )}
                    </div>
                    <div
                      className={`max-w-[88%] p-3 rounded-2xl text-xs leading-relaxed ${
                        isMoein
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tr-none border border-slate-200 dark:border-slate-700'
                          : 'bg-orange-500 text-white rounded-tl-none font-medium'
                      }`}
                    >
                      <p className="whitespace-pre-line">{m.text}</p>

                      {m.actionTab && (
                        <button
                          onClick={() => {
                            onNavigateTab(m.actionTab!);
                            setIsOpen(false);
                            stopSpeaking();
                          }}
                          className="mt-2.5 w-full py-1.5 px-3 bg-orange-500 hover:bg-orange-600 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                        >
                          <Play className="w-3 h-3" />
                          <span>{m.actionText || 'اضغط هنا للتوجه'}</span>
                        </button>
                      )}

                      {isMoein && (
                        <div className="mt-2 pt-1 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                          <button
                            onClick={() => speakText(m.text)}
                            className="text-[10px] text-slate-500 hover:text-orange-500 flex items-center gap-1"
                            title="إعادة سماع الرد بصوت بشري"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>اسمعني تاني</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleCustomSubmit}
              className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                placeholder="اسأل مُعين أي حاجة عن الرووف..."
                className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="p-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl hover:opacity-95 active:scale-95 transition shadow-md"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

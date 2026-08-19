import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  FileCheck2, 
  ShieldCheck, 
  DollarSign, 
  HardHat, 
  ArrowRight 
} from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'What does Nbyte Architecture & Construction’s NCA 1 Tier-1 Registration mean for my project?',
      category: 'Accreditation & Safety',
      answer: 'The National Construction Authority (NCA 1) category is the highest tier of contractor registration in Kenya and East Africa. It certifies that Nbyte Architecture & Construction possesses unlimited financial, plant, equipment, and structural engineering capacity to execute projects of unlimited monetary value. It provides institutional lenders, pension funds, and private developers with legal certainty that our technical team and safety protocols meet stringent statutory benchmarks.'
    },
    {
      question: 'How do you structure payment milestones and contractual valuations?',
      category: 'Commercial Terms',
      answer: 'We utilize standard FIDIC (Red, Yellow, or Silver Book) and JBC (Joint Building Council) contract standards. Payments are tied strictly to certified interim valuation certificates issued by the project Quantity Surveyor after rigorous on-site verification of measured works. We maintain open-book transparency throughout the build lifecycle.'
    },
    {
      question: 'Do you assist clients with county government approvals and statutory permits?',
      category: 'Statutory Compliance',
      answer: 'Yes. Our in-house technical liaison unit coordinates end-to-end statutory permitting, including National Environment Management Authority (NEMA) Environmental Impact Assessments (EIA), County Government Architectural & Structural approvals, NCA Project Registration, Water Resources Authority (WRA) clearances, and utility connections.'
    },
    {
      question: 'What structural warranties and defect liability periods do you provide?',
      category: 'Quality & Warranties',
      answer: 'Upon practical completion, all Nbyte Architecture & Construction projects enter a standard 6 to 12-month Defects Liability Period (DLP) during which any latent snags are remediated immediately. Furthermore, all primary reinforced concrete and structural steel frameworks carry our signature 10-Year Structural Integrity Warranty backed by comprehensive contractor all-risk (CAR) insurance.'
    },
    {
      question: 'How does Nbyte Architecture & Construction ensure Zero-Harm Safety on active construction sites?',
      category: 'Accreditation & Safety',
      answer: 'We operate under a strict ISO 45001 (Occupational Health & Safety) framework. Every site has full-time registered safety officers, mandatory morning toolbox briefings, 100% PPE compliance, perimeter edge-protection scaffolding, and full stop-work authority for every operative.'
    },
    {
      question: 'Can you work on design-and-build (turnkey EPC) arrangements?',
      category: 'Delivery Models',
      answer: 'Absolutely. We offer complete Engineering, Procurement, and Construction (EPC) turnkey delivery. In this model, Nbyte Architecture & Construction assumes single-point responsibility for architectural design, structural engineering, MEP coordination, procurement, and physical execution, reducing schedule overlap and cost overrun risks.'
    }
  ];

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Header */}
      <section className="relative py-20 bg-slate-900 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/40 border border-amber-800/40 px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Contracting, Permitting & Technical FAQs
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Clear answers to common questions regarding NCA statutory licensing, tender procedures, bill of quantities (BOQ), and structural guarantees.
          </p>
        </div>
      </section>

      {/* FAQs List */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggle(idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 mb-1 block">
                        {faq.category}
                      </span>
                      <h3 className="text-base font-bold text-white leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 text-slate-400 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Prompt banner */}
          <div className="mt-16 bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h4 className="text-xl font-bold text-white mb-1">Have a question not covered here?</h4>
              <p className="text-xs text-slate-400">Speak directly with our legal and contracts engineering division.</p>
            </div>
            <Link
              to="/contact"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shrink-0 flex items-center gap-2"
            >
              Contact Legal & Estimations <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

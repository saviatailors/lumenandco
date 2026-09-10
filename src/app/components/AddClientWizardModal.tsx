import { useState, useEffect } from "react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Building2, User, Phone, Mail, Calendar, DollarSign, Sparkles, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { SchoolClient, BillingInvoice } from "@/lib/lumenandco.types";

interface AddClientWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (client: SchoolClient, invoice?: BillingInvoice) => void;
  initialData?: {
    company_name?: string;
    contact_name?: string;
    contact_email?: string;
    contact_phone?: string;
    estimated_value?: number;
  };
}

export default function AddClientWizardModal({
  isOpen,
  onClose,
  onAddClient,
  initialData,
}: AddClientWizardModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: School Info
  const [schoolName, setSchoolName] = useState("");
  const [city, setCity] = useState<SchoolClient["city"]>("Hyderabad");
  const [contactPerson, setContactPerson] = useState("");
  const [contactRole, setContactRole] = useState("Principal / Director");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Step 2: Retainer & Package
  const [packageTier, setPackageTier] = useState<SchoolClient["package_tier"]>("Growth Retainer");
  const [monthlyRetainer, setMonthlyRetainer] = useState(55000);
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "SEO & Discovery",
    "Performance Ads",
  ]);

  // Step 3: Billing & Team Ops
  const [billingCycle, setBillingCycle] = useState<SchoolClient["billing_cycle"]>("monthly");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [assignedStaff, setAssignedStaff] = useState<{ id: string; name: string }>({
    id: "staff-1",
    name: "Sahit Sai",
  });
  const [createInitialInvoice, setCreateInitialInvoice] = useState(true);

  // Pre-fill initialData if coming from Lead Conversion!
  useEffect(() => {
    if (initialData && isOpen) {
      if (initialData.company_name) setSchoolName(initialData.company_name);
      if (initialData.contact_name) setContactPerson(initialData.contact_name);
      if (initialData.contact_email) setEmail(initialData.contact_email);
      if (initialData.contact_phone) setPhone(initialData.contact_phone);
      if (initialData.estimated_value) setMonthlyRetainer(initialData.estimated_value);
    }
  }, [initialData, isOpen]);

  const handleServiceToggle = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolName.trim()) return;

    const clientId = `client-${Date.now()}`;

    const newClient: SchoolClient = {
      id: clientId,
      school_name: schoolName.trim(),
      city,
      contact_person: contactPerson.trim() || "Contact Person",
      contact_role: contactRole.trim(),
      phone: phone.trim() || "+91 98490 00000",
      email: email.trim() || "admin@school.edu.in",
      services_subscribed: selectedServices.length > 0 ? selectedServices : ["SEO & Discovery"],
      package_tier: packageTier,
      monthly_retainer_rupees: monthlyRetainer,
      start_date: startDate,
      billing_cycle: billingCycle,
      status: "active",
      access_status: "active",
      assigned_staff_id: assignedStaff.id,
      assigned_staff_name: assignedStaff.name,
      created_at: new Date().toISOString(),
    };

    let newInvoice: BillingInvoice | undefined;
    if (createInitialInvoice) {
      const invNum = `YS-INV-2026-${Math.floor(100 + Math.random() * 900)}`;
      const dueDateObj = new Date(startDate);
      dueDateObj.setDate(dueDateObj.getDate() + 7);

      newInvoice = {
        id: `inv-${Date.now()}`,
        invoice_number: invNum,
        client_id: clientId,
        school_name: newClient.school_name,
        amount_rupees: monthlyRetainer,
        due_date: dueDateObj.toISOString().split("T")[0],
        status: "pending",
        overdue_days: 0,
        created_at: new Date().toISOString(),
      };
    }

    onAddClient(newClient, newInvoice);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setStep(1);
    setSchoolName("");
    setCity("Hyderabad");
    setContactPerson("");
    setContactRole("Principal / Director");
    setPhone("");
    setEmail("");
    setPackageTier("Growth Retainer");
    setMonthlyRetainer(55000);
    setSelectedServices(["SEO & Discovery", "Performance Ads"]);
    setBillingCycle("monthly");
    setStartDate(new Date().toISOString().split("T")[0]);
    setAssignedStaff({ id: "staff-1", name: "Sahit Sai" });
    setCreateInitialInvoice(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Onboard New Agency Client — Lumen & Co Wizard"
    >
      <div className="space-y-5 text-neutral-900">
        {/* Step Indicator Bar */}
        <div className="flex items-center justify-between bg-neutral-100 p-2.5 rounded-2xl text-xs font-semibold border border-neutral-200">
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              step === 1 ? "bg-[#ef4d23] text-white shadow-sm" : "text-neutral-500"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 text-center text-[10px]">1</span>
            <span>Client Info</span>
          </div>

          <ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              step === 2 ? "bg-[#ef4d23] text-white shadow-sm" : "text-neutral-500"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 text-center text-[10px]">2</span>
            <span>Services & Retainer</span>
          </div>

          <ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
              step === 3 ? "bg-[#ef4d23] text-white shadow-sm" : "text-neutral-500"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 text-center text-[10px]">3</span>
            <span>Review & Save</span>
          </div>
        </div>

        {/* STEP 1: SCHOOL INFO */}
        {step === 1 && (
          <div className="space-y-4 text-xs font-semibold">
            <div>
              <label className="block text-neutral-700 font-bold mb-1">School / Institution Name *</label>
              <div className="relative">
                <Building2 className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  placeholder="e.g. Oakridge International School"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-bold text-neutral-900 focus:ring-2 focus:ring-[#ef4d23] outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">Campus City</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value as SchoolClient["city"])}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-bold text-neutral-900 outline-none"
                >
                  <option value="Hyderabad">Hyderabad</option>
                  <option value="Bengaluru">Bengaluru</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">Contact Role</label>
                <input
                  type="text"
                  placeholder="e.g. Principal / Admissions Head"
                  value={contactRole}
                  onChange={(e) => setContactRole(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-bold text-neutral-900 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-700 font-bold mb-1">Contact Person Name</label>
                <div className="relative">
                  <User className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="e.g. Dr. K. V. Rao"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-bold text-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">Phone Number (WhatsApp)</label>
                <div className="relative">
                  <Phone className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="+91 98490 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-bold text-neutral-900 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-neutral-700 font-bold mb-1">Official Email Address</label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="email"
                  placeholder="contact@brand.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-bold text-neutral-900 outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                disabled={!schoolName.trim()}
                onClick={() => setStep(2)}
                className="bg-[#ef4d23] text-white font-bold px-5"
              >
                Next: Retainer & Services <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

          {/* STEP 2: PACKAGE TIER & SERVICES */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-neutral-700 font-bold mb-2">Select Retainer Tier</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { tier: "Performance Starter", price: "₹45,000/mo", desc: "Meta Ads + Basic Creatives" },
                    { tier: "Growth Retainer", price: "₹75,000/mo", desc: "Performance Ads + SEO + UGC" },
                    { tier: "Scale Enterprise", price: "₹1,20,000/mo", desc: "Full Stack Growth & CRO" },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.tier}
                      onClick={() => {
                        setPackageTier(item.tier as SchoolClient["package_tier"]);
                        if (item.tier === "Performance Starter") setRetainerAmount(45000);
                        if (item.tier === "Growth Retainer") setRetainerAmount(75000);
                        if (item.tier === "Scale Enterprise") setRetainerAmount(120000);
                      }}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                        packageTier === item.tier
                          ? "bg-[#ef4d23]/10 border-[#ef4d23] ring-2 ring-[#ef4d23]/20 text-[#ef4d23]"
                          : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-neutral-300"
                      }`}
                    >
                      <div>
                        <span className="font-semibold block text-xs">{item.tier}</span>
                        <span className="text-[10px] text-neutral-500 block mt-0.5">{item.desc}</span>
                      </div>
                      <span className="font-semibold text-xs mt-2 block">{item.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">Subscribed Lumen & Co Services</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "Performance Meta Ads", desc: "Facebook & Instagram Campaign Mgmt" },
                    { name: "Google Performance Max", desc: "Search, Shopping & YouTube Ads" },
                    { name: "Brand Portal Listing", desc: "Top Featured Placement on Lumen & Co Agency Hub" },
                    { name: "UGC Video Production", desc: "Monthly Creator Ad Creatives" },
                    { name: "SEO & Content Marketing", desc: "Organic Keyword Rankings" },
                    { name: "WhatsApp Automation", desc: "Automated Lead Lead Nurturing" },
                  ].map((srv) => (
                    <button
                      type="button"
                      key={srv.name}
                      onClick={() => handleToggleService(srv.name)}
                      className={`p-2.5 rounded-xl border text-left flex items-start justify-between ${
                        selectedServices.includes(srv.name)
                          ? "bg-emerald-50 border-emerald-400 text-emerald-900"
                          : "bg-neutral-50 border-neutral-200 text-neutral-700"
                      }`}
                    >
                      <div>
                        <span className="font-bold block text-[11px]">{srv.name}</span>
                        <span className="text-[9px] text-neutral-500">{srv.desc}</span>
                      </div>
                      {selectedServices.includes(srv.name) && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 ml-1" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: BILLING & OPS SETUP */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Custom Retainer Amount (₹)</label>
                  <input
                    type="number"
                    value={retainerAmount}
                    onChange={(e) => setRetainerAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-bold text-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Billing Cycle</label>
                  <select
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e.target.value as SchoolClient["billing_cycle"])}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-bold text-neutral-900 outline-none"
                  >
                    <option value="monthly">Monthly Retainer</option>
                    <option value="quarterly">Quarterly Advance</option>
                    <option value="annual">Annual Contract</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 font-bold mb-1">Assigned Lumen & Co Team Lead</label>
                <select
                  value={assignedStaffName}
                  onChange={(e) => setAssignedStaffName(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-bold text-neutral-900 outline-none"
                >
                  <option value="Sahit Sai (Co-Founder)">Sahit Sai (Co-Founder)</option>
                  <option value="Santhan Kumar (Co-Founder)">Santhan Kumar (Co-Founder)</option>
                  <option value="Alex Rivers">Alex Rivers (Admissions Lead)</option>
                  <option value="Priya Sharma">Priya Sharma (Creative Lead)</option>
                </select>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 space-y-1">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={generateInvoice}
                    onChange={(e) => setGenerateInvoice(e.target.checked)}
                    className="w-4 h-4 rounded text-[#ef4d23]"
                  />
                  <span>Generate Initial Retainer Invoice Instantly (15-Day Term)</span>
                </label>
                <p className="text-[10px] text-amber-700 pl-6">
                  Automatically creates invoice ref ref in Billing tab & enables auto-reminder triggers.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-neutral-100 p-4 border-t border-neutral-200 flex items-center justify-between">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={!schoolName.trim()}
              className="bg-[#ef4d23] text-white"
            >
              Continue to Step {step + 1} →
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Sparkles className="h-4 w-4 mr-1.5" /> Onboard Client
            </Button>
          )}
        </div>
      </Modal>
    );
  }

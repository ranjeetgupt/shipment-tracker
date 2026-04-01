import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { PlusCircle, User, MapPin, Package, Truck } from "lucide-react";
import { shipmentApi } from "@/lib/api";
import { SERVICE_TYPES, PACKAGE_TYPES } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const INITIAL_FORM = {
  senderName: "", senderAddress: "", senderCity: "", senderPhone: "", senderEmail: "",
  receiverName: "", receiverAddress: "", receiverCity: "", receiverPhone: "", receiverEmail: "",
  weight: "", packageType: "Parcel", description: "", declaredValue: "", serviceType: "Standard",
  shippingCost: "",
  dimensions: { length: "", width: "", height: "" },
};

const sectionColors = {
  blue:   "bg-blue-500/15 text-blue-500",
  violet: "bg-violet-500/15 text-violet-600",
  emerald:"bg-emerald-500/15 text-emerald-600",
  amber:  "bg-amber-500/15 text-amber-600",
};

function SectionHeader({ icon: Icon, title, subtitle, color = "blue" }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`p-2.5 rounded-xl ${sectionColors[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-semibold" style={{ color: "var(--color-text)" }}>{title}</h3>
        {subtitle && <p className="text-xs" style={{ color: "var(--color-muted)" }}>{subtitle}</p>}
      </div>
    </div>
  );
}

export default function CreateShipmentPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("dim_")) {
      const key = name.replace("dim_", "");
      setForm((prev) => ({ ...prev, dimensions: { ...prev.dimensions, [key]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelect = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        weight: parseFloat(form.weight),
        declaredValue: parseFloat(form.declaredValue) || 0,
        shippingCost: parseFloat(form.shippingCost) || 0,
        dimensions: {
          length: parseFloat(form.dimensions.length) || 0,
          width:  parseFloat(form.dimensions.width)  || 0,
          height: parseFloat(form.dimensions.height) || 0,
        },
      };
      const res = await shipmentApi.create(payload);
      toast.success(`Shipment created! Tracking ID: ${res.data.trackingId}`);
      navigate(`/track?id=${res.data.trackingId}`);
    } catch (err) {
      toast.error(err.message || "Failed to create shipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-blue-500/15 border border-blue-500/25">
          <PlusCircle className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Create Shipment</h1>
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>Fill in the details to generate a tracking ID</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sender */}
        <Card>
          <CardHeader className="pb-0">
            <SectionHeader icon={User} title="Sender Information" subtitle="Who is sending the package?" color="blue" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Full Name" id="senderName" required>
                <Input id="senderName" name="senderName" placeholder="John Smith" value={form.senderName} onChange={handleChange} required />
              </FormField>
              <FormField label="Phone Number" id="senderPhone" required>
                <Input id="senderPhone" name="senderPhone" placeholder="+91 9876543210" value={form.senderPhone} onChange={handleChange} required />
              </FormField>
              <FormField label="Email Address" id="senderEmail" required>
                <Input id="senderEmail" name="senderEmail" type="email" placeholder="john@example.com" value={form.senderEmail} onChange={handleChange} required />
              </FormField>
              <FormField label="City" id="senderCity" required>
                <Input id="senderCity" name="senderCity" placeholder="Mumbai" value={form.senderCity} onChange={handleChange} required />
              </FormField>
              <FormField label="Full Address" id="senderAddress" required className="md:col-span-2">
                <Textarea id="senderAddress" name="senderAddress" placeholder="123, Example Street, Area, City - 400001" value={form.senderAddress} onChange={handleChange} required className="min-h-[80px]" />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Receiver */}
        <Card>
          <CardHeader className="pb-0">
            <SectionHeader icon={MapPin} title="Receiver Information" subtitle="Where should we deliver?" color="violet" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Full Name" id="receiverName" required>
                <Input id="receiverName" name="receiverName" placeholder="Jane Doe" value={form.receiverName} onChange={handleChange} required />
              </FormField>
              <FormField label="Phone Number" id="receiverPhone" required>
                <Input id="receiverPhone" name="receiverPhone" placeholder="+91 9876543210" value={form.receiverPhone} onChange={handleChange} required />
              </FormField>
              <FormField label="Email Address" id="receiverEmail" required>
                <Input id="receiverEmail" name="receiverEmail" type="email" placeholder="jane@example.com" value={form.receiverEmail} onChange={handleChange} required />
              </FormField>
              <FormField label="City" id="receiverCity" required>
                <Input id="receiverCity" name="receiverCity" placeholder="Delhi" value={form.receiverCity} onChange={handleChange} required />
              </FormField>
              <FormField label="Full Address" id="receiverAddress" required className="md:col-span-2">
                <Textarea id="receiverAddress" name="receiverAddress" placeholder="456, Another Street, Area, City - 110001" value={form.receiverAddress} onChange={handleChange} required className="min-h-[80px]" />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Package */}
        <Card>
          <CardHeader className="pb-0">
            <SectionHeader icon={Package} title="Package Details" subtitle="Tell us about what you're shipping" color="emerald" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Weight (kg)" id="weight" required>
                <Input id="weight" name="weight" type="number" step="0.1" min="0.1" placeholder="2.5" value={form.weight} onChange={handleChange} required />
              </FormField>
              <FormField label="Package Type" id="packageType">
                <Select onValueChange={(v) => handleSelect("packageType", v)} defaultValue="Parcel">
                  <SelectTrigger id="packageType"><SelectValue /></SelectTrigger>
                  <SelectContent>{PACKAGE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </FormField>
              <FormField label="Declared Value (₹)" id="declaredValue">
                <Input id="declaredValue" name="declaredValue" type="number" min="0" placeholder="5000" value={form.declaredValue} onChange={handleChange} />
              </FormField>
              <FormField label="Length (cm)" id="dim_length">
                <Input id="dim_length" name="dim_length" type="number" min="0" placeholder="30" value={form.dimensions.length} onChange={handleChange} />
              </FormField>
              <FormField label="Width (cm)" id="dim_width">
                <Input id="dim_width" name="dim_width" type="number" min="0" placeholder="20" value={form.dimensions.width} onChange={handleChange} />
              </FormField>
              <FormField label="Height (cm)" id="dim_height">
                <Input id="dim_height" name="dim_height" type="number" min="0" placeholder="15" value={form.dimensions.height} onChange={handleChange} />
              </FormField>
              <FormField label="Description" id="description" className="md:col-span-3">
                <Textarea id="description" name="description" placeholder="Describe the contents of your package..." value={form.description} onChange={handleChange} />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Service */}
        <Card>
          <CardHeader className="pb-0">
            <SectionHeader icon={Truck} title="Shipping Service" subtitle="Choose your delivery speed" color="amber" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Service Type" id="serviceType">
                <Select onValueChange={(v) => handleSelect("serviceType", v)} defaultValue="Standard">
                  <SelectTrigger id="serviceType"><SelectValue /></SelectTrigger>
                  <SelectContent>{SERVICE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </FormField>
              <FormField label="Shipping Cost (₹)" id="shippingCost">
                <Input id="shippingCost" name="shippingCost" type="number" min="0" placeholder="250" value={form.shippingCost} onChange={handleChange} />
              </FormField>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-4">
          <Button type="button" variant="outline" onClick={() => setForm(INITIAL_FORM)}>Reset Form</Button>
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Creating…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" /> Create Shipment
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

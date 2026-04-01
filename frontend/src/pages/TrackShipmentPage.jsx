import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Package, MapPin, User, Truck, Calendar, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { shipmentApi } from "@/lib/api";
import { formatDate, formatDateTime, STATUS_CONFIG } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Progress } from "@/components/ui/progress";

const STATUS_STEPS = ["Pending", "Picked Up", "In Transit", "Out for Delivery", "Delivered"];

function getProgress(status) {
  const idx = STATUS_STEPS.indexOf(status);
  return idx === -1 ? 0 : Math.round((idx / (STATUS_STEPS.length - 1)) * 100);
}

function InfoRow({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-2">
      {Icon && <Icon className="h-4 w-4 mt-0.5 shrink-0" style={{ color: "var(--color-muted)" }} />}
      <div>
        <p className="text-xs" style={{ color: "var(--color-muted)" }}>{label}</p>
        <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>{value || "—"}</p>
      </div>
    </div>
  );
}

export default function TrackShipmentPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingId, setTrackingId] = useState(searchParams.get("id") || "");
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (id = trackingId) => {
    const tid = (id || "").trim().toUpperCase();
    if (!tid) return toast.error("Please enter a tracking ID");
    setLoading(true);
    setSearched(true);
    try {
      const res = await shipmentApi.track(tid);
      setShipment(res.data);
      setSearchParams({ id: tid });
    } catch (err) {
      setShipment(null);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) handleTrack(id);
  }, []);

  const progress = shipment ? getProgress(shipment.currentStatus) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/25">
          <Search className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Track Shipment</h1>
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>Enter your tracking ID to see live status</p>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              id="trackingIdInput"
              placeholder="SHP-XXXXXX-XXXXXX"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              className="flex-1 font-mono text-base h-12 tracking-wider"
            />
            <Button onClick={() => handleTrack()} size="lg" disabled={loading} className="h-12 px-8">
              {loading
                ? <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                : <><Search className="h-4 w-4" /> Track</>
              }
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Not Found */}
      {searched && !loading && !shipment && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto mb-3" style={{ color: "var(--color-muted)" }} />
            <p className="font-semibold" style={{ color: "var(--color-text)" }}>No shipment found</p>
            <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>Check your tracking ID and try again.</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {shipment && (
        <div className="space-y-4 animate-fade-in">
          {/* Main Status Card */}
          <Card style={{ overflow: "hidden" }}>
            {/* Rainbow bar */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500" />
            <CardContent className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <p className="text-xs" style={{ color: "var(--color-muted)" }}>Tracking ID</p>
                  <p className="text-xl font-mono font-bold tracking-wider" style={{ color: "var(--color-text)" }}>
                    {shipment.trackingId}
                  </p>
                </div>
                <StatusBadge status={shipment.currentStatus} className="text-sm px-3 py-1" />
              </div>

              {/* Progress Stepper */}
              {!["Cancelled", "Returned"].includes(shipment.currentStatus) && (
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    {STATUS_STEPS.map((step, i) => {
                      const stepProgress = Math.round((i / (STATUS_STEPS.length - 1)) * 100);
                      const isActive = progress >= stepProgress;
                      const isCurrent = shipment.currentStatus === step;
                      return (
                        <div key={step} className="flex flex-col items-center gap-1.5 flex-1">
                          <div
                            className="h-2.5 w-2.5 rounded-full ring-2 ring-offset-2 transition-all duration-500"
                            style={{
                              ringOffsetColor: "var(--bg-surface)",
                              background: isCurrent ? "#60a5fa" : isActive ? "#34d399" : "var(--color-border)",
                              boxShadow: isCurrent
                                ? "0 0 0 2px #60a5fa"
                                : isActive
                                ? "0 0 0 2px #34d399"
                                : `0 0 0 2px var(--color-border)`,
                              transform: isCurrent ? "scale(1.25)" : "scale(1)",
                            }}
                          />
                          <p
                            className="text-[10px] text-center leading-tight hidden sm:block"
                            style={{
                              color: isCurrent ? "#60a5fa" : isActive ? "#34d399" : "var(--color-muted)",
                              fontWeight: isCurrent ? "600" : "400",
                            }}
                          >
                            {step}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InfoRow icon={MapPin}       label="Current Location" value={shipment.currentLocation || "—"} />
                <InfoRow icon={Calendar}     label="Est. Delivery"    value={formatDate(shipment.estimatedDelivery)} />
                <InfoRow icon={Truck}        label="Service"          value={shipment.serviceType} />
                {shipment.actualDelivery && (
                  <InfoRow icon={CheckCircle2} label="Delivered On"   value={formatDateTime(shipment.actualDelivery)} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sender & Receiver */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="px-5 py-4 pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-500" /> Sender
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-2">
                <InfoRow label="Name"  value={shipment.senderName} />
                <InfoRow label="City"  value={shipment.senderCity} />
                <InfoRow label="Phone" value={shipment.senderPhone} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="px-5 py-4 pb-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-violet-600" /> Receiver
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5 space-y-2">
                <InfoRow label="Name"  value={shipment.receiverName} />
                <InfoRow label="City"  value={shipment.receiverCity} />
                <InfoRow label="Phone" value={shipment.receiverPhone} />
              </CardContent>
            </Card>
          </div>

          {/* Package Details */}
          <Card>
            <CardHeader className="px-5 py-4 pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Package className="h-4 w-4 text-emerald-600" /> Package Details
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoRow label="Type"           value={shipment.packageType} />
                <InfoRow label="Weight"         value={`${shipment.weight} kg`} />
                <InfoRow label="Declared Value" value={shipment.declaredValue ? `₹${shipment.declaredValue}` : "—"} />
                <InfoRow label="Shipping Cost"  value={shipment.shippingCost  ? `₹${shipment.shippingCost}` : "—"} />
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="px-5 py-4 pb-2">
              <CardTitle className="text-sm font-semibold">Tracking Timeline</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="relative space-y-0">
                {[...shipment.statusHistory].reverse().map((event, idx) => {
                  const config = STATUS_CONFIG[event.status] || { icon: "📌" };
                  const isFirst = idx === 0;
                  return (
                    <div key={idx} className="flex gap-4 pb-6 last:pb-0 relative">
                      <div className="flex flex-col items-center">
                        <div
                          className="h-8 w-8 rounded-full flex items-center justify-center text-sm z-10 border"
                          style={{
                            background: isFirst ? "rgba(96,165,250,0.15)" : "var(--bg-subtle)",
                            borderColor: isFirst ? "rgba(96,165,250,0.4)" : "var(--color-border)",
                          }}
                        >
                          {config.icon}
                        </div>
                        {idx !== shipment.statusHistory.length - 1 && (
                          <div className="w-px flex-1 my-1" style={{ background: "var(--color-border)" }} />
                        )}
                      </div>
                      <div className="flex-1 pt-0.5">
                        <div className="flex flex-wrap items-center gap-2 mb-0.5">
                          <StatusBadge status={event.status} showIcon={false} className="text-xs" />
                          {event.location && (
                            <span className="text-xs flex items-center gap-1" style={{ color: "var(--color-muted)" }}>
                              <MapPin className="h-3 w-3" />{event.location}
                            </span>
                          )}
                        </div>
                        <p className="text-sm" style={{ color: "var(--color-text)" }}>{event.description}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--color-muted)" }}>{formatDateTime(event.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

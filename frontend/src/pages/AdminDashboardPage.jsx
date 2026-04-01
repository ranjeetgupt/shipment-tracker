import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard, Package, Truck, CheckCircle2, Clock, XCircle,
  Trash2, RefreshCw, TrendingUp, Eye
} from "lucide-react";
import toast from "react-hot-toast";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import { shipmentApi } from "@/lib/api";
import { formatDate, formatDateTime, STATUSES } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormField } from "@/components/ui/form-field";
import { useTheme } from "@/context/ThemeContext";

// ── Stat Card 
const statColors = {
  blue:    "bg-blue-500/15 text-blue-500 border-blue-500/25",
  emerald: "bg-emerald-500/15 text-emerald-600 border-emerald-500/25",
  amber:   "bg-amber-500/15 text-amber-600 border-amber-500/25",
  violet:  "bg-violet-500/15 text-violet-600 border-violet-500/25",
  red:     "bg-red-500/15 text-red-500 border-red-500/25",
};

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <Card className={`card-hover border ${statColors[color]}`}>
      <CardContent className="p-5 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${statColors[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>{label}</p>
          <p className="text-2xl font-bold mt-0.5" style={{ color: "var(--color-text)" }}>{value ?? "—"}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Chart colors 
const PIE_COLORS = {
  "Pending":          "#f59e0b",
  "Picked Up":        "#38bdf8",
  "In Transit":       "#60a5fa",
  "Out for Delivery": "#a78bfa",
  "Delivered":        "#34d399",
  "Cancelled":        "#f87171",
  "Returned":         "#fb923c",
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-sm shadow-xl"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--color-border)",
        color: "var(--color-text)",
      }}
    >
      <p className="font-medium">{payload[0].name}</p>
      <p style={{ color: "var(--color-muted)" }}>
        Count: <span style={{ color: "var(--color-text)", fontWeight: 600 }}>{payload[0].value}</span>
      </p>
    </div>
  );
}

// ── Update Status Dialog 
function UpdateStatusDialog({ shipment, onClose, onSuccess }) {
  const [form, setForm] = useState({
    status: shipment.currentStatus,
    location: shipment.currentLocation || "",
    description: "",
    updatedBy: "Admin",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await shipmentApi.updateStatus(shipment._id, form);
      toast.success("Shipment status updated!");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update Shipment Status</DialogTitle>
        <DialogDescription>
          Tracking ID: <span className="text-blue-500 font-mono">{shipment.trackingId}</span>
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="New Status" id="newStatus" required>
          <Select value={form.status} onValueChange={(v) => setForm((p) => ({ ...p, status: v }))}>
            <SelectTrigger id="newStatus"><SelectValue /></SelectTrigger>
            <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </FormField>
        <FormField label="Location" id="updateLocation">
          <Input id="updateLocation" placeholder="e.g. Delhi Hub" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
        </FormField>
        <FormField label="Description" id="updateDescription">
          <Textarea id="updateDescription" placeholder="Status update notes..." value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
        </FormField>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? "Updating…" : "Update Status"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

// ── Admin Dashboard ────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, shipmentsRes] = await Promise.all([
        shipmentApi.getStats(),
        shipmentApi.getAll({ limit: 50, status: statusFilter, search: searchQuery || undefined }),
      ]);
      setStats(statsRes?.data || null);
      setShipments(shipmentsRes?.data || []);
    } catch { toast.error("Failed to load dashboard data"); }
    finally { setLoading(false); }
  }, [statusFilter, searchQuery]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await shipmentApi.delete(deleteTarget._id);
      toast.success("Shipment deleted");
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      fetchData();
    } catch (err) { toast.error(err.message); }
  };

  const pieData = stats ? Object.entries(stats.byStatus).map(([name, value]) => ({ name, value })) : [];
  const barData = stats ? Object.entries(stats.byStatus).map(([name, value]) => ({ name: name.split(" ")[0], value })) : [];

  const axisColor = isDark ? "#64748b" : "#94a3b8";
  const gridColor = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)";

  const statCards = [
    { icon: Package,      label: "Total Shipments", color: "blue",    value: stats?.total },
    { icon: Truck,        label: "In Transit",       color: "violet",  value: stats?.byStatus["In Transit"] || 0 },
    { icon: CheckCircle2, label: "Delivered",        color: "emerald", value: stats?.byStatus["Delivered"] || 0 },
    { icon: Clock,        label: "Pending",          color: "amber",   value: stats?.byStatus["Pending"] || 0 },
    { icon: XCircle,      label: "Cancelled",        color: "red",     value: stats?.byStatus["Cancelled"] || 0 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/25">
            <LayoutDashboard className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Admin Dashboard</h1>
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>Manage and monitor all shipments</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((s) => <StatCard key={s.label} {...s} />)}
        </div>
      )}

      {/* Charts */}
      {stats && pieData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" /> Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={PIE_COLORS[entry.name] || "#6b7280"} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => <span style={{ fontSize: 12, color: "var(--color-muted)" }}>{value}</span>}
                    iconType="circle" iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="px-5 py-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Package className="h-4 w-4 text-violet-600" /> Shipments by Status
              </CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={barData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                  <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {barData.map((entry) => (
                      <Cell key={entry.name} fill={PIE_COLORS[entry.name] || "#60a5fa"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Shipment Table */}
      <Card>
        <CardHeader
          className="px-5 py-4"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base">All Shipments</CardTitle>
              <CardDescription>Update status, view details or delete shipments</CardDescription>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Input
                  id="dashboardSearch"
                  placeholder="Search..."
                  className="w-52 h-8 text-xs pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Package className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: "var(--color-muted)" }} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36 h-8 text-xs" id="dashStatusFilter"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-5 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-14 rounded-xl" />)}
            </div>
          ) : shipments.length === 0 ? (
            <div className="p-10 text-center">
              <Package className="h-10 w-10 mx-auto mb-2" style={{ color: "var(--color-muted)" }} />
              <p className="text-sm" style={{ color: "var(--color-muted)" }}>No shipments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
                    {["Tracking ID", "Sender", "Receiver", "Status", "Created", "Actions"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                        style={{ color: "var(--color-muted)" }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shipments.map((s) => (
                    <tr
                      key={s._id}
                      className="transition-colors group"
                      style={{ borderBottom: "1px solid var(--color-border-2)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--table-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td className="px-5 py-3 font-mono font-semibold whitespace-nowrap text-blue-500">{s.trackingId}</td>
                      <td className="px-5 py-3 whitespace-nowrap" style={{ color: "var(--color-text)" }}>{s.senderName}</td>
                      <td className="px-5 py-3 whitespace-nowrap" style={{ color: "var(--color-text)" }}>{s.receiverName}</td>
                      <td className="px-5 py-3"><StatusBadge status={s.currentStatus} /></td>
                      <td className="px-5 py-3 whitespace-nowrap" style={{ color: "var(--color-muted)" }}>{formatDate(s.createdAt)}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <Link to={`/track?id=${s.trackingId}`} className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors" title="View">
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            onClick={() => { setSelectedShipment(s); setStatusDialogOpen(true); }}
                            className="p-1.5 rounded-lg bg-violet-500/10 text-violet-600 hover:bg-violet-500/20 transition-colors"
                            title="Update Status"
                          >
                            <Truck className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => { setDeleteTarget(s); setDeleteDialogOpen(true); }}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {stats?.recentShipments?.length > 0 && (
        <Card>
          <CardHeader className="px-5 py-4 pb-2">
            <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-3">
            {stats.recentShipments.map((s) => (
              <div
                key={s._id}
                className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg transition-colors"
                style={{ background: "var(--recent-card)" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--recent-card)")}
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                    <Package className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-mono text-xs font-semibold text-blue-500">{s.trackingId}</p>
                    <p className="text-xs" style={{ color: "var(--color-muted)" }}>{s.senderName} → {s.receiverName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={s.currentStatus} showIcon={false} />
                  <span className="text-xs" style={{ color: "var(--color-muted)" }}>{formatDateTime(s.createdAt)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        {selectedShipment && (
          <UpdateStatusDialog
            shipment={selectedShipment}
            onClose={() => setStatusDialogOpen(false)}
            onSuccess={fetchData}
          />
        )}
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle style={{ color: "#f87171" }}>Delete Shipment</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete{" "}
              <span className="font-mono text-blue-500">{deleteTarget?.trackingId}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

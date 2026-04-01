import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { History, Search, ChevronLeft, ChevronRight, Package, Eye } from "lucide-react";
import { shipmentApi } from "@/lib/api";
import { formatDate, STATUSES } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PAGE_SIZE = 10;

function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export default function ShipmentHistoryPage() {
  const [shipments, setShipments] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search);

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await shipmentApi.getAll({ page, limit: PAGE_SIZE, status: statusFilter, search: debouncedSearch || undefined });
      setShipments(res.data);
      setPagination(res.pagination);
    } catch { setShipments([]); }
    finally { setLoading(false); }
  }, [page, statusFilter, debouncedSearch]);

  useEffect(() => { setPage(1); }, [statusFilter, debouncedSearch]);
  useEffect(() => { fetchShipments(); }, [fetchShipments]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-violet-500/15 border border-violet-500/25">
            <History className="h-6 w-6 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>Shipment History</h1>
            <p className="text-sm" style={{ color: "var(--color-muted)" }}>{pagination.total} shipments found</p>
          </div>
        </div>
        <Button asChild><Link to="/create">+ New Shipment</Link></Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--color-muted)" }} />
            <Input
              id="historySearch"
              placeholder="Search by tracking ID or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-52" id="statusFilterSelect">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
        </div>
      ) : shipments.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 mx-auto mb-3" style={{ color: "var(--color-muted)" }} />
            <p className="font-semibold" style={{ color: "var(--color-text)" }}>No shipments found</p>
            <p className="text-sm mt-1" style={{ color: "var(--color-muted)" }}>Try adjusting your filters or create a new shipment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {/* Desktop Header */}
          <div
            className="hidden lg:grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--color-muted)" }}
          >
            <span>Tracking ID</span><span>Sender</span><span>Receiver</span>
            <span>Status</span><span>Created</span><span />
          </div>

          {shipments.map((s, idx) => (
            <Card
              key={s._id}
              className="card-hover animate-fade-in"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <CardContent className="p-4">
                {/* Desktop Row */}
                <div className="hidden lg:grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_auto] gap-4 items-center">
                  <span className="font-mono text-sm font-semibold text-blue-500">{s.trackingId}</span>
                  <span className="text-sm truncate" style={{ color: "var(--color-text)" }}>{s.senderName}</span>
                  <span className="text-sm truncate" style={{ color: "var(--color-text)" }}>{s.receiverName}</span>
                  <StatusBadge status={s.currentStatus} />
                  <span className="text-sm" style={{ color: "var(--color-muted)" }}>{formatDate(s.createdAt)}</span>
                  <Link
                    to={`/track?id=${s.trackingId}`}
                    className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </Link>
                </div>

                {/* Mobile Card */}
                <div className="lg:hidden space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold text-blue-500">{s.trackingId}</span>
                    <StatusBadge status={s.currentStatus} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "var(--color-muted)" }}>{s.senderName} → {s.receiverName}</span>
                    <Link to={`/track?id=${s.trackingId}`} className="flex items-center gap-1 text-xs text-blue-500">
                      <Eye className="h-3.5 w-3.5" /> View
                    </Link>
                  </div>
                  <p className="text-xs" style={{ color: "var(--color-muted)" }}>{formatDate(s.createdAt)}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            Page {pagination.page} of {pagination.pages}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" /> Prev
            </Button>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

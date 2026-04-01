# ShipTrack — MERN Stack Logistics Shipment Tracking System

 **Live Deployment:** [https://shipment-tracker-delta.vercel.app/](https://shipment-tracker-delta.vercel.app/)

##  Project Structure

```
shipment-tracker/
├── backend/                    # Node.js + Express + MongoDB API
│   ├── src/
│   │   ├── config/db.js        # MongoDB connection
│   │   ├── controllers/        # Business logic
│   │   │   └── shipmentController.js
│   │   ├── middleware/
│   │   │   └── errorHandler.js # Global error handling
│   │   ├── models/
│   │   │   └── Shipment.js     # Mongoose schema
│   │   ├── routes/
│   │   │   └── shipmentRoutes.js
│   │   └── utils/
│   │       └── generateTrackingId.js
│   ├── server.js               # Express entry point
│   ├── .env
│   └── package.json
│
└── frontend/          # React + Vite + Tailwind v4 + shadcn/ui
    ├── src/
    │   ├── components/
    │   │   ├── ui/             # shadcn-style UI components
    │   │   │   ├── button.jsx
    │   │   │   ├── card.jsx
    │   │   │   ├── input.jsx
    │   │   │   ├── label.jsx
    │   │   │   ├── select.jsx
    │   │   │   ├── badge.jsx
    │   │   │   ├── dialog.jsx
    │   │   │   ├── tabs.jsx
    │   │   │   ├── progress.jsx
    │   │   │   ├── textarea.jsx
    │   │   │   └── form-field.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Layout.jsx
    │   │   └── StatusBadge.jsx
    │   ├── lib/
    │   │   ├── api.js          # Axios API client
    │   │   └── utils.js        # Helpers, constants
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── CreateShipmentPage.jsx
    │   │   ├── TrackShipmentPage.jsx
    │   │   ├── ShipmentHistoryPage.jsx
    │   │   └── AdminDashboardPage.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

##  Tech Stack

| Layer     | Technology                                  |
|-----------|---------------------------------------------|
| Frontend  | React 19, Vite 8, Tailwind CSS v4           |
| UI        | shadcn/ui (Radix UI primitives + CVA)       |
| Charts    | Recharts                                    |
| Routing   | React Router v6                             |
| HTTP      | Axios                                       |
| Backend   | Node.js, Express.js (ESM)                   |
| Database  | MongoDB + Mongoose                          |
| Toasts    | react-hot-toast                             |
| Icons     | Lucide React                                |

##  How to Run

### Prerequisites
- Node.js ≥ 18
- MongoDB running locally (`mongodb://localhost:27017`)

### 1. Start Backend
```bash
cd shipment-tracker/backend
npm install
# Edit .env with your MONGO_URI
npm run dev       # runs on http://localhost:5000
```

### 2. Start Frontend
```bash
cd shipment-tracker/frontend
npm install
npm run dev       # runs on http://localhost:5173
```

## API Endpoints

| Method | Endpoint                         | Description          |
|--------|----------------------------------|----------------------|
| POST   | `/api/shipments`                 | Create shipment      |
| GET    | `/api/shipments`                 | Get all (paginated)  |
| GET    | `/api/shipments/stats`           | Dashboard stats      |
| GET    | `/api/shipments/track/:id`       | Track by tracking ID |
| GET    | `/api/shipments/:id`             | Get by MongoDB ID    |
| PATCH  | `/api/shipments/:id/status`      | Update status        |
| DELETE | `/api/shipments/:id`             | Delete shipment      |

##  Features

- **Auto Tracking ID** — Format: `SHP-XXXXXX-XXXXXX`
- **Status Flow** — Pending → Picked Up → In Transit → Out for Delivery → Delivered
- **Full Status History** — Every status change is recorded with timestamp, location & description
- **Progress Stepper** — Visual animated progress bar on track page
- **Admin Dashboard** — Pie + bar charts (Recharts), manage all shipments
- **Search & Filter** — Search by tracking ID or name, filter by status
- **Debounced Search** — Efficient search with 400ms debounce
- **Pagination** — Server-side paginated shipment list
- **Toast Notifications** — Success/error feedback
- **Mobile Responsive** — Hamburger menu, responsive cards/table
- **Skeleton Loaders** — Loading states on all data-fetching pages

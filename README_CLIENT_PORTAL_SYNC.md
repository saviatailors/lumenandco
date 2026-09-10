# Client Portal Sync Contract & Webhook Specifications

This document defines the real-time sync contract between **Delivery Hub (App 2)** and **Client Portal (App 3)**.

---

## Sync Principles & Fail-Closed Guarantee

1. **Strict Content Segregation**:
   - `internal_comments` and `client_portal_comments` live in **completely separate tables**.
   - Delivery Hub enforces `client_visible = false` by default for all new tasks, attachments, and notes (fail-closed security model).
   - Only when a deliverable transitions to `ready_for_client`, `client_review`, `approved`, or `delivered` does `client_visible` become `true`.

2. **Event-Driven Architecture**:
   - Status transitions emit typed sync events. The Client Portal listens to these events via WebSockets or Webhook HTTP POST endpoints to update the client's view instantaneously.

---

## Event Payload Definitions

### 1. `deliverable.ready_for_client`
Emitted when an Account Manager approves an internal review and moves a deliverable to `ready_for_client` or `client_review`.

```json
{
  "event": "deliverable.ready_for_client",
  "timestamp": "2026-09-10T12:00:00Z",
  "data": {
    "deliverable_id": "del-101",
    "client_id": "client-1",
    "client_name": "Northbeam Outdoors",
    "title": "Q4 Performance Video Reel & Hook Cuts",
    "type": "reel",
    "description": "Short-form vertical video cut showcasing the autumn jacket collection.",
    "status": "client_review",
    "attachments": [
      {
        "version": 2,
        "filename": "northbeam_reel_v2_final.mp4",
        "file_url": "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260801_001207_ec20d138-aa45-4b2b-ab8c-bdc71607f240.mp4"
      }
    ]
  }
}
```

### 2. `client.revision_requested`
Emitted from Client Portal back to Delivery Hub when a client requests revisions on a deliverable.

```json
{
  "event": "client.revision_requested",
  "timestamp": "2026-09-10T12:05:00Z",
  "data": {
    "deliverable_id": "del-101",
    "client_id": "client-1",
    "revision_notes": "Please make the CTA button brighter orange and add logo at 0:03 mark.",
    "requested_by": "Mark (Northbeam Founder)"
  }
}
```

### 3. `client.approved`
Emitted when a client approves a deliverable in their portal room.

```json
{
  "event": "client.approved",
  "timestamp": "2026-09-10T12:10:00Z",
  "data": {
    "deliverable_id": "del-101",
    "client_id": "client-1",
    "approved_by": "Mark (Northbeam Founder)"
  }
}
```

---

## Database Table Contracts Shared

- `leads` / `clients` (Shared table, owned by Super Admin CRM)
- `deliverables` (Owned by Delivery Hub, read-only for Client Portal when `client_visible = true`)
- `client_portal_comments` (Shared table, read/write for both Delivery Hub & Client Portal)

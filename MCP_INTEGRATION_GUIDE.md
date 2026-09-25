# 🌐 Lumen & Co — Custom MCP Process Tracker & AI Integration Guide

The **Lumen & Co Custom MCP (Model Context Protocol) Server** (`lumen-process-tracker`) connects any external AI tool, agent, or LLM assistant (Antigravity, Claude Desktop, Cursor, ChatGPT, Custom Python/Node LLM scripts) directly to your site's live engine to track lead acquisition pipelines, edit document vault templates & placeholders, audit agency ROAS performance, and log process execution events in real time.

---

## ⚡ Quick Specs

- **Server Name**: `lumen-process-tracker`
- **SDK**: Official `@modelcontextprotocol/sdk`
- **Transport**: `stdio` (Standard input/output) + REST JSON-RPC 2.0
- **Location**: [`mcp-server/server.js`](file:///Users/sahit/Desktop/%20/lumenandco/mcp-server/server.js)
- **Config Files**: 
  - Workspace: [`.agents/mcp_config.json`](file:///Users/sahit/Desktop/%20/lumenandco/.agents/mcp_config.json)
  - Global: `~/.gemini/config/mcp_config.json`

---

## 🛠️ Exposed MCP Tools Reference

| Tool Name | Parameters | Description |
| :--- | :--- | :--- |
| `get_site_status` | *(None)* | Returns real-time health, uptime, environment, active service statuses, and lead/doc counts. |
| `list_leads` | `status` (optional), `search` (optional) | Queries the client lead acquisition pipeline (e.g. `New`, `Contacted`, `Qualified`, `Proposal Sent`, `Closed-Won`). |
| `get_lead_details` | `leadId` (required) | Returns full profile, lead score (0-100), projected ROI, and communication history for a specific lead. |
| `update_lead_status` | `leadId`, `newStatus`, `notes` | Updates pipeline stage, appends internal notes, and logs a process tracking event. |
| `list_vault_documents` | `category` (optional) | Retrieves all documents, SOWs, monthly audit reports, pricing decks, and SLA compliance statuses. |
| `update_document_placeholders` | `documentId`, `placeholders` | Updates template placeholders (`CLIENT_NAME`, `RETAINER_FEE`, `INVOICE_NUMBER`, etc.) from any AI tool. |
| `get_performance_analytics` | `timeframe` (optional) | Returns live agency performance telemetry: blended ROAS (4.42x), CPL (₹38.50), CAC, ad impressions, and channel metrics. |
| `log_process_event` | `event`, `source`, `details` | Logs an execution process update or AI workflow event into the site's central activity stream. |
| `get_process_activity_log` | `limit` (optional) | Fetches the audit log timeline of process updates and AI tracking events. |

---

## 🔌 Connecting to Popular AI Tools

### 1. Claude Desktop App
Add the following snippet to your Claude Desktop configuration file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "lumen-process-tracker": {
      "command": "node",
      "args": [
        "/Users/sahit/Desktop/ /lumenandco/mcp-server/server.js"
      ],
      "env": {
        "NODE_ENV": "development",
        "LUMEN_SITE_URL": "http://localhost:3000"
      }
    }
  }
}
```

---

### 2. Cursor IDE & Antigravity
The workspace config is automatically detected from [`.agents/mcp_config.json`](file:///Users/sahit/Desktop/%20/lumenandco/.agents/mcp_config.json).
In Cursor:
1. Go to **Settings > Cursor Settings > Features > MCP**.
2. Click **Add New MCP Server**.
3. Name: `lumen-process-tracker`
4. Type: `stdio`
5. Command: `node /Users/sahit/Desktop/\ /lumenandco/mcp-server/server.js`

---

### 3. Testing via Command Line
You can test the MCP server manually or via Node scripts:

```bash
node mcp-server/server.js
```

Or run the test suite:
```bash
node -e '
import { spawn } from "child_process";
const child = spawn("node", ["mcp-server/server.js"]);
child.stdout.on("data", (data) => console.log(data.toString()));
child.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: 1, method: "tools/list", params: {} }) + "\n");
'
```

---

## 🤖 Example Prompts You Can Give Any AI Tool

1. *"Query Lumen & Co MCP server for all leads currently in the 'Qualified' stage and summarize their ad spend budgets."*
2. *"Update the retainer fee placeholder on proposal 'doc-201' to ₹3,00,000 / mo via the MCP server."*
3. *"Fetch the agency performance analytics and report our current blended ROAS and cost per lead."*
4. *"Log a process event that the Q4 Growth Strategy proposal was reviewed and sent to Northbeam E-Commerce."*

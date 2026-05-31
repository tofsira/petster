# Content Workflow

```txt
Google Sheet -> Automation/MCP -> Payload draft -> Human review -> Publish -> Next.js
```

Rules:

- AI and automation create drafts only.
- Publishing is manual in Payload.
- Google Sheet is for content planning and bulk feed operations.
- Payload is the source of truth for published content.
- Bulk import must validate rows before creating drafts.
- Duplicate checks use slug first.
- Import results should be written back to the sheet.

# v120 Source Scaffold

This scaffold documents the target modular architecture. The shipped offline runtime remains bootstrap-compatible for stability, while future releases can progressively move code here.

- `app/`: shell, routing and state adapters
- `modules/`: Today/Monitor/Investigate/Review hubs
- `graph/`: graph explorer and graph intelligence modules
- `reports/`: report builders and export adapters
- `update/`: manifest, package and rollback validation
- `admin/`: backend/API/admin integrations

log-watcher/ # Root project folder
│
├── backend/ # All server-side logic
│ ├── auth/ # OAuth login logic (Google/GitHub) ✅
│ │ └── passport/ # Strategies, callback handlers
│ │ └── routes/ # /auth/google, /auth/github
│ │ └── jwt/ # Token generation and middleware
│ │
│ ├── kafka/ # Kafka setup and producer logic 📄✅
│ │ └── producer.js # Log push to Kafka topic
│ │
│ ├── watcher-service/ # Log Watcher microservice
│ │ └── consumer.js # Kafka consumer + parser✅
│ │ └── alertManager.js # Slack/Email alert logic
│ │ └── elasticSender.js # Push to Elasticsearch✅
│ │ └── wsServer.js # WebSocket for UI
│ │
│ ├── elasticsearch/ # ES config & mapping templates✅
│ │ └── setup-index.js # Mapping creation logic
│ │ └── docker-compose.yml # (Optional) Local ES setup
│ │
│ └── dummy-log-app/ # Simulated backend emitting logs 📄✅
│ └── generator.js # Random log emitter✅
│
├── frontend/ # React UI
│ ├── public/
│ ├── src/
│ │ ├── components/ # LogViewer, FilterPanel, etc.
│ │ ├── pages/ # Login, Dashboard, Metrics
│ │ ├── context/ # Auth context / WebSocket
│ │ ├── api/ # Axios wrappers for backend
│ │ └── App.jsx
│ └── package.json
│
└── README.md # Project usage & setup guide

📝➕😂🌴TODO's (20-08-25) :-
│──Dark/Light Theme
├──slack notification
├──

ip:
access_time:
method:
endpoint:
protocol:
status:
bytes:
referrer:
user_agent:
log_time:
log_level:
message:
request_id:

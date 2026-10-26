<p align="center">
  <img src="assets/banner.svg" width="100%" alt="Gerardo Vilchis, AI/ML Engineer and Data Scientist. I ship LLM agents to production.">
</p>

I'm an AI/ML engineer building LLM agents, RAG systems and ML pipelines that run in production on Databricks and on self-hosted infrastructure, from raw data through training, deployment and monitoring. I came to GenAI from embedded systems, robotics and quant development, so I care about what happens after the demo: guardrails, latency, token cost, security and observability.

<p align="center">
  <img src="assets/impact.svg" width="100%" alt="Analysts in 40+ countries use my multi-agent system. 8 years of engineering. 2 Databricks certifications. M.Sc. in Computer Science.">
</p>

## Flagship: an enterprise multi-agent system

It started as a finance assistant and grew into a company-wide data assistant. Analysts in more than 40 countries use it to pull income statements and drill into the products, entities and drivers that move results the most, and it now connects people/HR, IoT and route-to-market data with company documents too.

A Deep Agents/LangGraph supervisor delegates to specialized subagents, including DSPy modules wrapped in LangChain, with guardrails and per-task routing across several LLMs on Model Serving. Its tools are domain Genie agents over tables and Unity Catalog volumes, plus Genie Ontology through the Genie One MCP server. It runs as a Databricks App on the client's Azure Databricks: a React UI streams each subagent's events and renders Plotly charts, DataFrames, code and cited documents, with Lakebase holding memory and artifacts, and Microsoft Teams as a second front door.

```mermaid
%%{init: {"theme": "base", "themeVariables": {"primaryColor": "#152C55", "primaryTextColor": "#EAF2FF", "primaryBorderColor": "#4EA8FF", "lineColor": "#4EA8FF", "secondaryColor": "#0B1B3A", "tertiaryColor": "#0B1B3A", "clusterBkg": "#0B1B3A", "clusterBorder": "#2C5DB8", "titleColor": "#EAF2FF", "edgeLabelBackground": "#0B1B3A"}}}%%
flowchart TB
    UI["React app on Databricks Apps<br/>+ Microsoft Teams"] --> SUP["Supervisor<br/>Deep Agents · LangGraph<br/>guardrails · multi-LLM routing"]
    SUP --> SUBS["Specialized subagents<br/>DSPy modules in LangChain"]
    SUP -- tools --> GENIE["Domain Genie agents<br/>finance · HR · IoT · RTM<br/>docs in Unity Catalog volumes"]
    SUP -- Genie One MCP --> ONT["Genie Ontology"]
    SUP --- MEM[("Lakebase<br/>memory · artifacts")]
```

The code belongs to a client, so the repository is private. The architecture above is the part I can share.

## More in production

<details>
<summary><b>Self-hosted AI platform infrastructure</b> · zero trust, infrastructure as code</summary>
<br>

- Built, on my own, the self-hosted platform behind a company's AI services, used by every team: servers with no inbound ports, cloud resources in OpenTofu and idempotent host configuration in Ansible.
- Published internal MCP servers to Claude connectors through Cloudflare Tunnel, with Cloudflare Access as their OAuth server, while the Coolify control panel and a private container registry stay reachable only over the Tailscale tailnet.
- Secured the stack with SOPS/age-encrypted secrets, client-side encrypted remote state, three exposure tiers (private, protected, public), host hardening, encrypted nightly backups and uptime monitoring.
- Gated every release tag on a verified, empty infrastructure plan, so each tag is a tested restore point.

**Stack:** OpenTofu, Ansible, Coolify, Hetzner, Tailscale, Cloudflare Tunnel and Access, SOPS/age, Docker
</details>

<details>
<summary><b>Sales forecasting and product cannibalization</b> · retail/CPG</summary>
<br>

- Owned the whole data science workflow on the client's Azure Databricks data, from EDA and feature engineering to training and evaluation, to forecast sales across a bakery product portfolio.
- Modeled which products eat into each other's sales, to guide assortment and demand planning.
- Served the model from a Databricks Model Serving endpoint that an LLM agent in Microsoft Teams calls for predictions and cannibalization analysis on demand.

**Stack:** Python, scikit-learn, MLflow, Azure Databricks Model Serving
</details>

<details>
<summary><b>Plant maintenance RAG assistant</b> · industrial bakery</summary>
<br>

- Built the RAG system behind an iPad assistant that answers failure-code, maintenance and operating questions from ingested machine manuals, citing the source of every answer.
- Owned retrieval and generation on the client's Azure, using a Microsoft Foundry and Azure AI Search vector index.

**Stack:** Microsoft Foundry, Azure AI Search, Python
</details>

## How I got here

<p align="center">
  <img src="assets/journey.svg" width="100%" alt="2018 computer vision, 2019 firmware and PCBs, 2021 IoT freelance, 2022 robotics for ANA Avatar XPRIZE, 2023 quant developer in Singapore, 2024 AI/ML engineer shipping GenAI and self-hosted infrastructure.">
</p>

Since 2023 I've also been a university professor, teaching AI, software, electronics and embedded systems in bachelor's and master's programs.

## Stack

<p align="center">
  <img src="assets/genai-stack.svg" width="100%" alt="Models: Claude, GPT, Gemini, Llama, Qwen, DeepSeek, Kimi, GLM. Agent frameworks: DSPy, LangGraph, LangChain, Deep Agents, CrewAI, MCP. Coding agents: Claude Code, Codex, OpenCode, Genie Code. Platforms: Databricks, MLflow, Microsoft Foundry, Azure, AWS.">
</p>

<p align="center">
  <img src="assets/engineering-stack.svg" width="100%" alt="ML and data: PyTorch, TensorFlow, Keras, scikit-learn, OpenCV, NumPy, pandas, Plotly. Languages: Python, SQL, Bash, TypeScript, C, C++, Go. Backend and data: FastAPI, Flask, Streamlit, React, PostgreSQL, MySQL, MongoDB, Redis. Infra: Docker, Linux, Hetzner, Coolify, Tailscale, Cloudflare, OpenTofu, Ansible, SOPS.">
</p>

## Certifications

<p align="center">
  <a href="https://credentials.databricks.com/d2e586de-cdc8-4f8a-87c8-84ff702bf1db"><img src="assets/cert-ml-professional.svg" width="49%" alt="Databricks Certified Machine Learning Professional, valid 2026 to 2028"></a>
  <a href="https://credentials.databricks.com/dd688c7a-ead7-429b-8835-798822998ae8"><img src="assets/cert-genai-associate.svg" width="49%" alt="Databricks Certified Generative AI Engineer Associate, valid 2026 to 2028"></a>
</p>

<sub>AI brand icons from <a href="https://github.com/lobehub/lobe-icons">Lobe Icons</a>; other logos from <a href="https://simpleicons.org">Simple Icons</a>. Images are generated by <code>scripts/build-assets.mjs</code>.</sub>

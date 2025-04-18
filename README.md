# 🎟️ Arretados Ingressos - Painel do Organizador

Este é o **painel administrativo** do sistema **Arretados Ingressos**, voltado para organizadores de eventos. Através deste painel, é possível visualizar, filtrar e validar os ingressos comprados via app do cliente.

---

## 🔧 Funcionalidades

- ✅ Atualização em tempo real com Firebase Firestore
- 🔍 Filtro por CPF, gênero, cidade e evento
- 📄 Exportação para PDF e CSV
- 🌓 Modo escuro/claro com salvamento de preferência
- 🆔 Visualização detalhada do ingresso com QR Code
- ✔️ Validação manual dos ingressos
- 📊 Contador de ingressos pendentes/validados

---

## 🧪 Ambiente de Teste

As regras do Firebase estão **temporariamente abertas para testes**. ⚠️  
🔐 Lembrar de restringir as permissões após finalizar os testes.

---

## 🚀 Como rodar localmente

1. Baixe ou clone este repositório
2. Abra a pasta no terminal
3. Execute:

```bash
python -m http.server 8080
```

4. Acesse no navegador:

```
http://localhost:8080/painel_organizador.html
```

---

## 📁 Estrutura

```text
📦 arretados-organizador
├── painel_organizador.html
├── cadastro.html
├── login.html
├── firebase-config.js
└── README.md
```

---

## 🧠 Desenvolvido por

Arretados Produções • 2025  
Contato: [@arretadosproducoes](https://instagram.com/arretadosproducoes)
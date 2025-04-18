<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Painel do Organizador</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #fff8e1;
      padding: 2rem;
    }
    h1 {
      color: #d35400;
    }
    .filtros input, .filtros select {
      padding: 0.5rem;
      margin: 0.5rem;
    }
    .contadores {
      display: flex;
      gap: 1rem;
      margin: 1rem 0;
    }
    .contador {
      background: white;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 0 5px rgba(0,0,0,0.1);
      text-align: center;
    }
    .pedido {
      background: white;
      padding: 1rem;
      margin: 0.5rem 0;
      border-radius: 5px;
      box-shadow: 0 0 5px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <h1>Painel do Organizador (Tempo Real)</h1>

  <div class="contadores">
    <div class="contador">
      <strong>Total</strong>
      <div id="totalPedidos">0</div>
    </div>
    <div class="contador">
      <strong>Validados</strong>
      <div id="totalValidados">0</div>
    </div>
    <div class="contador">
      <strong>Pendentes</strong>
      <div id="totalPendentes">0</div>
    </div>
  </div>

  <div class="filtros">
    <input type="text" id="buscaCPF" placeholder="Buscar por CPF...">
    <select id="filtroStatus">
      <option value="todos">Todos</option>
      <option value="pendente">Pendentes</option>
      <option value="validado">Validados</option>
    </select>
  </div>

  <div id="listaPedidos"></div>

  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
    import { getFirestore, collection, onSnapshot, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

    const firebaseConfig = {
      apiKey: "AIzaSyCgFN0lCf0xeJaLnWkTfjAbvDBwQXxXe0A",
      authDomain: "arretados-ingressos-app.firebaseapp.com",
      projectId: "arretados-ingressos-app",
      storageBucket: "arretados-ingressos-app.appspot.com",
      messagingSenderId: "309467408671",
      appId: "1:309467408671:web:d4be567df9b4d39a1e282a"
    };

    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const lista = document.getElementById("listaPedidos");
    const buscaCPF = document.getElementById("buscaCPF");
    const filtroStatus = document.getElementById("filtroStatus");
    let dados = [];

    onSnapshot(collection(db, "pedidos"), (snapshot) => {
      dados = [];
      snapshot.forEach((doc) => {
        const pedidos = doc.data();
        Object.entries(pedidos).forEach(([id, p]) => {
          dados.push({ id: id, ...p });
        });
      });
      renderizar();
    });

    function renderizar() {
      const cpfFiltro = buscaCPF.value.trim();
      const statusFiltro = filtroStatus.value;

      const filtrados = dados.filter(p => {
        const statusMatch = (statusFiltro === "todos" || p.evento.status === statusFiltro);
        const cpfMatch = p.cpf.includes(cpfFiltro);
        return statusMatch && cpfMatch;
      });

      document.getElementById("totalPedidos").textContent = dados.length;
      document.getElementById("totalValidados").textContent = dados.filter(p => p.evento.status === "validado").length;
      document.getElementById("totalPendentes").textContent = dados.filter(p => p.evento.status === "pendente").length;

      lista.innerHTML = "";
      filtrados.forEach(p => {
        const div = document.createElement("div");
        div.className = "pedido";
        div.innerHTML = `
          <strong>${p.evento.nome}</strong><br>
          CPF: ${p.cpf}<br>
          Status: <span style="color: ${p.evento.status === 'pendente' ? 'red' : 'green'}">${p.evento.status}</span><br>
          WhatsApp: ${p.evento.whatsapp || "-"}
        `;
        lista.appendChild(div);
      });
    }

    buscaCPF.addEventListener("input", renderizar);
    filtroStatus.addEventListener("input", renderizar);
  </script>
</body>
</html>

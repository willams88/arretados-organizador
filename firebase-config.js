<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Painel do Organizador</title>
  <link rel="stylesheet" href="style.css">
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
    import {
      getFirestore, collection, onSnapshot, updateDoc, doc
    } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
    import { firebaseConfig } from "./firebase-config.js";

    const app = initializeApp(firebaseConfig);
    const db = getFirestore();

    const lista = document.getElementById("listaPedidos");
    const buscaCPF = document.getElementById("buscaCPF");
    const filtroStatus = document.getElementById("filtroStatus");
    let dados = [];

    // Carregar dados em tempo real
    onSnapshot(collection(db, "pedidos"), (snapshot) => {
      dados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      renderizar();
    });

    // Função para validar pedido
    async function validarPedido(id) {
      await updateDoc(doc(db, "pedidos", id), {
        "evento.status": "validado"
      });
      alert("✅ Pedido validado!");
    }

    // Renderizar lista
    function renderizar() {
      const cpfFiltro = buscaCPF.value;
      const statusFiltro = filtroStatus.value;

      const filtrados = dados.filter(p => {
        const cpf = (p.cpf || p.evento?.cpf || "-").replaceAll('"', '');
        const status = p.evento?.status || p.status || "";
        return (
          cpf.includes(cpfFiltro) &&
          (statusFiltro === "todos" || status === statusFiltro)
        );
      });

      document.getElementById("totalValidados").textContent = dados.filter(p => (p.status || p.evento?.status) === "validado").length;
      document.getElementById("totalPendentes").textContent = dados.filter(p => (p.status || p.evento?.status) === "pendente").length;
      document.getElementById("totalPedidos").textContent = dados.length;

      lista.innerHTML = "";
      filtrados.forEach(p => {
        const nomeEvento = p.evento?.nomeEvento || "-";
        const nomePessoa = p.evento?.nomePessoa || "-";        
        const status = p.evento?.status || p.status || "-";
        const cpf = (p.cpf || p.evento?.cpf || "-").replaceAll('"', '');
        const whatsapp = p.evento?.whatsapp || "-";

        const div = document.createElement("div");
        div.className = "pedido";
        div.innerHTML = `
          <strong>${nomeEvento}</strong><br>
          Nome: ${nomePessoa}<br>
          CPF: ${cpf}<br>
          Status: <span style="color:${status === 'validado' ? 'green' : 'red'}">${status}</span><br>
          WhatsApp: ${whatsapp}<br>
          ${status === 'pendente' ? `<button onclick="validarPedido('${p.id}')">✔ Validar</button>` : ''}
        `;
        lista.appendChild(div);
      });
    }

    // Eventos de filtro
    [buscaCPF, filtroStatus].forEach(el => {
      el.addEventListener("input", renderizar);
    });

    // Tornar função disponível globalmente
    window.validarPedido = validarPedido;
  </script>
</head>
<body>
  <h1>Painel do Organizador</h1>
  <input type="text" id="buscaCPF" placeholder="Buscar CPF...">
  <select id="filtroStatus">
    <option value="todos">Todos</option>
    <option value="validado">Validados</option>
    <option value="pendente">Pendentes</option>
  </select>
  <div class="painel">
    <div>Total<br><span id="totalPedidos">0</span></div>
    <div>Validados<br><span id="totalValidados">0</span></div>
    <div>Pendentes<br><span id="totalPendentes">0</span></div>
  </div>
  <div id="listaPedidos"></div>
</body>
</html>

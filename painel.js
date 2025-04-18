import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// Firebase inicializado em firebase-config.js
const db = getFirestore();

// Elementos
const lista = document.getElementById("listaPedidos");
const buscaNome = document.getElementById("buscaNome");
const buscaCPF = document.getElementById("buscaCPF");
const filtroStatus = document.getElementById("filtroStatus");

let dados = [];

// 🟢 Carregar dados em tempo real
onSnapshot(collection(db, "pedidos"), (snapshot) => {
  dados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderizar();
});

// 🎨 Renderizar lista
function renderizar() {
  const nomeFiltro = buscaNome.value.toLowerCase();
  const cpfFiltro = buscaCPF.value;
  const statusFiltro = filtroStatus.value;

  const filtrados = dados.filter(pedido => {
    const nome = pedido.evento?.nome?.toLowerCase() || "";
    const cpf = pedido.cpf || "";
    const status = pedido.status || pedido.evento?.status || "pendente";

    return (
      (nome.includes(nomeFiltro)) &&
      (cpf.includes(cpfFiltro)) &&
      (statusFiltro === "todos" || status === statusFiltro)
    );
  });

  // Resumo
  document.getElementById("totalTodos").textContent = dados.length;
  document.getElementById("totalValidados").textContent = dados.filter(p => (p.status || p.evento?.status) === "validado").length;
  document.getElementById("totalPendentes").textContent = dados.filter(p => (p.status || p.evento?.status) === "pendente").length;

  lista.innerHTML = "";
  filtrados.forEach(p => {
    const nome = p.evento?.nome || "-";
    const cpf = p.cpf || "-";
    const status = p.status || p.evento?.status || "pendente";
    const whatsapp = p.whatsapp || p.evento?.whatsapp || "";

    const div = document.createElement("div");
    div.className = "pedido";
    div.innerHTML = `
      <strong>${nome}</strong><br>
      CPF: ${cpf}<br>
      Status: <span class="${status}">${status}</span><br>
      <button onclick="validarPedido('${p.id}')">✅ Validar</button>
      <button onclick="reenviarWhats('${whatsapp}')">📲 WhatsApp</button>
    `;
    lista.appendChild(div);
  });
}

// ✅ Validar pedido
window.validarPedido = async (id) => {
  await updateDoc(doc(db, "pedidos", id), { status: "validado" });
  alert("✅ Pedido validado!");
};

// 📲 Reenviar por WhatsApp
window.reenviarWhats = (numero) => {
  if (!numero) return alert("WhatsApp não disponível.");
  window.open(`https://wa.me/55${numero}`, "_blank");
};

// 🌗 Alternar modo escuro
window.toggleModoEscuro = () => {
  document.body.classList.toggle("dark");
};

// Exportar CSV
window.exportarCSV = () => {
  const linhas = [["Nome", "CPF", "Status"]];
  dados.forEach(p => {
    linhas.push([p.evento?.nome || "", p.cpf || "", p.status || p.evento?.status || ""]);
  });

  const csv = linhas.map(l => l.join(";")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "pedidos.csv";
  link.click();
};

// Exportar PDF
window.exportarPDF = () => {
  const docWindow = window.open("", "_blank");
  docWindow.document.write("<pre>" + dados.map(p =>
    `Nome: ${p.evento?.nome}\nCPF: ${p.cpf}\nStatus: ${p.status || p.evento?.status}\n\n`
  ).join("") + "</pre>");
  docWindow.print();
};

// Eventos de filtro
[buscaNome, buscaCPF, filtroStatus].forEach(el => {
  el.addEventListener("input", renderizar);
});

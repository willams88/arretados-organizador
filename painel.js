// painel.js
import { getFirestore, collection, onSnapshot, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { app } from "./firebase-config.js";

const db = getFirestore(app);

const lista = document.getElementById("listaPedidos");
const buscaNome = document.getElementById("buscaNome");
const buscaCPF = document.getElementById("buscaCPF");
const filtroStatus = document.getElementById("filtroStatus");

let dados = [];

onSnapshot(collection(db, "pedidos"), (snapshot) => {
  dados = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  renderizar();
});

function renderizar() {
  const nomeFiltro = buscaNome.value.toLowerCase();
  const cpfFiltro = buscaCPF.value;
  const statusFiltro = filtroStatus.value;

  const filtrados = dados.filter(pedido => {
    const nome = pedido.evento?.nome?.toLowerCase() || "";
    const cpf = pedido.cpf || "";
    const status = pedido.status || pedido.evento?.status || "pendente";

    return (
      nome.includes(nomeFiltro) &&
      cpf.includes(cpfFiltro) &&
      (statusFiltro === "todos" || status === statusFiltro)
    );
  });

  document.getElementById("totalPedidos").textContent = dados.length;
  document.getElementById("totalValidados").textContent = dados.filter(p => (p.status || p.evento?.status) === "validado").length;
  document.getElementById("totalPendentes").textContent = dados.filter(p => (p.status || p.evento?.status) === "pendente").length;

  lista.innerHTML = "";
  filtrados.forEach(p => {
    const div = document.createElement("div");
    div.className = "pedido";
    div.innerHTML = `
      <strong>${p.evento?.nome || "-"}</strong><br>
      CPF: ${p.cpf || "-"}<br>
      Status: <span class="${p.status === "validado" ? "validado" : "pendente"}">${p.status || "pendente"}</span><br>
      WhatsApp: ${p.whatsapp || "-"}
    `;

    const btnValidar = document.createElement("button");
    btnValidar.textContent = "✅ Validar";
    btnValidar.onclick = () => validarPedido(p.id);
    div.appendChild(btnValidar);

    const btnWhats = document.createElement("button");
    btnWhats.textContent = "📲 WhatsApp";
    btnWhats.onclick = () => reenviarWhats(p.whatsapp);
    div.appendChild(btnWhats);

    lista.appendChild(div);
  });
}

async function validarPedido(id) {
  await updateDoc(doc(db, "pedidos", id), { status: "validado" });
  alert("✅ Pedido validado!");
}

function reenviarWhats(numero) {
  if (!numero) return alert("Número inválido");
  window.open(`https://wa.me/55${numero}`, "_blank");
}

window.exportarCSV = () => {
  const linhas = [["Nome", "CPF", "Status"]];
  dados.forEach(p => {
    linhas.push([p.evento?.nome || "", p.cpf || "", p.status || "pendente"]);
  });
  const csv = linhas.map(l => l.join(";")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "pedidos.csv";
  link.click();
};

window.exportarPDF = () => {
  const docWindow = window.open("", "_blank");
  docWindow.document.write("<pre>" + dados.map(p =>
    `Nome: ${p.evento?.nome}\nCPF: ${p.cpf}\nStatus: ${p.status || "pendente"}\n\n`
  ).join("") + "</pre>");
  docWindow.print();
};

window.toggleModoEscuro = () => {
  document.body.classList.toggle("dark");
};

[buscaNome, buscaCPF, filtroStatus].forEach(el => {
  el.addEventListener("input", renderizar);
});

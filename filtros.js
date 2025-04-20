
const inputNome = document.getElementById("filtroNome");
const inputCPF = document.getElementById("filtroCPF");
const selectStatus = document.getElementById("filtroStatus");
const selectEvento = document.getElementById("filtroEvento");

let cachePedidos = [];

function aplicarFiltros(pedidos, nome, cpf, status, evento) {
  return pedidos.filter(p => {
    const nomeOk = !nome || p.evento?.nomecliente?.toLowerCase().includes(nome.toLowerCase());
    const cpfOk = !cpf || p.cpf?.includes(cpf);
    const statusOk = !status || p.evento?.status === status;
    const eventoOk = !evento || p.evento?.nomeEvento === evento;
    return nomeOk && cpfOk && statusOk && eventoOk;
  });
}

function atualizarLista(pedidos) {
  const lista = document.getElementById("lista-pedidos");
  const template = document.getElementById("template-pedido");
  lista.innerHTML = "";

  const filtrados = aplicarFiltros(
    pedidos,
    inputNome.value,
    inputCPF.value,
    selectStatus.value,
    selectEvento.value
  );

  filtrados.forEach(dados => {
    const clone = template.content.cloneNode(true);
    clone.querySelector(".nome").textContent = dados.evento.nomecliente;
    clone.querySelector(".cpf").textContent = dados.cpf;
    clone.querySelector(".evento").textContent = dados.evento.nomeEvento;
    const statusEl = clone.querySelector(".status");
    statusEl.textContent = dados.evento.status;
    statusEl.className = "status " + dados.evento.status.toLowerCase();
    clone.querySelector(".codigo").textContent = dados.codigo || `${dados.cpf.slice(-4)}-${dados.evento.nomeEvento.slice(0, 3)}`;

    QRCode.toCanvas(document.createElement("canvas"), JSON.stringify({
      nome: dados.evento.nomecliente,
      cpf: dados.cpf,
      evento: dados.evento.nomeEvento,
      status: dados.evento.status,
      codigo: dados.codigo || `${dados.cpf.slice(-4)}-${dados.evento.nomeEvento.slice(0, 3)}`
    }), (err, canvas) => {
      if (!err) clone.querySelector(".qrcode").appendChild(canvas);
    });

    clone.querySelector(".validar").onclick = () => validarIngresso(dados.id);
    clone.querySelector(".reenviar").onclick = () => reenviarWhatsApp({
      nome: dados.evento.nomecliente,
      cpf: dados.cpf,
      evento: dados.evento.nomeEvento,
      status: dados.evento.status,
      codigo: dados.codigo || `${dados.cpf.slice(-4)}-${dados.evento.nomeEvento.slice(0, 3)}`,
      telefone: dados.evento.whatsapp || ""
    });
    clone.querySelector(".excluir").onclick = () => excluirIngresso(dados.id);

    lista.appendChild(clone);
  });
}

function carregarEventosUnicos(pedidos) {
  const eventos = [...new Set(pedidos.map(p => p.evento?.nomeEvento))];
  selectEvento.innerHTML = '<option value="">Todos</option>';
  eventos.forEach(evt => {
    const opt = document.createElement("option");
    opt.value = evt;
    opt.textContent = evt;
    selectEvento.appendChild(opt);
  });
}

function escutarPedidos() {
  db.collection("pedidos").onSnapshot(snapshot => {
    const pedidos = [];
    snapshot.forEach(doc => pedidos.push({ id: doc.id, ...doc.data() }));
    cachePedidos = pedidos;
    carregarEventosUnicos(pedidos);
    atualizarLista(pedidos);
  });
}

[inputNome, inputCPF, selectStatus, selectEvento].forEach(el => {
  el.addEventListener("input", () => atualizarLista(cachePedidos));
});

escutarPedidos();

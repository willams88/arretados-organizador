
window.validarIngresso = function(id) {
  db.collection("pedidos").doc(id).update({
    "evento.status": "validado"
  })
  .then(() => {
    alert("Ingresso validado com sucesso!");
  })
  .catch(err => console.error("Erro ao validar:", err));
};

window.reenviarWhatsApp = function(dados) {
  const msg = `🎟️ Ingresso Confirmado\nEvento: ${dados.evento}\nNome: ${dados.nome}\nCPF: ${dados.cpf}\nStatus: ${dados.status}\nCódigo: ${dados.codigo}`;
  if (dados.telefone) {
    const link = `https://wa.me/55${dados.telefone}?text=${encodeURIComponent(msg)}`;
    window.open(link, '_blank');
  } else {
    alert("Telefone não disponível para este pedido.");
  }
};

window.excluirIngresso = function(id) {
  if (confirm("Tem certeza que deseja excluir este ingresso?")) {
    db.collection("pedidos").doc(id).delete()
      .then(() => {
        alert("Ingresso excluído com sucesso.");
      })
      .catch(err => console.error("Erro ao excluir:", err));
  }
};

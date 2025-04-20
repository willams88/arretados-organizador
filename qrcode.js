// qrcode.js

function gerarQRCode(dados, container) {
  const canvas = document.createElement("canvas");
  QRCode.toCanvas(canvas, JSON.stringify({
    nome: dados.nome,
    cpf: dados.cpf,
    evento: dados.evento,
    codigo: dados.codigo,
    status: dados.status
  }), (err) => {
    if (!err) container.appendChild(canvas);
  });
}

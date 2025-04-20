
window.exportarCSV = function () {
  const csv = ["Nome,CPF,Evento,Código,Status"];
  document.querySelectorAll(".pedido").forEach(card => {
    const nome = card.querySelector(".nome")?.textContent.trim() || "";
    const cpf = card.querySelector(".cpf")?.textContent.trim() || "";
    const evento = card.querySelector(".evento")?.textContent.trim() || "";
    const codigo = card.querySelector(".codigo")?.textContent.trim() || "";
    const status = card.querySelector(".status")?.textContent.trim() || "";
    csv.push(`${nome},${cpf},${evento},${codigo},${status}`);
  });
  const blob = new Blob([csv.join("\n")], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "ingressos.csv";
  link.click();
};

window.exportarPDF = function () {
  const win = window.open("", "_blank");
  win.document.write("<html><head><title>Ingressos PDF</title></head><body>");
  win.document.write("<h1>Lista de Ingressos</h1><table border='1' cellpadding='5'><tr>");
  ["Nome", "CPF", "Evento", "Código", "Status"].forEach(t => {
    win.document.write("<th>" + t + "</th>");
  });
  win.document.write("</tr>");

  document.querySelectorAll(".pedido").forEach(card => {
    const nome = card.querySelector(".nome")?.textContent.trim() || "";
    const cpf = card.querySelector(".cpf")?.textContent.trim() || "";
    const evento = card.querySelector(".evento")?.textContent.trim() || "";
    const codigo = card.querySelector(".codigo")?.textContent.trim() || "";
    const status = card.querySelector(".status")?.textContent.trim() || "";
    win.document.write("<tr><td>" + nome + "</td><td>" + cpf + "</td><td>" + evento + "</td><td>" + codigo + "</td><td>" + status + "</td></tr>");
  });

  win.document.write("</table></body></html>");
  win.document.close();
  win.print();
};

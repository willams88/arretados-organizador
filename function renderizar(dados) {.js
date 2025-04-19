function renderizar(dados) {
    const filtrados = dados.filter(p => {
      return p.cpf?.includes(campos.cpf.value) &&
             p.evento?.nomecliente?.toLowerCase().includes(campos.nome.value.toLowerCase()) &&
             p.evento?.data?.includes(campos.data.value) &&
             p.evento?.local?.toLowerCase().includes(campos.local.value.toLowerCase()) &&
             (campos.status.value === "todos" || p.evento?.status === campos.status.value);
    });
  
    const agrupados = {};
    filtrados.forEach(p => {
      const evento = p.evento?.nomeEvento || "Outro Evento";
      if (!agrupados[evento]) agrupados[evento] = [];
      agrupados[evento].push(p);
    });
  
    lista.innerHTML = "";
    Object.entries(agrupados).forEach(([evento, pedidos]) => {
      const bloco = document.createElement("div");
      bloco.innerHTML = `<h2 style="color:#d35400">${evento}</h2>`;
      
      pedidos.forEach(p => {
        const div = document.createElement("div");
        div.className = "card";
        const statusColor = p.evento?.status === "validado" ? "green" : "red";
        const codigo = (p.evento?.codigo || "000000").padStart(6, '0');
        const canvasId = `qr-${p.id}-${Math.random().toString(36).substring(2, 8)}`;
  
        div.innerHTML = `
          <strong>Nome:</strong> ${p.evento?.nomecliente || "-"}<br>
          <strong>CPF:</strong> ${p.cpf || "-"}<br>
          <strong>Data:</strong> ${p.evento?.data || "-"}<br>
          <strong>Local:</strong> ${p.evento?.local || "-"}<br>
          <strong>Status:</strong> <span style="color:${statusColor}">${p.evento?.status || "-"}</span><br>
          <strong>Código de Segurança:</strong> <span style="color:#6a1b9a; font-weight:bold">${codigo}</span><br>
          <canvas id="${canvasId}" style="margin:10px 0"></canvas><br>
        `;
  
        const btnZap = document.createElement("button");
        btnZap.textContent = "📤 Reenviar por WhatsApp";
        btnZap.style.background = "#25D366";
        btnZap.style.marginRight = "5px";
        btnZap.onclick = () => {
          const numero = p.evento?.whatsapp?.replace(/\D/g, "");
          const texto = `🎫 *Ingresso Arretados Produções*\nNome: ${p.evento?.nomecliente}\nEvento: ${evento}\nCPF: ${p.cpf}\nCódigo: ${codigo}`;
          if (numero) {
            window.open(`https://wa.me/55${numero}?text=${encodeURIComponent(texto)}`, "_blank");
          } else {
            alert("Número de WhatsApp não informado.");
          }
        };
  
        const btnExcluir = document.createElement("button");
        btnExcluir.textContent = "🗑️ Excluir";
        btnExcluir.style.background = "#c0392b";
        btnExcluir.onclick = async () => {
          if (confirm("Deseja realmente excluir este pedido?")) {
            await deleteDoc(doc(db, 'pedidos', p.id));
          }
        };
  
        div.appendChild(btnZap);
        div.appendChild(btnExcluir);
        bloco.appendChild(div);
  
        // Gera o QR Code corretamente após inserção no DOM
        setTimeout(() => {
          new QRious({
            element: document.getElementById(canvasId),
            value: `CPF:${p.cpf}\nEvento:${evento}\nNome:${p.evento?.nomecliente || "-"}`,
            size: 100
          });
        }, 100);
      });
  
      lista.appendChild(bloco);
    });
  }
  
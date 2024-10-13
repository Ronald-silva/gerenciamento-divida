const valorInicial = 5107.00;
const numParcelas = 18;
const valorParcela = valorInicial / numParcelas;
let valorRestante = valorInicial;
let parcelasPagas = 0;
let chart;

function atualizarDashboard() {
    document.getElementById('parcelaValor').textContent = valorParcela.toFixed(2);
    document.getElementById('valorRestante').textContent = valorRestante.toFixed(2);
    document.getElementById('parcelasPagas').textContent = parcelasPagas;
    
    const dataProximoPagamento = new Date();
    dataProximoPagamento.setDate(30);
    if (dataProximoPagamento < new Date()) {
        dataProximoPagamento.setMonth(dataProximoPagamento.getMonth() + 1);
    }
    document.getElementById('proximoPagamento').textContent = dataProximoPagamento.toLocaleDateString('pt-BR');

    atualizarGrafico();
}

function registrarPagamento() {
    if (parcelasPagas < numParcelas) {
        const dataPagamento = new Date().toLocaleDateString('pt-BR');
        valorRestante -= valorParcela;
        parcelasPagas++;

        const tabela = document.getElementById('historicoTabela');
        const novaLinha = tabela.insertRow(-1);
        const celData = novaLinha.insertCell(0);
        const celValorPago = novaLinha.insertCell(1);
        const celValorRestante = novaLinha.insertCell(2);

        celData.textContent = dataPagamento;
        celValorPago.textContent = `R$ ${valorParcela.toFixed(2)}`;
        celValorRestante.textContent = `R$ ${valorRestante.toFixed(2)}`;

        atualizarDashboard();

        if (parcelasPagas === numParcelas) {
            alert('Parabéns! Você concluiu todos os pagamentos.');
        }
    } else {
        alert('Todos os pagamentos já foram realizados.');
    }
}

function criarGrafico() {
    const ctx = document.getElementById('paymentChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pago', 'Restante'],
            datasets: [{
                data: [0, valorInicial],
                backgroundColor: ['#4a90e2', '#f5a623']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: true,
                    text: 'Progresso do Pagamento'
                }
            }
        }
    });
}

function atualizarGrafico() {
    const valorPago = valorInicial - valorRestante;
    chart.data.datasets[0].data = [valorPago, valorRestante];
    chart.update();
}

// Inicializar o dashboard e o gráfico
criarGrafico();
atualizarDashboard();

// Configurar o lembrete
function verificarLembrete() {
    const hoje = new Date();
    if (hoje.getDate() === 30 && parcelasPagas < numParcelas) {
        alert('Lembrete: Hoje é dia de pagar sua parcela!');
    }
}

// Verificar o lembrete diariamente
setInterval(verificarLembrete, 86400000); // 24 horas em milissegundos

// Verificar imediatamente ao carregar a página
verificarLembrete();
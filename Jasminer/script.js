// Limpar LocalStorage ao carregar a página para reiniciar o site
window.onload = function () {
    localStorage.clear();

    // Configurar evento de mudança no tipo de emprego
    document.getElementById('employment').addEventListener('change', function () {
        const incomeLabel = document.getElementById('income-label');
        if (this.value === 'clt') {
            incomeLabel.textContent = 'Qual é o seu salário líquido mensal?';
        } else {
            incomeLabel.textContent = 'Qual é a média do seu faturamento mensal?';
        }
    });

    // Configurar evento ao clicar no botão de calcular
    document.getElementById('calculate').addEventListener('click', function () {
        const name = document.getElementById('name').value;
        const income = parseFloat(document.getElementById('income').value);
        if (!name || isNaN(income) || income <= 0) {
            alert('Por favor, insira um nome e um valor de renda válidos.');
            return;
        }

        const essential = income * 0.5;
        const important = income * 0.3;
        const nonEssential = income * 0.2;

        document.getElementById('user-name').textContent = name;
        document.getElementById('essential').textContent = essential.toFixed(2);
        document.getElementById('important').textContent = important.toFixed(2);
        document.getElementById('non-essential').textContent = nonEssential.toFixed(2);

        document.getElementById('results').style.display = 'block';
        document.getElementById('expenses').style.display = 'block';

        // Salvar informações no LocalStorage
        localStorage.setItem('name', name);
        localStorage.setItem('employment', document.getElementById('employment').value);
        localStorage.setItem('income', income);
        localStorage.setItem('essential', essential);
        localStorage.setItem('important', important);
        localStorage.setItem('nonEssential', nonEssential);
    });

    // Configurar evento ao clicar no botão de adicionar gasto
    document.getElementById('add-expense').addEventListener('click', function () {
        const description = document.getElementById('expense-description').value;
        const value = parseFloat(document.getElementById('expense-value').value);
        if (!description || isNaN(value) || value <= 0) {
            alert('Por favor, insira uma descrição e um valor válidos.');
            return;
        }

        const expenseList = document.getElementById('expense-list');
        const li = document.createElement('li');
        li.textContent = `${description}: R$${value.toFixed(2)}`;
        expenseList.appendChild(li);

        // Salvar gasto no LocalStorage
        let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses.push({ description, value });
        localStorage.setItem('expenses', JSON.stringify(expenses));
    });

    // Configurar evento ao clicar no botão de baixar PDF
    document.getElementById('download-pdf').addEventListener('click', function () {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({
            // Configurações da página
            unit: 'cm',
            format: 'a4'
        });

        // Configuração de margens e estilo
        const marginLeft = 2.5;
        const marginTop = 2.5;
        const lineHeight = 1.5;
        const fontSize = 12;
        const fontName = 'Arial';
        
        doc.setFont(fontName);
        doc.setFontSize(fontSize);
        doc.setLineHeightFactor(lineHeight);

        // Adicionando conteúdo ao PDF
        const name = localStorage.getItem('name');
        const employment = localStorage.getItem('employment');
        const income = localStorage.getItem('income');
        const essential = localStorage.getItem('essential');
        const important = localStorage.getItem('important');
        const nonEssential = localStorage.getItem('nonEssential');
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];

        let yPosition = marginTop;
        
        doc.text(`Nome: ${name}`, marginLeft, yPosition);
        yPosition += lineHeight;
        doc.text(`Tipo de Emprego: ${employment === 'clt' ? 'CLT' : 'PJ'}`, marginLeft, yPosition);
        yPosition += lineHeight;
        doc.text(`Renda Mensal: R$${income}`, marginLeft, yPosition);
        yPosition += lineHeight;
        doc.text(`Gastos Essenciais: R$${essential}`, marginLeft, yPosition);
        yPosition += lineHeight;
        doc.text(`Gastos Importantes: R$${important}`, marginLeft, yPosition);
        yPosition += lineHeight;
        doc.text(`Gastos Não Essenciais: R$${nonEssential}`, marginLeft, yPosition);
        yPosition += lineHeight;

        if (expenses.length > 0) {
            doc.setFontSize(fontSize + 2);
            doc.setFont(undefined, 'bold');
            yPosition += lineHeight;
            doc.text('Lista de Gastos:', marginLeft, yPosition);
            doc.setFont(undefined, 'normal');
            doc.setFontSize(fontSize);
            yPosition += lineHeight;

            expenses.forEach((expense) => {
                doc.text(`${expense.description}: R$${expense.value.toFixed(2)}`, marginLeft, yPosition);
                yPosition += lineHeight;
            });
        }

        doc.save('informacoes_financeiras.pdf');
    });
};
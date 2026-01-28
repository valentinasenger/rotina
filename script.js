const API_URL = "http://localhost:8080/api/tarefas";

// 1. CARREGAR TAREFAS (GET)
async function loadTasks() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Erro na resposta da rede");
        
        const tasks = await res.json();
        console.log("Dados recebidos do Java:", tasks); // Verifique se os dados aparecem aqui no F12

        const impList = document.getElementById('importantList');
        const allList = document.getElementById('allTasksList');
        
        // Limpa as listas antes de renderizar
        if (impList) impList.innerHTML = '';
        if (allList) allList.innerHTML = '';

        tasks.forEach(t => {
            const star = t.importante ? '<span class="star-icon">⭐</span>' : '';
            const card = `
                <div class="task-card ${t.concluida ? 'completed' : ''}">
                    <div class="task-info" onclick="toggleComplete(${t.id}, ${t.concluida})">
                        <strong id="desc-${t.id}">${t.descricao}</strong>
                        <span class="date-tag">${t.dataAgendada || 'Sem data'} ${star}</span>
                    </div>
                    <div class="task-actions">
                        <button class="edit-btn" onclick="editTask(${t.id}, '${t.descricao}')">Editar</button>
                        <button class="del-btn" onclick="deleteTask(${t.id})">Apagar</button>
                    </div>
                </div>
            `;

            // Lógica de separação: se 'importante' for true, vai para a lista de cima
            if (t.importante && impList) {
                impList.innerHTML += card;
            } else if (allList) {
                allList.innerHTML += card;
            }
        });
    } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
    }
}

// 2. CRIAR TAREFA (POST)
async function addTask() {
    const desc = document.getElementById('taskInput').value;
    const date = document.getElementById('dateInput').value;
    const imp = document.getElementById('impInput').checked;

    if (!desc) return alert("Por favor, digite uma descrição.");

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                descricao: desc, 
                concluida: false, 
                importante: imp, 
                dataAgendada: date 
            })
        });

        if (res.ok) {
            document.getElementById('taskInput').value = '';
            document.getElementById('dateInput').value = '';
            document.getElementById('impInput').checked = false;
            loadTasks();
        }
    } catch (error) {
        console.error("Erro ao adicionar tarefa:", error);
    }
}

// 3. APAGAR TAREFA (DELETE)
async function deleteTask(id) {
    if(confirm("Deseja realmente remover esta tarefa?")) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            loadTasks();
        } catch (error) {
            console.error("Erro ao deletar:", error);
        }
    }
}

// 4. EDITAR TEXTO DA TAREFA (PUT)
async function editTask(id, oldDesc) {
    const newDesc = prompt("Edite sua tarefa:", oldDesc);
    if (newDesc && newDesc !== oldDesc) {
        try {
            await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ descricao: newDesc })
            });
            loadTasks();
        } catch (error) {
            console.error("Erro ao editar:", error);
        }
    }
}

// 5. ALTERNAR CONCLUÍDA (PUT)
async function toggleComplete(id, currentStatus) {
    try {
        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ concluida: !currentStatus })
        });
        loadTasks();
    } catch (error) {
        console.error("Erro ao atualizar status:", error);
    }
}

// 6. TROCAR TEMA
function toggleTheme() { 
    document.body.classList.toggle('blue-mode'); 
}

// Inicializa a lista ao carregar a página
document.addEventListener('DOMContentLoaded', loadTasks);
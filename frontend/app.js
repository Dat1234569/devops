const API = "http://localhost:3000";

async function calculate() {
    const a = Number(document.getElementById("a").value);
    const b = Number(document.getElementById("b").value);
    const operator = document.getElementById("operator").value;

    const res = await fetch(API + "/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ a, b, operator })
    });

    const data = await res.json();

    if (data.error) {
        alert(data.error);
        return;
    }

    document.getElementById("result").innerText = data.result;

    loadHistory();
}

async function loadHistory() {
    const res = await fetch(API + "/history");
    const data = await res.json();

    const list = document.getElementById("history");
    list.innerHTML = "";

    data.forEach(item => {
        const li = document.createElement("li");
        li.innerText = `${item.a} ${item.operator} ${item.b} = ${item.result}`;
        list.appendChild(li);
    });
}

loadHistory();
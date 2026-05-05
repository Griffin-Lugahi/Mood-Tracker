document.addEventListener("DOMContentLoaded", function () {
 
    var valueDisplay = document.getElementById("value");
    var statusEl = document.getElementById("status");
    var historyList = document.getElementById("history-list");
 
    var increaseBtn = document.getElementById("increase");
    var decreaseBtn = document.getElementById("decrease");
    var resetBtn = document.getElementById("reset");
    var clearHistoryBtn = document.getElementById("clear-history");
 
    var MIN = -10;
    var MAX = 10;
 
    var saved = localStorage.getItem("moodValue");
    var value = saved !== null ? Number(saved) : 0;
 
    var history = JSON.parse(localStorage.getItem("moodHistory")) || [];
 
    renderHistory();
    updateUI();
 
    // ── Button Events ──
 
    increaseBtn.addEventListener("click", function () {
        if (value < MAX) {
            value++;
            addToHistory(value);
            updateUI();
        }
    });
 
    decreaseBtn.addEventListener("click", function () {
        if (value > MIN) {
            value--;
            addToHistory(value);
            updateUI();
        }
    });
 
    resetBtn.addEventListener("click", function () {
        value = 0;
        addToHistory(value);
        updateUI();
    });
 
    clearHistoryBtn.addEventListener("click", function () {
        history = [];
        localStorage.removeItem("moodHistory");
        renderHistory();
    });
 
    // ── Core Functions ──
 
    function updateUI() {
        valueDisplay.textContent = value;
        statusEl.textContent = getMoodLabel(value);
 
        if (value > 0) {
            setColors("var(--positive)", "var(--positive-bg)");
        } else if (value < 0) {
            setColors("var(--negative)", "var(--negative-bg)");
        } else {
            setColors("var(--neutral)", "var(--neutral-bg)");
        }
 
        localStorage.setItem("moodValue", value);
    }
 
    function setColors(textColor, bgColor) {
        valueDisplay.style.color = textColor;
        statusEl.style.color = textColor;
        document.body.style.backgroundColor = bgColor;
    }
 
    function getMoodLabel(v) {
        if (v >= 9)  return "Ecstatic 🤩";
        if (v >= 7)  return "Excellent 😄";
        if (v >= 5)  return "Great 😊";
        if (v >= 3)  return "Good 🙂";
        if (v >= 1)  return "Okay 😌";
        if (v === 0) return "Neutral 😐";
        if (v >= -2) return "Meh 😕";
        if (v >= -4) return "Bad 😞";
        if (v >= -6) return "Sad 😢";
        if (v >= -8) return "Terrible 😭";
        return "Awful 🤬";
    }
 
    function addToHistory(v) {
        var now = new Date();
        var time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        var date = now.toLocaleDateString([], { month: "short", day: "numeric" });
 
        history.unshift({
            value: v,
            label: getMoodLabel(v),
            time: time,
            date: date
        });
 
        // Keep only last 20 entries
        if (history.length > 20) {
            history.pop();
        }
 
        localStorage.setItem("moodHistory", JSON.stringify(history));
        renderHistory();
    }
 
    function renderHistory() {
        historyList.innerHTML = "";
 
        if (history.length === 0) {
            historyList.innerHTML = "<li style='color:#aaa;'>No history yet.</li>";
            return;
        }
 
        history.forEach(function (entry) {
            var li = document.createElement("li");
            li.textContent = entry.date + " " + entry.time + " — " + entry.label + " (" + entry.value + ")";
            historyList.appendChild(li);
        });
    }
 
});
// 4 rotierende Putzpläne
const plans = [
    // Putzplan 1
    {
        "LG 7": "MacBook Wagen ohne Punkt",
        "LG 4": "MacBook Wagen mit Punkt",
        "LG 1": "SLA + 2. Etage",
        "LG 5": "Etage 3 & 4"
    },
    // Putzplan 2
    {
        "LG 7": "Etage 3 & 4",
        "LG 4": "MacBook Wagen ohne Punkt",
        "LG 1": "MacBook Wagen mit Punkt",
        "LG 5": "SLA + 2. Etage"
    },
    // Putzplan 3
    {
        "LG 7": "SLA + 2. Etage",
        "LG 4": "Etage 3 & 4",
        "LG 1": "MacBook Wagen ohne Punkt",
        "LG 5": "MacBook Wagen mit Punkt"
    },
    // Putzplan 4
    {
        "LG 7": "MacBook Wagen mit Punkt",
        "LG 4": "SLA + 2. Etage",
        "LG 1": "Etage 3 & 4",
        "LG 5": "MacBook Wagen ohne Punkt"
    }
];

// Startdatum - Putzen beginnt in dieser Woche
const START_DATE = new Date("2025-11-24");

// Tag-Zuordnung: LG 7 = Montag, LG 4 = Dienstag, LG 1 = Mittwoch, LG 5 = Donnerstag
const dayToLG = {
    1: "LG 7",  // Montag
    2: "LG 4",  // Dienstag
    3: "LG 1",  // Mittwoch
    4: "LG 5"   // Donnerstag
};

// Ferienzeiten - neue Ferien hier hinzufügen (YYYY-MM-DD Format)
const holidays = [
    { start: "2025-12-22", end: "2026-01-02", name: "Weihnachtsferien" },
    { start: "2026-02-02", end: "2026-02-07", name: "Winterferien" },
    { start: "2026-03-30", end: "2026-04-10", name: "Osterferien" },
    { start: "2026-05-15", end: "2026-05-15", name: "Unterrichtsfreier Tag" },
    { start: "2026-05-26", end: "2026-05-26", name: "Pfingstferien" },
    { start: "2026-07-09", end: "2026-08-22", name: "Sommerferien" },
    { start: "2026-10-19", end: "2026-10-31", name: "Herbstferien" },
    { start: "2026-12-23", end: "2027-01-02", name: "Weihnachtsferien" }
];

function getWeeksSinceStart(date) {
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    const diff = date - START_DATE;
    return Math.floor(diff / msPerWeek);
}

function isHoliday(date) {
    const dateStr = date.toISOString().split('T')[0];
    for (const period of holidays) {
        if (dateStr >= period.start && dateStr <= period.end) {
            return true;
        }
    }
    return false;
}

function hasHolidayInCleaningDays(date) {
    // Prüft ob ein Putztag (Mo-Do) in der aktuellen Woche Ferien hat
    const dayOfWeek = date.getDay();
    
    // Montag der aktuellen Woche ermitteln
    const monday = new Date(date);
    monday.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
    // Montag bis Donnerstag prüfen
    for (let i = 0; i < 4; i++) {
        const checkDay = new Date(monday);
        checkDay.setDate(monday.getDate() + i);
        if (isHoliday(checkDay)) {
            return true;
        }
    }
    return false;
}

function getCurrentPlan() {
    const today = new Date();
    
    if (today < START_DATE) return null;
    if (hasHolidayInCleaningDays(today)) return null;
    
    const weeksSinceStart = getWeeksSinceStart(today);
    if (weeksSinceStart % 2 !== 0) return null; // Ungerade Wochen sind putzfrei
    
    const cleaningWeekNumber = Math.floor(weeksSinceStart / 2);
    const planIndex = cleaningWeekNumber % plans.length;
    return plans[planIndex];
}

function formatDate(date) {
    const days = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const day = days[date.getDay()];
    const dateNum = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return { dayName: day, formatted: `${dateNum}.${month}.${year}` };
}

// Hauptlogik
const today = new Date();
const dayOfWeek = today.getDay();
const dateInfo = formatDate(today);
const currentPlan = getCurrentPlan();

const dateDiv = document.getElementById('date');
const scheduleDiv = document.getElementById('schedule');

// Nachricht und Aufgabe bestimmen
let message = `Heute ist ${dateInfo.dayName}, der ${dateInfo.formatted}`;
let task = null;

if (today < START_DATE) {
    message += ". Das Putzen hat noch nicht begonnen!";
} else if (hasHolidayInCleaningDays(today)) {
    message += ". Ferien! 🎉";
} else if (!currentPlan) {
    message += ". Diese Woche wird nicht geputzt!";
} else if (dayOfWeek >= 1 && dayOfWeek <= 4) {
    const lgGroup = dayToLG[dayOfWeek];
    task = currentPlan[lgGroup];
    message += `, und wir müssen ${task} putzen.`;
} else {
    message += ". Heute wird nicht geputzt!";
}

// Nachricht anzeigen
dateDiv.textContent = message;

// Wochenplan anzeigen (wenn es einen gibt)
if (currentPlan) {
    const groups = ['LG 7', 'LG 4', 'LG 1', 'LG 5'];
    const colors = ['lg7', 'lg4', 'lg1', 'lg5'];
    const dayNames = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag'];
    
    groups.forEach((group, index) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = `group ${colors[index]}`;
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'group-name';
        nameDiv.textContent = `${dayNames[index]} (${group})`;
        
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        taskDiv.textContent = currentPlan[group];
        
        groupDiv.appendChild(nameDiv);
        groupDiv.appendChild(taskDiv);
        scheduleDiv.appendChild(groupDiv);
    });
}

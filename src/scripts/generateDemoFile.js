const fs = require('fs');

const people = {
    "Linus Torvalds": {
        messages: [
            "This needs a complete overhaul. 🚀",
            "We must avoid overengineering here. 🛠️",
            "Keep performance at the forefront. ⚡",
            "Merge conflicts resolved. Moving on. 👍",
            "The patch is ready for review. 📝",
            "Code must be simple and elegant. 🎯",
            "Don't complicate this process unnecessarily. ❌"
        ],
        preferred_hours: Array.from({ length: 17 - 9 }, (_, i) => i + 9),
        preferred_months: [1, 2, 3, 11, 12],
        preferred_days: [1, 2, 3, 4, 5]
    },
    "Brendan Eich": {
        messages: [
            "Focusing on JavaScript performance will be key. ⚡",
            "This feature can make JS even more powerful. 💪",
            "Let's improve browser performance further. 🌐",
            "Cross-browser compatibility is critical. 🖥️",
            "Backward compatibility is non-negotiable. 🔄",
            "Optimization here will make a difference. 🔧",
            "This asynchronous approach could save time. ⏳"
        ],
        preferred_hours: Array.from({ length: 16 - 8 }, (_, i) => i + 8),
        preferred_months: [1, 4, 5, 9, 11],
        preferred_days: [1, 2, 3, 4, 5]
    },
    "Aaron Swartz": {
        messages: [
            "Information has to be accessible to all. 🌍",
            "Decentralizing the internet is a priority. 🛠️",
            "Have we considered the ethical implications here? 🤔",
            "Open access should drive everything we build. 🔓",
            "This tool must empower users, not restrict them. 🧑‍💻",
            "Make the API available for everyone. 🌐",
            "User privacy must always come first. 🔒"
        ],
        preferred_hours: Array.from({ length: 22 - 10 }, (_, i) => i + 10),
        preferred_months: [1, 6, 8, 10],
        preferred_days: [1, 2, 3, 4, 5, 6, 7]
    },
    "Margaret Hamilton": {
        messages: [
            "We need to account for every possible error. 🚀",
            "Safety in software is our top priority. 🛰️",
            "More simulations will help us perfect this. 🔄",
            "The algorithm has to be reliable under any conditions. 🧠",
            "Thorough testing is critical for mission success. ✅",
            "Have you double-checked for edge cases? 📐",
            "This code carries a huge responsibility. 💻"
        ],
        preferred_hours: Array.from({ length: 19 - 7 }, (_, i) => i + 7),
        preferred_months: [3, 4, 6, 9, 12],
        preferred_days: [1, 2, 3, 4, 5]
    }
};

function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function calculateMonthProbability(personName, currentMonth) {
    const preferredMonths = people[personName].preferred_months;
    const minDistance = Math.min(...preferredMonths.map(month => Math.abs(currentMonth - month)));
    const baseProbability = 0.1;
    const maxProbability = 1.0;
    const probability = maxProbability - (minDistance * 0.1);
    return Math.max(baseProbability, probability);
}

function generateConditionalDateAndTime(personName) {
    const currentMonth = Math.floor(Math.random() * 12) + 1;
    const probability = calculateMonthProbability(personName, currentMonth);
    let day, hour;
    if (Math.random() <= probability) {
        day = randomChoice(people[personName].preferred_days);
        hour = randomChoice(people[personName].preferred_hours);
    } else {
        day = Math.floor(Math.random() * 28) + 1;
        hour = Math.floor(Math.random() * 24);
    }
    const minute = randomChoice([0, 15, 30, 45]);
    const year = randomChoice([2023, 2024]);
    const date = `${day}/${currentMonth}/${year}`;
    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    return [date, time];
}

function generateFakeChatWithMoreVariety(n) {
    let fakeChat = '';
    const names = Object.keys(people);
    for (let i = 0; i < n; i++) {
        const name = randomChoice(names);
        const message = randomChoice(people[name].messages);
        const [date, time] = generateConditionalDateAndTime(name);
        fakeChat += `${date}, ${time} - ${name}: ${message}\n`;
    }
    return fakeChat;
}

const filePath = './public/fake_chat.txt';
const chatContent = generateFakeChatWithMoreVariety(1134);
fs.writeFileSync(filePath, chatContent);

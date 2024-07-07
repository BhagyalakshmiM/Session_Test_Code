
const fs = require('fs');
const logFilePath = process.argv[2];
// below function convert time string into number time in seconds
const timeInSeconds = (time) => {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
}
// to check if the time string is valid or not
const isValidTime = (time) => {
    const parts = time.split(':');
    if (parts.length !== 3) return false;
    const [hours, minutes, seconds] = parts;
    return (
        hours.length === 2 &&
        minutes.length === 2 &&
        seconds.length === 2 &&
        !isNaN(hours) &&
        !isNaN(minutes) &&
        !isNaN(seconds) &&
        Number(hours) >= 0 && Number(hours) < 24 &&
        Number(minutes) >= 0 && Number(minutes) < 60 &&
        Number(seconds) >= 0 && Number(seconds) < 60
    );
}
// to check user name is valid or not
const isValidUser = (user) => {
    return /^[A-Za-z0-9]+$/.test(user);
}
// to check action is valid or not
const isValidAction = (action) => {
    return action === 'Start' || action === 'End';
}

// returns session object
const processSessionArrObj = (sessionDetail, startTime, endTime) => {
    let sessions = {};
    sessionDetail.forEach(detail => {
        const { userName, status, seconds } = detail;
        if (!sessions[userName]) {
            sessions[userName] = { totalTime: 0, totalSession: 0, NonCompletedStarts: [] }
        }
        if (status === 'Start') {
            sessions[userName].NonCompletedStarts.push(seconds);
        } else if (status === 'End') {
            if (sessions[userName].NonCompletedStarts.length > 0) {
                const sessionStartTime = sessions[userName].NonCompletedStarts.pop();
                sessions[userName].totalTime += seconds - sessionStartTime;
                sessions[userName].totalSession += 1;
            } else {
                sessions[userName].totalTime += seconds - startTime;
                sessions[userName].totalSession += 1;
            }
        }
    });
    // checks if NonCompletedStarts is empty or not
    for (let user in sessions) {
        if (sessions[user].NonCompletedStarts.length > 0) {
            sessions[user].totalTime += endTime - sessions[user].NonCompletedStarts.pop();
            sessions[user].totalSession += 1;
        }
    }
    return sessions;
}
// reads file and created array of session objects
const processFile = (filePath) => {
    const data = fs.readFileSync(filePath, 'utf-8');
    const entries = data.split('\n');

    const sessionsObjArr = [];
    let startTime = null;
    let endTime = null;

    entries.forEach(entry => {
        let entryObj = {};
        const entryArr = entry.split(' ');
        if (entryArr.length === 3) {
            const [time, userName, status] = entryArr;
            seconds = timeInSeconds(time);
            entryObj = { time, userName, status, seconds };
            if(isValidAction(status) && isValidTime(time) && isValidUser(userName)) {
                sessionsObjArr.push(entryObj);
            }
        }
    });
    startTime = timeInSeconds(sessionsObjArr[0].time);
    endTime = timeInSeconds(sessionsObjArr[sessionsObjArr.length - 1].time);
    const result = processSessionArrObj(sessionsObjArr, startTime, endTime);
    for (let user in result) {
        console.log(`${user} ${result[user].totalSession} ${result[user].totalTime}`);
    }
}

processFile(logFilePath);

// Exporting the functions for testing
module.exports = { timeInSeconds, processSessionArrObj };
const { timeInSeconds, processSessionArrObj } = require('./billing');

const assertEqual = (actual, expected, description) => {
    if (actual === expected) {
        console.log(`PASSED: ${description}`);
    } else {
        console.log(`FAILED: ${description}`);
        console.log(`  Expected: ${expected}`);
        console.log(`  Actual: ${actual}`);
    }
};

const runTests = () => {
    // Unit test case for timeInSeconds function
    assertEqual(timeInSeconds('14:02:03'), 50523, 'Converts time to seconds correctly');

    // Unit test case for processSessionArrObj function
    const sessionDetail = [
        { time: '14:02:03', userName: 'ALICE99', status: 'Start', seconds: 50523 },
        { time: '14:02:05', userName: 'CHARLIE', status: 'End', seconds: 50525 },
        { time: '14:02:34', userName: 'ALICE99', status: 'End', seconds: 50554 },
        { time: '14:02:58', userName: 'ALICE99', status: 'Start', seconds: 50578 },
        { time: '14:03:02', userName: 'CHARLIE', status: 'Start', seconds: 50582 },
        { time: '14:03:33', userName: 'ALICE99', status: 'Start', seconds: 50613 },
        { time: '14:03:35', userName: 'ALICE99', status: 'End', seconds: 50615 },
        { time: '14:03:37', userName: 'CHARLIE', status: 'End', seconds: 50617 },
        { time: '14:04:05', userName: 'ALICE99', status: 'End', seconds: 50645 },
        { time: '14:04:23', userName: 'ALICE99', status: 'End', seconds: 50663 },
        { time: '14:04:41', userName: 'CHARLIE', status: 'Start', seconds: 50681 }
    ];
    const startTime = 50523;
    const endTime = 50681;
    const expectedSessions = {
        ALICE99: { totalTime: 240, totalSession: 4, NonCompletedStarts: [] },
        CHARLIE: { totalTime: 37, totalSession: 3, NonCompletedStarts: [] }
    };
    const actualSessions = processSessionArrObj(sessionDetail, startTime, endTime);
    assertEqual(JSON.stringify(actualSessions), JSON.stringify(expectedSessions), 'Processes session details correctly');

    // Unit test case for processSessionArrObj for scenario 2
    const sessionDetail2 = [
        { time: '14:01:00', userName: 'ALICE99', status: 'Start', seconds: 50460 },
        { time: '14:01:05', userName: 'CHARLIE', status: 'Start', seconds: 50465 },
        { time: '14:01:30', userName: 'ALICE99', status: 'Start', seconds: 50490 },
        { time: '14:01:40', userName: 'CHARLIE', status: 'End', seconds: 50500 },
        { time: '14:02:00', userName: 'ALICE99', status: 'End', seconds: 50520 },
        { time: '14:02:05', userName: 'ALICE99', status: 'End', seconds: 50525 },
        { time: '14:02:10', userName: 'CHARLIE', status: 'Start', seconds: 50530 },
        { time: '14:02:30', userName: 'ALICE99', status: 'End', seconds: 50550 },
        { time: '14:02:40', userName: 'CHARLIE', status: 'End', seconds: 50560 },
        { time: '14:02:50', userName: 'ALICE99', status: 'Start', seconds: 50570 }
    ];
    const startTime2 = 50460;
    const endTime2 = 50570;
    const expectedSessions2 = {
        ALICE99: { totalTime: 185, totalSession: 4, NonCompletedStarts: [] },
        CHARLIE: { totalTime: 65, totalSession: 2, NonCompletedStarts: [] }
    };
    const actualSessions2 = processSessionArrObj(sessionDetail2, startTime2, endTime2);
    assertEqual(JSON.stringify(actualSessions2), JSON.stringify(expectedSessions2), 'Processes session details correctly');
};

runTests();

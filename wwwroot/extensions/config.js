export const phasing_config = {
  "tasks": [
    { id: '123', name: 'Walls - Timber', start: '2022-04-22', end: '2022-05-22', progress: '50' },
    { id: '124', name: 'Floors - Concrete', start: '2022-04-22', end: '2022-05-15', progress: '10' },
    { id: '125', name: 'Walls - 202mm', start: '2022-05-22', end: '2022-05-29', progress: '50' },
    { id: '126', name: 'Floors - Generic', start: '2022-06-02', end: '2022-06-08', progress: '50' }
  ],
  "objects": {},
  "propFilter": "Type Name",
  "requiredProps": {
    "id": "ID",
    "taskName": "NAME",
    "startDate": "START",
    "endDate": "END",
    "taskProgress": "PROGRESS"
  },
  "mapTaksNProps": { 'Wall - Timber Clad': '123', 'Concrete-Domestic 425mm': '124', 'SIP 202mm Wall - conc clad': '125', 'Generic 150mm': '126' },
  "viewModes": [
    // "Quarter Day",
    // "Half Day",
    "Day",
    "Week",
    "Month"
  ],
  "statusColors": {
    "finished": "31,246,14",
    "inProgress": "235,246,14",
    "late": "246,55,14",
    "notYetStarted": "",
    "advanced": "14,28,246"
  }
}
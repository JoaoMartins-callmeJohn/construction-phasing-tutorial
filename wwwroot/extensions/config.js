export const phasing_config = {
  "tasks": [],
  "objects": {},
  "propFilter": "Type Name",
  "requiredProps": {
    "id": "ID",
    "taskName": "NAME",
    "startDate": "START",
    "endDate": "END",
    "taskProgress": "PROGRESS",
    "dependencies": "DEPENDENCIES"
  },
  "mapTaksNProps": {},
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
  },
  "statusLabels": {
    "finished": "Complete",
    // "inProgress": "In Progress",
    "notYetStarted": "Not Started"
  },
  "updatedIds": {}
}
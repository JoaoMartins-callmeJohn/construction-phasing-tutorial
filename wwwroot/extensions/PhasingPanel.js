var PHASING_CONFIG = {
  tasks: [],
  //here we have the equivalence between tasks and dbids from the model
  objects: {},
  propFilter: 'Type Name',
  requiredProps: {
    id: 'ID',
    taskName: 'NAME',
    startDate: 'START',
    endDate: 'END',
    taskProgress: 'PROGRESS'
  },
  mapTaksNProps: {},
  viewModes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
  statusColors: {
    finished: '31, 246, 14',
    inProgress: '235, 246, 14 ',
    late: '246, 55, 14',
    notYetStarted: '',
    advanced: '14, 28, 246'
  }
};

export class PhasingPanel extends Autodesk.Viewing.UI.DockingPanel {
  constructor(extension, id, title, options) {
    super(extension.viewer.container, id, title, options);
    this.extension = extension;
    this.container.style.left = (options.x || 0) + 'px';
    this.container.style.top = (options.y || 0) + 'px';
    this.container.style.width = (options.width || 500) + 'px';
    this.container.style.height = (options.height || 400) + 'px';
    this.container.style.resize = 'both';
    this.container.style.backgroundColor = 'white';
  }

  initialize() {
    this.title = this.createTitleBar(this.titleLabel || this.container.id);
    this.initializeMoveHandlers(this.title);
    this.container.appendChild(this.title);

    //Here we add the button to update the csv
    this.button = document.createElement('button');
    this.button.innerHTML = 'IMPORT CSV';
    this.button.style.width = '100px';
    this.button.style.height = '24px';
    this.button.style.verticalAlign = 'middle';
    this.button.style.backgroundColor = 'white';
    this.button.style.borderRadius = '8px';
    this.button.style.borderStyle = 'groove';

    //We could also take advantage of one of the existing classes for Viewers buttons
    // button.classList.add('docking-panel-tertiary-button');
    this.button.onclick = this.inputCSV;
    this.container.appendChild(this.button);

    //Here we create a dropdown to control vision of the GANTT
    this.dropdown = document.createElement('select');
    this.dropdown.style.width = '100px';
    this.dropdown.style.height = '28px';
    this.dropdown.style.verticalAlign = 'middle';
    this.dropdown.style.backgroundColor = 'white';
    this.dropdown.style.borderRadius = '8px';
    this.dropdown.style.borderStyle = 'groove';
    for (const viewMode of PHASING_CONFIG.viewModes) {
      let currentOption = document.createElement('option');
      currentOption.value = viewMode;
      currentOption.innerHTML = viewMode;
      this.dropdown.appendChild(currentOption);
    }

    this.dropdown.onchange = this.changeViewMode.bind(this);
    this.container.appendChild(this.dropdown);

    //Here we create a switch to control vision of the schedule based on the GANTT chart
    this.checkbox = document.createElement('input');
    this.checkbox.type = 'checkbox';
    this.checkbox.id = 'colormodel';
    this.checkbox.style.width = '30px';
    this.checkbox.style.height = '28px';
    this.checkbox.style.verticalAlign = 'middle';
    this.checkbox.style.backgroundColor = 'white';
    this.checkbox.style.borderRadius = '8px';
    this.checkbox.style.borderStyle = 'groove';

    this.checkbox.onchange = this.handleElementsColor.bind(this);
    this.container.appendChild(this.checkbox);

    this.label = document.createElement('label');
    this.label.for = 'colormodel';
    this.label.innerHTML = 'Override Color';
    this.label.style.fontSize = '18px';
    this.label.style.verticalAlign = 'middle';
    this.container.appendChild(this.label);

    //Here we add the svg for the GANTT chart
    this.content = document.createElement('div');
    this.content.style.height = '350px';
    this.content.style.backgroundColor = 'white';
    this.content.innerHTML = `<svg class="phasing-container"></svg>`;
    this.container.appendChild(this.content);

    this.updateTasks();
  }

  update(model, dbids) {
    if (PHASING_CONFIG.tasks.length === 0) {
      this.inputCSV();
    }
    model.getBulkProperties(dbids, { propFilter: PHASING_CONFIG.propFilter }, (results) => {
      results.map((result => {
        this.updateObjects(result);
      }))
    }, (err) => {
      console.error(err);
    });
    if (PHASING_CONFIG.tasks.length > 0) {
      this.gantt = new Gantt(".phasing-container", PHASING_CONFIG.tasks, {
        on_click: this.barCLickEvent.bind(this)
      });
    }
  }

  barCLickEvent(task) {
    this.extension.viewer.isolate(PHASING_CONFIG.objects[task.id]);
  }

  updateObjects(result) {
    // let currentTaskId = PHASING_CONFIG.mapTaksNProps[result[PHASING_CONFIG.propFilter]];
    let currentTaskId = PHASING_CONFIG.mapTaksNProps[result.properties[0].displayValue];
    if (!!currentTaskId) {
      if (!PHASING_CONFIG.objects[currentTaskId])
        PHASING_CONFIG.objects[currentTaskId] = [];

      PHASING_CONFIG.objects[currentTaskId].push(result.dbId);
    }
  }

  updateTasks() {
    if (PHASING_CONFIG.tasks.length === 0) {
      this.inputCSV();
    }
  }

  handleElementsColor(event) {
    console.log(event);
    if (event.targer.checked) {
      let taskStatusArray = this.gantt.tasks.map(this.checkTaskStatus);
      for (let index = 0; index < this.gantt.tasks.length; index++) {
        const currentTaskId = this.gantt.tasks[index].id;
        const currentdbIds = PHASING_CONFIG.objects[currentTaskId];


      }
      // PHASING_CONFIG.objects[task.id]
    }
    else {
      this.extension.viewer.clearThemingColors();
    }
  }

  checkTaskStatus(task) {
    let currentDate = new Date();

    let taskStart = new Date(task.start);
    let taskEnd = new Date(task.end);

    let shouldHaveStarted = currentDate > taskStart;
    let shouldHaveEnded = currentDate > taskEnd;

    let taskProgress = task.progress;

    //We need to map finished, in progress, late, not yet started or advanced
    //finished should have started and ended and actually ended (progress 100%)
    //in progress should have started, not ended and progress should be greater than 0
    //late should have started and ended but progress is less than 100, or should have started not ended and progress is 0
    //not yet started should not have started nor ended and progress is 0
    //advanced should not have started and have progress greater than 0 or should not have ended and progress is 100

    if (shouldHaveStarted && shouldHaveEnded && taskProgress === 100)
      return 'finished';

    else if (shouldHaveStarted && !shouldHaveEnded && taskProgress > 0)
      return 'inProgress';

    else if ((shouldHaveStarted && shouldHaveEnded && taskProgress < 100) || (shouldHaveStarted && !shouldHaveEnded && taskProgress === 0))
      return 'late';

    else if (!shouldHaveStarted && !shouldHaveEnded && taskProgress === 0)
      return 'notYetStarted';

    else if ((!shouldHaveStarted && taskProgress > 0) || (shouldHaveStarted && !shouldHaveEnded && taskProgress === 100))
      return 'advanced';

  }

  changeViewMode(event) {
    this.gantt.change_view_mode(event.target.value);
  }

  async inputCSV() {
    const { value: file } = await Swal.fire({
      title: 'Select csv file',
      input: 'file',
      inputAttributes: {
        'accept': '.csv',
        'aria-label': 'Upload your csv for configuration'
      },
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Import CSV'
    })
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        let lines = e.target.result.split('\n');
        if (this.validateCSV(lines[0])) {
          let header = lines[0];
          lines.shift();
          let newTasks = lines.map(line => this.lineToObject(line, header));
          PHASING_CONFIG.tasks = newTasks;
        }
      }
      reader.readAsBinaryString(file);
    }
  }

  //This function converts a line from imported csv into an object to generate the GANTT chart
  lineToObject(line, inputHeadersLine) {
    let parameters = line.split(',');
    let inputHeaders = inputHeadersLine.split(',');
    let newObject = {};
    // Object.keys(newObject) = PHASING_CONFIG.requiredProps;
    Object.values(PHASING_CONFIG.requiredProps).forEach(requiredProp => {
      newObject.id = parameters[inputHeaders.findIndex(h => h === PHASING_CONFIG.requiredProps.id)];
      newObject.name = parameters[inputHeaders.findIndex(h => h === PHASING_CONFIG.requiredProps.taskName)];
      newObject.start = parameters[inputHeaders.findIndex(h => h === PHASING_CONFIG.requiredProps.startDate)];
      newObject.end = parameters[inputHeaders.findIndex(h => h === PHASING_CONFIG.requiredProps.endDate)];
      newObject.progress = parameters[inputHeaders.findIndex(h => h === PHASING_CONFIG.requiredProps.taskProgress)];
    });
    this.addPropToMask(parameters[inputHeaders.findIndex(h => h === PHASING_CONFIG.propFilter)], newObject.id);
    return newObject;
  }

  addPropToMask(filterValue, taskId) {
    PHASING_CONFIG.mapTaksNProps[filterValue] = taskId;
  }

  validateCSV(line) {
    let parameters = line.split(',');
    return Object.values(PHASING_CONFIG.requiredProps).every((currentProp) => !!parameters.find(p => p === currentProp));
  }
}
import { phasing_config } from './config.js';

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
    this.options = options;
    this.currentViewMode = 'Day';
  }

  initialize() {

    // This will resie our panel
    this.isVertical = false;

    this.title = this.createTitleBar(this.titleLabel || this.container.id);
    this.title.style.overflow = 'auto';
    this.initializeMoveHandlers(this.title);
    this.container.appendChild(this.title);

    this.div = document.createElement('div');
    this.div.ondblclick = this.toggleOrientation.bind(this);
    this.container.appendChild(this.div);

    //Here we add the button to update the csv
    this.button = document.createElement('button');
    this.button.innerHTML = 'IMPORT CSV';
    this.button.style.width = (this.options.buttonWidth || 100) + 'px';
    this.button.style.height = (this.options.buttonHeight || 24) + 'px';
    this.button.style.margin = (this.options.margin || 5) + 'px';
    this.button.style.verticalAlign = (this.options.verticalAlign || 'middle');
    this.button.style.backgroundColor = (this.options.backgroundColor || 'white');
    this.button.style.borderRadius = (this.options.borderRadius || 8) + 'px';
    this.button.style.borderStyle = (this.options.borderStyle || 'groove');

    //We could also take advantage of one of the existing classes for Viewers buttons
    // button.classList.add('docking-panel-tertiary-button');
    this.button.onclick = this.importCSV.bind(this);
    this.div.appendChild(this.button);

    //Here we create a dropdown to control vision of the GANTT
    this.dropdown = document.createElement('select');
    this.dropdown.style.width = (this.options.dropdownWidth || 100) + 'px';
    this.dropdown.style.height = (this.options.dropdownHeight || 28) + 'px';
    this.dropdown.style.margin = (this.options.margin || 5) + 'px';
    this.dropdown.style.verticalAlign = (this.options.verticalAlign || 'middle');
    this.dropdown.style.backgroundColor = (this.options.backgroundColor || 'white');
    this.dropdown.style.borderRadius = (this.options.borderRadius || 8) + 'px';
    this.dropdown.style.borderStyle = (this.options.borderStyle || 'groove');
    for (const viewMode of phasing_config.viewModes) {
      let currentOption = document.createElement('option');
      currentOption.value = viewMode;
      currentOption.innerHTML = viewMode;
      // if (currentOption.value === 'Day')
      //   currentOption.selected = true;
      this.dropdown.appendChild(currentOption);
    }
    // this.selectDayOption.call(this);

    this.dropdown.onchange = this.changeViewMode.bind(this);
    this.div.appendChild(this.dropdown);

    //Here we create a switch to control vision of the schedule based on the GANTT chart
    this.checkbox = document.createElement('input');
    this.checkbox.type = 'checkbox';
    this.checkbox.id = 'colormodel';
    this.checkbox.style.width = (this.options.checkboxWidth || 30) + 'px';
    this.checkbox.style.height = (this.options.checkboxHeight || 28) + 'px';
    this.checkbox.style.margin = '0 0 0 ' + (this.options.margin || 5) + 'px';
    this.checkbox.style.verticalAlign = (this.options.verticalAlign || 'middle');
    this.checkbox.style.backgroundColor = (this.options.backgroundColor || 'white');
    this.checkbox.style.borderRadius = (this.options.borderRadius || 8) + 'px';
    this.checkbox.style.borderStyle = (this.options.borderStyle || 'groove');

    // this.checkbox.onchange = this.handleElementsColor.bind(this);
    this.checkbox.onchange = this.handleColors.bind(this);
    this.div.appendChild(this.checkbox);

    this.label = document.createElement('label');
    this.label.for = 'colormodel';
    this.label.innerHTML = 'Show Phases';
    this.label.style.fontSize = (this.options.fontSize || 18) + 'px';
    this.label.style.verticalAlign = (this.options.verticalAlign || 'middle');
    this.div.appendChild(this.label);

    //Here we add the svg for the GANTT chart
    this.content = document.createElement('div');
    this.content.style.backgroundColor = (this.options.backgroundColor || 'white');
    this.content.innerHTML = `<svg id="phasing-container"></svg>`;
    this.container.appendChild(this.content);

    this.updateTasks();

    // const hotkeys = [{
    //   keycodes: [
    //     Autodesk.Viewing.KeyCode.ESCAPE
    //   ],
    //   onRelease: this.pressKey.bind(this)
    // }];
    // this.extension.viewer.getHotkeyManager().pushHotkeys(this.escapeHotkeyId, hotkeys);
  }

  async pressKey() {
    const selection = this._panel.extension.viewer.getSelection();
    const { value: selectedStatus } = await Swal.fire({
      title: 'Choose the new Status for selected objects',
      input: 'radio',
      inputOptions: phasing_config.statusLabels,
      inputValidator: (value) => {
        if (!value) {
          return 'You need to choose a Status!'
        }
      }
    })

    if (selectedStatus) {
      selection.forEach(dbId => {
        phasing_config.updatedIds[dbId] = selectedStatus;
      });
    }
  }

  selectDayOption() {
    // this.dropdown.options.item(this.currentViewMode).selected = true;
  }

  toggleOrientation() {
    const { left: startX, top: startY, right: endX, bottom: endY } = this.extension.viewer.impl.getCanvasBoundingClientRect();

    let defaultPanelHeigth = (this.options.height || 400);
    let defaultPanelWidth = (this.options.width || 500);

    if (this.isVertical) {
      this.container.style.width = (endX - startX - 20) + 'px';
      this.container.style.height = defaultPanelHeigth + 'px';
      this.container.style.left = (this.options.x || 0) + 'px';
      this.container.style.top = (endY - startY - defaultPanelHeigth - this.options.y) + 'px';
    }
    else {
      this.container.style.width = defaultPanelWidth + 'px';
      this.container.style.height = (endY - startY - 20) + 'px';
      this.container.style.left = (this.options.x || 0) + 'px';
      this.container.style.top = (this.options.y || 0) + 'px';
    }

    this.isVertical = !this.isVertical;
  }

  update(model, dbids) {
    if (phasing_config.tasks.length === 0) {
      this.inputCSV();
    }
    model.getBulkProperties(dbids, { propFilter: phasing_config.propFilter }, (results) => {
      results.map((result => {
        this.updateObjects(result);
      }))
    }, (err) => {
      console.error(err);
    });
    if (phasing_config.tasks.length > 0) {
      this.gantt = this.createGanttChart();
      this.handleColors.call(this);
      // this.selectDayOption.call(this);
      this.changeViewMode.call(this);
    }
  }

  async importCSV() {
    await this.inputCSV();
    this.gantt = this.createGanttChart();
    this.handleColors.call(this);
  }

  createGanttChart() {
    document.getElementById('phasing-container').innerHTML = `<svg id="phasing-container"></svg>`;

    let newGantt = new Gantt("#phasing-container", phasing_config.tasks, {
      on_click: this.barCLickEvent.bind(this),
      on_progress_change: this.handleColors.bind(this),
      on_date_change: this.handleColors.bind(this)
    });

    return newGantt;
  }

  barCLickEvent(task) {
    this.extension.viewer.isolate(phasing_config.objects[task.id]);
  }

  updateObjects(result) {
    let currentTaskId = phasing_config.mapTaksNProps[result.properties[0].displayValue];
    if (!!currentTaskId) {
      if (!phasing_config.objects[currentTaskId])
        phasing_config.objects[currentTaskId] = [];

      phasing_config.objects[currentTaskId].push(result.dbId);
    }
  }

  updateTasks() {
    if (phasing_config.tasks.length === 0) {
      this.inputCSV();
    }
  }

  handleColors() {
    this.handleElementsColor.call(this);
    this.handleBarsColor.call(this);
  }

  handleElementsColor() {
    const overrideCheckbox = document.getElementById('colormodel');
    if (overrideCheckbox.checked) {
      let tasksNStatusArray = this.gantt.tasks.map(this.checkTaskStatus.bind(this));
      let mappeddbIds = [];
      for (let index = 0; index < this.gantt.tasks.length; index++) {
        const currentTaskId = this.gantt.tasks[index].id;
        const currentdbIds = phasing_config.objects[currentTaskId];
        let colorVector4 = this.fromRGB2Color(phasing_config.statusColors[tasksNStatusArray[index]]);
        currentdbIds.forEach(dbId => {
          //Added for updated elements
          if (Object.keys(phasing_config.updatedIds).includes(id => id === dbId))
            colorVector4 = this.fromRGB2Color(phasing_config.statusColors[phasing_config.updatedIds[dbId]]);

          if (colorVector4) {
            this.extension.viewer.setThemingColor(dbId, colorVector4)
          }
          else {
            this.extension.viewer.hide(dbId);
          }
        });
        mappeddbIds.push(...currentdbIds);
      }
      this.extension.viewer.isolate(mappeddbIds);
    }
    else {
      this.extension.viewer.clearThemingColors();
      this.extension.viewer.showAll();
    }
  }

  handleBarsColor() {
    this.gantt.bars.map(bar => {
      let tasksStatus = this.checkTaskStatus.call(bar.task);
      let barColor = phasing_config.statusColors[tasksStatus];
      bar.$bar.style = `fill: rgb(${barColor})`;
    })
  }

  fromRGB2Color(rgbString) {
    if (rgbString) {
      let colorsInt = rgbString.replaceAll(' ', '').split(',').map(colorString => parseInt(colorString, 10));
      return new THREE.Vector4(colorsInt[0] / 255, colorsInt[1] / 255, colorsInt[2] / 255, 0.5);
    }
    else {
      return null;
    }
  }

  checkTaskStatus(task) {
    let currentDate = new Date();

    let taskStart = new Date(task._start);
    let taskEnd = new Date(task._end);

    let shouldHaveStarted = currentDate > taskStart;
    let shouldHaveEnded = currentDate > taskEnd;

    let taskProgress = parseInt(task.progress, 10);

    let incrementProgress = this.updateProgress(task);

    //We need to map finished, in progress, late, not yet started or advanced
    //finished should have started and ended and actually ended (progress 100%)
    //in progress should have started, not ended and progress should be greater than 0
    //late should have started and ended but progress is less than 100, or should have started not ended and progress is 0
    //not yet started should not have started nor ended and progress is 0
    //advanced should not have started and have progress greater than 0 or should not have ended and progress is 100

    if (shouldHaveStarted && shouldHaveEnded && taskProgress === 100)
      return 'finished';

    else if (shouldHaveStarted && !shouldHaveEnded) {
      switch (taskProgress) {
        case 100:
          return 'advanced';
        case 0:
          return 'late';
        default:
          return 'inProgress';
      }
    }

    else if (shouldHaveStarted && shouldHaveEnded && taskProgress < 100)
      return 'late';

    else if (!shouldHaveStarted && !shouldHaveEnded && taskProgress === 0)
      return 'notYetStarted';

    else if (!shouldHaveStarted && taskProgress > 0)
      return 'advanced';

  }

  updateProgress(task) {
    const taskObjects = phasing_config.objects[task.id];
    let unitIncrement = 0;
    taskObjects.forEach(taskObject => {
      if (Object.keys(phasing_config.updatedIds).includes(taskObject)) {
        switch (phasing_config.updatedIds[taskObject]) {
          case 'finished':
            unitIncrement += 1;
            break;
          case 'inProgress':
            break;
          case 'notYetStarted':
            unitIncrement -= 1;
            break;
        }
      }
    });
    return unitIncrement;
  }

  changeViewMode(event) {
    const viewMode = event ? event.target.value : this.currentViewMode;
    this.gantt.change_view_mode(viewMode);
    this.handleColors.call(this);
    this.currentViewMode = viewMode;
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
          phasing_config.tasks = newTasks;
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
    Object.values(phasing_config.requiredProps).forEach(requiredProp => {
      newObject.id = parameters[inputHeaders.findIndex(h => h === phasing_config.requiredProps.id)];
      newObject.name = parameters[inputHeaders.findIndex(h => h === phasing_config.requiredProps.taskName)];
      newObject.start = parameters[inputHeaders.findIndex(h => h === phasing_config.requiredProps.startDate)];
      newObject.end = parameters[inputHeaders.findIndex(h => h === phasing_config.requiredProps.endDate)];
      newObject.progress = parameters[inputHeaders.findIndex(h => h === phasing_config.requiredProps.taskProgress)];
      newObject.dependencies = parameters[inputHeaders.findIndex(h => h === phasing_config.requiredProps.dependencies)];
      newObject.dependencies.replaceAll('-', ',');
    });
    this.addPropToMask(parameters[inputHeaders.findIndex(h => h === phasing_config.propFilter)], newObject.id);
    return newObject;
  }

  addPropToMask(filterValue, taskId) {
    phasing_config.mapTaksNProps[filterValue] = taskId;
  }

  validateCSV(line) {
    let parameters = line.split(',');
    return Object.values(phasing_config.requiredProps).every((currentProp) => !!parameters.find(p => p === currentProp));
  }
}
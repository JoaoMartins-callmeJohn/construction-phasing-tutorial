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
    this.container.style.overflow = 'overlay';
    this.container.style.backgroundColor = 'white';
    this.options = options;
    this.currentViewMode = 'Day';
  }

  initialize() {

    this.title = this.createTitleBar(this.titleLabel || this.container.id);
    this.title.style.overflow = 'auto';
    this.initializeMoveHandlers(this.title);
    this.container.appendChild(this.title);

    this.div = document.createElement('div');
    this.container.appendChild(this.div);

    //Here we add the svg for the GANTT chart
    this.content = document.createElement('div');
    this.content.style.backgroundColor = (this.options.backgroundColor || 'white');
    this.content.innerHTML = `<svg id="phasing-container"></svg>`;
    this.container.appendChild(this.content);

    this.updateTasks();
  }

  update(model, dbids) {
    if (phasing_config.tasks.length === 0) {
      this.inputCSV();
    }
    if (phasing_config.tasks.length > 0) {
      this.gantt = this.createGanttChart();
    }
  }

  async importCSV() {
    await this.inputCSV();
    this.gantt = this.createGanttChart();
    this.handleColors.call(this);
  }

  createGanttChart() {
    document.getElementById('phasing-container').innerHTML = `<svg id="phasing-container"></svg>`;

    let newGantt = new Gantt("#phasing-container", phasing_config.tasks);

    return newGantt;
  }

  updateTasks() {
    if (phasing_config.tasks.length === 0) {
      this.inputCSV();
    }
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
    return newObject;
  }

  validateCSV(line) {
    let parameters = line.split(',');
    return Object.values(phasing_config.requiredProps).every((currentProp) => !!parameters.find(p => p === currentProp));
  }
}
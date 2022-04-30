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
  mapTaksNProps: {}
};

export class PhasingPanel extends Autodesk.Viewing.UI.DockingPanel {
  constructor(extension, id, title, options) {
      super(extension.viewer.container, id, title, options);
      this.extension = extension;
      this.container.style.left = (options.x || 0) + 'px';
      this.container.style.top = (options.y || 0) + 'px';
      this.container.style.width = (options.width || 500) + 'px';
      this.container.style.height = (options.height || 400) + 'px';
      // this.container.style.resize = 'none';
  }

  initialize() {
    this.title = this.createTitleBar(this.titleLabel || this.container.id);
    this.initializeMoveHandlers(this.title);
    this.container.appendChild(this.title);
    this.content = document.createElement('div');
    this.content.style.height = '350px';
    this.content.style.backgroundColor = 'white';
    this.content.innerHTML = `<svg class="phasing-container" style="position: relative; height: 350px;"></svg>`;
    this.container.appendChild(this.content);
    this.updateTasks();
    // See https://frappe.io/gantt
    // if(PHASING_CONFIG.tasks.length > 0){
    //   this.gantt = new Gantt(".phasing-container", PHASING_CONFIG.tasks, {
    //     on_click: function (task) {
    //       viewer.isolate(PHASING_CONFIG.objects[task.id]);
    //     }
    //   });
    // }
  }

  update(model, dbids) {
    if(PHASING_CONFIG.tasks.length === 0){
      this.inputCSV();
    }
    model.getBulkProperties(dbids, { propFilter: PHASING_CONFIG.propFilter }, (results) => {
      results.map((result => {
        this.updateObjects(result);
      }))
    }, (err) => {
      console.error(err);
    });
    if(PHASING_CONFIG.tasks.length > 0){
      let _viewer = this.extension.viewer;
      this.gantt = new Gantt(".phasing-container", PHASING_CONFIG.tasks, {
        on_click: this.barCLickEvent.bind(this)
        // on_click: function (task, _viewer) {
        //   _viewer.isolate(PHASING_CONFIG.objects[task.id]);
        // }
      });
    }
  }

  barCLickEvent(task){
    this.extension.viewer.isolate(PHASING_CONFIG.objects[task.id]);
  }

  updateObjects(result){
    // let currentTaskId = PHASING_CONFIG.mapTaksNProps[result[PHASING_CONFIG.propFilter]];
    let currentTaskId = PHASING_CONFIG.mapTaksNProps[result.properties[0].displayValue];
    if(!!currentTaskId) {
      if(!PHASING_CONFIG.objects[currentTaskId])
        PHASING_CONFIG.objects[currentTaskId] = [];
      
      PHASING_CONFIG.objects[currentTaskId].push(result.dbId);
    }
  }

  updateTasks(){
    if(PHASING_CONFIG.tasks.length === 0){
      this.inputCSV();
    }
  }

  async inputCSV(){
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
    if(file){
      const reader = new FileReader();
      reader.onload = async (e) => {
        let lines = e.target.result.split('\n');
        if(this.validateCSV(lines[0])){
          let header = lines[0];
          lines.shift();
          let newTasks = lines.map(line => this.lineToObject(line, header));
          PHASING_CONFIG.tasks = newTasks;
        }
      }
      reader.readAsBinaryString(file);
    }
  }

  lineToObject(line, inputHeadersLine){
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

  addPropToMask(filterValue, taskId){
    PHASING_CONFIG.mapTaksNProps[filterValue] = taskId;
  }

  validateCSV(line){
    let parameters = line.split(',');
    return Object.values(PHASING_CONFIG.requiredProps).every((currentProp) => !!parameters.find(p => p===currentProp));
  }
}
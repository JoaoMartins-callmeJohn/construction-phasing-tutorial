import { PhasingPanel } from './PhasingPanel.js';

class PhasingExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._button = null;
        this._panel = null;
    }

    async load() {
        super.load();
        await Promise.all([
            this.loadScript('https://cdn.jsdelivr.net/npm/frappe-gantt@0.6.1/dist/frappe-gantt.js', 'FrappeGantt'),
            this.loadStylesheet('https://cdn.jsdelivr.net/npm/frappe-gantt@0.6.1/dist/frappe-gantt.css')
        ]);
        console.log('PhasingExtension loaded.');
        return true;
    }

    unload() {
        super.unload();
        if (this._button) {
            this.removeToolbarButton(this._button);
            this._button = null;
        }
        if (this._panel) {
            this._panel.setVisible(false);
            this._panel.uninitialize();
            this._panel = null;
        }
        this.viewer.clearThemingColors();
        this.viewer.showAll();
        console.log('PhasingExtension unloaded.');
        return true;
    }

    createToolbarButton(buttonId, buttonIconUrl, buttonTooltip) {
        let group = this.viewer.toolbar.getControl('dashboard-toolbar-group');
        if (!group) {
            group = new Autodesk.Viewing.UI.ControlGroup('dashboard-toolbar-group');
            this.viewer.toolbar.addControl(group);
        }
        const button = new Autodesk.Viewing.UI.Button(buttonId);
        button.setToolTip(buttonTooltip);
        group.addControl(button);
        const icon = button.container.querySelector('.adsk-button-icon');
        if (icon) {
            icon.style.backgroundImage = `url(${buttonIconUrl})`;
            icon.style.backgroundSize = `24px`;
            icon.style.backgroundRepeat = `no-repeat`;
            icon.style.backgroundPosition = `center`;
        }
        return button;
    }

    removeToolbarButton(button) {
        const group = this.viewer.toolbar.getControl('dashboard-toolbar-group');
        group.removeControl(button);
    }

    onToolbarCreated() {
        this._panel = new PhasingPanel(this, 'dashboard-phases-panel', 'Schedule', { x: 10, y: 10 });//
        this._button = this.createToolbarButton('dashboard-phases-button', 'https://img.icons8.com/small/32/000000/gantt-chart.png', 'Show Gantt Chart');//
        this._button.onClick = () => {
            this._panel.setVisible(!this._panel.isVisible());
            this._button.setState(this._panel.isVisible() ? Autodesk.Viewing.UI.Button.State.ACTIVE : Autodesk.Viewing.UI.Button.State.INACTIVE);
            if (this._panel.isVisible() && this.viewer.model) {
                this.update();
            }
        };
    }

    onModelLoaded(model) {
        super.onModelLoaded(model);
        if (this._panel && this._panel.isVisible()) {
            this.update();
        }
    }

    findLeafNodes(model) {
        return new Promise(function (resolve, reject) {
            model.getObjectTree(function (tree) {
                let leaves = [];
                tree.enumNodeChildren(tree.getRootId(), function (dbid) {
                    if (tree.getChildCount(dbid) === 0) {
                        leaves.push(dbid);
                    }
                }, true);
                resolve(leaves);
            }, reject);
        });
    }

    async update() {
        const dbids = await this.findLeafNodes(this.viewer.model);
        this._panel.update(this.viewer.model, dbids);
    }

    loadScript(url, namespace) {
        if (window[namespace] !== undefined) {
            return Promise.resolve();
        }
        return new Promise(function (resolve, reject) {
            const el = document.createElement('script');
            el.src = url;
            el.onload = resolve;
            el.onerror = reject;
            document.head.appendChild(el);
        });
    }

    loadStylesheet(url) {
        return new Promise(function (resolve, reject) {
            const el = document.createElement('link');
            el.rel = 'stylesheet';
            el.href = url;
            el.onload = resolve;
            el.onerror = reject;
            document.head.appendChild(el);
        });
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('PhasingExtension', PhasingExtension);
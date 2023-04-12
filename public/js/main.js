// uncomment line below to register offline cache service worker 
// navigator.serviceWorker.register('../serviceworker.js');

if (typeof fin !== 'undefined') {
    init();
} else {
    document.querySelector('#of-version').innerText =
        'The fin API is not available - you are probably running in a browser.';
}

//once the DOM has loaded and the OpenFin API is ready
async function init() {
    //get a reference to the current Application.
    const app = await fin.Application.getCurrent();
    const win = await fin.Window.getCurrent();

    // const ofVersion = document.querySelector('#of-version');
    // ofVersion.innerText = await fin.System.getVersion();

    //Only launch new windows from the main window.
    if (win.identity.name === app.identity.uuid) {
        //subscribing to the run-requested events will allow us to react to secondary launches, clicking on the icon once the Application is running for example.
        //for this app we will  launch a child window the first the user clicks on the desktop.
        app.once('run-requested', async () => {
            await fin.Window.create({
                name: 'childWindow',
                url: location.href,
                defaultWidth: 320,
                defaultHeight: 320,
                autoShow: true
            });
        });
    }
}

const config = {
    settings:{
        hasHeaders: true,
        constrainDragToContainer: true,
        reorderEnabled: true,
        selectionEnabled: false,
        popoutWholeStack: false,
        blockedPopoutsThrowError: true,
        closePopoutsOnUnload: true,
        showPopoutIcon: true,
        showMaximiseIcon: true,
        showCloseIcon: true
    },
    dimensions: {
        borderWidth: 5,
        minItemHeight: 10,
        minItemWidth: 10,
        headerHeight: 20,
        dragProxyWidth: 300,
        dragProxyHeight: 200
    },
    labels: {
        close: 'close',
        maximise: 'maximise',
        minimise: 'minimise',
        popout: 'open in new window'
    },
    content: [{
      type: 'row',
      content: [
        {
          type:'component',
          componentName: 'example',
          componentState: { text: 'Component 1' }
        },
        {
          type:'component',
          componentName: 'example',
          componentState: { text: 'Component 2' }
        },
        {
          type:'component',
          componentName: 'example',
          componentState: { text: 'Component 3' }
        }
      ]
    }]
};
  
const layoutEvents = [
    "stateChanged",
    "windowOpened",
    "windowClosed",
    "selectionChanged",
    "itemDestroyed",
    "itemCreated",
    "componentCreated",
    "rowCreated",
    "columnCreated",
    "stackCreated",
    "tabCreated"
];

let myLayout = new GoldenLayout( config );
for (const event of layoutEvents) {
    // @ts-ignore
    myLayout.on(event, (e) => {
        console.log(`layout event ${event} fired`);
        console.log(e);
    });
}

myLayout.registerComponent( 'example', function( container, state ){
    container.getElement().html( '<h2>' + state.text + '</h2>');
});
  
myLayout.init();

let component = myLayout.getComponent('example');
console.log('component: ', component);

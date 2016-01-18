var CLIENTS_INFO = [
    {
        name: "All",
        value :""
    },
    {
        name: "Liberty Mutual",
        value :"297"
    },
    {
        name: "StateFarm",
        value :"477"
    },
    {
        name: "ALFA Vision",
        value :"611"
    },
    {
        name: "Utica",
        value :"870"
    },
    {
        name: "Motorists Mutual",
        value: "366"
    },
    {
        name: "United Automobile",
        value :"747"
    }
];
var selectedENV = {};
var opts = {
    lines: 10, // The number of lines to draw
    length: 10, // The length of each line
    width: 5, // The line thickness
    radius: 10, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: '500' // Left position relative to parent in px
};
var pageCenter = document.getElementById('center');
var spinner = new Spinner(opts);
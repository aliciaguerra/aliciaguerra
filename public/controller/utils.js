var  getClaimStatus = function(claim) {
    switch(claim.customerStatus){
        case 0:
            return "New claim (0)";

        case 1:
            return "Claim started (1)";

        case 2:
            return "Damage captured (2)";

        case 3:
            return "Photos captured (3)";

        case 4:
            return "Claim reviewed (4)";

        case 5:
            return "Claim submitted (5)";

        case 6:
            return "Estimate ready (6)";

        case 7:
            return "Estimate received (7)";

        case 8:
            return "Survey completed (8)";

        case 9:
            return "Completed (9)";

        case 10:
            return "Appointment Scheduled (10)";

        case 11:
            return "Repair Completed (11)";

        default:
            return "Unknown status";
    }
};

var isPositiveNumber = function(value) {
    return parseFloat(value) > 0 ;
};

var getAppName= function(orgId){
    if (orgId === '477') {
        return "Pocket Estimate";
    } if (orgId === '297'){
        return "Express Est";
    } else {
        return "";
    }
};

var getClientName = function(claim){
    if (claim.orgId === '477') {
        return "StateFarm";
    } if (claim.orgId === '297'){
        return "Liberty Mutual";
    } if (claim.orgId ==='611') {
        return "Avisios";
    } if (claim.orgId ==='870') {
        return "Utica";
    } if(claim.orgId ==='366') {
        return "Motorists";
    } if (claim.orgId =='747') {
        return "UAIC";
    } if (claim.orgId=='M00'){
        return "M00";
    } else {
        return "";
    }
};

var trimString = function  (str) {
    if(typeof(str) == 'undefined' || str == '') {
        return '';
    }
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
};

var formatDate = function (date) {
    var today = new Date(date);
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10) {
        dd='0'+dd
    }
    if(mm<10) {
        mm='0'+mm
    }
    return yyyy +'-'+mm+'-'+dd;
};
var formatDateDay = function (date) {
    var today = new Date(date);
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    if(dd<10) {
        dd='0'+dd
    }
    if(mm<10) {
        mm='0'+mm
    }
    return mm+'/'+dd;
};
var format_two_digits = function(n) {
    return n < 10 ? '0' + n : n;
};
var time_format = function(d) {
    var hours = format_two_digits(d.getHours());
    var minutes = format_two_digits(d.getMinutes());
    var seconds = format_two_digits(d.getSeconds());
    return hours + ":" + minutes + ":" + seconds;
};

var getTodayDate = function () {
    var today = new Date();
    return formatDate(today);
};
var iniPages = function(obj) {
    obj.pageList =[];
    if(obj.currentPage > 1 && obj.currentPage <obj.totalPages) {
        if(obj.currentPage-1 >=1) {
            obj.pageList.push(obj.currentPage-1);
        }
        obj.pageList.push(obj.currentPage);
        if(obj.currentPage+1 <=obj.totalPages) {
            obj.pageList.push(obj.currentPage+1);
        }
    } else if(obj.currentPage == 1) {
        obj.pageList.push(obj.currentPage);
        if(obj.currentPage+1 <=obj.totalPages) {
            obj.pageList.push(obj.currentPage+1);
        }
        if(obj.currentPage+2 <=obj.totalPages) {
            obj.pageList.push(obj.currentPage+2);
        }
    } else if (obj.currentPage ==obj.totalPages) {
        if(obj.currentPage-2 >=1) {
            obj.pageList.push(obj.currentPage-2);
        }
        if(obj.currentPage-1 >=1) {
            obj.pageList.push(obj.currentPage-1);
        }
        obj.pageList.push(obj.currentPage);
    }
};

var startAndEndOfWeek = function(date) {

    // If no date object supplied, use current date
    // Copy date so don't modify supplied date
    var now = date? new Date(date) : new Date();

    // set time to some convenient value
    now.setHours(0,0,0,0);

    // Get the previous Monday
    var monday = new Date(now);
    monday.setDate(monday.getDate() - monday.getDay() + 1);

    // Get next Sunday
    var sunday = new Date(now);
    sunday.setDate(sunday.getDate() - sunday.getDay() + 7);

    // Return array of date objects
    return [monday, sunday];
};

var formatPhone = function(obj) {
    obj = obj.toString();
    var numbers = obj.replace(/\D/g, ''),
        char = {0:'(',3:')',6:'-'};
    obj = '';
    for (var i = 0; i < numbers.length; i++) {
        obj += (char[i]||'') + numbers[i];
    }
    return obj;
};

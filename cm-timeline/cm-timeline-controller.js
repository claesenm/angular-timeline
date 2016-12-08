'use strict';

//var CmtimelineCtrl = function($rootScope, $document, $timeout, $scope) {
var CmtimelineCtrl = function($scope, $http) {

	var lorem = "klLorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. " +
		          "Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor." +
		          "Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, " +
		          "ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor." +
		          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

	$scope.side = '';

/////////
//
// SIMPLE CONVENIENCE FUNCTIONS FOR DATE REPRESENTATION
//
/////////

	function CMStr2Date(CMstring){
		return new Date(CMstring.substr(0, 4) + "-" + CMstring.substr(4, 2) + "-" + CMstring.substr(6, 2));		
	}
	function Date2Day(date){
		var weekDays = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];
		return weekDays[date.getUTCDay()];
	}
	function Date2Text(date){
		var months = ["januari", "februari", "maart", "april", "mei", "juni", "juli",
					  "augustus", "september", "oktober", "november", "december"];
		var day = date.getUTCDate();
		var year = date.getUTCFullYear();
		var month = date.getUTCMonth();
		return day.toString() + " " + months[month] + " " + year.toString();
	}

	function sortByKey(array, key) {
		return array.sort(function(a, b) {
			var x = a[key]; var y = b[key];
			return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		});
	}

	function concatAndSort(arr, up){
        arr = arr.concat(up);
        return sortByKey(arr, 'date');
	}
	$scope.events = [];

/*	
	$scope.events = [{
		badgeClass: 'info',
        type: 'consult',
        badgeImage: 'obsgyn-icon.png',
		badgeIconClass: 'glyphicon-check',
		physician: 'dr. Oetker',
        day: 'Vrijdag',
        dateText: '2 december 2016',
        date: new Date(),
		when: '11 hours ago via Twitter',
            eventColor: '#fffff',
		content: 'Some awesome content.',
        description: 'Bevalling met keizersnede.',
        costTotal: '10.00',
        costZIV: '9.00',
        costPerstus: '1.00',
        costs: [{nomenclature: '1234',
                 description: 'blabla',
                 total: '5.00',
                 ZIV: '4.00',
                 perstus: '1.00'},
                 {nomenclature: '57859',
                 description: "klLorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. " +
		          "Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor." +
		          "Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, " +
		          "ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor." +
		          "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                 total: '5.00',
                 ZIV: '4.00',
                 perstus: '1.00'}
        ]
	},{
		badgeClass: 'info',
        type: 'consult',
        badgeImage: 'obsgyn-icon.png',
		badgeIconClass: 'glyphicon-check',
		physician: 'dr. Oetker',
        day: 'Vrijdag',
        dateText: '2 december 2016',
        date: new Date(),
		when: '11 hours ago via Twitter',
            eventColor: '#fffff',
		content: 'Some awesome content.',
        description: 'Bevalling met keizersnede.',
        costTotal: '10.00',
        costZIV: '9.00',
        costPerstus: '1.00',
        costs: [{nomenclature: '1234',
                 description: 'blabla',
                 total: '5.00',
                 ZIV: '4.00',
                 perstus: '1.00'},
                 {nomenclature: '57859',
                 description: 'bloblu',
                 total: '5.00',
                 ZIV: '4.00',
                 perstus: '1.00'}
        ]

        }, {
		badgeClass: 'warning',
		badgeIconClass: 'glyphicon-credit-card',
		title: 'Second heading',
        day: 'Vrijdag',
        dateText: '2 december 2016',
        date: new Date(),
		when: '12 hours ago via Twitter',
            eventColor: '#fffff',
		content: 'More awesome content.'
	}, {
		badgeClass: 'default',
		badgeIconClass: 'glyphicon-credit-card',
		title: 'Third heading',
        day: 'Vrijdag',
        dateText: '2 december 2016',
        date: new Date(),
        textcontent: 'fjieofjoweif',
        imgcontent: 'icons/red-brain-20.png',
		titleContentHtml: '<img class="img-responsive" src="http://www.freeimages.com/assets/183333/1833326510/wood-weel-1444183-m.jpg">',
		contentHtml: $scope.greeting,
            eventColor: '#fffff',
		footerContentHtml: '<a href="">Continue Reading</a>'
	}];
*/

/////////
//
// GEZO QUERIES
//
/////////

    $scope.queryGezoTimeline = function(lidano, successCallback, errorCallback){
        var data = {lidano: lidano};
        $http({
                url: 'http://localhost:8090/jobs?context=tetraitesapi&appName=tetraitesapi&classPath=tetraitesapi.gezoTimeline&sync=true',
                method: "POST",
                data: data
            })
            .then(successCallback, errorCallback);
    }

//     $scope.queryGezoTimeline('Patricia',
//             function(response){
//                 $scope.greeting = response.data;
//             },
//             function(response){
//                 $scope.greeting = 'ERROR: ' + JSON.stringify(error);
//             });

    $scope.queryGezoEvent = function(lidano, day, successCallback, errorCallback){
        var data = {lidano: lidano, day: day};
        $http({
                url: 'http://localhost:8090/jobs?context=tetraitesapi&appName=tetraitesapi&classPath=tetraitesapi.gezoEvents&sync=true',
                method: "POST",
                data: data
            })
            .then(successCallback, errorCallback);
     }

    function processGezoEvent(eventData){
    	var date = CMStr2Date(eventData.baDat);
    	var bed = (eventData.totaal.length  > 0) ? parseFloat(eventData.totaal) : 0.0;
    	var ziv = (eventData.ziv.length  > 0) ? parseFloat(eventData.ziv) : 0.0;
    	var perstus = bed-ziv;
        return {
            type: 'consult',
            physician: eventData.verstrNr,
            day: Date2Day(date),
            dateText: Date2Text(date),
            date: date,
            content: 'TODO',
            description: eventData.prestatieDesc,
            location: eventData.hnummer,
            hospitalised: eventData.hnummer.length > 0,
            costTotal: bed,
            costZIV: ziv,
            costPerstus: perstus,
            badgeClass: 'info', /* TODO */
            badgeImage: 'obsgyn-icon.png',
            badgeIconClass: 'glyphicon-check',
            costs: [{nomenclature: '1234',
                     description: 'blabla',
                     total: '5.00',
                     ZIV: '4.00',
                     perstus: '1.00'},
                     {nomenclature: '57859',
                     description: 'bloblu',
                     total: '5.00',
                     ZIV: '4.00',
                     perstus: '1.00'}]
        };
    }

	$scope.queryGezoEvent('Patricia', 20121117,
            function(response){
                var gezoEvents = response.data.result.data.map(processGezoEvent);
                console.log(gezoEvents);
                console.log(gezoEvents[0]);
                $scope.events = concatAndSort($scope.events, gezoEvents);
//                 $scope.events = $scope.events.concat(gezoEvents);
                console.log($scope.events);
            },
            function(response){
            	console.log(response);
                $scope.greeting = 'ERROR: ' + JSON.stringify(response);
       			$scope.events.concat([{type: 'consult', physician: 'dr error'}]);
                throw new Error('Error in queryGezoEvent');
            });

/////////
//
// FARMA QUERIES
//
/////////

    $scope.queryFarmaEvent = function(lidano, day, successCallback, errorCallback){
        var data = {lidano: lidano, day: day};
        $http({
                url: 'http://localhost:8090/jobs?context=tetraitesapi&appName=tetraitesapi&classPath=tetraitesapi.farmaEvents&sync=true',
                method: "POST",
                data: data
            })
            .then(successCallback, errorCallback);
     }

    function processFarmaEvent(eventData){
    	var date = CMStr2Date(eventData.baDat);
    	var bed = (eventData.totaal.length  > 0) ? parseFloat(eventData.totaal) : 0.0;
    	var ziv = (eventData.ziv.length  > 0) ? parseFloat(eventData.ziv) : 0.0;
    	var perstus = bed-ziv;
        return {
            type: 'farma',
            physician: eventData.voorsNr,
            pharmacy: eventData.verstrNr,
            numPackages: eventData.gev,
            productName: 'Rilatine (500kg)',
            day: Date2Day(date),
            dateText: Date2Text(date),
            date: date,
            content: 'TODO',
            description: eventData.prestatieDesc,
            atc: eventData.atc,
            cnk: eventData.farmprod,
            ddd: 1.618,
            costTotal: bed,
            costZIV: ziv,
            costPerstus: perstus,
            badgeClass: 'info', /* TODO */
            badgeImage: 'obsgyn-icon.png',
            badgeIconClass: 'glyphicon-check',
        };
    }

	$scope.queryFarmaEvent('Karel', 20111001,
            function(response){
                var farmaEvents = response.data.result.data.map(processFarmaEvent);
                console.log(farmaEvents);
                console.log(farmaEvents[0]);
                $scope.events = concatAndSort($scope.events, farmaEvents);
//                 $scope.events = $scope.events.concat(farmaEvents);
                console.log($scope.events);
            },
            function(response){
            	console.log(response);
                $scope.greeting = 'ERROR: ' + JSON.stringify(response);
       			$scope.events.concat([{type: 'consult', physician: 'dr error'}]);
                throw new Error('Error in queryGezoEvent');
            });


/////////
//
// VARIA
//
/////////

	$scope.addEvent = function() {
		$scope.events.push({
			badgeClass: 'info',
			badgeIconClass: 'glyphicon-check',
			title: 'First heading',
        day: 'Vrijdag',
        date: '2 december 2016',
			when: '3 hours ago via Twitter',
			content: 'Some awesome content.',
            eventColor: '#fffff'
		});

	};
	// optional: not mandatory (uses angular-scroll-animate)
	$scope.animateElementIn = function($el) {
		$el.removeClass('timeline-hidden');
		$el.addClass('bounce-in');
	};

	// optional: not mandatory (uses angular-scroll-animate)
	$scope.animateElementOut = function($el) {
		$el.addClass('timeline-hidden');
		$el.removeClass('bounce-in');
	};

	$scope.leftAlign = function() {
		$scope.side = 'left';
	}

	$scope.rightAlign = function() {
		$scope.side = 'right';
	}

	$scope.defaultAlign = function() {
		$scope.side = ''; // or 'alternate'
	}

};

angular.module('cm-timeline').controller('Cm-timelineCtrl', CmtimelineCtrl);

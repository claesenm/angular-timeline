'use strict';

//var CmtimelineCtrl = function($rootScope, $document, $timeout, $scope) {
var CmtimelineCtrl = function($scope, $http) {

	$scope.side = '';
	$scope.lidano = 'Patricia';
	$scope.timeout = 30;
	$scope.urlstring = '&num-cpu-cores=1&memory-per-node=512mb';

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

	$scope.today = new Date();
	$scope.todayText = Date2Text($scope.today);
	$scope.todayDay = Date2Day($scope.today);


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

    $scope.queryGezoEvent = function(lidano, day, successCallback, errorCallback){
        var data = {lidano: lidano, day: day};
        $http({
                url: 'http://localhost:8090/jobs?context=tetraitesapi&appName=tetraitesapi&classPath=tetraitesapi.gezoEvents&sync=true' + $scope.urlstring,
                method: "POST",
                data: data
            })
            .then(successCallback, errorCallback);
     }

	function physicianSpec2Icon(spec){
		if(spec.length < 1) return "unknown";
		if(spec.search("tand") > -1) return "dentist";
		if(spec.search("gynae") > -1) return "gynae";
		if(spec.search("cardio") > -1) return "cardio";
		if(spec.search("huisarts") > -1) return "gp";
		if(spec.search("oftal") > -1) return "oftal";
		return "unknown";
	}

    function processGezoEvent(eventData){
    	var date = CMStr2Date(eventData.baDat);
    	var bed = parseFloat(eventData.totaal.toFixed(2));
    	var ziv = parseFloat(eventData.ziv.toFixed(2));
    	var perstus = parseFloat((bed-ziv).toFixed(2));
    	return {
            type: 'consult',
            physician: eventData.verstrNr,
            physicianSpec: eventData.verstrSpec,
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
            icon: physicianSpec2Icon(eventData.verstrSpec),
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

/////////
//
// 	GEZO TIMELINE QUERIES
//
/////////

    $scope.queryGezoTimeline = function(lidano, successCallback, errorCallback){
        var data = {lidano: lidano};
        $http({
                url: 'http://localhost:8090/jobs?context=tetraitesapi&appName=tetraitesapi&classPath=tetraitesapi.gezoTimeline&sync=true' + $scope.urlstring,
                method: "POST",
                data: data
            })
            .then(successCallback, errorCallback);
    }

	function processGezoTimelineEntry(timelineEntry){
		if(timelineEntry.meta.hospital){		
			// timeline entry is a hospitalisation, do not add as separate event
	    	var date = CMStr2Date(timelineEntry.date);
    		var bed = parseFloat(timelineEntry.totaal.toFixed(2));
    		var ziv = parseFloat(timelineEntry.ziv.toFixed(2));
    		var perstus = parseFloat(timelineEntry.perstus.toFixed(2));
			var event = {
				day: Date2Day(date),
				dateText: Date2Text(date),
				date: date,
				type: 'hospi',
				icon: 'hospi',
				location: '',
				costTotal: bed,
				costZIV: ziv,
				costPerstus: perstus,
				consultations: []
			}
			$scope.events = concatAndSort($scope.events, [event]);
			$scope.queryGezoEvent($scope.lidano, timelineEntry.date,
						function(response){
							var gezoEvents = response.data.result.data.map(processGezoEvent);
							$scope.greeting = event;
							console.log(gezoEvents);
							console.log(gezoEvents[0]);
							event.consultations.concat(gezoEvents);
							event.location = event.consultations[0].location // dirty
							console.log($scope.events);
						},
						function(response){
							console.log(response);
							$scope.events.concat([{type: 'consult', physician: 'dr error'}]);
							throw new Error('Error in queryGezoEvent');
						});

		}else{
			// timeline entry is NOT a hospitalisation -> add as consultation
			$scope.queryGezoEvent($scope.lidano, timelineEntry.date,
					function(response){
						var gezoEvents = response.data.result.data.map(processGezoEvent);
						console.log(gezoEvents);
						console.log(gezoEvents[0]);
						$scope.events = concatAndSort($scope.events, gezoEvents);
						console.log($scope.events);
					},
					function(response){
						console.log(response);
						$scope.greeting = 'ERROR: ' + JSON.stringify(response);
						$scope.events.concat([{type: 'consult', physician: 'dr error'}]);
						throw new Error('Error in queryGezoEvent');
					});
		}
	}
	
    $scope.queryGezoTimeline($scope.lidano,
            function(response){
            	response.data.result.data.map(processGezoTimelineEntry);
            	console.log('hospi' + $scope.hospitalisations);
            },
            function(response){
                throw new Error('Error in queryGezoTimeline');
            });



// 	$scope.queryGezoEvent($scope.lidano, 20130110,
// 			function(response){
// 				var gezoEvents = response.data.result.data.map(processGezoEvent);
// 				console.log(gezoEvents);
// 				console.log(gezoEvents[0]);
// 				$scope.events = concatAndSort($scope.events, gezoEvents);
// 				console.log($scope.events);
// 			},
// 			function(response){
// 				console.log(response);
// 				$scope.greeting = 'ERROR: ' + JSON.stringify(response);
// 				throw new Error('Error in queryGezoEvent');
// 			});

// 	$scope.queryGezoEvent($scope.lidano, 20140110,
// 			function(response){
// 				var gezoEvents = response.data.result.data.map(processGezoEvent);
// 				console.log(gezoEvents);
// 				console.log(gezoEvents[0]);
// 				$scope.events = concatAndSort($scope.events, gezoEvents);
// 				console.log($scope.events);
// 			},
// 			function(response){
// 				console.log(response);
// 				$scope.greeting = 'ERROR: ' + JSON.stringify(response);
// 				throw new Error('Error in queryGezoEvent');
// 			});

	$scope.queryGezoEvent($scope.lidano, 20150223,
			function(response){
				var gezoEvents = response.data.result.data.map(processGezoEvent);
				console.log(gezoEvents);
				console.log(gezoEvents[0]);
				$scope.events = concatAndSort($scope.events, gezoEvents);
				console.log($scope.events);
			},
			function(response){
				console.log(response);
				$scope.greeting = 'ERROR: ' + JSON.stringify(response);
				throw new Error('Error in queryGezoEvent');
			});

	$scope.queryGezoEvent($scope.lidano, 20160110,
			function(response){
				var gezoEvents = response.data.result.data.map(processGezoEvent);
				console.log(gezoEvents);
				console.log(gezoEvents[0]);
				$scope.events = concatAndSort($scope.events, gezoEvents);
				console.log($scope.events);
			},
			function(response){
				console.log(response);
				$scope.greeting = 'ERROR: ' + JSON.stringify(response);
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
                url: 'http://localhost:8090/jobs?context=tetraitesapi&appName=tetraitesapi&classPath=tetraitesapi.farmaEvents&sync=true' + $scope.urlstring,
                method: "POST",
                data: data
            })
            .then(successCallback, errorCallback);
     }

    function processFarmaEvent(eventData){
    	var date = CMStr2Date(eventData.baDat);
    	var bed = parseFloat(eventData.totaal.toFixed(2));
    	var ziv = parseFloat(eventData.ziv.toFixed(2));
    	var perstus = parseFloat((bed-ziv).toFixed(2));
        return {
            type: 'farma',
            icon: 'farma',
            physician: eventData.voorsNr,
            pharmacy: eventData.verstrNr,
            numPackages: eventData.gev,
            productName: eventData.name,
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

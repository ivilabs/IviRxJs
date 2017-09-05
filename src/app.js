import $ from 'jquery';
import Rx from 'rxjs/Rx';

// http://reactivex.io/rxjs/manual/overview.html

/* -----------------------------------------------------
Event
----------------------------------------------------- */
var button = document.querySelector('button');
Rx.Observable.fromEvent(button, 'click')
    .scan(count => count + 1, 0)
    .subscribe(count => {
        console.log(`Clicked ${count} times`);
        $('body').css("background-color", getRandomColor());
    });


/* -----------------------------------------------------
Git user search
----------------------------------------------------- */
function getUser(username) {
    return $.ajax({
        url: 'https://api.github.com/users/' + username,
        dataType: 'jsonp'
    }).promise();
}

// V1

/*
const inputSource$ = Rx.Observable.fromEvent($('#input_name'), 'keyup');
inputSource$.subscribe(e => {
    Rx.Observable.fromPromise(getUser(e.target.value)).subscribe(x => {
        $('#name').text(x.data.name);
        $('#location').text(x.data.location);
        $('#bio').text(x.data.bio);
    });
});
*/

// V2

const inputSource$ = Rx.Observable.fromEvent($('#input_name'), 'keyup')
    .map(e => e.target.value)
    .switchMap(v => {
        return Rx.Observable.fromPromise(getUser(v))
    });

inputSource$.subscribe(x => {
    $('#p_name').text(x.data.name);
    $('#p_location').text(x.data.location);
    $('#p_bio').text(x.data.bio);
});

// Helper

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

/* -----------------------------------------------------
From
----------------------------------------------------- */
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const numbers$ = Rx.Observable.from(numbers);

numbers$.subscribe(x => {
    console.log('From: ', x * 2);
});

/* -----------------------------------------------------
Promise
----------------------------------------------------- */
const myPromise = new Promise((resolve, reject) => {
    console.log('Creating a promise');
    setTimeout(() => {
        resolve('Resolved');
    }, 3000);
});

const source$ = Rx.Observable.fromPromise(myPromise);
source$.subscribe(x => {
    console.log('Promise: ', x);
});

/* -----------------------------------------------------
Interval
----------------------------------------------------- */
const interval$ = Rx.Observable.interval(1000).take(5);

interval$.subscribe(x => {
    console.log('Interval: ', x);
})

/* -----------------------------------------------------
Timer
----------------------------------------------------- */
const timer$ = Rx.Observable.timer(4000, 1000).take(5);

timer$.subscribe(x => {
    console.log('Timer: ', x);
})

/* -----------------------------------------------------
Range
----------------------------------------------------- */
const range$ = Rx.Observable.range(1, 10);

range$.subscribe(
    x => {
        console.log('Range: ', x);
    },
    err => {
        console.log(err);
    },
    complete => {
        console.log('Completed');
    });

/* -----------------------------------------------------
Merge
----------------------------------------------------- */
const merge1$ = Rx.Observable.interval(500).map(x => x = "Merge 1: " + x);
const merge2$ = Rx.Observable.interval(1000).map(x => x = "Merge 2: " + x);

Rx.Observable.merge(merge1$, merge2$).take(10).subscribe(x => console.log(x));

/* -----------------------------------------------------
Concat
----------------------------------------------------- */
const concat1$ = Rx.Observable.range(0,5).map(x => x = "Concat 1: " + x);
const concat2$ = Rx.Observable.range(5,10).map(x => x = "Concat 2: " + x);

Rx.Observable.concat(concat1$, concat2$).subscribe(x => console.log(x));
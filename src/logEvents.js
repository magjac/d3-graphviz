import {format} from "d3-format";

export default function(enable) {

    var t0 = Date.now();
    var times = {};
    var eventTypes = this._eventTypes;
    var maxEventTypeLength = Math.max(...(eventTypes.map(eventType => eventType.length)));
    for (let i = 0; i < eventTypes.length; i++) {
        let eventType = eventTypes[i];
        times[eventType] = [];
        var graphvizInstance = this;
        var expectedDelay;
        var expectedDuration;
        this
            .on(eventType + '.log', enable ? function () {
                var t = Date.now();
                var seqNo = times[eventType].length;
                times[eventType].push(t);
                var string = '';
                string += 'Event ';
                string += format(' >2')(i) + ' ';
                string += eventType + ' '.repeat(maxEventTypeLength - eventType.length);
                string += format(' >5')(t - t0) + ' ';
                if (eventType != 'initEnd') {
                    string += format(' >5')(t - times['start'][seqNo]);
                }
                if (eventType == 'dataProcessEnd') {
                    string += ' prepare                 ' + format(' >5')((t - times['layoutEnd'][seqNo]));
                }
                if (eventType == 'renderEnd' && graphvizInstance._transition) {
                    string += ' transition start margin ' + format(' >5')(graphvizInstance._transition.delay() - (t - times['renderStart'][seqNo]));
                    expectedDelay = graphvizInstance._transition.delay();
                    expectedDuration = graphvizInstance._transition.duration();
                }
                if (eventType == 'transitionStart') {
                    var actualDelay = (t - times['renderStart'][seqNo])
                    string += ' transition delay        ' + format(' >5')(t - times['renderStart'][seqNo]);
                    string += ' expected ' + format(' >5')(expectedDelay);
                    string += ' diff ' + format(' >5')(actualDelay - expectedDelay);
                }
                if (eventType == 'transitionEnd') {
                    var actualDuration = t - times['transitionStart'][seqNo]
                    string += ' transition duration     ' + format(' >5')(actualDuration);
                    string += ' expected ' + format(' >5')(expectedDuration);
                    string += ' diff ' + format(' >5')(actualDuration - expectedDuration);
                }
                console.log(string);
                t0 = t;
            } : null);
    }
    return this;
}

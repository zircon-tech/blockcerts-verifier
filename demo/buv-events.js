var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value"in descriptor)
                descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
        if (staticProps)
            defineProperties(Constructor, staticProps);
        return Constructor;
    }
    ;
}();

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

var Tracker = function() {
    function Tracker(issuerData, baseHref, assertionUID, origin) {
        _classCallCheck(this, Tracker);

        this.origin = origin || 'web-viewer';
        this.baseUrl = issuerData.analyticsURL ? issuerData.analyticsURL : baseHref.split('/certificate/')[0] + '/api/event/certificate';
        this.assertionUID = assertionUID;
    }

    _createClass(Tracker, [{
        key: 'track',
        value: function track(action, detail) {
            if (!this.assertionUID || !action || action === '') {
                return;
            }

            var xhr = new XMLHttpRequest();
            var params = {
                key: this.assertionUID,
                action: action,
                application: document.certificateTrackerOrigin,
                platform: 'blockcerts-verifier',
                userAgent: navigator.userAgent
            };

            if (detail.socialNetwork) {
                params.sharedOn = detail.socialNetwork;
            }

            xhr.addEventListener('load', function(event) {});
            xhr.addEventListener('error', function(event) {
                console.error('Failed calling event endpoint', event);
            });

            xhr.open('POST', this.baseUrl);
            xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            xhr.send(JSON.stringify(params));
        }
    }]);

    return Tracker;
}();

function _getDomainFromUrl(url, keepProtocol) {
    keepProtocol = typeof keepProtocol === 'undefined' ? false : keepProtocol;
    var result = '';
    var parser = document.createElement('a');
    parser.href = url;
    if (keepProtocol) {
        result = parser.protocol + '//';
    }
    result += parser.hostname + (parser.port !== '' ? parser.port : '');
    return result;
}

function handleEvent(e) {
    var chainCode = e.detail.certificateDefinition.chain.code;
    var reportEvents = chainCode !== 'mocknet' && chainCode !== 'regtest' && chainCode !== 'testnet';

    if (!reportEvents) {
        return false;
    }

    if (!document.certificateTracker) {
        var issuer = e.detail.certificateDefinition.issuer;
        var id = e.detail.certificateDefinition.id;
        document.certificateTracker = new Tracker(issuer,_getDomainFromUrl(issuer.id, true),id,document.certificateTrackerOrigin);
    }

    switch (e.type) {
    case 'certificate-load':
        document.certificateTracker.track('viewed', e.detail);
        break;

    case 'certificate-verify':
        document.certificateTracker.track('verified', e.detail);
        break;

    case 'certificate-share':
        document.certificateTracker.track('shared', e.detail);
        break;
    }
}

window.addEventListener('certificate-load', handleEvent);
window.addEventListener('certificate-verify', handleEvent);
window.addEventListener('certificate-share', handleEvent);

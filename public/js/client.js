(function(window, undefined){

  


/**
 * @enum {string}
 */
var LivetexSettings = {
  HTTP_BALANCER: 'http://balancer.unstablehttp.livetex.ru/',
  CHAT_BALANCER: '//unstablechat.livetex.ru',
  MEDIA_SERVER: 'unstablemedia.livetex.ru',
  BILLING_URL: 'http://192.168.48.15:8082/'
};

  var LTX_VERSION = '';

  if (typeof window.LTX_URL === 'undefined') {
    window.LTX_URL = LivetexSettings.LTX_URL;
  }

  
  if (typeof window.LTX_IS_API === 'undefined') {
    window.LTX_IS_API = false;
  }

  if (typeof LiveTex !== 'undefined' &&
      typeof LiveTex['liveTexID'] !== 'undefined') {
    window.liveTexID = LiveTex['liveTexID'];
  }

  function nop() {}

  function loadScript(url, opt_callback) {
    var callback = opt_callback || nop;

    function completeHandler() {
      script.onreadystatechange = nop;
      script.onload = nop;

      document.body.removeChild(script);

      clearTimeout(timeout);

      callback();
    }

    var timeout = setTimeout(completeHandler, 1000);
    var script = document.createElement('script');

    script.onreadystatechange = function() {
      if (script.readyState === 'complete' ||
          script.readyState === 'loaded') {
        completeHandler();
      }
    };

    script.onload = completeHandler;
    script.src = window.LTX_URL + url + '?' + LTX_VERSION;

    document.body.appendChild(script);
  }

  function loadStyle(url, opt_callback) {
    if (document.createStyleSheet) {
      document.createStyleSheet(url);
    } else {
      var head = document.getElementsByTagName('head')[0];
      var link = document.createElement('link');
      
      if (link !== null && head !== undefined) {
        link.setAttribute('type', 'text/css');
        link.setAttribute('href', url);
        link.setAttribute('rel', 'stylesheet');

        head.appendChild(link);
      }
    }

    if (typeof opt_callback === 'function') {
      setTimeout(opt_callback, 200);
    }
  }

  function makeAppCssUrl(isMobile) {
    return window.LTX_URL + 'css/app' + (isMobile ? '-mobile' : '') + '.css';
  }

  function makeCustomCssUrl(siteId){
    return window.LTX_URL + 'csscontroller/css/' + siteId + '.css';
  }

  function makeCustomCssButtonsUrl(siteId) {
    return window.LTX_URL + 'csscontroller/cssbuttons/' + siteId + '.css';
  }

  function makeAppJsUrl() {
    if (typeof document.getElementsByClassName === 'function' &&
        JSON instanceof Object &&
        typeof JSON.parse === 'function' &&
        typeof JSON.stringify === 'function') {
      return 'js/app.js';
    } else {
      return 'js/app-ie.js';
    }
  }

  function isMobileWidget() {
    return ((screen.width < 568 &&
      /iPhone|iPod/i.test(navigator.userAgent)) ||
      /android/i.test(navigator.userAgent)) &&
      (window.liveSettings['flag_mobile'] === 1);
  }
  
  loadScript('js/settings/' + liveTexID.toString() + '.js', function() {
    loadStyle(makeAppCssUrl(isMobileWidget()), function() {
      loadStyle(makeCustomCssButtonsUrl(window.liveSettings['id_site']), function(){
        function callback() {
          loadScript(makeAppJsUrl());
        }

        if (!isMobileWidget()) {
          loadStyle(makeCustomCssUrl(window.liveSettings['id_site']), callback);
        } else {
          callback();
        }
      });
    });
  });
})(window);

/// NicoThumbWatch4HTML5 ///
/*  Created by @3846masa */

var isSupport = 
    navigator == null || 
    (typeof ActiveXObject === 'undefined' &&
      !(navigator.plugins &&
        typeof navigator.plugins['Shockwave Flash'] === 'object' &&
        navigator.mimeTypes &&
        navigator.mimeTypes.length));

if (isSupport) {
  const navigator = {'plugins': {'Shockwave Flash':{}},'mimeTypes':[1,2]};
  navigator.plugins['Shockwave Flash'] = {};
}

window.addEventListener('load', nicoThumbWatch4HTML5, false);

function nicoThumbWatch4HTML5() {
  if (!isSupport) return;
  Array.prototype.forEach.call(
    document.querySelectorAll('embed[id^=external_nico_]'),
    convertNicoToHTML5,
    false);
};

function convertNicoToHTML5(embed){
  var data = GetQueryString(embed.getAttribute('flashvars'));
  var id = data.videoId.match(/([0-9]+)$/)[1];
  
  var nicoframe = document.createElement('div');
  nicoframe.setAttribute('class','nicoframe');
  nicoframe.style.cssText = makeCSSText({
    'display' : 'inline-block',
    'position' : 'relative',
    'background' : 'black',
    'border' : '1px solid black',
    'width' : embed.offsetWidth+'px',
    'height' : embed.offsetHeight+'px'
  });

  var nicovideo = document.createElement('video');
  nicovideo.setAttribute('width', embed.offsetWidth);
  nicovideo.setAttribute('height', embed.offsetHeight);
  nicovideo.setAttribute('class', 'nicovideo');
  nicovideo.setAttribute('sm', id);
  nicovideo.setAttribute('controls', 'true');
  nicovideo.style.cssText = makeCSSText({
    'display' : 'none',
    'position' : 'absolute',
    'left' : '0px',
    'top' : '0px',
    'background' : 'black'
  });

  var img = document.createElement('img');
  img.setAttribute('src', 'http://tn-skr'+(id%4+1)+'.smilevideo.jp/smile?i='+id);
  img.style.cssText = makeCSSText({
    'position' : 'absolute',
    'top' : '0px',
    'left' : '0px',
    'width' : embed.offsetWidth+'px',
    'height' : embed.offsetHeight+'px',
    'border' : 'none'
  });
  img.addEventListener('error', function(){
    this.removeEventListener('error', arguments.callee, false);
    this.setAttribute('src', 'http://res.nimg.jp/img/common/video_deleted.jpg');
  }, false);
  
  var span = document.createElement('span');
  span.style.cssText = makeCSSText({
    'display' : 'inline-block',
    'position' : 'absolute',
    'left' : '0px',
    'top' : '0px',
    'width' : embed.offsetWidth+'px',
    'height' : embed.offsetHeight+'px',
    'background-image' : 'url(http://res.nimg.jp/img/thumb/nico/play.png)',
    'background-repeat' : 'no-repeat',
    'background-position' : 'center center'
  });

  embed.parentNode.insertBefore(nicoframe,embed);
  nicoframe.appendChild(embed);
  nicoframe.appendChild(nicovideo);
  nicoframe.appendChild(img);
  nicoframe.appendChild(span);

  if (data.videoId.match(/^sm/)){
    var nicoplay = document.createElement('div');
    nicoplay.setAttribute('class','nicoplay');
    nicoplay.style.cssText = makeCSSText({
      'display' : 'inline-block',
      'position' : 'absolute',
      'cursor' : 'pointer',
      'top' : '0px',
      'left' : '0px',
      'width' : embed.offsetWidth+'px',
      'height' : embed.offsetHeight+'px'
    });
    nicoplay.addEventListener('click', function(){
      resetAllPlayer();
      this.parentNode.querySelector('span').style['background-image'] =
        'url(http://seiga.nicovideo.jp/img/common/loading_nico.gif)';
      GetCookie(this.parentNode, data.videoId, data.thumbPlayKey);
    }, false);
    
    nicoframe.appendChild(nicoplay);
  } else {
    unsupportedVideoToLink(nicoframe, data.videoId);
  }
  embed.parentNode.removeChild(embed);
};

function resetAllPlayer() {
  Array.prototype.forEach.call(
    document.querySelectorAll('div.nicoframe'),
    function(nicoframe){
      console.log(nicoframe);
      var nicovideo = nicoframe.querySelector('video.nicovideo');
      var nicoplay = nicoframe.querySelector('div.nicoplay');
      var img = nicoframe.querySelector('img');
      var span = nicoframe.querySelector('span');

      nicovideo.pause();
      nicovideo.removeAttribute('src');
      nicovideo.removeAttribute('autoplay');
      nicovideo.style['display'] = 'none';
      if (nicoplay) nicoplay.style['display'] = 'none';
      img.style['visibility'] = 'visible';
      span.style['visibility'] = 'visible';
      span.style['background-image'] = 'url(http://res.nimg.jp/img/thumb/nico/play.png)';
    });
};

function unsupportedVideoToLink(nicoframe,id) {
  var nicoplay = document.createElement('a');
  nicoplay.setAttribute('href','http://nicovideo.jp/watch/'+id);
  nicoplay.setAttribute('class', 'nicoplay');
  nicoplay.style.cssText = makeCSSText({
    'display' : 'inline-block',
    'position' : 'absolute',
    'cursor' : 'pointer',
    'top' : '0px',
    'left' : '0px',
    'width' : nicoframe.offsetWidth+'px',
    'height' : nicoframe.offsetHeight+'px'
  });
  nicoplay.addEventListener('click', function(){
    location.href = 'http://nicovideo.jp/watch/'+id;
  }, false);

  nicoframe.appendChild(nicoplay);
};

function GetCookie(node,id,key) {
  var url = "http://ext.nicovideo.jp/thumb_watch?eco=1&v="+id+"&k="+key;
  var iframe = document.createElement('iframe');
  iframe.style['display'] = 'none';
  iframe.setAttribute('src', url);
  iframe.addEventListener('load', function(){
    this.parentNode.removeChild(this);
    GetVideo(node, id, 0);
  });
  document.querySelector('body').appendChild(iframe);
};

function GetVideo(node,id,force) {
  var url = 'https://script.google.com/macros/s/AKfycbyKItgheVUJEI42L07WzeCOSI4nX5I5XBGe1CdOXjzd8G3e4NA/exec?callback=callback&type=info&force='+force+'&id='+id;
  var jsonp = document.createElement('script');
  jsonp.setAttribute('src', url);
  window.callback = function(data) {
    var idNum = id.match(/^sm([0-9]+)$/)[1];
    var nicovideo = node.querySelector('video.nicovideo');
    nicovideo.setAttribute('src', data.url);
    nicovideo.setAttribute('autoplay','true');
    nicovideo.setAttribute('preload','auto');
    nicovideo.setAttribute('id','nicoplaying');
    if (force == 1) {
      nicovideo.addEventListener('error',
        function(){
          unsupportedVideoToLink(this.parent, data.videoId);
          this.parentNode.removeChild(this);
          resetAllPlayer();
        },
        false);
    } else {
      nicovideo.addEventListener('error',
        function(){
          this.removeEventListener('error', arguments.callee, false);
          this.removeAttribute('src');
          GetVideo(id,1);
        },
        false);
    }
    nicovideo.addEventListener('loadstart',
      function() {
        this.removeEventListener('error', arguments.callee, false);
        this.style['display'] = 'initial';
        this.parentNode.querySelector('img').style['visibility'] = 'hidden';
        this.parentNode.querySelector('span').style['visibility'] = 'hidden';
        Array.prototype.forEach.call(document.querySelectorAll('div.nicoplay'),
          function(nicoplay){
            nicoplay.style['display'] = 'initial';
          });

        this.parentNode.querySelector('div.nicoplay').style['display'] = 'none';
        this.volume = 0.5;
        this.play();
      },
      false);
  };

  document.querySelector('body').appendChild(jsonp);
};

function GetQueryString(query) {
  if(1 < query.length) {
    var parameters = query.split('&');
    var result = {};
    for(var i = 0; i < parameters.length; i++) {
      var element = parameters[i].split('=');
      var paramName = decodeURIComponent(element[0]);
      var paramValue = decodeURIComponent(element[1]);
      result[paramName] = paramValue;
    }
    return result;
  }
  return null;
};

function makeCSSText(obj) {
  return JSON.stringify(obj).replace(/[\'\"\{\}]/g,'').replace(/,/g,';')+';';
};
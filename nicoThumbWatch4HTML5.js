/// NicoThumbWatch4HTML5 0.0.1 ///
/*  Created by @3846masa 2014/02/27
    This script requires jQuery   */

if (typeof jQuery !== "undefined") {

var isSupport = (navigator == null) || !((typeof ActiveXObject !== "undefined") || (navigator.plugins && typeof navigator.plugins["Shockwave Flash"] === "object" && navigator.mimeTypes && navigator.mimeTypes.length));
if (isSupport) {
  const navigator = {'plugins': {'Shockwave Flash':new Object()},'mimeTypes':['01','02']};
  navigator.plugins['Shockwave Flash'] = new Object();
}

$(function(){
  if (isSupport) {
    $('embed[id^=external_nico_]').each(function(){
      var embed = this;
      var data = GetQueryString($(this).attr('flashvars'));
      var id = data.videoId.match(/([0-9]+)$/)[1];
      $(this).wrap(
        $('<div></div>').attr('class','nicoframe')
          .css({'display':'inline-block','position':'relative','background':'black','border':'1px solid black',
            'width':$(embed).width(),'height':$(embed).height()})
      );
      $(this).css({'visibility':'hidden'});
      $(this).parent().append(
        $('<video width="'+$(embed).width()+'" height="'+$(embed).height()+'"></video>').addClass('nicovideo')
          .attr({'sm':id,'src':'','controls':'true'}).removeAttr("autoplay")
          .css({'display':'none','position':'absolute','left':'0px','top':'0px','background':'black'})
      ).append(
        $('<img alt="">').css({'position':'absolute','top':'0px','left':'0px',
          'width':$(embed).width(),'height':$(embed).height(),'border':'none'})
          .attr('src','http://tn-skr'+(id%4+1)+'.smilevideo.jp/smile?i='+id)
          .error(function(){
            $(this).unbind('error');
            $(this).attr('src','http://res.nimg.jp/img/common/video_deleted.jpg');
          })
      ).append(
        $('<span></span>').css({"display":"inline-block","position":"absolute",
          "left":"0px","top":"0px","width":$(embed).width(),"height":$(embed).height(),
          "background-image":"url(http://res.nimg.jp/img/thumb/nico/play.png)",
          "background-repeat":"no-repeat","background-position":"center center"})
      );
      if (data.videoId.match(/^sm/)){
        $(this).parent().append(
          $('<div></div>').addClass('nicoplay')
            .css({'display':'inline-block','position':'absolute','cursor':'pointer',
            'top':'0px','left':'0px','width':$(embed).width(),'height':$(embed).height()})
            .click(function(){
              $('.nicovideo').attr('src','').removeAttr("autoplay").off('error');
              $('.nicoframe').each(function(){
                $(this).find('img').css('visibility','visible');
                $(this).find('span').css('visibility','visible')
                  .css('background-image','url(http://res.nimg.jp/img/thumb/nico/play.png)');
              });
              $('.nicovideo').css({'display':'none'});
              $('.nicoplay').css({'display':'none'});
              $(this).parent().find('span')
                .css('background-image','url(http://seiga.nicovideo.jp/img/common/loading_nico.gif)');
              GetCookie(data.videoId,data.thumbPlayKey);
            })
        );
      } else {
        $(this).parent().append(
          $('<a></a>').addClass('nicoplay')
            .css({'display':'inline-block','position':'absolute','cursor':'pointer',
            'top':'0px','left':'0px','width':$(embed).width(),'height':$(embed).height()})
            .attr('href','http://nicovideo.jp/watch/'+data.videoId)
            .click(function(){
              location.href = 'http://nicovideo.jp/watch/'+data.videoId;
            })
        );
      }
      $(this).remove();
    });
  }
});

function GetCookie(id,key) {
  var url = "http://ext.nicovideo.jp/thumb_watch?eco=1&v="+id+"&k="+key;
  $('<iframe src="'+url+'" style="display:none"></iframe>').appendTo('body').load(function(){
    $(this).remove();
    GetVideo(id,0);
  });
}

function GetVideo(id,force) {
  $.ajax({
    url:'https://script.google.com/macros/s/AKfycbyKItgheVUJEI42L07WzeCOSI4nX5I5XBGe1CdOXjzd8G3e4NA/exec?type=info&force='+force+'&id='+id,
    jsonp:'callback',
    dataType:'jsonp',
    success:function(data){
      var idNum = id.match(/^sm([0-9]+)$/)[1];
      $('video[sm='+idNum+']').attr({'src':data.url,'autoplay':'true','preload':'auto','id':'player'});
      if (force == 1) {
        $('video[sm='+idNum+']').on('error',function(){
          $(this).off('error');
          $(this).off('loadstart');
          $(this).parent().find('div').remove();
          $(this).parent().append(
            $('<a></a>').addClass('nicoplay')
            .css({'display':'inline-block','position':'absolute','cursor':'pointer',
            'top':'0px','left':'0px','width':$(embed).width(),'height':$(embed).height()})
            .attr('href','http://nicovideo.jp/watch/'+data.videoId)
            .click(function(){
              location.href = 'http://nicovideo.jp/watch/'+data.videoId;
            })
          );
          $('.nicoframe').each(function(){
            $(this).find('img').css('visibility','visible');
            $(this).find('span').css('visibility','visible')
              .css('background-image','url(http://res.nimg.jp/img/thumb/nico/play.png)');
          });
          $(this).remove();
        });
      } else {
        $('video[sm='+idNum+']').on('error',function(){
          $(this).off('error');
          $(this).off('loadstart');
          GetVideo(id,1);
        });
      }
      $('video[sm='+idNum+']').on('loadstart',function() {
        $(this).off('loadstart');
        $(this).css('display','');
        $(this).parent().find('img').css('visibility','hidden');
        $(this).parent().find('span').css('visibility','hidden');
        $('.nicoplay').css({'display':''});
        $(this).parent().find('.nicoplay').css({'display':'none'});
        $(this)[0].volume = 0.5;
        $(this)[0].play();
      });
    }
  });
}

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
}

}
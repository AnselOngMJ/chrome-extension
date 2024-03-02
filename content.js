let dict;
document.addEventListener('yt-navigate-finish', async () => {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const start = xhttp.responseText.indexOf("var ytInitialPlayerResponse = ") + 30;
        const end = xhttp.responseText.indexOf("};", start) + 1;
        const response = JSON.parse(xhttp.responseText.slice(start, end));
        dict = {};
        if (response) {
          const captionTracks = response.captions.playerCaptionsTracklistRenderer.captionTracks;
          captionTracks.forEach(track => {
            if (track.languageCode.includes("zh")) {
              const request = new XMLHttpRequest();
              request.onreadystatechange = function() {
                  if (this.readyState == 4 && this.status == 200) {
                    caption = request.responseText;
                    console.log(caption);
                    const parser = new DOMParser();
                    xmlDoc = parser.parseFromString(caption,"text/xml");
                    xmlDoc.querySelectorAll("text").forEach(t => {
                      dict[`${t.getAttribute("start")}`] = {
                        text: t.textContent,
                        dur: t.getAttribute("dur"),
                      }
                    });
                    setInterval(function(){
                      for (const [key, value] of Object.entries(dict)) {
                        if (document.querySelector("video").currentTime >= parseFloat(key) && document.querySelector("video").currentTime < parseFloat(key) + parseFloat(value.dur)) {
                          console.log(document.querySelector("video").currentTime);
                          console.log([key, value])
                          document.querySelector("h1.style-scope.ytd-watch-metadata").textContent = value.text;
                          break;
                        }
                      }
                    },100);
                  }
              };
              request.open("GET", track.baseUrl, true);
              request.send();
            }
          });
        }
      }
  };
  xhttp.open("GET", location.href, true);
  xhttp.send();
});
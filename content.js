let dict;
document.addEventListener("yt-navigate-finish", async () => {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const start = xhttp.responseText.indexOf("var ytInitialPlayerResponse = ") + 30;
        const end = xhttp.responseText.indexOf("};", start) + 1;
        const response = JSON.parse(xhttp.responseText.slice(start, end));
        dict = {};
        let caption;
        if (response) {
          const captionTracks = response.captions.playerCaptionsTracklistRenderer.captionTracks;
          captionTracks.forEach(track => {
            if (track.languageCode.includes("zh")) {
              const request = new XMLHttpRequest();
              request.onreadystatechange = function() {
                  if (this.readyState == 4 && this.status == 200) {
                    caption = request.responseText;
                    const parser = new DOMParser();
                    xmlDoc = parser.parseFromString(caption,"text/xml");
                    xmlDoc.querySelectorAll("text").forEach(t => {
                      let s = "";
                      for (let c of t.textContent) {
                        if (c in cedict) {
                          s += cedict[c];
                        } else {
                          s += c;
                        }
                      }
                      dict[`${t.getAttribute("start")}`] = {
                        text: s,
                        dur: t.getAttribute("dur"),
                      }
                    });
                    let t = setInterval(function(){
                      for (const [key, value] of Object.entries(dict)) {
                        if (document.querySelector("video").currentTime >= parseFloat(key) && document.querySelector("video").currentTime < parseFloat(key) + parseFloat(value.dur)) {
                          document.querySelector("h1.style-scope.ytd-watch-metadata").textContent = value.text;
                          break;
                        }
                      }
                      if (!location.href.includes("watch")) {
                        clearInterval(t);
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
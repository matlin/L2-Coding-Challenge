import fetchJsonp from "fetch-jsonp";

class WalmartSearch {
  constructor(apiKey) {
    const apiURL = "http://api.walmartlabs.com/v1/search";
    this.base = apiURL + "?apiKey=" + apiKey;
  }

  search(query) {
    return fetchJsonp(this.parameterize(query)).then(response => {
      if (response.ok) {
        console.log(response);
        return response.json();
      } else {
        throw new Error(
          "Could not retrieve data from API | " + response.status
        );
      }
    });
  }

  parameterize(params) {
    let url = this.base;
    for (let name in params) {
      console.log(name, params[name]);
      if (params[name] != null) {
        url += `&${name}=${encodeURIComponent(params[name])}`;
      }
    }
    return url;
  }
}

export default WalmartSearch;

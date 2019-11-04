const SAPI_PATH = "https://api.ft.com/content/search/v1";

const searchBody = {
  queryString: 'topics:"UK Politics & Policy"',
  queryContext: {
    curations: ["ARTICLES"]
  },
  resultContext: {
    maxResults: "10",
    offset: "0",
    aspects: [
      "audioVisual",
      "editorial",
      "images",
      "lifecycle",
      "location",
      "master",
      "metadata",
      "nature",
      "provenance",
      "summary",
      "title"
    ],
    sortOrder: "DESC",
    sortField: "lastPublishDateTime",
    facets: {
      names: [
        "authors",
        "organisations",
        "organisationsId",
        "people",
        "peopleId",
        "topics",
        "topicsId",
        "genre",
        "regions"
      ],
      maxElements: -1
    }
  }
};

function constructSAPIQuery(params) {
  const defaults = {
    queryString: "",
    maxResults: 10,
    offset: 0,
    aspects: ["title", "lifecycle", "location"], // [ "title", "location", "summary", "lifecycle", "metadata"],
    constraints: [],
    facets: { names: ["people", "organisations", "topics"], maxElements: -1 }
  };
  const combined = Object.assign({}, defaults, params);
  let queryString = combined.queryString;
  if (combined.constraints.length > 0) {
    // NB: not promises...
    queryString = `"${combined.queryString}" and `;
    queryString += combined.constraints
      .map(c => {
        return rephraseEntityForQueryString(c);
      })
      .join(" and ");
  }

  const full = {
    queryString: queryString,
    queryContext: {
      curations: ["ARTICLES", "BLOGS"]
    },
    resultContext: {
      maxResults: `${combined.maxResults}`,
      offset: `${combined.offset}`,
      aspects: combined.aspects,
      sortOrder: "DESC",
      sortField: "lastPublishDateTime",
      facets: combined.facets
    }
  };
  return full;
}

function search(params) {
  const sapiUrl = `${SAPI_PATH}?apiKey=${CAPI_KEY}`;
  const sapiQuery = constructSAPIQuery(params);
  const options = {
    method: "POST",
    body: JSON.stringify(sapiQuery),
    headers: {
      "Content-Type": "application/json"
    }
  };
  return fetchResText(sapiUrl, options)
    .then(text => {
      let sapiObj;
      try {
        sapiObj = JSON.parse(text);
      } catch (err) {
        throw new Error(`JSON.parse: err=${err},
				text=${text},
				params=${params}`);
      }
      return {
        params,
        sapiObj
      };
    })
    .catch(err => {
      console.log(`ERROR: search: err=${err}.`);
      return { params }; // NB, no sapiObj...
    });
}

module.exports = {
  getArticles
};

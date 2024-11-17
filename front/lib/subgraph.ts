export async function fetchSubgraph(query: any, variables: any) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch(
      "https://api.studio.thegraph.com/query/95027/unilend/version/latest",
      {
        method: "POST",
        body: JSON.stringify({ query, variables }),
        headers,
      }
    );
    return { response: response, success: true };
  } catch (err) {
    return { response: null, success: false };
  }
}

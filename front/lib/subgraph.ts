import axios from "axios";

export async function fetch(query: any, variables: any) {
  try {
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await axios.post(
      "https://api.studio.thegraph.com/query/95027/unilend/version/latest",
      {
        query,
        variables,
      }, 
      { headers },
    );
    return { response: response, success: true };
  } catch (err) {
    return { response: null, success: false };
  }
}

// Example Usage:

// const QUERY = `
// query Lended($lender: String!) {
//   lendCreateds(
//     orderBy: id
//     where: { lender: $lender }
//   ) {
//     lender
//     price
//     time
//     tokenId
//   }
// }
// `;

// const VARIABLES = { lender: "0xbC17F46df79e31FC7169422F57e496DA501Aa73f" };
// const response = await fetch(QUERY, VARIABLES);
// console.log(response);
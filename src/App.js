import "./App.css";
import Router from "./Router";
function App() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/font-awesome.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css"
      ></link>
      <Router />
    </>
  );
}

export default App;
// const query = `{ shop { name } }`;
// function apiCall(query) {
//   return fetch("https://mecl-c54e.myshopify.com/api/graphql.json", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/graphql",
//       // "Access-Control-Origin": "*",
//       "X-Shopify-Storefront-Access-Token": "131dd25d692f4afebb0311bed6eb9db9",
//     },
//     body: query,
//   }).then((response) => response.json());
// }
// apiCall(query)
//   .then((response) => {
//     console.log(response);
//   })
//   .catch((err) => console.log(err));

// function getProducts() {
//   const query = `{ products(first: 20) { edges { node { title description images(first: 1) { edges { node { altText transformedSrc(maxWidth: 400, maxHeight: 400) } } } } } } }`;
//   return apiCall(query);
// }
// getProducts()
//   .then((response) => {
//     console.log(response);
//   })
//   .catch((err) => console.log(err));

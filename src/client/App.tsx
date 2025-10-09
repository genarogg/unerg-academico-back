import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Helmet } from "react-helmet"

import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"
import { ApolloProvider } from "@apollo/client/react"

import App from "./app/page"
import Demo from "./app/demo/page"
import favico from "./img/logo/isotipo.svg"

// Configura el cliente Apollo
const client = new ApolloClient({
	link: new HttpLink({ uri: "/graphql" }),
	cache: new InMemoryCache(),
})

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<BrowserRouter>
				<Helmet>
					<link rel="shortcut icon" href={favico} type="image/x-icon" />
				</Helmet>

				<Routes>
					<Route path="/" element={<App />} />
					<Route path="/demo" element={<Demo />} />
					<Route path="/headcheck" element={<p>headcheck</p>} />
				</Routes>
			</BrowserRouter>
		</ApolloProvider>
	</React.StrictMode>
)

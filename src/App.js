import React from 'react';
import pages from "./pages";
import { BrowserRouter, Route, Routes } from "react-router-dom";
// import "./css/style.sass";

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Routes>

                    {Object.values(pages).map(({ RootComponent, rootPath }) => (
                        <Route
                            key={rootPath}
                            path={rootPath}
                            exact={rootPath === "/"}
                            element={
                                <RootComponent rootpath={rootPath} />
                            }
                        />
                    ))}
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;

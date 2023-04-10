import logo from './logo.svg';
import './App.css';
import useApexAdapter from "./hooks/useApexAdapter";

function App() {
    const [loading, state] = useApexAdapter({});
    function getBaseUrl(){
        if(process.env.NODE_ENV === "development"){
            return "";
        }
        return (window.hasOwnProperty('inlineApexAdaptor') ? window.inlineApexAdaptor.landingResources+'/': '');
    }
    return (
        <div className="App">
            <header className="App-header">
                <img style={{maxWidth: "200px"}} src={getBaseUrl()+logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.jsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <p>
                    {
                        loading === false && state.response !== null ?
                            state.response
                        :
                            null
                    }
                </p>
            </header>
        </div>
    );
}

export default App;

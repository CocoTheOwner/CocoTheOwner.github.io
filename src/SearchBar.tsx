function SearchBar() {
    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-custom" style={{backgroundColor: "#121B37"}}>
            <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
                <ul className="navbar-nav ml-auto mx-3">
                    <li className="nav-item px-5">
                        <a style={{color: "white", fontFamily: "Segoe UI, Arial, Bauhaus", fontSize: "30px", fontWeight: "bold"}} className="nav-link" href="#">Home</a>
                    </li>
                    <li className="nav-item px-5">
                        <a style={{color: "white", fontFamily: "Segoe UI, Arial, Bauhaus", fontSize: "30px", fontWeight: "bold"}} className="nav-link" href="#">Visualize</a>
                    </li>
                    <li className="nav-item pl-5">
                        <a style={{color: "white", fontFamily: "Segoe UI, Arial, Bauhaus", fontSize: "30px", fontWeight: "bold"}} className="nav-link" href="#">Help</a>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default SearchBar
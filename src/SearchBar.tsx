function SearchBar() {
    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <div className="navbar-collapse collapse w-100 order-3 dual-collapse2">
                <ul className="navbar-nav ml-auto mx-3">
                    <li className="nav-item">
                        <a style={{color: "white"}} className="nav-link" href="#">Home</a>
                    </li>
                    <li className="nav-item">
                        <a style={{color: "white"}} className="nav-link" href="#">Visualize</a>
                    </li>
                    <li className="nav-item">
                        <a style={{color: "white"}} className="nav-link" href="#">Help</a>
                    </li>
                </ul>
            </div>
        </nav>
        
    );
}

export default SearchBar
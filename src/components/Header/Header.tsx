import './Header.css';

interface HeaderProps {
    onToggleSidebar: () => void;
}

function Header({ onToggleSidebar }: HeaderProps) {
    return (
        <header className="header">
            <div className="header-left">
                <img src="/geo.png" alt="Geo Icon" className="header-icon" />
                <h1 className="header-title">GeoFinder</h1>
            </div>
            <button className="header-toggle" onClick={onToggleSidebar}>
                ☰
            </button>
        </header>
    );
}

export default Header;

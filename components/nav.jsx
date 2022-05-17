import { useState, useEffect } from 'react';

import { NavLink } from '.';
import { userService } from '../services';

export { Nav };

function Nav() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const subscription = userService.user.subscribe(x => setUser(x));
        return () => subscription.unsubscribe();
    }, []);

    function logout() {
        userService.logout();
    }

    if (!user) return null;
    
    return (
        <nav className="navbar navbar-expand navbar-light bg-success">
            <div className="navbar-nav">
                <NavLink href="/home" className="nav-item nav-link">Quizer</NavLink>
                <NavLink href="/home" exact className="nav-item nav-link">Home page</NavLink>
                <a onClick={logout} className="logout nav-item nav-link">Logout</a>
            </div>
        </nav>
    );
}
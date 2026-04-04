import Sidebar from './Sidebar';

function Layout({ children }) {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main">
        {children}
      </div>
    </div>
  );
}

export default Layout;
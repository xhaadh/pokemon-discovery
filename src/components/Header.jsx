export default function Header({ activeTab, setActiveTab, show }) {
  const tabClasses = (tab) =>
    `px-4 py-2 rounded-lg font-medium transition-colors ${
      activeTab === tab
        ? "bg-gray-700 text-white shadow-lg"
        : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 bg-gray-50 transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-1">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold text-gray-700">PokéDiscover</h1>
          </div>
        </div>
        <nav className="flex gap-2">
          <button onClick={() => setActiveTab("discover")} className={tabClasses("discover")}>
            Discover
          </button>
          <button onClick={() => setActiveTab("collection")} className={tabClasses("collection")}>
            My Collection
          </button>
        </nav>
      </div>
    </header>
  );
}

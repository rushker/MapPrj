//src/components/Sidebar.jsx
export default function Sidebar({ children, title }) {
  return (
    <aside className="w-80 bg-white shadow-xl p-4 overflow-y-auto h-screen z-[999]">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </aside>
  );
}

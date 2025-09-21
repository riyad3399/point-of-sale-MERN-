import shortcutConfig from "../../utils/shortcutConfig";

export default function ShortcutHelpModal() {
  return (
    <div className="p-4 bg-white shadow-lg rounded-xl">
      <h2 className="text-xl font-bold mb-2">🔑 Keyboard Shortcuts</h2>
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Operation</th>
            <th className="p-2 border">Shortcut</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(shortcutConfig).map(([combo, action]) => (
            <tr key={combo}>
              <td className="p-2 border">{action}</td>
              <td className="p-2 border font-mono">{combo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

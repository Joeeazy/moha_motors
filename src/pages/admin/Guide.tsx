import { Link } from 'react-router-dom'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 sm:p-6">
      <h2 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">{title}</h2>
      {children}
    </div>
  )
}

export default function Guide() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-7">
        <p className="text-xs font-semibold text-maroon-700 uppercase tracking-wider mb-1">Help</p>
        <h1 className="text-2xl font-bold text-gray-900">Admin Guide</h1>
        <p className="text-gray-500 text-sm mt-1">A quick reference for managing the site.</p>
      </div>

      <div className="space-y-5">
        <Section title="Navigating">
          <p className="text-sm text-gray-600 leading-relaxed">
            Use the left sidebar: <b>Dashboard</b> (overview), <b>Inventory</b> (vehicles),
            <b> Brands</b>, <b>Categories</b>, <b>Inquiries</b> (customer messages),
            <b> Admins</b>, and <b>Profile</b>. Sign out at the bottom of the sidebar.
          </p>
        </Section>

        <Section title="Adding a new vehicle">
          <ol className="text-sm text-gray-600 leading-relaxed space-y-2 list-decimal pl-5">
            <li>
              Go to <Link to="/admin/vehicles/new" className="text-maroon-700 font-medium hover:underline">Inventory → Add Vehicle</Link>.
            </li>
            <li>
              Fill in the fields. <b>Required:</b> Title, Brand, Category, Year, Price, Color,
              Fuel Type, Engine Size, Seats, Transmission.
            </li>
            <li><b>Fuel Type</b> and <b>Transmission</b> start blank — you must choose them (no default).</li>
            <li>Missing a Brand or Category? Add it first under <b>Brands</b> / <b>Categories</b>.</li>
            <li>Add one or more <b>photos</b> — the first image becomes the main photo.</li>
            <li>Click <b>Save</b>. You'll return to the inventory list and see a confirmation.</li>
          </ol>
        </Section>

        <Section title="Editing & marking sold">
          <p className="text-sm text-gray-600 leading-relaxed">
            Open <b>Inventory</b> → click a vehicle → change any field or images → <b>Save</b>.
            To mark a car sold, turn off the <b>Available</b> toggle.
          </p>
        </Section>

        <Section title="Brands & categories">
          <p className="text-sm text-gray-600 leading-relaxed">
            Open <b>Brands</b> or <b>Categories</b>, type the name in the box at the top and click
            <b> Add</b>. Edit or delete existing entries from the list below.
          </p>
        </Section>

        <Section title="Inquiries">
          <p className="text-sm text-gray-600 leading-relaxed">
            Open <b>Inquiries</b> to read customer messages, mark them read / resolved, or delete them.
          </p>
        </Section>

        <Section title="Admins & your account">
          <p className="text-sm text-gray-600 leading-relaxed">
            Add a new admin under <b>Admins</b> (name, email, password → <b>Create Admin</b>).
            Update your own name, email, or password under <b>Profile</b>. Use the 👁 icon in any
            password box to reveal what you typed.
          </p>
        </Section>

        <p className="text-xs text-gray-400 text-center pt-2">
          Every save shows a confirmation. If something fails, an error message explains what to fix.
        </p>
      </div>
    </div>
  )
}

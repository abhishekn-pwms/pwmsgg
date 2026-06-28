Date : Mon, 29-Jun-2026

\------------------



Release PWMSGG v1

\---



\## 🚀 Core Features \& Modules



\### 1. Unified Mobile-Responsive UI

\* \*\*Fluid Layout Framework:\*\* Built using a flexible, dynamic structure (`.app-body-container`) that ensures a sticky top header and a bottom footer that never clips or collides with content.

\* \*\*Modern Aesthetic:\*\* Transitioned from raw monospace fonts to a crisp, variable system sans-serif font stack with refined drop shadows, modern borders, and smooth transitions.

\* \*\*Touch-First Ergonomics:\*\* All interactive buttons, fields, selects, and menus maintain a minimum height of `44px` on mobile, eliminating cramped tap targets.

\* \*\*Collapsible Sidebar:\*\* Dynamically transitions from a left-docked desktop menu to a clean, space-saving slide-out overlay drawer on mobile viewports.



\### 2. Core Operational Modules

\* \*\*ToDo Management:\*\* Task logging with activity-linked records, due-date buckets (Overdue, Today, This Week, Future), open/completed toggle workflows, text filtering, and automated priority metric counters.

\* \*\*Task Log Feed:\*\* Date-grouped grid layout displaying logged durations, times, and structured activity context fields alongside custom inline activity creation mechanisms.

\* \*\*Review Reporting \& Analysis:\*\* Real-time summary metrics for active pipeline tasks and work hour distribution tracking across your portfolios utilizing self-collapsing adaptive dashboard card grids.

\* \*\*Masters Configurations:\*\* Complete lifecycle management setups across \*\*Portfolio\*\*, \*\*Project\*\*, \*\*Milestone\*\*, and \*\*Activity\*\* hierarchies with structured table container safeguards to handle overflowing mobile content seamlessly.



\---



\## 🛠️ System Architecture \& Stack



\* \*\*Frontend:\*\* Semantic HTML5, Modular JavaScript (ES6+), and Clean CSS Variables (`:root` token mapping).

\* \*\*Database \& Backend:\*\* Supabase (Real-time DB \& View Schemas).

\* \*\*Authentication:\*\* Google OAuth explicitly restricted to an approved list of digital profiles.

\* \*\*Deployment Setup:\*\* GitHub Pages serving production assets out of the `/PWMS2` routing base directory.



\------------------------------------

Date : Sun, 28-Jun-2026

\------------------



Release PWMS v1.5 ToDo Module



• Added ToDo management module with activity-linked tasks.

• Added Create, Edit, Delete and Complete/Open toggle functionality.

• Added Due Date and Notes support.

• Added inline Activity creation from ToDo modal.

• Added ToDo grouping by Due Date buckets and Activity.

• Added search, status and activity filters.

• Added Open, Completed and Overdue summary counters.

• Implemented click-to-edit and checkbox-based completion workflow.

• Added responsive ToDo feed UI for desktop and mobile.

• Reused Task Log activity framework while maintaining modular architecture.

• Added support for Unicode delete icon (\&#128465;\&#65039; / \&#128465; / 🗑 / 🗑️).





Date : Sat, 27-Jun-2026

\------------------



Release PWMS v1.4UI Mobile CSS Foundation Framework \& Text Sizes



• Standardized mobile-device based styling across PWMS.

• Increased mobile menu, button and form control sizes.

• Added mobile-friendly page titles, toolbars and search controls.

• Introduced responsive mobile table framework using table-container wrappers.

• Improved dashboard card readability on mobile.

• Standardized modal sizing and spacing for mobile devices.

• Established separate mobile UI patterns for Task Log (card-based) and Master/Review pages (table-based).

• Added table-container wrappers to Portfolio, Project, Milestone, Activity and Review pages.

• Increased text \& button sizes in Login Page.





\---------

\* Release PWMS v1.3cUI Filter Logic For Task Logs \& Search Field Clear



v1.3cUI

\---------



• Created centralized getFilteredTaskLogs() helper.

• Created centralized updateTaskLogSummary() helper.

• Fixed filters and totals for Task Log card layout.

• Converted search fields to type="search" for native clear (X) support.

• Standardized Task Log filtering across Grid and Card views.





\------------------

Date : Fri, 26-Jun-2026

\------------------

\* Release PWMS v1.3bUI Touch-First Mobile CSS Optimization FONT



v1.3bUI

\---------

Implemented:

• Device-based mobile detection

• Larger Card Text

• Larger touch targets

• Larger menu items

• Larger form controls

• Larger buttons

• Larger modal spacing

• Larger Task Card Text for Improved readability



Evaluated:

• Single-column mobile card layout



Outcome:

• Reverted single-column card layout due to inefficient space usage.

• Retained multi-column responsive layout with improved readability.





\---------

\* v1.3aUI Mobile Optimized Task Log Cards \& Entry Modal



v1.3aUI

\---------

• Responsive Task Log card layout with date grouping

• Compact Task Entry modal redesign

• Mobile optimized modal sizing and layout

• Auto-focus description field

• Collapsible Additional Details section

• Improved activity search/reset behavior





\* Release PWMS v1.2bUI TASK LOG FEED \& MODAL REDESIGN

\* Release PWMS v1.2aUI TASK LOG FEED

\* Release PWMS v1.1UI with UI Menu Hide \& Time Fields Calculation \& Row



Files changed

\----------------

index.html



css/pwms.css

components/header.html

js/components.js

js/auth.js

js/config.js

js/task-log.js



pages/task-log.html







=== === === === === ===



=== === === === === ===



Release : PWMS v1.0 Stable with URL path Logic..



Date : Fri, 26-Jun-2026



Modules

\--------

✔ Authentication

✔ Portfolio

✔ Project

✔ Milestone

✔ Activity

✔ Task Log

✔ Review



Backend

\--------

Supabase



Authentication

\--------------

Google OAuth

Allowed Email Validation



Deployment

\----------

GitHub Pages





Deployment Notes

\--------------------

Development

&#x20; IIS / localhost

&#x20; Site URL = localhost or LAN IP (eg. 192.168.1.8)



Production

&#x20; GitHub Pages

&#x20; Site URL = GitHub Pages URL 'https://abhishekn-pwms.github.io/PWMS2'

